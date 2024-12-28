import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { UserLogic } from "../logic/user.logic";
import { ReportLogic } from "../logic/report.logic";

const reportLogic = new ReportLogic(AppDataSource);

const getQuantityStudent = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getQuantityStudent();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

export const ReportController = {
    getQuantityStudent,
    
};