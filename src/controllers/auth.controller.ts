import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { sendMail } from "../logic/logic_mailer";
import { UserLogic } from "../logic/user.logic";
import config  from '../config/mail.config';
dotenv.config();

interface JwtPayload {
  id: number;
}

const userLogic = new UserLogic(AppDataSource)

const login = async (req: Request, res: Response) => {
  try {
    const { email, password} = req.body;

    // TODO: pasarlo a una funcion aparte
    const userFound  = await userLogic.getUserByEmail(email); 

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

    const { email} = req.body;
    const userFound  = await userLogic.getUserByEmail(email);

    if(userFound) {
      return res.status(400).send({message: "Este correo ya existe."})
    }
    
    const registeredUser = await userLogic.register(req.body)

    return res.status(201).json({
      token: registeredUser.token,
      data: registeredUser.savedUser
    });

  } catch(err) {
    console.log('error: ', err)
    res.status(500).json({error: err})
  }
}

const completeRegister = async (req: Request, res: Response) => {
  try{

    const { userId, phone, country, province, department, district, type_document, document, birthdate, medical_history, gender} = req.body;

    const userFound  = await AppDataSource.getRepository(User).findOne({
      where: {
        id: userId
      }
    }); 

    if(!userFound) throw new Error("User not found")

    const userFound2 = await userLogic.getUserByDocument({type_document, document})

    if(userFound2) 
      // throw new Error("Numero de documento ya en uso")
      return res.status(400).send({message: "Numero de documento ya en uso"})

    console.log({ userId, phone, country, province, district, type_document, document, birthdate, medical_history, gender})

    userFound.phone = phone
    userFound.country = country
    userFound.province = province
    userFound.district = district
    userFound.type_document = type_document
    userFound.document = document
    userFound.department = department;
    userFound.gender = gender
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

const sendEmailResetPassword = async(req: Request, res: Response) => {
  try{
    const { email} = req.body;
    const userFound  = await userLogic.getUserByEmail(email);

    if(!userFound) return res.status(400).send({message: "Este correo no existe."})

    const token = jwt.sign({id: userFound.email}, process.env.JWT_SECRET_KEY , {expiresIn: 30}); 
    
    const verificationLink = `http://localhost:4200/auth/reset-password?token=${token}`;
    // const verificationLink = `http://167.88.43.130/nadarfront/auth/reset-password?token=${token}`;
    const bodyHTML = `
          <div>
              <h1>Reestablece tu contraseña dando click en el siguiente enlace: </h1>
              <p>
                  <a href="${verificationLink}">Click para reestablecer contraseña</a>
              </p>
          </div>
      `


    //const sendEmail = await sendMail(newUser.email, 'Registro Existoso', 'Holas', bodyHTML)
    const sendEmail = await sendMail(config.email,userFound.email, 'Reestablecer contraseña', 'Holas', bodyHTML)
    return res.status(200).json({data: true})
  } catch(err) {
    console.log('error: ', err)
  }
}


const resetPassword =  async(req: Request, res: Response) => {
  try {

    const {idUser, password} = req.body;
    const userToUpdate = await AppDataSource.getRepository(User).findOneBy({ id: Number(idUser) });

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });}

    const salt = await bcrypt.genSalt(10);
    const passwordEncrypt = await bcrypt.hash(password, salt)

    userToUpdate.password = passwordEncrypt || userToUpdate.password;

    const updatedProgram = await AppDataSource.getRepository(User).save(userToUpdate);
    return res.json({data: updatedProgram})

  } catch(err) {
    console.log('err: ', err)
    throw err;
  }
}


export const AuthController = {
  login,
  register,
  verifyUser,
  completeRegister,
  sendEmailResetPassword,
  resetPassword
};