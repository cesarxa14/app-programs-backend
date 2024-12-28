import { Express} from "express";
const {PackageRoutes} = require('./routes/package.route');
const {ProgramRoutes} = require('./routes/program.route');
const {AuthRoutes} = require('./routes/auth.route');
const {RoleRoutes} = require('./routes/role.route');
const {MyCustomerRoutes} = require('./routes/my-customer.route');
const {SubscriptionRoutes} = require('./routes/subscription.route');
const {PurchaseRoutes} = require('./routes/purchase.route');
const {BookRoutes} = require('./routes/book.route')
const {SaleRoutes} = require('./routes/sale.route')
const {ProductRoutes} = require('./routes/product.route')
const {AsssitRoutes} = require('./routes/assist.route')
const {UserRoutes} = require('./routes/user.route')
const {HourRoutes} = require('./routes/hour.route')
const {ReportRoutes} = require('./routes/report.route')


function indexRoutes(app: Express){
    PackageRoutes(app);
    AuthRoutes(app);
    ProgramRoutes(app);
    RoleRoutes(app);
    MyCustomerRoutes(app);
    SubscriptionRoutes(app);
    PurchaseRoutes(app);
    BookRoutes(app);
    SaleRoutes(app);
    ProductRoutes(app);
    AsssitRoutes(app);
    UserRoutes(app);
    HourRoutes(app);
    ReportRoutes(app);

}

export {indexRoutes}