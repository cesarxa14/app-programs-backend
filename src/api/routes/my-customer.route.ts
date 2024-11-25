import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
// import {} from "../../controllers/package.controller"
const {MyCustomerController} = require('../../controllers/my-customers.controller');

function MyCustomerRoutes(app: Express){
    app.use('/my-customers', router);

    router.get('/',
        // [ verifyToken] ,
        MyCustomerController.getMyCustomers);
    // router.post('/', PackageController.createPackage);
    // router.put('/:id', PackageController.updatePackage);
    // router.delete('/:id', PackageController.deletePackage);
}

export {MyCustomerRoutes}