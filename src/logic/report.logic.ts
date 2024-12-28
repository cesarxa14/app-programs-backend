import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";



export class ReportLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getQuantityStudent(){
    try{

        const [users, count] = await this.dataSource.getRepository(User).findAndCount({
            where: {
              role: 3,
              deleted: 0,
            },
          });
    //   let sql = `
    //     SELECT count(*) 
    //     FROM users
    //     WHERE role = 3
    //     AND deleted = 0
    //   `

    //   const results = await AppDataSource.query(sql)
      return count;
    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

}