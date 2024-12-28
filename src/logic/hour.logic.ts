import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Role } from "../entities/Role";
import { Hour } from "../entities/Hour";



export class HourLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getHours(){
    try{
      const results = await AppDataSource.getRepository(Hour).find({
        where:{
            isActive: true
        }
      });

      return results;
    } catch(err) {
      console.log('err: ', err);
      throw err;
    }
  }

  async createHour(body: any){
    try {
      const { startHour, endHour } = body;
      let newHour = new Hour();
        newHour.startHour = startHour;
        newHour.endHour = endHour;
        
        const savedHour = await AppDataSource.getRepository(Hour).save(newHour);

        return savedHour;
    } catch (err) {
        console.log('err', err)
        throw err
    }
  }

  async deleteHour(id: any){
    try{
        const deletedHour = await AppDataSource.getRepository(Hour).update(id, {isActive: false});
        return deletedHour
    } catch(err) {
        console.log('err: ', err)
        throw err;
    }
  }
}