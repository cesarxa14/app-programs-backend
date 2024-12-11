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

export const AssistController = {
    getAssistsByUserPackages
}