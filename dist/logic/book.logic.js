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
exports.BookLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const Book_1 = require("../entities/Book");
const user_logic_1 = require("./user.logic");
const logic_mailer_1 = require("./logic_mailer");
const assist_logic_1 = require("./assist.logic");
const package_logic_1 = require("./package.logic");
const mail_config_1 = __importDefault(require("../config/mail.config"));
const userLogic = new user_logic_1.UserLogic(data_source_1.AppDataSource);
const assistLogic = new assist_logic_1.AssistLogic(data_source_1.AppDataSource);
const packageLogic = new package_logic_1.PackageLogic(data_source_1.AppDataSource);
class BookLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getMyBooks(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('query', query);
                const whereConditions = { deleted: 0 };
                const queryOptions = {
                    where: whereConditions,
                    order: {
                        id: 'DESC'
                    },
                    relations: ['userBooked', 'program']
                };
                if (query.limit) {
                    queryOptions.take = 10;
                }
                const results = yield data_source_1.AppDataSource.getRepository(Book_1.Book).find(queryOptions);
                return results;
            }
            catch (err) {
                console.log('error: ', err);
            }
        });
    }
    getMyBooksAdmin(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                const userFound = yield userLogic.getUserById(userId);
                const results = yield data_source_1.AppDataSource.getRepository(Book_1.Book).find({
                    where: {
                        deleted: 0,
                        userCreator: { id: userFound.id }
                    },
                    order: {
                        id: 'DESC'
                    },
                    relations: ['userBooked', 'program'],
                });
                return results;
            }
            catch (err) {
                console.log('error: ', err);
            }
        });
    }
    getMyBooksCustomer(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('query: ', query);
                const { userId } = query;
                const userFound = yield userLogic.getUserById(userId);
                console.log('userFound: ', userFound);
                const results = yield data_source_1.AppDataSource.getRepository(Book_1.Book).find({
                    where: {
                        deleted: 0,
                        userBooked: { id: userFound.id }
                    },
                    order: {
                        id: 'DESC'
                    },
                    relations: ['userBooked', 'program'],
                });
                return results;
            }
            catch (err) {
                console.log('error: ', err);
                throw err;
            }
        });
    }
    getBooksByUserPrograms(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                let sql = `
                SELECT 
                    *
                    FROM 
                        books book
                    INNER JOIN 
                        users user_booked ON book.user_booked_id = user_booked.id
                    INNER JOIN 
                        users user_creator ON book.user_creator_id = user_creator.id
                    INNER JOIN 
                        programs program ON book.program_id = program.id
               
                    WHERE 
                        user_booked.id = $1
                        AND book.deleted = 0
                   
        `;
                const results = yield data_source_1.AppDataSource.query(sql, [userId]);
                return results;
            }
            catch (err) {
                console.log('error: ', err);
            }
        });
    }
    // todo: AGREGAR EL DTO
    createBook(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { program, classDate, classHour, userCreator, userBooked, additional_notes } = body;
                const resultBooks = yield this.getBooksByUserPrograms({ userId: userBooked });
                const numberAssist = resultBooks.length;
                const numClasesResult = yield packageLogic.getNumClassesByUser({ userId: userBooked });
                const numClases = numClasesResult[0].num_clases;
                console.log('resultAssist: ', resultBooks);
                console.log('numClases', numClases);
                if (numberAssist >= numClases) {
                    throw new Error("Usuario ya no tiene clases disponibles");
                }
                // const userWithPackage = await logi
                console.log('body:', body);
                let newBook = new Book_1.Book();
                newBook.program = program;
                newBook.classDate = classDate;
                newBook.classHour = classHour;
                newBook.userBooked = userBooked;
                newBook.userCreator = userCreator;
                newBook.additional_notes = additional_notes || '';
                const savedBook = yield data_source_1.AppDataSource.getRepository(Book_1.Book).save(newBook);
                const fullBook = yield data_source_1.AppDataSource.getRepository(Book_1.Book).findOne({
                    where: { id: savedBook.id },
                    relations: ['userBooked'], // Incluir la relación
                });
                // TODO: pasar a una variable en una carpeta de bodyHTML
                /*
                let bodyHTML2 = `
                <div>
                  <h1>Se registro su reserva para el programa <b>${program.name}</b></h1>
                  <p>Fecha: <b>${classDate}</b></p>
                  <p>Hora: <b>${classHour}</b></p>
                  
              `
              if(additional_notes || additional_notes != ''){
                bodyHTML2 += `<p>Notas: <b>${additional_notes}</b></p> `
              }
              body += `</div>`
                */
                let bodyHTML = `
        <div style="font-family: Arial, sans-serif; color: #000000; padding: 20px; max-width: 600px; margin: auto;">
            <div style="text-align: center;">
                <img src="https://copiloto.sigties.com/files/project_files/21/_file67605e200f519-logook.png" alt="Nadar es Vida" style="max-width: 200px;"/>
            </div>
            <h1 style="color: #2fa3ce; text-align: center;">Se registro su reserva para el programa <b>${program.name}</b></h1>
            <p style="font-size: 16px; line-height: 1.5;">Fecha: <b>${classDate}</b></p>
            <p style="font-size: 16px; line-height: 1.5;">Hora: <b>${classHour}</b></p>
            ${additional_notes ? `<p style="font-size: 16px; line-height: 1.5;">Notas: <b>${additional_notes}</b></p>` : ''}
            <div style="text-align: center; margin-top: 20px;">
                <a href="https://wa.link/bbv21m" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #e89a28; text-decoration: none; border-radius: 5px; border: 2px solid #e89a28; transition: background-color 0.3s ease;">
                    Confirmar Reserva
                </a>
            </div>
            <p style="text-align: center; font-size: 14px; color: #555555; margin-top: 20px;">Gracias por elegir Nadar es Vida. ¡Nos vemos en el mar!</p>
        </div>
    `;
                yield (0, logic_mailer_1.sendMail)(mail_config_1.default.email, fullBook.userBooked.email, mail_config_1.default.subjects.reserva, 'Holas', bodyHTML);
                // await sendMail('cetolara06@gmail.com', 'Registro de reserva', 'Holas', bodyHTML);
                //await sendMail(config.email,fullBook.userBooked.email, 'Registro de reserva', 'Holas', bodyHTML);
                // await sendMail('cetolara06@gmail.com', 'Registro de reserva', 'Holas', bodyHTML);
                // await sendMail('cetolara06@gmail.com', 'Registro de reserva', 'Holas', bodyHTML)
                return fullBook;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
}
exports.BookLogic = BookLogic;
