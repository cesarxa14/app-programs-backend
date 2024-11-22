import { Express} from "express";
const {PackageRoutes} = require('./routes/package.route');
const {AuthRoutes} = require('./routes/auth.route');


function indexRoutes(app: Express){
    PackageRoutes(app);
    AuthRoutes(app);
}

export {indexRoutes}