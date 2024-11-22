import { NextFunction, Request, Response } from "express";

const jwt = require('jsonwebtoken');
require('dotenv').config();
export async function verifyToken(req: Request, res: Response, next: NextFunction){
    try{
        const {authorization} = req.headers;
        // console.log('authorization', authorization)
        const token = authorization!.split(' ')[1];
        console.log('token', token);
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err:any, data:any) => {
            if(err){
                throw err;
            }
            res.locals.id = data.id;

            next();
        });

    } catch(err) {
        res.status(401).json({message: 'Unauthorized'});
    }
    
}

module.exports = {verifyToken};

