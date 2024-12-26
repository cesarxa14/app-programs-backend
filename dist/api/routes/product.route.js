"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = ProductRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
const { ProductController } = require('../../controllers/product.controller');
function ProductRoutes(app) {
    app.use('/products', router);
    router.get('/', ProductController.getProducts);
    router.get('/my-products', ProductController.getMyProducts);
    router.post('/', ProductController.createProduct);
    router.delete('/:id', ProductController.deleteProduct);
}
