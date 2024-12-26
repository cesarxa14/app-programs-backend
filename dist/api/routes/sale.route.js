"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleRoutes = SaleRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
const { SaleController } = require("../../controllers/sale.controller");
function SaleRoutes(app) {
    app.use('/sales', router);
    router.get('/my-sales', 
    // [ verifyToken] ,
    SaleController.getMySales);
    router.post('/', SaleController.createSale);
    // router.put('/:id', PackageController.updatePackage);
    // router.delete('/:id', PackageController.deletePackage);
}
