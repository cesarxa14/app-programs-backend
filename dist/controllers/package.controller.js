"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageController = void 0;
const Package_1 = require("../entities/Package");
const data_source_1 = require("../ddbb/data-source");
const package_logic_1 = require("../logic/package.logic");
const packageLogic = new package_logic_1.PackageLogic(data_source_1.AppDataSource);
const createPackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { program, name, num_clases, expiration, cost, status, activeDays, activeHours } = req.body;
    try {
        console.log('body: ', req.body);
        let packages = new Package_1.Package();
        packages.program = program;
        packages.name = name;
        packages.num_clases = num_clases;
        packages.expiration = expiration;
        packages.cost = cost;
        packages.status = status;
        packages.activeDays = activeDays;
        packages.activeHours = activeHours;
        const savedPackage = yield data_source_1.AppDataSource.getRepository(Package_1.Package).save(packages);
        const fullPackage = yield data_source_1.AppDataSource.getRepository(Package_1.Package).findOne({
            where: { id: savedPackage.id },
            relations: ['program'], // Incluir la relación
        });
        res.status(201).json(fullPackage);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
const getPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        let sql = `
            SELECT pr.name as program, p.*
                FROM packages p
                INNER JOIN programs pr ON p.program_id = pr.id
                INNER JOIN users u ON u.id = pr.user_id
                ORDER BY p.id DESC
        `;
        const results = yield data_source_1.AppDataSource.query(sql);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getPackagesEnables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        let sql = `
            SELECT pr.name as program, p.*, u.phone
                FROM packages p
                INNER JOIN programs pr ON p.program_id = pr.id
                INNER JOIN users u ON u.id = pr.user_id
                WHERE status = 'HABILITADO'
                ORDER BY p.id DESC
        `;
        const results = yield data_source_1.AppDataSource.query(sql);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getNumClassesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield packageLogic.getNumClassesByUser(req.query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const updatePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { program, name, num_clases, expiration, cost, status } = req.body;
        // Buscar la entidad por ID
        const packageToUpdate = yield data_source_1.AppDataSource.getRepository(Package_1.Package).findOneBy({ id: Number(id) });
        if (!packageToUpdate) {
            return res.status(404).json({ message: 'Program not found' });
        }
        packageToUpdate.program = program || packageToUpdate.program;
        packageToUpdate.name = name || packageToUpdate.name;
        packageToUpdate.num_clases = num_clases || packageToUpdate.num_clases;
        packageToUpdate.expiration = expiration || packageToUpdate.expiration;
        packageToUpdate.cost = cost || packageToUpdate.cost;
        packageToUpdate.status = status || packageToUpdate.status;
        const updatedProgram = yield data_source_1.AppDataSource.getRepository(Package_1.Package).save(packageToUpdate);
        return res.json({ data: updatedProgram });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const deletePackage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedPackage = yield data_source_1.AppDataSource.getRepository(Package_1.Package).update(id, { deleted: 1 });
        return res.json({ data: deletedPackage });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
exports.PackageController = {
    getPackages,
    getPackagesEnables,
    getNumClassesByUser,
    createPackage,
    updatePackage,
    deletePackage
};
