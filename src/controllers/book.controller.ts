import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { Book } from "../entities/Book";
import { BookLogic } from "../logic/book.logic";

const bookLogic = new BookLogic(AppDataSource)

const getMyBooks = async(req: Request, res: Response) => {
    try{
        const results = await bookLogic.getMyBooks();
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const getMyBooksAdmin = async(req: Request, res: Response) => {
    try{
        const query = req.query;
        const results = await bookLogic.getMyBooksAdmin(query);
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const getMyBooksCustomer = async(req: Request, res: Response) => {
    try{
        const query = req.query;
        const results = await bookLogic.getMyBooksCustomer(query);
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const createBook = async(req: Request, res: Response) => {
    
    try{
        const body = req.body;

        const result = await bookLogic.createBook(body)
        
        res.status(201).json(result);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}
export const BookController = {
    getMyBooks,
    createBook,
    getMyBooksAdmin,
    getMyBooksCustomer
}