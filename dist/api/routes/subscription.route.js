"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRoutes = SubscriptionRoutes;
const express_1 = require("express");
const router = (0, express_1.Router)();
const { SubscriptionController } = require("../../controllers/subscription.controller");
function SubscriptionRoutes(app) {
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
