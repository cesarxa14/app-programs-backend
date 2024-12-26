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
exports.ProductController = void 0;
const data_source_1 = require("../ddbb/data-source");
const product_logic_1 = require("../logic/product.logic");
const Product_1 = require("../entities/Product");
const productLogic = new product_logic_1.ProductLogic(data_source_1.AppDataSource);
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield productLogic.getProducts();
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
        throw err;
    }
});
const getMyProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const results = yield productLogic.getMyProducts(query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const savedRole = yield productLogic.createProduct(body);
        res.status(201).json(savedRole);
    }
    catch (err) {
        return res.status(400).json({ message: err });
    }
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO: pasarlo al logic
        const { id } = req.params;
        const deletedPackage = yield data_source_1.AppDataSource.getRepository(Product_1.Product).update(id, { deleted: 1 });
        return res.json({ data: deletedPackage });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
exports.ProductController = {
    getProducts,
    getMyProducts,
    createProduct,
    deleteProduct
};
