"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = UserRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
// import {} from "../../controllers/package.controller"
const { UserController } = require('../../controllers/user.controller');
function UserRoutes(app) {
    app.use('/users', router);
    router.get('/:id', 
    // [ verifyToken] ,
    UserController.getUserById);
    // router.post('/', MyCustomerController.createMyCustomer);
    // router.put('/:id', MyCustomerController.updateMyCustomer);
    // router.delete('/:id', MyCustomerController.deleteCustomer);
}
