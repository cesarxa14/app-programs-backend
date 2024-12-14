import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
const { SubscriptionController} = require("../../controllers/subscription.controller")

function SubscriptionRoutes(app: Express){
    app.use('/subscriptions', router);

    router.get('/byUser',
        // [ verifyToken] ,
        SubscriptionController.getSubscriptionByUser);
    router.get('/valid',
        // [ verifyToken] ,
        SubscriptionController.getSubscriptionValidByUser);
    router.post('/', SubscriptionController.createSubscription);
    router.put('/extendSubscription/:id', SubscriptionController.extendSubscription);
    // router.delete('/:id', PackageController.deletePackage);
}

export {SubscriptionRoutes}