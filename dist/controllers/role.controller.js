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
exports.RoleController = void 0;
const data_source_1 = require("../ddbb/data-source");
const role_logic_1 = require("../logic/role.logic");
const roleLogic = new role_logic_1.RoleLogic(data_source_1.AppDataSource);
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield roleLogic.getRoles();
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedRole = yield roleLogic.createRole(req.body);
        res.status(201).json(savedRole);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
exports.RoleController = {
    getRoles,
    createRole
};
