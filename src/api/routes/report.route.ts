import {Router, Express} from "express"
const router = Router();
// import {} from "../../controllers/package.controller"
const {ReportController} = require('../../controllers/report.controller');

function ReportRoutes(app: Express){
    app.use('/reports', router);

    router.get('/getQuantityStudent', ReportController.getQuantityStudent);
    // router.post('/', ReportController.createRole);
}

export {ReportRoutes}