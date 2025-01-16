import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { UserLogic } from "../logic/user.logic";
import { ReportLogic } from "../logic/report.logic";

const reportLogic = new ReportLogic(AppDataSource);

const getQuantityStudent = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getQuantityStudent(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getStudentsByPrograms = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getStudentsByPrograms(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getStudentsByPackages = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getStudentsByPackages(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getEarningsByPackages = async(req: Request, res: Response) => {

    try{
        // const {startDate: , endDate}
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getEarningsByPackages(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getEarningsByPrograms = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getEarningsByPrograms(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getUsersByGender = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getUsersByGender(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getUsersInfoDemographics = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getUsersInfoDemographics(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getSalesLineTime = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const savedRole = await reportLogic.getSalesLineTime(startDate, endDate);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}


const getTotalEarningSales = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        console.log('query a: ', query)
        const sales = await reportLogic.getTotalEarningSales(startDate, endDate);
        console.log('getTotalEarningSales: ', sales)
        const total = sales[0];
        res.status(200).json(total);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getSalesByTypeVoucher = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const sales = await reportLogic.getSalesByTypeVoucher(startDate, endDate);
        res.status(200).json(sales);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getSalesByPaymentMethod = async(req: Request, res: Response) => {

    try{
        const {query} = req;
        const {startDate, endDate} = query;
        // console.log('query a: ', query)
        const sales = await reportLogic.getSalesByPaymentMethod(startDate, endDate);
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