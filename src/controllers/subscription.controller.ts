import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { Subscription } from "../entities/Subscription";

const createSubscription = async(req: Request, res: Response) => {

  const { user_id, service, startDate, endDate } = req.body;
  try{
      let newSubscription = new Subscription();
      newSubscription.user = user_id;
      newSubscription.service = service;
      newSubscription.startDate = startDate;
      newSubscription.endDate = endDate;
  

      const savedProgram = await AppDataSource.getRepository(Subscription).save(newSubscription);
      res.status(201).json(savedProgram);
  } catch(err) {
      return res.status(400).json({message: err})
  }
}


const getSubscriptionByUser = async(req: Request, res: Response) => {
  try{ 
  
      const {userId} = req.query;
      console.log('userId', userId)
      let sql = `
          SELECT * 
            FROM subscriptions 
            WHERE deleted = 0
            AND user_id = $1
            ORDER BY id DESC
      `
      const results = await AppDataSource.query(sql, [userId])
      console.log('results:', results)
      return res.json({data: results})
  } catch (err) {
      console.log('err: ', err)
  }
}


export const SubscriptionController = {
  createSubscription,
  getSubscriptionByUser
};