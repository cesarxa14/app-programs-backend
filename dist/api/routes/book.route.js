"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = BookRoutes;
const express_1 = require("express");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = (0, express_1.Router)();
// import {} from "../../controllers/package.controller"
const { BookController } = require('../../controllers/book.controller');
function BookRoutes(app) {
    app.use('/books', router);
    router.get('/', [verifyToken_1.verifyToken], BookController.getMyBooks);
    router.get('/admin', [verifyToken_1.verifyToken], BookController.getMyBooksAdmin);
    router.get('/customer', [verifyToken_1.verifyToken], BookController.getMyBooksCustomer);
    router.post('/', BookController.createBook);
    // router.put('/:id', BookController.updatePackage);
    // router.delete('/:id', BookController.deletePackage);
}
