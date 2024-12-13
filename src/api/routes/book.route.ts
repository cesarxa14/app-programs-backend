import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
// import {} from "../../controllers/package.controller"
const {BookController} = require('../../controllers/book.controller');

function BookRoutes(app: Express){
    app.use('/books', router);

    router.get('/', [ verifyToken] , BookController.getMyBooks);
    router.get('/admin', [ verifyToken] , BookController.getMyBooksAdmin);
    router.get('/customer', [ verifyToken] , BookController.getMyBooksCustomer);
    router.post('/', BookController.createBook);
    // router.put('/:id', BookController.updatePackage);
    // router.delete('/:id', BookController.deletePackage);
}

export {BookRoutes}