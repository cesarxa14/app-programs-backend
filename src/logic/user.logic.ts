import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken';
import { sendMail } from "../logic/logic_mailer";


export class UserLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getUserById(id: number){
    try {
      const userFound = await AppDataSource.getRepository(User).findOne({
        where: {
          id: id
        }
      }); 

      return userFound;
    } catch (err) {
      console.log('err: ', err);
      throw err;
    }
  }


  async getUserByEmail(email: string){
    try {
      const userFound = await AppDataSource.getRepository(User).findOne({
        where: {
          email: email
        }
      }); 

      return userFound;
    } catch (err) {
      console.log('err: ', err);
    }
  }

  // todo: pasarlo con dto para validar
  async register(body: any){
    try {

      const { name, lastname, email, role, password, createdBy} = body;
      const salt = await bcrypt.genSalt(10);
      const passwordEncrypt = await bcrypt.hash(password, salt)
      let newUser = new User();

      newUser.name = name
      newUser.lastname = lastname
      newUser.email = email
      newUser.role = role
      newUser.password = passwordEncrypt
      newUser.createdBy = createdBy

      

    const savedUser = await AppDataSource.getRepository(User).save(newUser);

    const token = jwt.sign({id: savedUser.id}, process.env.JWT_SECRET_KEY , {expiresIn: 30}); 
    // TODO: PASARLO A UNA FUNCIONA APARTE
    //const verificationLink = `http://localhost:4200/auth/verify-email?token=${token}`;
    const verificationLink = `http://167.88.43.130/nadarfront/auth/verify-email?token=${token}`;
      
    const bodyHTML = `
        <div>
            <h1>Verifica tu cuenta dando click en el siguiente enlace</h1>
            <p>
                <a href="${verificationLink}">Click para verificar</a>
            </p>
        </div>
    `

    console.log('savedUser', savedUser)

    const sendEmail = await sendMail(newUser.email, 'Registro Existoso', 'Holas', bodyHTML)

    return {savedUser, token}
    } catch (err) {
      console.log('error: ', err)
      throw err;
    }
  }

}
