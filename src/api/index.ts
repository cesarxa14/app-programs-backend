import { Express} from "express";
const {PackageRoutes} = require('./routes/package.route');


function indexRoutes(app: Express){
    PackageRoutes(app);
}

export {indexRoutes}