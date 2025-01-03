import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Subscription } from "../entities/Subscription";
import { Package } from "../entities/Package";
import { PackageLogic } from "./package.logic";

const packageLogic = new PackageLogic(AppDataSource);

export class SubscriptionLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async createSubscription(body: any){

        try {
            const { user_id, service, startDate, endDate, sale_id } = body;

            const verifyActiveSubs = await this.verifyActiveSubs(user_id);

            console.log('verifyActiveSubs', verifyActiveSubs)
            if(verifyActiveSubs.length > 0){
                throw new Error('Usuario cuenta con una subscripción activa!')
            }

            const packageData = await packageLogic.getPackageById(service);

            console.log('packageData', packageData)
            if(!packageData) throw new Error('Subscription not found')

            let newSubscription = new Subscription();
            newSubscription.user = user_id;
            newSubscription.service = packageData;
            newSubscription.startDate = packageData.program.startDate;
            newSubscription.endDate = packageData.program.endDate;
            newSubscription.sale = sale_id;
        

            const savedSubscription = await AppDataSource.getRepository(Subscription).save(newSubscription);

            return savedSubscription
        } catch (err) {
            console.log('error: ', err)
            throw err;
        }

    }

    async getSubscriptionById(id: number){
        try{

            const subData = await AppDataSource.getRepository(Subscription).findOne({
                where:{
                    id: id
                }
            })

            return subData;

        } catch(err) {
            console.log('err: ', err)
            throw err;
        }
    }

    async getSubscriptionByUser(query: any){
        try {
            const {userId} = query;
            console.log('userId', userId)
            let sql = `
                 SELECT s.*, pa.name as package_name 
                    FROM subscriptions s
                    INNER JOIN packages pa ON pa.id = s.package_id
                    WHERE s.deleted = 0
                    AND s.user_id = $1
                    ORDER BY s.id DESC
            `;
      
            const results = await AppDataSource.query(sql, [userId])
            return results;
        } catch (err) {
            console.log('err: ', err)
            throw err;
        }
    }

    async getSubscriptionValidByUser(query:any){
        try {
            const {userId} = query;
            console.log('userId', userId)
            //TODO:  validar que la fecha actual sea menor que la fecha de inicio en la venta + los dias de vigencia
            let sql = `
                    SELECT s.*, p."activeHours"
                    FROM subscriptions s
                    INNER JOIN packages p ON p.id = s.package_id
                    WHERE s.user_id = $1
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

    async extendSubscription(id: string, payload:any){
        try {
             // Buscar la entidad por ID
            const subscriptionToUpdate = await AppDataSource.getRepository(Subscription).findOneBy({ id: Number(id) });

            if (!subscriptionToUpdate) {
                throw new Error('Subscription not found')
            }

            subscriptionToUpdate.endDate = payload.endDate;

            const updatedSubscription = await AppDataSource.getRepository(Subscription).save(subscriptionToUpdate);
            return updatedSubscription;
        } catch (err) {
            console.log('err: ', err)
            throw err;
        }
    }

    async verifyActiveSubs(userId: number){
        try{
            console.log('userId', userId)
            let sql = `
                 SELECT s.*
                    FROM subscriptions s
                    WHERE s.deleted = 0
                    AND s.user_id = $1
					AND s."isActive" = true
                    ORDER BY s.id DESC
            `;
            const results = await AppDataSource.query(sql, [userId])
            return results;

        } catch(err) {
            console.log('err: ', err)
            throw err;
        }
    }

    
}
  