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
exports.AuthController = void 0;
const data_source_1 = require("../ddbb/data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const user_logic_1 = require("../logic/user.logic");
dotenv.config();
const userLogic = new user_logic_1.UserLogic(data_source_1.AppDataSource);
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // TODO: pasarlo a una funcion aparte
        const userFound = yield userLogic.getUserByEmail(email);
        if (!userFound) {
            return res.status(404).send({ message: "User not found" });
        }
        if (userFound.isVerified == false) {
            return res.status(400).send({ message: "User not verified" });
        }
        console.log('userFound: ', userFound);
        const passwordsCompared = yield bcrypt.compare(password, userFound.password);
        console.log('aqui');
        if (!passwordsCompared) {
            return res.status(400).send({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: userFound.id }, process.env.JWT_SECRET_KEY, { expiresIn: 1800 });
        res.json({ data: userFound, token });
    }
    catch (err) {
        console.log('error: ', err);
        return res.status(500).json({ message: err });
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const userFound = yield userLogic.getUserByEmail(email);
        if (userFound) {
            return res.status(400).send({ message: "User already exists" });
        }
        const registeredUser = yield userLogic.register(req.body);
        return res.status(201).json({
            token: registeredUser.token,
            data: registeredUser.savedUser
        });
    }
    catch (err) {
        console.log('error: ', err);
        res.status(500).json({ error: err });
    }
});
const completeRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, phone, country, province, department, district, type_document, document, birthdate, medical_history, gender } = req.body;
        const userFound = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
            where: {
                id: userId
            }
        });
        if (!userFound)
            throw new Error("User not found");
        console.log({ userId, phone, country, province, district, type_document, document, birthdate, medical_history, gender });
        userFound.phone = phone;
        userFound.country = country;
        userFound.province = province;
        userFound.district = district;
        userFound.type_document = type_document;
        userFound.document = document;
        userFound.department = department;
        userFound.gender = gender;
        userFound.birthdate = birthdate;
        userFound.medical_history = medical_history;
        userFound.isVerified = true;
        const savedUser = yield data_source_1.AppDataSource.getRepository(User_1.User).save(userFound);
        return res.status(201).json({ data: savedUser });
    }
    catch (err) {
        console.log('error: ', err);
        res.status(500).json({ error: err });
    }
});
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('body: ', req.body);
        const { token, byAssistant } = req.body;
        const tokenDecoded = jwt.decode(token);
        console.log('tokenDecoded', tokenDecoded);
        const idUser = tokenDecoded.id;
        // Buscar la entidad por ID
        const userToUpdate = yield data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: Number(idUser) });
        userToUpdate.isVerified = true;
        const updatedUser = yield data_source_1.AppDataSource.getRepository(User_1.User).save(userToUpdate);
        return res.json({ data: updatedUser });
    }
    catch (err) {
        console.log('error: ', err);
    }
});
exports.AuthController = {
    login,
    register,
    verifyUser,
    completeRegister
};
