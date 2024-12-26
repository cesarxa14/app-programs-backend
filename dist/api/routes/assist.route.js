"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsssitRoutes = AsssitRoutes;
const express_1 = require("express");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = (0, express_1.Router)();
// import {AssistController} from "../../controllers/assist.controller";
const { AssistController } = require('../../controllers/assist.controller');
function AsssitRoutes(app) {
    app.use('/assists', router);
    router.get('/byAdmin', [verifyToken_1.verifyToken], AssistController.getAssistByAdmin);
    router.get('/byCustomer', [verifyToken_1.verifyToken], AssistController.getAssistByCustomer);
    router.get('/getAssistsByUserPackages', 
    // [ verifyToken] ,
    AssistController.getAssistsByUserPackages);
    router.post('/', AssistController.createAssist);
    router.post('/sendReminder', AssistController.sendReminder);
    // router.put('/:id', BookController.updatePackage);
    // router.delete('/:id', BookController.deletePackage);
}
