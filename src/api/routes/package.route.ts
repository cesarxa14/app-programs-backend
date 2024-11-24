import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
// import {} from "../../controllers/package.controller"
const {PackageController} = require('../../controllers/package.controller');

function PackageRoutes(app: Express){
    app.use('/packages', router);

    router.get('/',
        // [ verifyToken] ,
        PackageController.getPackages);
    router.post('/', PackageController.createPackage);
    router.put('/:id', PackageController.updatePackage);
    router.delete('/:id', PackageController.deletePackage);
}

export {PackageRoutes}