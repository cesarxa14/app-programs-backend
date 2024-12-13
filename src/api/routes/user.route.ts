import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
// import {} from "../../controllers/package.controller"
const {UserController} = require('../../controllers/user.controller');

function UserRoutes(app: Express){
    app.use('/users', router);

    router.get('/:id',
        // [ verifyToken] ,
        UserController.getUserById);
    // router.post('/', MyCustomerController.createMyCustomer);
    // router.put('/:id', MyCustomerController.updateMyCustomer);
    // router.delete('/:id', MyCustomerController.deleteCustomer);
}

export {UserRoutes}