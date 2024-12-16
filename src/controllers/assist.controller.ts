import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { AssistLogic } from "../logic/assist.logic";

const assistLogic = new AssistLogic(AppDataSource)

const getAssistByAdmin = async(req: Request, res: Response) => {
    try{
        const results = await assistLogic.getAssistByAdmin(req.query);
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const getAssistByCustomer = async(req: Request, res: Response) => {
    try{
        const results = await assistLogic.getAssistByCustomer(req.query);
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

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
        console.log('err: ', err)
        // throw err;
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Error interno del servidor'
        })
    }
}

export const AssistController = {
    getAssistByAdmin,
    getAssistByCustomer,
    getAssistsByUserPackages,
    createAssist
}