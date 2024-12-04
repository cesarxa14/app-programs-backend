import {Router, Express} from "express"

const router = Router();
const { SaleController} = require("../../controllers/sale.controller")

function SaleRoutes(app: Express){
    app.use('/sales', router);

    router.get('/my-sales',
        // [ verifyToken] ,
        SaleController.getMySales);
    router.post('/', SaleController.createSale);
    // router.put('/:id', PackageController.updatePackage);
    // router.delete('/:id', PackageController.deletePackage);
}

export {SaleRoutes}