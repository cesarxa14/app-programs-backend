import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { UserLogic } from "../logic/user.logic";

const userLogic = new UserLogic(AppDataSource)

const getUserById = async(req: Request, res: Response) => {
    try{
        const params = req.params
        console.log('params', params)
        let userId = Number(params.id)
        const results = await userLogic.getUserById(userId);
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
        throw err;
    }
  }

  const getUserByEmail = async(req: Request, res: Response) => {
    try{
        const params = req.params
        console.log('params', params)
        let userId = params.id
        const results = await userLogic.getUserByEmail(userId);
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
        throw err;
    }
  }

  export const UserController = {
    getUserById,getUserByEmail
};