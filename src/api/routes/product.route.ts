import {Router, Express} from "express"
const router = Router();
const {ProductController} = require('../../controllers/product.controller');

function ProductRoutes(app: Express){
    app.use('/products', router);

    router.get('/', ProductController.getMyProducts);
    // router.post('/', ProductController.createRole);
}

export {ProductRoutes}