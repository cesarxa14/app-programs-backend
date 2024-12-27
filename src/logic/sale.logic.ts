import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Sale } from "../entities/Sale";
import { SubscriptionLogic } from "./subscription.logic";
import { ProductLogic } from "./product.logic";
import { PurchaseLogic } from "./purchase.logic";

const subscriptionLogic = new SubscriptionLogic(AppDataSource);
const purchaseLogic = new PurchaseLogic(AppDataSource);

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
                relations: ["customer"],
                order:{
                    saleDate:"DESC"
                }
              }); 

            return results;
        } catch (err) {

        }
    }

    async createSale(body:any){
        try {
            const { amount, category, igv, saleDate, startDate,
                payment_method, saleName, itemId,  type_voucher,
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
            newSale.startDate = startDate;

            let date = new Date();
            
            if(category == 'servicio'){
                await subscriptionLogic.createSubscription({user_id: customerId, service: itemId , startDate: date , endDate: date})
            }else if(category == 'producto'){
                await purchaseLogic.createPurchase({user_id: customerId, product_id: itemId, amount: amount})
            }

            const savedSale = await AppDataSource.getRepository(Sale).save(newSale);

            return savedSale;

        } catch(err) {
            console.log('error: ', err)
            throw err;
        }
    }

}