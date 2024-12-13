import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
// import {} from "../../controllers/package.controller"
const {ProgramController} = require('../../controllers/program.controller');

function ProgramRoutes(app: Express){
    app.use('/programs', router);

    router.get('/',
        [ verifyToken] ,
        ProgramController.getPrograms);
    router.get('/getProgramValidByUser',
        [ verifyToken] ,
        ProgramController.getProgramValidByUser);
    router.get('/getProgramsBuyedByCustomer',
        [ verifyToken] ,
        ProgramController.getProgramsBuyedByCustomer);
    router.post('/', ProgramController.createProgram);
    router.put('/:id', ProgramController.updateProgram);
    router.delete('/:id', ProgramController.deleteProgram);

}

export {ProgramRoutes}