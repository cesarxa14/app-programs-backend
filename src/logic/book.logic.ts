import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Book } from "../entities/Book";
import { UserLogic } from "./user.logic";
import { sendMail } from "./logic_mailer";
import { AssistLogic } from "./assist.logic";
import { PackageLogic } from "./package.logic";

const userLogic = new UserLogic(AppDataSource)
const assistLogic = new AssistLogic(AppDataSource)
const packageLogic = new PackageLogic(AppDataSource)
export class BookLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getMyBooks(){

    try{
      const whereConditions: any = { deleted: 0 };
        
      const results = await AppDataSource.getRepository(Book).find({
        where: whereConditions,
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
          let bodyHTML = `
          <div>
            <h1>Se registro su reserva para el programa <b>${program.name}</b></h1>
            <p>Fecha: <b>${classDate}</b></p>
            <p>Hora: <b>${classHour}</b></p>
            
        `
        if(additional_notes || additional_notes != ''){
          bodyHTML += `<p>Notas: <b>${additional_notes}</b></p> `
        }
        body += `</div>`

    await sendMail(fullBook.userBooked.email, 'Registro de reserva', 'Holas', bodyHTML)
    // await sendMail('cetolara06@gmail.com', 'Registro de reserva', 'Holas', bodyHTML)

        return fullBook;
    } catch(err) {
      console.log('err: ', err)
      throw err;
    }

  }


}