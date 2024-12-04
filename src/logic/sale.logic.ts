import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Sale } from "../entities/Sale";
import { SubscriptionLogic } from "./subscription.logic";

const subscriptionLogic = new SubscriptionLogic(AppDataSource);


export class SaleLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async getMySales(query: any){
        try {
            const {selledId} = query;

            const results = await AppDataSource.getRepository(Sale).find({
                where: {
                  seller: selledId
                },
                relations: ["customer"]
              }); 

            return results;
        } catch (err) {

        }
    }

    async createSale(body:any){
        try {
            const { amount, category, igv, saleDate, 
                payment_method, saleName,  type_voucher,
                sellerId, customerId} = body;

            console.log('body:', body)
            let newSale = new Sale();
            newSale.amount = amount;
            newSale.category = category;
            newSale.igv = igv;
            newSale.payment_method = payment_method;
            newSale.saleDate = saleDate;
            newSale.saleName = saleName;
            newSale.type_voucher = type_voucher;
            newSale.seller = sellerId;
            newSale.customer = customerId;

            let date = new Date();
            // todo: obtener la fecha inicio y fin del servicio
            if(category == 'servicio'){
                await subscriptionLogic.createSubscription({user_id: customerId, service: saleName , startDate: date , endDate: date})
            }

            const savedSale = await AppDataSource.getRepository(Sale).save(newSale);

            return savedSale;

        } catch(err) {
            console.log('error: ', err)
            throw err;
        }
    }

}