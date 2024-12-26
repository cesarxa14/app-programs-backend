"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRoutes = RoleRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
// import {} from "../../controllers/package.controller"
const { RoleController } = require('../../controllers/role.controller');
function RoleRoutes(app) {
    app.use('/roles', router);
    router.get('/', RoleController.getRoles);
    router.post('/', RoleController.createRole);
}
