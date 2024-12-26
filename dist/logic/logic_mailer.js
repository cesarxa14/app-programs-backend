"use strict";
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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configurar el transportador
let transportOptions1 = {
    service: 'gmail',
    auth: {
        user: 'cetolara06@gmail.com',
        pass: 'ogarnrmfpnujkgsa' // TODO: pasarlo a una variable de entorno
    }
};
const transportOptions2 = {
    host: 'mail.nadaresvidaperu.pe', // Asegúrate de usar el host SMTP correcto de tu proveedor de correo
    port: 465, // El puerto puede variar, usualmente es 587 para conexiones TLS
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@nadaresvidaperu.com',
        pass: 'r4CeHv1j{2z7'
    }
};
const transportOptions = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};
const transporter = nodemailer_1.default.createTransport(transportOptions, {
    logger: true, // Log detail during connection
    debug: true // Log SMTP traffic
});
transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP Connection Error: ", error);
    }
    else {
        console.log("SMTP Server is ready to send emails");
    }
});
// Función para enviar correos
const sendMail = (from, to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: from, // Remitente
            to, // Destinatario
            subject, // Asunto
            text, // Texto plano
            html, // HTML opcional
        });
        console.log("Correo enviado: ", info.messageId);
    }
    catch (error) {
        console.error("Error enviando correo: ", error);
        throw error;
    }
});
exports.sendMail = sendMail;
