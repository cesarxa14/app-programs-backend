import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Package } from "../entities/Package";


export class PackageLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async getPackageById(id: number){
        try{

            const packageData = await AppDataSource.getRepository(Package).findOne({
                where:{
                    id: id
                },
                relations: ["program"]
            })

            return packageData;

        } catch(err) {
            console.log('err: ', err)
            throw err;
        }
    }

}