import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Role } from "../entities/Role";



export class RoleLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getRoles(){
    try{
      const results = await AppDataSource.getRepository(Role).find();

      return results;
    } catch(err) {
      console.log('err: ', err);
    }
  }

  async createRole(body: any){
    try {
      const { name } = body;
      let newRole = new Role();
        newRole.name = name;
        
        const savedRole = await AppDataSource.getRepository(Role).save(newRole);

        return savedRole;
    } catch (err) {

    }
  }
}