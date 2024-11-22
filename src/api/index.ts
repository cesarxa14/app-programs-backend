import { Express} from "express";
const {PackageRoutes} = require('./routes/package.route');
const {ProgramRoutes} = require('./routes/program.route');
const {AuthRoutes} = require('./routes/auth.route');
const {RoleRoutes} = require('./routes/role.route');


function indexRoutes(app: Express){
    PackageRoutes(app);
    AuthRoutes(app);
    ProgramRoutes(app);
    RoleRoutes(app);
}

export {indexRoutes}