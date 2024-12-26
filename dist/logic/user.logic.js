"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const logic_mailer_1 = require("../logic/logic_mailer");
class UserLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: {
                        id: id
                    }
                });
                return userFound;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
                    where: {
                        email: email
                    }
                });
                return userFound;
            }
            catch (err) {
                console.log('err: ', err);
            }
        });
    }
    // todo: pasarlo con dto para validar
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, lastname, email, role, password, createdBy } = body;
                const salt = yield bcrypt.genSalt(10);
                const passwordEncrypt = yield bcrypt.hash(password, salt);
                let newUser = new User_1.User();
                newUser.name = name;
                newUser.lastname = lastname;
                newUser.email = email;
                newUser.role = role;
                newUser.password = passwordEncrypt;
                newUser.createdBy = createdBy;
                const savedUser = yield data_source_1.AppDataSource.getRepository(User_1.User).save(newUser);
                const token = jwt.sign({ id: savedUser.id }, process.env.JWT_SECRET_KEY, { expiresIn: 30 });
                // TODO: PASARLO A UNA FUNCIONA APARTE
                const verificationLink = `http://localhost:4200/auth/verify-email?token=${token}`;
                const bodyHTML = `
        <div>
            <h1>Verifica tu cuenta dando click en el siguiente enlace</h1>
            <p>
                <a href="${verificationLink}">Click para verificar</a>
            </p>
        </div>
    `;
                console.log('savedUser', savedUser);
                const sendEmail = yield (0, logic_mailer_1.sendMail)(newUser.email, 'Registro Existoso', 'Holas', bodyHTML);
                return { savedUser, token };
            }
            catch (err) {
                console.log('error: ', err);
                throw err;
            }
        });
    }
}
exports.UserLogic = UserLogic;
