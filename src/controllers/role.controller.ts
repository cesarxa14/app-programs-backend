import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Role } from "../entities/Role";

const getRoles = async(req: Request, res: Response) => {
    try{
        const results = await AppDataSource.getRepository(Role).find();
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const createRole = async(req: Request, res: Response) => {

    const { name } = req.body;
    try{
        let newRole = new Role();
        newRole.name = name;
        
        const savedRole = await AppDataSource.getRepository(Role).save(newRole);
        res.status(201).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

export const RoleController = {
    getRoles,
    createRole
    
};