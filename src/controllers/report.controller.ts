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

const getStudentsByPrograms = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getStudentsByPrograms();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getStudentsByPackages = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getStudentsByPackages();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getEarningsByPackages = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getEarningsByPackages();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getEarningsByPrograms = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getEarningsByPrograms();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getUsersByGender = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getUsersByGender();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getUsersInfoDemographics = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getUsersInfoDemographics();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getSalesLineTime = async(req: Request, res: Response) => {

    try{
        const savedRole = await reportLogic.getSalesLineTime();
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}


const getTotalEarningSales = async(req: Request, res: Response) => {

    try{
        const sales = await reportLogic.getTotalEarningSales();
        console.log(sales)
        const total = sales[0];
        res.status(200).json(total);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getSalesByTypeVoucher = async(req: Request, res: Response) => {

    try{
        const sales = await reportLogic.getSalesByTypeVoucher();
        res.status(200).json(sales);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getSalesByPaymentMethod = async(req: Request, res: Response) => {

    try{
        const sales = await reportLogic.getSalesByPaymentMethod();
        res.status(200).json(sales);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}





export const ReportController = {
    getQuantityStudent,
    getStudentsByPrograms,
    getStudentsByPackages,
    getEarningsByPackages,
    getEarningsByPrograms,
    getUsersByGender,
    getUsersInfoDemographics,
    getSalesLineTime,
    getTotalEarningSales,
    getSalesByTypeVoucher,
    getSalesByPaymentMethod
};