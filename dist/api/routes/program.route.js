"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramRoutes = ProgramRoutes;
const express_1 = require("express");
const verifyToken_1 = require("../../middlewares/verifyToken");
const router = (0, express_1.Router)();
// import {} from "../../controllers/package.controller"
const { ProgramController } = require('../../controllers/program.controller');
function ProgramRoutes(app) {
    app.use('/programs', router);
    router.get('/', [verifyToken_1.verifyToken], ProgramController.getPrograms);
    router.get('/getProgramValidByUser', [verifyToken_1.verifyToken], ProgramController.getProgramValidByUser);
    router.get('/getProgramsBuyedByCustomer', [verifyToken_1.verifyToken], ProgramController.getProgramsBuyedByCustomer);
    router.post('/', ProgramController.createProgram);
    router.put('/:id', ProgramController.updateProgram);
    router.delete('/:id', ProgramController.deleteProgram);
}
