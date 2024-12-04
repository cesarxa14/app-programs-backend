import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Product } from "../entities/Product";


export class ProductLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getMyProducts(query: any){
    try {
      const {userId} = query;
      const results = await AppDataSource.getRepository(Product).find({
        where: {
          user: userId
        }
      });

      return results;
    } catch(err) {

    }
  }

  async createProduct(body: any){
    try {
      const { name, description, quantity, status, price_sale, image, user_id } = body;
      let newProduct = new Product();
        newProduct.name = name;
        newProduct.description = description;
        newProduct.quantity = quantity;
        newProduct.status = status;
        newProduct.price_sale = price_sale;
        newProduct.image = image;
        newProduct.user = user_id;
        
        const savedProduct = await AppDataSource.getRepository(Product).save(newProduct);

        return savedProduct;
    } catch (err) {

    }
  }
}