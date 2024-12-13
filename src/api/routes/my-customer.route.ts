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
    router.get('/search',
        [ verifyToken] ,
        MyCustomerController.getMyCustomersBySearch);
    router.post('/', MyCustomerController.createMyCustomer);
    router.put('/:id', MyCustomerController.updateMyCustomer);
    router.delete('/:id', MyCustomerController.deleteCustomer);
}

export {MyCustomerRoutes}