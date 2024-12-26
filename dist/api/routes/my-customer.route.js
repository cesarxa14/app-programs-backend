"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomerRoutes = MyCustomerRoutes;
const express_1 = require("express");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = (0, express_1.Router)();
// import {} from "../../controllers/package.controller"
const { MyCustomerController } = require('../../controllers/my-customers.controller');
function MyCustomerRoutes(app) {
    app.use('/my-customers', router);
    router.get('/', 
    // [ verifyToken] ,
    MyCustomerController.getMyCustomers);
    router.get('/search', [verifyToken_1.verifyToken], MyCustomerController.getMyCustomersBySearch);
    router.post('/', MyCustomerController.createMyCustomer);
    router.put('/:id', MyCustomerController.updateMyCustomer);
    router.delete('/:id', MyCustomerController.deleteCustomer);
}
