import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";

const getMyCustomers = async(req: Request, res: Response) => {
    try{
        const whereConditions: any = { role: 3 };
        console.log(req.query)
        
        const results = await AppDataSource.getRepository(User).find({
            where: whereConditions,
            order: {
                id: 'DESC'
            },

        });
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

export const MyCustomerController = {
    getMyCustomers,
    // createPackage,
    // updatePackage,
    // deletePackage
};