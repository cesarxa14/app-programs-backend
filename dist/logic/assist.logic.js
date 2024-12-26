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
exports.AssistLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const Assists_1 = require("../entities/Assists");
const package_logic_1 = require("./package.logic");
const Subscription_1 = require("../entities/Subscription");
const logic_mailer_1 = require("./logic_mailer");
const user_logic_1 = require("./user.logic");
const mail_config_1 = __importDefault(require("../config/mail.config"));
const packageLogic = new package_logic_1.PackageLogic(data_source_1.AppDataSource);
const userLogic = new user_logic_1.UserLogic(data_source_1.AppDataSource);
class AssistLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getAssistByAdmin(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                let sql = `
               SELECT a.*, pr.name AS program_name, pa.name AS package_name
                FROM assists a
                INNER JOIN programs pr ON a.program_id = pr.id
                INNER JOIN packages pa ON a.package_id = pa.id
                WHERE a.assistant_id = $1
                AND a.deleted = 0
                ORDER BY a.id DESC;       
                       
        `;
                const results = yield data_source_1.AppDataSource.query(sql, [userId]);
                return results;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
    getAssistByCustomer(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                let sql = `
               SELECT a.*, pr.name AS program_name, pa.name AS package_name
                FROM assists a
                INNER JOIN programs pr ON a.program_id = pr.id
                INNER JOIN packages pa ON a.package_id = pa.id
                WHERE a.student_id = $1
                AND a.deleted = 0
                ORDER BY a.id DESC;    
                       
        `;
                const results = yield data_source_1.AppDataSource.query(sql, [userId]);
                return results;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
    getAssistsByUserPackages(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                let sql = `
                    SELECT 
                        assist.created_at AS assistDate,
                        assist."classHour" AS classHour, 
                        CONCAT(assistant.name, ' ', assistant.lastname) AS instructor,
                        CONCAT(student.name, ' ', student.lastname) AS student, 
                        program.name AS program_name
                    FROM 
                        assists assist
                    INNER JOIN 
                        users assistant ON assist.assistant_id = assistant.id
                    INNER JOIN 
                        users student ON assist.student_id = student.id
                    INNER JOIN 
                        programs program ON assist.program_id = program.id
                    INNER JOIN 
                        packages package ON assist.package_id = package.id
                    WHERE 
                        student.id = $1
                        AND assist.deleted = 0
                    ORDER BY assist.id DESC
                       
            `;
                const results = yield data_source_1.AppDataSource.query(sql, [userId]);
                return results;
            }
            catch (err) {
                console.log('error: ', err);
            }
        });
    }
    createAssist(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { program, assistant, student, pack, classHour, additional_notes } = body;
                const resultAssist = yield this.getAssistsByUserPackages({ userId: student });
                const numberAssist = resultAssist.length;
                const numClasesResult = yield packageLogic.getNumClassesByUser({ userId: student });
                const numClases = numClasesResult[0].num_clases;
                if (numberAssist >= numClases) {
                    throw new Error("Usuario ya no tiene clases disponibles");
                }
                console.log('resultAssist: ', resultAssist);
                console.log('numClases', numClases);
                // const userWithPackage = await logi
                console.log('body:', body);
                let newAssist = new Assists_1.Assist();
                newAssist.program = program;
                newAssist.assistant = assistant;
                newAssist.student = student;
                newAssist.package = pack;
                newAssist.classHour = classHour;
                newAssist.additional_notes = additional_notes;
                const savedAssist = yield data_source_1.AppDataSource.getRepository(Assists_1.Assist).save(newAssist);
                const fullAssist = yield data_source_1.AppDataSource.getRepository(Assists_1.Assist).findOne({
                    where: { id: savedAssist.id },
                });
                // SI YA ES LA ULTIMA ASISTENCIA DISPONIBLE REGISTRADA, LO INACTIVAMOS
                if (numberAssist == numClases - 1) {
                    const subscriptionFound = yield data_source_1.AppDataSource.getRepository(Subscription_1.Subscription).findOne({
                        where: {
                            service: fullAssist.package,
                            user: fullAssist.student
                        }
                    });
                    subscriptionFound.isActive = false;
                    yield data_source_1.AppDataSource.getRepository(Subscription_1.Subscription).save(subscriptionFound);
                    console.log('Subscription updated successfully');
                }
                return fullAssist;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
    sendReminder(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = body;
                const studentFound = yield userLogic.getUserById(studentId);
                if (!studentFound)
                    throw new Error('Student not found');
                const bodyHTML1 = `
            <div>
                <h1>Subscripcion a punto de vencer!</h1>
                <p>
                    Hola ${studentFound.name}, tienes una clase pendiente, comentanos si deseas renovar.
                </p>
            </div>
        `;
                const bodyHTML = `
<div style="font-family: Arial, sans-serif; color: #000000; padding: 20px; max-width: 600px; margin: auto;">
    <div style="text-align: center;">
        <img src="https://copiloto.sigties.com/files/project_files/21/_file67605e200f519-logook.png" alt="Nadar es Vida" style="max-width: 200px;"/>
    </div>
    <h1 style="color: #2fa3ce; text-align: center;">Subscripción a punto de vencer!</h1>
    <p style="font-size: 16px; line-height: 1.5;">
        Hola ${studentFound.name}, tienes una clase pendiente, coméntanos si deseas renovar.
    </p>
<div style="text-align: center; margin-top: 20px;">
    <a href="https://wa.link/bbv21m" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;"
       onmouseover="this.style.backgroundColor='#45a049';" 
       onmouseout="this.style.backgroundColor='#4CAF50';" 
       onmousedown="this.style.backgroundColor='#3e8e41';" 
       onmouseup="this.style.backgroundColor='#45a049';">
       Renovar Subscripción
    </a>
</div>
    <p style="text-align: center; font-size: 14px; color: #555555; margin-top: 20px;">Gracias por elegir Nadar es Vida. ¡Nos vemos en el mar!</p>
</div>
`;
                yield (0, logic_mailer_1.sendMail)(mail_config_1.default.email, studentFound.email, mail_config_1.default.subjects.reminder, 'Por vencer', bodyHTML);
                return true;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
}
exports.AssistLogic = AssistLogic;
