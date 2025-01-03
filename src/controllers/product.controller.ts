import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { ProductLogic } from "../logic/product.logic";
import { Product } from "../entities/Product";

const productLogic = new ProductLogic(AppDataSource)

const getProducts = async(req: Request, res: Response) => {
  try{
      const results = await productLogic.getProducts();
      return res.json({data: results})
  } catch (err) {
      console.log('err: ', err)
      throw err;
  }
}

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


const deleteProduct = async(req: Request, res: Response) => {
  try {

    // TODO: pasarlo al logic
      const {id} = req.params;

      const deletedPackage = await AppDataSource.getRepository(Product).update(id, {deleted: 1});
      return res.json({data: deletedPackage})

  } catch (err) {
      console.log('err: ', err)
  }
}

export const ProductController = {
  getProducts,
  getMyProducts,
  createProduct,
  deleteProduct
  
};


