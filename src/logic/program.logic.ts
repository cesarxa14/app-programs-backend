import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";

export class ProgramLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async getProgramsBuyedByCustomer(query: any){
        try {
            const {userId} = query;
            let sql = `
                SELECT pr.* 
                    FROM programs pr
                    INNER JOIN packages pa ON pa.program_id = pr.id
                    INNER JOIN subscriptions s ON s.package_id = pa.id
                    WHERE s."isActive" = true
                    AND s.user_id = $1
            `;

            const results = await AppDataSource.query(sql, [userId])
            return results;

        } catch (err) {
            console.log('err: ', err)
            throw err
        }
    }

    async getProgramValidByUser(query:any){
        try {
            const {userId} = query;
            console.log('userId', userId)
            let sql = `
                    SELECT s.*, p."activeHours", pr.id as program_id, pr.name as program_name
                        FROM subscriptions s
                        INNER JOIN packages p ON p.id = s.package_id
                        INNER JOIN programs pr ON pr.id = p.program_id
                        WHERE s.user_id = $1
                        AND s."isActive" = true
                        AND p.deleted = 0
                        AND s."endDate" > NOW();
                `
      
            const results = await AppDataSource.query(sql, [userId])

            return results;
        } catch (err) {
            console.log('err: ', err)
            throw err;
        }
    }
}