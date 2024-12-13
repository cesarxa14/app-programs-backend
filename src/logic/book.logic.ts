import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Book } from "../entities/Book";
import { UserLogic } from "./user.logic";

const userLogic = new UserLogic(AppDataSource)
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


  // todo: AGREGAR EL DTO
  async createBook(body: any){

    try {
      const { program, classDate, classHour, userCreator, userBooked, additional_notes } = body;

      // TODO: VALIDAMOS SI EL USUARIO YA CUENTA CON PAQUETES

      // const userWithPackage = await logi
      console.log('body:', body)
        let newBook = new Book();
        newBook.program = program;
        newBook.classDate = classDate;
        newBook.classHour = classHour;
        newBook.userBooked = userBooked;
        newBook.userCreator = userCreator;
        newBook.additional_notes = additional_notes || ''

        const savedBook = await AppDataSource.getRepository(Book).save(newBook);

        const fullBook = await AppDataSource.getRepository(Book).findOne({
            where: { id: savedBook.id },
            relations: ['userBooked'], // Incluir la relación
          });

        return fullBook;
    } catch(err) {
      console.log('err: ', err)
    }

  }


}