import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
const { PurchaseController} = require("../../controllers/purchase.controller")

function PurchaseRoutes(app: Express){
    app.use('/purchases', router);

    router.get('/byUser',
        // [ verifyToken] ,
        PurchaseController.getPurchaseByUser);
    router.post('/', PurchaseController.createPurchase);
    // router.put('/:id', PackageController.updatePackage);
    // router.delete('/:id', PackageController.deletePackage);
}

export {PurchaseRoutes}