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
exports.AssistController = void 0;
const data_source_1 = require("../ddbb/data-source");
const assist_logic_1 = require("../logic/assist.logic");
const assistLogic = new assist_logic_1.AssistLogic(data_source_1.AppDataSource);
const getAssistByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield assistLogic.getAssistByAdmin(req.query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getAssistByCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield assistLogic.getAssistByCustomer(req.query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getAssistsByUserPackages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield assistLogic.getAssistsByUserPackages(req.query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const createAssist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield assistLogic.createAssist(body);
        res.status(201).json(result);
    }
    catch (err) {
        console.log('err: ', err);
        // throw err;
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Error interno del servidor'
        });
    }
});
const sendReminder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield assistLogic.sendReminder(body);
        res.status(201).json({ message: 'Se envió el recordario con éxito' });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Error interno del servidor'
        });
    }
});
exports.AssistController = {
    getAssistByAdmin,
    getAssistByCustomer,
    getAssistsByUserPackages,
    createAssist,
    sendReminder
};
