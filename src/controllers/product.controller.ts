import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { ProductLogic } from "../logic/product.logic";

const productLogic = new ProductLogic(AppDataSource)

const getMyProducts = async(req: Request, res: Response) => {
  try{
      const query = req.query;
      const results = await productLogic.getMyProducts(query);
      return res.json({data: results})
  } catch (err) {
      console.log('err: ', err)
  }
}

const createProduct = async(req: Request, res: Response) => {

  try{
      const body = req.body;
      const savedRole = await productLogic.createProduct(body);
      res.status(201).json(savedRole);
  } catch(err) {
      return res.status(400).json({message: err})
  }
}

export const ProductController = {
  getMyProducts,
  createProduct
  
};


