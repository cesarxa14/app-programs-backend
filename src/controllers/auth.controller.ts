import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

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

    return res.status(201).json({
      token,
      data: savedUser
  });

  } catch(err) {
    console.log('error: ', err)
    res.status(500).json({error: err})
  }
}



export const AuthController = {
  login,
  register
};