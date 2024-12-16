import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";



export class MyCustomerLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async getMyCustomers(query:any){
        try{
            console.log('query', query)
            const {userId} = query;
            let sql = `
                SELECT *
                    FROM users
                    WHERE role = 3
                    AND "createdBy" in ($1, -1)
                    AND deleted = 0
            `
            const results = await AppDataSource.query(sql, [userId])

            return results;

        } catch(err){
            // console.log('err: ', err)
            throw err;
        }
    }


    async getMyCustomersBySearch(query:any){
        try{
            const {userId, byDocument, byName} = query;
            const params = []
            let sql = `
                SELECT *
                    FROM users
                    WHERE role = 3
                    AND "createdBy" in ($1, -1)
                    AND deleted = 0
            `
            params.push(userId)
            if(byDocument){
                sql += ` AND document LIKE '%${byDocument.toLowerCase()}%'`
            }
            if(byName){
                sql += ` AND (LOWER(name) LIKE '%${byName.toLowerCase()}%' OR LOWER(lastname) LIKE '%${byName.toLowerCase()}%')`
            }
            console.log(sql)
            const results = await AppDataSource.query(sql, params)

            return results;

        } catch(err){
            console.log('err: ', err)
            throw err;
        }
    }
}