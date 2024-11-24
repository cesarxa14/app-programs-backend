import {Router, Express} from "express"
const router = Router();
// import {} from "../../controllers/package.controller"
const {RoleController} = require('../../controllers/role.controller');

function RoleRoutes(app: Express){
    app.use('/roles', router);

    router.get('/', RoleController.getRoles);
    router.post('/', RoleController.createRole);
}

export {RoleRoutes}