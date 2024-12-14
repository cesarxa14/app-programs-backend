import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { SubscriptionLogic } from "../logic/subscription.logic";


const subscriptionLogic = new SubscriptionLogic(AppDataSource);
const createSubscription = async(req: Request, res: Response) => {

  try{
      const body = req.body;
      const savedProgram = await subscriptionLogic.createSubscription(body);
      res.status(201).json(savedProgram);
  } catch(err) {
      return res.status(400).json({message: err})
  }
}


const getSubscriptionByUser = async(req: Request, res: Response) => {
  try{ 
      const query = req.query;
      const results = await subscriptionLogic.getSubscriptionByUser(query);
      console.log('results:', results)
      return res.json({data: results})
  } catch (err) {
      console.log('err: ', err)
  }
}

const getSubscriptionValidByUser = async(req: Request, res: Response) => {
  try{ 
      const query = req.query;
      
      const results = await subscriptionLogic.getSubscriptionValidByUser(query);
      console.log('results:', results)
      return res.json({data: results})
  } catch (err) {
      console.log('err: ', err)
  }
}

const extendSubscription = async(req: Request, res: Response) => {
  try{ 
      const {id} = req.params;
      const {body} = req
      
      const result = await subscriptionLogic.extendSubscription(id, body);
      console.log('result:', result)
      return res.json({data: result})
  } catch (err) {
      console.log('err: ', err)
      throw err;
  }
}


export const SubscriptionController = {
  createSubscription,
  getSubscriptionByUser,
  getSubscriptionValidByUser,
  extendSubscription
};