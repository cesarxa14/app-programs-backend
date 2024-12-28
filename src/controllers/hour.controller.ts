import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { HourLogic } from "../logic/hour.logic";


const hourLogic = new HourLogic(AppDataSource);

const getHours = async(req: Request, res: Response) => {
    try{
        const results = await hourLogic.getHours();
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const createHour = async(req: Request, res: Response) => {

    try{
        const savedRole = await hourLogic.createHour(req.body);
        res.status(201).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const deleteHour = async(req: Request, res: Response) => {
    try {

        const {id} = req.params;

        const deletedHour = await hourLogic.deleteHour(id);
        return res.json({data: deletedHour})

    } catch (err) {
        console.log('err: ', err)
    }
}

export const HourController = {
    getHours,
    createHour,
    deleteHour
};