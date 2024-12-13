import {Router, Express} from "express"
import { verifyToken } from "../../middlewares/verifyToken";
const router = Router();
// import {AssistController} from "../../controllers/assist.controller";
const {AssistController} = require('../../controllers/assist.controller');

function AsssitRoutes(app: Express){
    app.use('/assists', router);

    router.get('/getAssistsByUserPackages',
        // [ verifyToken] ,
        AssistController.getAssistsByUserPackages);
    router.post('/', AssistController.createAssist);
    // router.put('/:id', BookController.updatePackage);
    // router.delete('/:id', BookController.deletePackage);
}

export {AsssitRoutes}