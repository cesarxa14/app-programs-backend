import { Request, Response } from "express";
import { AppDataSource } from "../ddbb/data-source";
import { Book } from "../entities/Book";

const getMyBooks = async(req: Request, res: Response) => {
    try{
        const whereConditions: any = { deleted: 0 };
        console.log(req.query)
        
        const results = await AppDataSource.getRepository(Book).find({
            where: whereConditions,
            order: {
                id: 'DESC'
            },
            relations: ['userBooked', 'program'],

        });
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const createBook = async(req: Request, res: Response) => {
    const { program, classDate, classHour, userCreator, userBooked, additional_notes } = req.body;
    try{
        console.log('body:', req.body)
        let newBook = new Book();
        newBook.program = program;
        newBook.classDate = classDate;
        newBook.classHour = classHour;
        newBook.userBooked = userBooked;
        newBook.userCreator = userCreator;
        newBook.additional_notes = additional_notes || ''

        const savedBook = await AppDataSource.getRepository(Book).save(newBook);

        const fullBook = await AppDataSource.getRepository(Book).findOne({
            where: { id: savedBook.id },
            relations: ['userBooked'], // Incluir la relación
          });
        res.status(201).json(fullBook);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}
export const BookController = {
    getMyBooks,
    createBook
}