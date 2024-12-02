import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Book } from "../entities/Book";

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


  // todo: AGREGAR EL DTO
  async createBook(body: any){

    try {
      const { program, classDate, classHour, userCreator, userBooked, additional_notes } = body;
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