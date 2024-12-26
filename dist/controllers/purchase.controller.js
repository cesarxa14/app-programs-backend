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
exports.PurchaseController = void 0;
const Purchase_1 = require("../entities/Purchase");
const data_source_1 = require("../ddbb/data-source");
const purchase_logic_1 = require("../logic/purchase.logic");
const purchaseLogic = new purchase_logic_1.PurchaseLogic(data_source_1.AppDataSource);
const createPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, service, amount } = req.body;
    try {
        let newPurchase = new Purchase_1.Purchase();
        newPurchase.user = user_id;
        newPurchase.service = service;
        newPurchase.amount = amount;
        const savedProgram = yield data_source_1.AppDataSource.getRepository(Purchase_1.Purchase).save(newPurchase);
        res.status(201).json(savedProgram);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
const getPurchaseByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield purchaseLogic.getPurchaseByUser(req.query);
        // const results = await AppDataSource.query(sql, [userId])
        console.log('results:', results);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
exports.PurchaseController = {
    getPurchaseByUser,
    createPurchase
};
