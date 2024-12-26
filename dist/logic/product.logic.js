"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const Product_1 = require("../entities/Product");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
class ProductLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sql = `
             SELECT p.*, u.phone 
              FROM products p
			        INNER JOIN users u ON u.id = p.user_id 
              WHERE p.deleted = 0
              ORDER BY id DESC
        `;
                const results = yield data_source_1.AppDataSource.query(sql);
                console.log('results', results);
                return results;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
    getMyProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                console.log('userId', userId);
                let sql = `
                SELECT * 
                  FROM products 
                  WHERE deleted = 0
                  AND user_id = $1
                  ORDER BY id DESC
            `;
                const results = yield data_source_1.AppDataSource.query(sql, [userId]);
                return results;
            }
            catch (err) {
            }
        });
    }
    createProduct(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, quantity, status, price_sale, image, user_id } = body;
                // Subir la imagen a Cloudinary
                const resultImage = yield cloudinary_config_1.default.uploader.upload(image, {
                    folder: 'uploads', // Carpeta en Cloudinary
                });
                let newProduct = new Product_1.Product();
                newProduct.name = name;
                newProduct.description = description;
                newProduct.quantity = quantity;
                newProduct.status = status;
                newProduct.price_sale = price_sale;
                newProduct.image = resultImage.url; // image;s
                newProduct.user = user_id;
                const savedProduct = yield data_source_1.AppDataSource.getRepository(Product_1.Product).save(newProduct);
                return savedProduct;
            }
            catch (err) {
            }
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageData = yield data_source_1.AppDataSource.getRepository(Product_1.Product).findOne({
                    where: {
                        id: id
                    },
                    // relations: ["program"]
                });
                return packageData;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
}
exports.ProductLogic = ProductLogic;
