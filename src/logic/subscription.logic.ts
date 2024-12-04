import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Subscription } from "../entities/Subscription";



export class SubscriptionLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async createSubscription(body: any){

        try {
            const { user_id, service, startDate, endDate } = body;
            let newSubscription = new Subscription();
            newSubscription.user = user_id;
            newSubscription.service = service;
            newSubscription.startDate = startDate;
            newSubscription.endDate = endDate;
        

            const savedSubscription = await AppDataSource.getRepository(Subscription).save(newSubscription);

            return savedSubscription
        } catch (err) {
            console.log('error: ', err)
            throw err;
        }

    }

    async getSubscriptionByUser(query: any){

        try {
            const {userId} = query;
            console.log('userId', userId)
            let sql = `
                SELECT * 
                  FROM subscriptions 
                  WHERE deleted = 0
                  AND user_id = $1
                  ORDER BY id DESC
            `;
      
            const results = await AppDataSource.query(sql, [userId])

            return results;
        } catch (err) {
            console.log('err: ', err)
            throw err;
        }
     


    }
}
  