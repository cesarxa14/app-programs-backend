"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRoutes = PackageRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
// import {} from "../../controllers/package.controller"
const { PackageController } = require('../../controllers/package.controller');
function PackageRoutes(app) {
    app.use('/packages', router);
    router.get('/', 
    // [ verifyToken] ,
    PackageController.getPackages);
    router.get('/enables', 
    // [ verifyToken] ,
    PackageController.getPackagesEnables);
    router.get('/getNumClassesByUser', 
    // [ verifyToken] ,
    PackageController.getNumClassesByUser);
    router.post('/', PackageController.createPackage);
    router.put('/:id', PackageController.updatePackage);
    router.delete('/:id', PackageController.deletePackage);
}
