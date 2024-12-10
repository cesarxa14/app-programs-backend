import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Product } from "../entities/Product";
import cloudinary from "../config/cloudinary.config";


export class ProductLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getProducts(){
    try {

        let sql = `
             SELECT p.*, u.phone 
              FROM products p
			        INNER JOIN users u ON u.id = p.user_id 
              WHERE p.deleted = 0
              ORDER BY id DESC
        `;
      
      const results = await AppDataSource.query(sql)
      console.log('results', results)
      return results;
    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getMyProducts(query: any){
    try {
  
      const {userId} = query;
            console.log('userId', userId)
            let sql = `
                SELECT * 
                  FROM products 
                  WHERE deleted = 0
                  AND user_id = $1
                  ORDER BY id DESC
            `;
      
      const results = await AppDataSource.query(sql, [userId])

      return results;
    } catch(err) {

    }
  }

  async createProduct(body: any){
    try {
      const { name, description, quantity, status, price_sale, image, user_id } = body;

      // Subir la imagen a Cloudinary
      const resultImage = await cloudinary.uploader.upload(image, {
        folder: 'uploads', // Carpeta en Cloudinary
      });

      
      let newProduct = new Product();
        newProduct.name = name;
        newProduct.description = description;
        newProduct.quantity = quantity;
        newProduct.status = status;
        newProduct.price_sale = price_sale;
        newProduct.image = resultImage.url // image;s
        newProduct.user = user_id;
        
        const savedProduct = await AppDataSource.getRepository(Product).save(newProduct);

        return savedProduct;
    } catch (err) {

    }
  }

  async getProductById(id: number){
    try{

        const packageData = await AppDataSource.getRepository(Product).findOne({
            where:{
                id: id
            },
            // relations: ["program"]
        })

        return packageData;

    } catch(err) {
        console.log('err: ', err)
        throw err;
    }
}
}