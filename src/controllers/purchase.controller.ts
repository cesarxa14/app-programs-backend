import { Request, Response } from "express";
import { Purchase } from "../entities/Purchase";
import { AppDataSource } from "../ddbb/data-source";
import { PurchaseLogic } from "../logic/purchase.logic";

const purchaseLogic = new PurchaseLogic(AppDataSource)

const createPurchase = async(req: Request, res: Response) => {

  const { user_id, service, amount } = req.body;
  try{
      let newPurchase = new Purchase();
      newPurchase.user = user_id;
      newPurchase.service = service;
      newPurchase.amount = amount;
 

      const savedProgram = await AppDataSource.getRepository(Purchase).save(newPurchase);
      res.status(201).json(savedProgram);
  } catch(err) {
      return res.status(400).json({message: err})
  }
}



const getPurchaseByUser = async(req: Request, res: Response) => {
  try{ 
  
      const results = await purchaseLogic.getPurchaseByUser(req.query)
      // const results = await AppDataSource.query(sql, [userId])
      console.log('results:', results)
      return res.json({data: results})
  } catch (err) {
      console.log('err: ', err)
  }
}
export const PurchaseController = {
  getPurchaseByUser,
  createPurchase
}