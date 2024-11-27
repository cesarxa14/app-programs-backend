import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { sendMail } from "../logic/logic_mailer";
dotenv.config();

interface JwtPayload {
  id: number;
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password} = req.body;

    // TODO: pasarlo a una funcion aparte
    const userFound  = await AppDataSource.getRepository(User).findOne({
      where: {
        email: email
      }
    }); 

    if(!userFound) {
      return res.status(404).send({message: "User not found"})
    }

    if(userFound.isVerified == false) {
      return res.status(400).send({message: "User not verified"})
    }

    console.log('userFound: ', userFound)
    
    const passwordsCompared = await bcrypt.compare(password, userFound.password);
      console.log('aqui')
      if(!passwordsCompared){
          return res.status(400).send({message: "Invalid password"})
    }

    const token = jwt.sign({id: userFound.id}, process.env.JWT_SECRET_KEY, {expiresIn: 1800});

    res.json({data:userFound, token});
  } catch (err) {
    console.log('error: ', err)
    return res.status(500).json({message: err})
  }
}

const register = async (req: Request, res: Response) => {
  try{

    const { name, lastname, email, role, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypt = await bcrypt.hash(password, salt)

    const userFound  = await AppDataSource.getRepository(User).findOne({
      where: {
        email: email
      }
    }); 

    if(userFound) {
      return res.status(400).send({message: "User already exists"})
    }
    let newUser = new User();

    newUser.name = name
    newUser.lastname = lastname
    newUser.email = email
    newUser.role = role
    newUser.password = passwordEncrypt

    const savedUser = await AppDataSource.getRepository(User).save(newUser);

    const token = jwt.sign({id: savedUser.id}, process.env.JWT_SECRET_KEY , {expiresIn: 30}); 
    // TODO: PASARLO A UNA FUNCIONA APARTE
    const verificationLink = `http://localhost:4200/auth/verify-email?token=${token}`;
    const bodyHTML = `
        <div>
            <h1>Verifica tu cuenta dando click en el siguiente enlace</h1>
            <p>
                <a href="${verificationLink}">Click para verificar</a>
            </p>
        </div>
    `

    const sendEmail = await sendMail(newUser.email, 'Registro Existoso', 'Holas', bodyHTML)

    return res.status(201).json({
      token,
      data: savedUser
  });

  } catch(err) {
    console.log('error: ', err)
    res.status(500).json({error: err})
  }
}

const completeRegister = async (req: Request, res: Response) => {
  try{

    const { id, phone, country, province, district, type_document, document, birthdate, medical_history} = req.body;

    const userFound  = await AppDataSource.getRepository(User).findOne({
      where: {
        id: id
      }
    }); 

    userFound.phone = phone
    userFound.country = country
    userFound.province = province
    userFound.district = district
    userFound.type_document = type_document
    userFound.document = document
    userFound.birthdate = birthdate
    userFound.medical_history = medical_history
    userFound.isVerified = true;

    const savedUser = await AppDataSource.getRepository(User).save(userFound);

    return res.status(201).json({data: savedUser});

  } catch(err) {
    console.log('error: ', err)
    res.status(500).json({error: err})
  }
}



const verifyUser = async(req: Request, res: Response) => {
  try{
    console.log('body: ', req.body)
    const {token, byAssistant} = req.body;
    const tokenDecoded = jwt.decode(token) as JwtPayload;
    console.log('tokenDecoded', tokenDecoded)
    const idUser = tokenDecoded.id;

    
    // Buscar la entidad por ID
    const userToUpdate = await AppDataSource.getRepository(User).findOneBy({ id: Number(idUser) });

    userToUpdate.isVerified = true;

    const updatedUser = await AppDataSource.getRepository(User).save(userToUpdate);
    return res.json({data: updatedUser})
  } catch(err) {
    console.log('error: ', err)
  }
}


export const AuthController = {
  login,
  register,
  verifyUser,
  completeRegister
};