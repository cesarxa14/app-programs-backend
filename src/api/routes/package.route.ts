import {Router, Express} from "express"
const router = Router();
import {} from "../../controllers/package.controller"
const {PackageController} = require('../../controllers/package.controller');

function PackageRoutes(app: Express){
    app.use('/packages', router);

    router.get('/', PackageController.getPackages);
    router.post('/', PackageController.createPackage);
}

export {PackageRoutes}