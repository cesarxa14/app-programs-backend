import {Router, Express} from "express"
const router = Router();
// import {AuthController} from "../../controllers/auth.controller"
const {AuthController} = require('../../controllers/auth.controller');


function AuthRoutes(app: Express){
    app.use('/auth', router);

    router.post('/login', AuthController.login);
    router.post('/register', AuthController.register);
    router.post('/complete-register', AuthController.completeRegister);
    router.post('/verifyUser', AuthController.verifyUser);
    router.post('/email-reset-password', AuthController.sendEmailResetPassword);
    router.post('/reset-password', AuthController.resetPassword);
    
}

// export class AuthRoutes {
//   authController: AuthController;
//   constructor(app: Express, authController: AuthController){
//     this.authController = authController;
//     app.use('/auth', router);
//     router.post('/login', this.authController.login);

//   }


// }

export {AuthRoutes}