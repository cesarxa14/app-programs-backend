import { Request, Response } from "express";
import { Package } from '../entities/Package';
import { AppDataSource } from "../ddbb/data-source";

const createPackage = async(req: Request, res: Response) => {

    const { program, name, num_clases, expiration, cost, status } = req.body;
    try{
        console.log('body: ', req.body)
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
        const {userId} = req.query;
        let sql = `
            SELECT pr.name as program, p.*
                FROM packages p
                INNER JOIN programs pr ON p.program_id = pr.id
                INNER JOIN users u ON u.id = pr.user_id
                ORDER BY p.id DESC
        `
        const results = await AppDataSource.query(sql)
        return res.json({data: results})
    } catch (err) {
        console.log('err: ', err)
    }
}


const getPackagesEnables = async(req: Request, res: Response) => {
    try{
        const {userId} = req.query;
        let sql = `
            SELECT pr.name as program, p.*
                FROM packages p
                INNER JOIN programs pr ON p.program_id = pr.id
                INNER JOIN users u ON u.id = pr.user_id
                WHERE status = 'HABILITADO'
                ORDER BY p.id DESC
        `
        const results = await AppDataSource.query(sql)
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

        const deletedPackage = await AppDataSource.getRepository(Package).update(id, {deleted: 1});
        return res.json({data: deletedPackage})

    } catch (err) {
        console.log('err: ', err)
    }
}


export const PackageController = {
    getPackages,
    getPackagesEnables,
    createPackage,
    updatePackage,
    deletePackage
};