import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { ProductLogic } from "./product.logic";
import { Purchase } from "../entities/Purchase";

const productLogic = new ProductLogic(AppDataSource)
export class PurchaseLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }


    async createPurchase(body: any){

        try {
            const { user_id, product_id, amount } = body;

            const productData = await productLogic.getProductById(product_id);

            console.log('productData', productData)
            if(!productData) throw new Error('Product not found')

            let newPurchase = new Purchase();
            newPurchase.user = user_id;
            newPurchase.service = productData;
            newPurchase.amount = amount;

            const savedPurchase = await AppDataSource.getRepository(Purchase).save(newPurchase);

            return savedPurchase
        } catch (err) {
            console.log('error: ', err)
            throw err;
        }

    }

    async getPurchaseByUser(query: any){
        try {
            const {userId} = query;
            console.log('userId', userId)
            let sql = `
                SELECT p.*, pr.name as product_name 
                    FROM purchases p
                    INNER JOIN products pr ON pr.id = p.product_id
                    WHERE p.deleted = 0
                    AND p.user_id = $1
                    ORDER BY p.id DESC
            `;
      
            const results = await AppDataSource.query(sql, [userId])
            return results;
        } catch (err) {
            console.log('err: ', err)
            throw err;
        }
    }
}