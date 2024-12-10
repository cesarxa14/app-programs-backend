import {Router, Express} from "express"
import { upload } from "../../config/multer.config";
const router = Router();
const {ProductController} = require('../../controllers/product.controller');

function ProductRoutes(app: Express){
    app.use('/products', router);

    router.get('/', ProductController.getProducts);
    router.get('/my-products', ProductController.getMyProducts);
    router.post('/',  ProductController.createProduct);
    router.delete('/:id', ProductController.deleteProduct);
}

export {ProductRoutes}