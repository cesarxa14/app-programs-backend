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
exports.UserController = void 0;
const data_source_1 = require("../ddbb/data-source");
const user_logic_1 = require("../logic/user.logic");
const userLogic = new user_logic_1.UserLogic(data_source_1.AppDataSource);
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.params;
        console.log('params', params);
        let userId = Number(params.id);
        const results = yield userLogic.getUserById(userId);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
        throw err;
    }
});
exports.UserController = {
    getUserById
};
