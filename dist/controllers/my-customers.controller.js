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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyCustomerController = void 0;
const data_source_1 = require("../ddbb/data-source");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const logic_mailer_1 = require("../logic/logic_mailer");
const my_customer_logic_1 = require("../logic/my-customer.logic");
const mail_config_1 = __importDefault(require("../config/mail.config"));
const myCustomerLogic = new my_customer_logic_1.MyCustomerLogic(data_source_1.AppDataSource);
const getMyCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield myCustomerLogic.getMyCustomers(req.query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const getMyCustomersBySearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.query);
        const results = yield myCustomerLogic.getMyCustomersBySearch(req.query);
        return res.json({ data: results });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const createMyCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('body: ', req.body);
    const { createdBy, name, lastname, email, password, phone, country, department, province, district, type_document, document, birthdate, medical_history } = req.body;
    try {
        const salt = yield bcrypt.genSalt(10);
        const passwordEncrypt = yield bcrypt.hash(password, salt);
        let createUserMyCustomer = new User_1.User();
        createUserMyCustomer.name = name;
        createUserMyCustomer.lastname = lastname;
        createUserMyCustomer.email = email;
        createUserMyCustomer.password = passwordEncrypt;
        createUserMyCustomer.phone = phone;
        createUserMyCustomer.country = country;
        createUserMyCustomer.department = department;
        createUserMyCustomer.province = province;
        createUserMyCustomer.district = district;
        createUserMyCustomer.type_document = type_document;
        createUserMyCustomer.document = document;
        createUserMyCustomer.birthdate = birthdate;
        createUserMyCustomer.medical_history = medical_history;
        createUserMyCustomer.role = 3;
        createUserMyCustomer.createdBy = createdBy || -1;
        const savedUserMyCustomer = yield data_source_1.AppDataSource.getRepository(User_1.User).save(createUserMyCustomer);
        const token = jwt.sign({ id: createUserMyCustomer.id }, process.env.JWT_SECRET_KEY, { expiresIn: 30 });
        // TODO: AQUI SE LE ENVIA UN CORREO AL USUARIO CREADO PARA QUE PUEDA CONFIRMAR Y VALIDAR SU CUENTA
        // TODO: PASARLO A UNA FUNCIONA APARTE
        const verificationLink = `http://localhost:4200/auth/verify-email?token=${token}&byAssistant=true`;
        const bodyHTML = `
            <div>
                <h1>Verifica tu cuenta dando click en el siguiente enlace</h1>
                <p>
                    <a href="${verificationLink}">Click para verificar</a>
                </p>
            </div>
        `;
        const sendEmail = yield (0, logic_mailer_1.sendMail)(mail_config_1.default.email, createUserMyCustomer.email, mail_config_1.default.subjects.registro, 'Holas', bodyHTML);
        console.log('sendEmail: ', sendEmail);
        const fullUserMyCustomer = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
            where: { id: savedUserMyCustomer.id },
        });
        res.status(201).json(fullUserMyCustomer);
    }
    catch (err) {
        console.log('err: ', err);
        return res.status(400).json({ message: err });
    }
});
const updateMyCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, lastname, email, phone, country, province, district, type_document, document, birthdate, medical_history } = req.body;
        // Buscar la entidad por ID
        const userToUpdate = yield data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({ id: Number(id) });
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }
        userToUpdate.name = name;
        userToUpdate.lastname = lastname;
        userToUpdate.email = email;
        userToUpdate.phone = phone;
        userToUpdate.country = country;
        userToUpdate.province = province;
        userToUpdate.district = district;
        userToUpdate.type_document = type_document;
        userToUpdate.document = document;
        userToUpdate.birthdate = birthdate;
        userToUpdate.medical_history = medical_history;
        userToUpdate.role = 3;
        const updatedProgram = yield data_source_1.AppDataSource.getRepository(User_1.User).save(userToUpdate);
        return res.json({ data: updatedProgram });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedUser = yield data_source_1.AppDataSource.getRepository(User_1.User).update(id, { deleted: 1 });
        return res.json({ data: deletedUser });
    }
    catch (err) {
        console.log('err: ', err);
    }
});
exports.MyCustomerController = {
    getMyCustomers,
    getMyCustomersBySearch,
    createMyCustomer,
    updateMyCustomer,
    deleteCustomer
};
