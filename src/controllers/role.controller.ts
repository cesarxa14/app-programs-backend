import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { Role } from "../entities/Role";
import { RoleLogic } from "../logic/role.logic";

const roleLogic = new RoleLogic(AppDataSource);

const getRoles = async(req: Request, res: Response) => {
    try{
        const results = await roleLogic.getRoles();
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const createRole = async(req: Request, res: Response) => {

    try{
        const savedRole = await roleLogic.createRole(req.body);
        res.status(201).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

export const RoleController = {
    getRoles,
    createRole
    
};