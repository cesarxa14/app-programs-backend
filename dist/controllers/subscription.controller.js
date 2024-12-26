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
exports.SubscriptionController = void 0;
const data_source_1 = require("../ddbb/data-source");
const subscription_logic_1 = require("../logic/subscription.logic");
const subscriptionLogic = new subscription_logic_1.SubscriptionLogic(data_source_1.AppDataSource);
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const savedProgram = yield subscriptionLogic.createSubscription(body);
        res.status(201).json(savedProgram);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
const getSubscriptionByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const results = yield subscriptionLogic.getSubscriptionByUser(query);
        console.log('results:', results);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getSubscriptionValidByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const results = yield subscriptionLogic.getSubscriptionValidByUser(query);
        console.log('results:', results);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const extendSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        const result = yield subscriptionLogic.extendSubscription(id, body);
        console.log('result:', result);
        return res.json({ data: result });
    }
    catch (err) {
        console.log('err: ', err);
        throw err;
    }
});
exports.SubscriptionController = {
    createSubscription,
    getSubscriptionByUser,
    getSubscriptionValidByUser,
    extendSubscription
};
