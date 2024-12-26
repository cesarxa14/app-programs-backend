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
exports.BookController = void 0;
const data_source_1 = require("../ddbb/data-source");
const book_logic_1 = require("../logic/book.logic");
const bookLogic = new book_logic_1.BookLogic(data_source_1.AppDataSource);
const getMyBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req;
        const results = yield bookLogic.getMyBooks(query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getMyBooksAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const results = yield bookLogic.getMyBooksAdmin(query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getMyBooksCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const results = yield bookLogic.getMyBooksCustomer(query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const result = yield bookLogic.createBook(body);
        res.status(201).json(result);
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Error interno del servidor'
        });
    }
});
exports.BookController = {
    getMyBooks,
    createBook,
    getMyBooksAdmin,
    getMyBooksCustomer,
};
