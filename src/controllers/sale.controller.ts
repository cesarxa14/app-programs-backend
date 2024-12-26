import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { SaleLogic } from "../logic/sale.logic";

const saleLogic = new SaleLogic(AppDataSource);

const getMySales = async(req: Request, res: Response) => {

    try{
        const query = req.query;
        const savedRole = await saleLogic.getMySales(query);
        res.status(200).json(savedRole);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const createSale = async(req: Request, res: Response) => {

    try{
        const savedRole = await saleLogic.createSale(req.body);
        res.status(201).json(savedRole);
    } catch(err) {
        console.log('errrrorrrrr: ', err)
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Error interno del servidor',
            error: err
        });
    }
}

export const SaleController = {
    getMySales,
    createSale
};