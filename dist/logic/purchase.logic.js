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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const product_logic_1 = require("./product.logic");
const Purchase_1 = require("../entities/Purchase");
const productLogic = new product_logic_1.ProductLogic(data_source_1.AppDataSource);
class PurchaseLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    createPurchase(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, product_id, amount } = body;
                const productData = yield productLogic.getProductById(product_id);
                console.log('productData', productData);
                if (!productData)
                    throw new Error('Product not found');
                let newPurchase = new Purchase_1.Purchase();
                newPurchase.user = user_id;
                newPurchase.service = productData;
                newPurchase.amount = amount;
                const savedPurchase = yield data_source_1.AppDataSource.getRepository(Purchase_1.Purchase).save(newPurchase);
                return savedPurchase;
            }
            catch (err) {
                console.log('error: ', err);
                throw err;
            }
        });
    }
    getPurchaseByUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                console.log('userId', userId);
                let sql = `
                SELECT p.*, pr.name as product_name 
                    FROM purchases p
                    INNER JOIN products pr ON pr.id = p.product_id
                    WHERE p.deleted = 0
                    AND p.user_id = $1
                    ORDER BY p.id DESC
            `;
                const results = yield data_source_1.AppDataSource.query(sql, [userId]);
                return results;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
}
exports.PurchaseLogic = PurchaseLogic;
