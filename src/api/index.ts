import { Express} from "express";
const {PackageRoutes} = require('./routes/package.route');
const {ProgramRoutes} = require('./routes/program.route');
const {AuthRoutes} = require('./routes/auth.route');
const {RoleRoutes} = require('./routes/role.route');
const {MyCustomerRoutes} = require('./routes/my-customer.route');
const {SubscriptionRoutes} = require('./routes/subscription.route');
const {PurchaseRoutes} = require('./routes/purchase.route');


function indexRoutes(app: Express){
    PackageRoutes(app);
    AuthRoutes(app);
    ProgramRoutes(app);
    RoleRoutes(app);
    MyCustomerRoutes(app);
    SubscriptionRoutes(app);
    PurchaseRoutes(app);
}

export {indexRoutes}