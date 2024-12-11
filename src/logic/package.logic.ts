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

    async getNumClassesByUser(query: any){
        try{
            const {userId} = query;

            let sql = `
                SELECT pa.*
                FROM packages pa
                INNER JOIN programs pr ON pa.program_id = pr.id
                INNER JOIN subscriptions s ON s.package_id = pa.id
                INNER JOIN users u ON u.id = s.user_id
                WHERE u.id = $1
                AND  s."isActive" = true
            `
            const results = await AppDataSource.query(sql, [userId])
    
            return results;
        } catch(err) {
            console.log('err: ', err)
            throw err;
        }
    }

}