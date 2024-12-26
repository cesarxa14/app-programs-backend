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
exports.SaleController = void 0;
const data_source_1 = require("../ddbb/data-source");
const sale_logic_1 = require("../logic/sale.logic");
const saleLogic = new sale_logic_1.SaleLogic(data_source_1.AppDataSource);
const getMySales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const savedRole = yield saleLogic.getMySales(query);
        res.status(200).json(savedRole);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
const createSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedRole = yield saleLogic.createSale(req.body);
        res.status(201).json(savedRole);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
exports.SaleController = {
    getMySales,
    createSale
};
