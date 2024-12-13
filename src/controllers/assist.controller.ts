import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { AssistLogic } from "../logic/assist.logic";

const assistLogic = new AssistLogic(AppDataSource)

const getAssistsByUserPackages = async(req: Request, res: Response) => {
    try{
        const results = await assistLogic.getAssistsByUserPackages(req.query);
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const createAssist = async(req: Request, res: Response) => {
    
    try{
        const body = req.body;

        const result = await assistLogic.createAssist(body)
        
        res.status(201).json(result);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

export const AssistController = {
    getAssistsByUserPackages,
    createAssist
}