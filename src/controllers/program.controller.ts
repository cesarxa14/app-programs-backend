import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Program } from "../entities/Program";

const createProgram = async(req: Request, res: Response) => {

    const { name, description, startDate, endDate } = req.body;
    try{
        let newProgram = new Program();
        newProgram.name = name;
        newProgram.description = description;
        newProgram.startDate = startDate;
        newProgram.endDate = endDate;
    

        const savedProgram = await AppDataSource.getRepository(Program).save(newProgram);
        res.status(201).json(savedProgram);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getPrograms = async(req: Request, res: Response) => {
    try{
        const results = await AppDataSource.getRepository(Program).find({
            order: {
                id: 'DESC'
            }
        });
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const updateProgram = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const {name, description, startDate, endDate} = req.body;

        // Buscar la entidad por ID
        const programToUpdate = await AppDataSource.getRepository(Program).findOneBy({ id: Number(id) });

        if (!programToUpdate) {
        return res.status(404).json({ message: 'Program not found' });}

        programToUpdate.name = name || programToUpdate.name;
        programToUpdate.description = description || programToUpdate.description;
        programToUpdate.startDate = startDate || programToUpdate.startDate;
        programToUpdate.endDate = endDate || programToUpdate.endDate;

        const updatedProgram = await AppDataSource.getRepository(Program).save(programToUpdate);
        return res.json({data: updatedProgram})
    } catch (err) {
        console.log('err: ', err)
    }
}

const deleteProgram = async(req: Request, res: Response) => {
    try {

        const {id} = req.params;

        const deletedProgram = await await AppDataSource.getRepository(Program).delete(id);
        return res.json({data: deletedProgram})

    } catch (err) {
        console.log('err: ', err)
    }
}

export const ProgramController = {
    getPrograms,
    createProgram,
    updateProgram,
    deleteProgram
};