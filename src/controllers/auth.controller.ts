import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { sendMail } from "../logic/logic_mailer";
import { UserLogic } from "../logic/user.logic";
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
      return res.status(400).send({message: "User already exists"})
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


export const AuthController = {
  login,
  register,
  verifyUser,
  completeRegister
};