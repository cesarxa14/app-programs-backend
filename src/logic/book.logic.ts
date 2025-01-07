import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Book } from "../entities/Book";
import { UserLogic } from "./user.logic";
import { sendMail } from "./logic_mailer";
import { AssistLogic } from "./assist.logic";
import { PackageLogic } from "./package.logic";
import config  from '../config/mail.config';

const userLogic = new UserLogic(AppDataSource)
const assistLogic = new AssistLogic(AppDataSource)
const packageLogic = new PackageLogic(AppDataSource)
export class BookLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getMyBooks(query: any){

    try{
      console.log('query', query)
      const whereConditions: any = { deleted: 0 };
      
      const queryOptions: any = {
        where: whereConditions,
        order: {
            id: 'DESC'
        },
        relations: ['userBooked', 'program']
      };
      if(query.limit){
        queryOptions.take =  10 
      }
      const results = await AppDataSource.getRepository(Book).find(queryOptions);

      return results;
    } catch(err) {
      console.log('error: ', err)
    }
  }

  async getMyBooksAdmin(query: any){

    try{
      const {userId} = query;

      const userFound = await userLogic.getUserById(userId);
        
      const results = await AppDataSource.getRepository(Book).find({
        where: {
          deleted: 0,
          userCreator: {id: userFound.id}
        },
        order: {
            id: 'DESC'
        },
        relations: ['userBooked', 'program'],

      });

      return results;
    } catch(err) {
      console.log('error: ', err)
    }
  }

  async getMyBooksCustomer(query: any){

    try{
      console.log('query: ', query)
      const {userId} = query;

      const userFound = await userLogic.getUserById(userId);
        
      console.log('userFound: ', userFound)
      const results = await AppDataSource.getRepository(Book).find({
        where: {
          deleted: 0,
          userBooked: {id: userFound.id}
        },
        order: {
            id: 'DESC'
        },
        relations: ['userBooked', 'program'],

      });

      return results;
    } catch(err) {
      console.log('error: ', err)
      throw err;
    }
  }

  async getBooksByUserPrograms(query: any){

    try{
      
        const {userId} = query;
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

                    ORDER BY book.id DESC
                   
        `
            
        const results = await AppDataSource.query(sql, [userId])

        return results;
    } catch(err) {
      console.log('error: ', err)
    }
  }


  // todo: AGREGAR EL DTO
  async createBook(body: any){

    try {
      const { program, classDate, classHour, userCreator, userBooked, additional_notes } = body;


      const resultBooks = await this.getBooksByUserPrograms({userId: userBooked});

      const numberAssist = resultBooks.length;
      const numClasesResult = await packageLogic.getNumClassesByUser({userId: userBooked});

      const numClases = numClasesResult[0].num_clases;

      console.log('resultAssist: ', resultBooks);
        console.log('numClases', numClases)

      if(numberAssist >= numClases){
        throw new Error("Usuario ya no tiene clases disponibles")
      }

      // const userWithPackage = await logi
      console.log('body:', body)
        let newBook = new Book();
        newBook.program = program;
        newBook.classDate = classDate;
        newBook.classHour = classHour;
        newBook.userBooked = userBooked;
        newBook.userCreator = userCreator;
        newBook.additional_notes = additional_notes || '';



        const savedBook = await AppDataSource.getRepository(Book).save(newBook);
        
        const fullBook = await AppDataSource.getRepository(Book).findOne({
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
    
    await sendMail(config.email,fullBook.userBooked.email, config.subjects.reserva, 'Holas', bodyHTML);
    // await sendMail('cetolara06@gmail.com', 'Registro de reserva', 'Holas', bodyHTML);
    

//await sendMail(config.email,fullBook.userBooked.email, 'Registro de reserva', 'Holas', bodyHTML);
// await sendMail('cetolara06@gmail.com', 'Registro de reserva', 'Holas', bodyHTML);


    
    // await sendMail('cetolara06@gmail.com', 'Registro de reserva', 'Holas', bodyHTML)

        return fullBook;
    } catch(err) {
      console.log('err: ', err)
      throw err;
    }

  }

 


}