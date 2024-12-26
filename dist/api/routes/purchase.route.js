"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseRoutes = PurchaseRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
const { PurchaseController } = require("../../controllers/purchase.controller");
function PurchaseRoutes(app) {
    app.use('/purchases', router);
    router.get('/byUser', 
    // [ verifyToken] ,
    PurchaseController.getPurchaseByUser);
    router.post('/', PurchaseController.createPurchase);
    // router.put('/:id', PackageController.updatePackage);
    // router.delete('/:id', PackageController.deletePackage);
}
