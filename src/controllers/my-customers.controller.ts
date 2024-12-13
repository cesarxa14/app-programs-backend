import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt"
import * as jwt from 'jsonwebtoken';
import { sendMail } from "../logic/logic_mailer";
import { MyCustomerLogic } from "../logic/my-customer.logic";

const myCustomerLogic = new MyCustomerLogic(AppDataSource)

const getMyCustomers = async(req: Request, res: Response) => {
    try{
        const results = await myCustomerLogic.getMyCustomers(req.query)
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const getMyCustomersBySearch = async(req: Request, res: Response) => {
    try{
        console.log(req.query)
        
        const results = await myCustomerLogic.getMyCustomersBySearch(req.query)

        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const createMyCustomer = async(req: Request, res: Response) => {

    console.log('body: ', req.body)
    const { createdBy, name, lastname, email, password, phone, country, province, district, type_document, document, birthdate, medical_history } = req.body;
    try{

        const salt = await bcrypt.genSalt(10);
        const passwordEncrypt = await bcrypt.hash(password, salt)

        let createUserMyCustomer = new User();
        createUserMyCustomer.name = name;
        createUserMyCustomer.lastname = lastname;
        createUserMyCustomer.email = email;
        createUserMyCustomer.password = passwordEncrypt;
        createUserMyCustomer.phone = phone;
        createUserMyCustomer.country = country;
        createUserMyCustomer.province = province;
        createUserMyCustomer.district = district;
        createUserMyCustomer.type_document = type_document;
        createUserMyCustomer.document = document;
        createUserMyCustomer.birthdate = birthdate;
        createUserMyCustomer.medical_history = medical_history;
        createUserMyCustomer.role = 3;
        createUserMyCustomer.createdBy = createdBy || -1;

        const savedUserMyCustomer = await AppDataSource.getRepository(User).save(createUserMyCustomer);

        const token = jwt.sign({id: createUserMyCustomer.id}, process.env.JWT_SECRET_KEY , {expiresIn: 30}); 

        // TODO: AQUI SE LE ENVIA UN CORREO AL USUARIO CREADO PARA QUE PUEDA CONFIRMAR Y VALIDAR SU CUENTA

        // TODO: PASARLO A UNA FUNCIONA APARTE
        const verificationLink = `http://localhost:4200/auth/verify-email?token=${token}&byAssistant=true`;
        const bodyHTML = `
            <div>
                <h1>Verifica tu cuenta dando click en el siguiente enlace</h1>
                <p>
                    <a href="${verificationLink}">Click para verificar</a>
                </p>
            </div>
        `

        const sendEmail = await sendMail(createUserMyCustomer.email, 'Registro Existoso', 'Holas', bodyHTML)

        
        console.log('sendEmail: ', sendEmail)
        const fullUserMyCustomer = await AppDataSource.getRepository(User).findOne({
            where: { id: savedUserMyCustomer.id },
            
          });
        res.status(201).json(fullUserMyCustomer);
    } catch(err) {
        console.log('err: ', err)
        return res.status(400).json({message: err})
    }
}

const updateMyCustomer = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const {name, lastname, email, phone, country, province, district, type_document, document, birthdate, medical_history} = req.body;

        // Buscar la entidad por ID
        const userToUpdate = await AppDataSource.getRepository(User).findOneBy({ id: Number(id) });

        if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });}

        userToUpdate.name = name;
        userToUpdate.lastname = lastname;
        userToUpdate.email = email;
        userToUpdate.phone = phone;
        userToUpdate.country = country;
        userToUpdate.province = province;
        userToUpdate.district = district;
        userToUpdate.type_document = type_document;
        userToUpdate.document = document;
        userToUpdate.birthdate = birthdate;
        userToUpdate.medical_history = medical_history;
        userToUpdate.role = 3;

        const updatedProgram = await AppDataSource.getRepository(User).save(userToUpdate);
        return res.json({data: updatedProgram})
    } catch (err) {
        console.log('err: ', err)
    }
}

const deleteCustomer = async(req: Request, res: Response) => {
    try {

        const {id} = req.params;

        const deletedUser = await AppDataSource.getRepository(User).update(id, {deleted: 1});
        return res.json({data: deletedUser})

    } catch (err) {
        console.log('err: ', err)
    }
}

export const MyCustomerController = {
    getMyCustomers,
    getMyCustomersBySearch,
    createMyCustomer,
    updateMyCustomer,
    deleteCustomer
};