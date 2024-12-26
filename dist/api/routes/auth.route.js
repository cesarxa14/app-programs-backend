"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = AuthRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
// import {AuthController} from "../../controllers/auth.controller"
const { AuthController } = require('../../controllers/auth.controller');
function AuthRoutes(app) {
    app.use('/auth', router);
    router.post('/login', AuthController.login);
    router.post('/register', AuthController.register);
    router.post('/complete-register', AuthController.completeRegister);
    router.post('/verifyUser', AuthController.verifyUser);
}
