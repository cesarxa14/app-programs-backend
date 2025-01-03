import {Router, Express} from "express"
const router = Router();
// import {} from "../../controllers/package.controller"
const {ReportController} = require('../../controllers/report.controller');

function ReportRoutes(app: Express){
    app.use('/reports', router);

    router.get('/getQuantityStudent', ReportController.getQuantityStudent);
    router.get('/getStudentsByPrograms', ReportController.getStudentsByPrograms);
    router.get('/getStudentsByPackages', ReportController.getStudentsByPackages);
    router.get('/getEarningsByPackages', ReportController.getEarningsByPackages);
    router.get('/getEarningsByPrograms', ReportController.getEarningsByPrograms);
    router.get('/getUsersByGender', ReportController.getUsersByGender);
    router.get('/getUsersInfoDemographics', ReportController.getUsersInfoDemographics);
    router.get('/getSalesLineTime', ReportController.getSalesLineTime);
    // router.post('/', ReportController.createRole);
}

export {ReportRoutes}