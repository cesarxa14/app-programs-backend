import { Request, Response } from "express";
import { Package } from '../entities/Package';
import { AppDataSource } from "../data-source";

const createPackage = async(req: Request, res: Response) => {

    const { program, name, num_clases, expiration, cost, status } = req.body;
    try{
        let packages = new Package();
        packages.program = program;
        packages.name = name;
        packages.num_clases = num_clases;
        packages.expiration = expiration;
        packages.cost = cost;
        packages.status = status;

        const savedPackage = await AppDataSource.getRepository(Package).save(packages);

        const fullPackage = await AppDataSource.getRepository(Package).findOne({
            where: { id: savedPackage.id },
            relations: ['program'], // Incluir la relación
          });
        res.status(201).json(fullPackage);
    } catch(err) {
        return res.status(400).json({message: err})
    }
}

const getPackages = async(req: Request, res: Response) => {
    try{
        const results = await AppDataSource.getRepository(Package).find({
            order: {
                id: 'DESC'
            },
            relations: ['program']

        });
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}

const updatePackage = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const {program, name, num_clases, expiration, cost, status} = req.body;

        // Buscar la entidad por ID
        const packageToUpdate = await AppDataSource.getRepository(Package).findOneBy({ id: Number(id) });

        if (!packageToUpdate) {
        return res.status(404).json({ message: 'Program not found' });}

        packageToUpdate.program = program || packageToUpdate.program;
        packageToUpdate.name = name || packageToUpdate.name;
        packageToUpdate.num_clases = num_clases || packageToUpdate.num_clases;
        packageToUpdate.expiration = expiration || packageToUpdate.expiration;
        packageToUpdate.cost = cost || packageToUpdate.cost;
        packageToUpdate.status = status || packageToUpdate.status;

        const updatedProgram = await AppDataSource.getRepository(Package).save(packageToUpdate);
        return res.json({data: updatedProgram})
    } catch (err) {
        console.log('err: ', err)
    }
}

const deletePackage = async(req: Request, res: Response) => {
    try {

        const {id} = req.params;

        const deletedPackage = await await AppDataSource.getRepository(Package).delete(id);
        return res.json({data: deletedPackage})

    } catch (err) {
        console.log('err: ', err)
    }
}


export const PackageController = {
    getPackages,
    createPackage,
    updatePackage,
    deletePackage
};