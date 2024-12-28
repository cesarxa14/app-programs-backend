import {Router, Express} from "express"
const router = Router();
// import {} from "../../controllers/package.controller"
const {HourController} = require('../../controllers/hour.controller');

function HourRoutes(app: Express){
    app.use('/hours', router);

    router.get('/', HourController.getHours);
    router.post('/', HourController.createHour);
    // router.put('/:id', HourController.updateHour);
    router.delete('/:id', HourController.deleteHour);
}

export {HourRoutes}