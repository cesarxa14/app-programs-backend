import { Request, Response } from "express";
import { Package } from '../entities/Package';
import { AppDataSource } from "../data-source";

const createPackage = async(req: Request, res: Response) => {

    const { program, name, num_clases, days_validity, cost, status } = req.body;
    try{
        let packages = new Package();
        packages.program = program;
        packages.name = name;
        packages.num_clases = num_clases;
        packages.days_validity = days_validity;
        packages.cost = cost;
        packages.status = status;

        const savedProduct = await AppDataSource.getRepository(Package).save(packages);
    res.status(201).json(savedProduct);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getPackages = async(req: Request, res: Response) => {
    try{
        const results = await AppDataSource.getRepository(Package).find();
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

module.exports.PackageController = {
    getPackages,
    createPackage,
}