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
exports.ProgramController = void 0;
const data_source_1 = require("../ddbb/data-source");
const Program_1 = require("../entities/Program");
const program_logic_1 = require("../logic/program.logic");
const programLogic = new program_logic_1.ProgramLogic(data_source_1.AppDataSource);
const createProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, name, description, startDate, endDate } = req.body;
    try {
        let newProgram = new Program_1.Program();
        newProgram.name = name;
        newProgram.description = description;
        newProgram.user = user_id;
        newProgram.startDate = startDate;
        newProgram.endDate = endDate;
        const savedProgram = yield data_source_1.AppDataSource.getRepository(Program_1.Program).save(newProgram);
        res.status(201).json(savedProgram);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
const getPrograms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        console.log('userId', userId);
        const params = [];
        let sql = `
            SELECT p.* 
                FROM programs p
                INNER JOIN users u ON u.id = p.user_id
                WHERE p.user_id = $1
                AND p.deleted = 0
        `;
        params.push(Number(userId));
        const results = yield data_source_1.AppDataSource.query(sql, params);
        console.log('results:', results);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getProgramValidByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req;
        const results = yield programLogic.getProgramValidByUser(query);
        console.log('results:', results);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getProgramsBuyedByCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req;
        const results = yield programLogic.getProgramsBuyedByCustomer(query);
        console.log('results:', results);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const updateProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, startDate, endDate } = req.body;
        // Buscar la entidad por ID
        const programToUpdate = yield data_source_1.AppDataSource.getRepository(Program_1.Program).findOneBy({ id: Number(id) });
        if (!programToUpdate) {
            return res.status(404).json({ message: 'Program not found' });
        }
        programToUpdate.name = name || programToUpdate.name;
        programToUpdate.description = description || programToUpdate.description;
        programToUpdate.startDate = startDate || programToUpdate.startDate;
        programToUpdate.endDate = endDate || programToUpdate.endDate;
        const updatedProgram = yield data_source_1.AppDataSource.getRepository(Program_1.Program).save(programToUpdate);
        return res.json({ data: updatedProgram });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const deleteProgram = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProgram = yield yield data_source_1.AppDataSource.getRepository(Program_1.Program).update(id, { deleted: 1 });
        return res.json({ data: deletedProgram });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
exports.ProgramController = {
    getPrograms,
    getProgramsBuyedByCustomer,
    getProgramValidByUser,
    createProgram,
    updateProgram,
    deleteProgram
};
