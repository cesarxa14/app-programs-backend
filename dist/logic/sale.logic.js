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
exports.SaleLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const Sale_1 = require("../entities/Sale");
const subscription_logic_1 = require("./subscription.logic");
const purchase_logic_1 = require("./purchase.logic");
const subscriptionLogic = new subscription_logic_1.SubscriptionLogic(data_source_1.AppDataSource);
const purchaseLogic = new purchase_logic_1.PurchaseLogic(data_source_1.AppDataSource);
class SaleLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getMySales(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { selledId } = query;
                const results = yield data_source_1.AppDataSource.getRepository(Sale_1.Sale).find({
                    where: {
                        seller: selledId
                    },
                    relations: ["customer"],
                    order: {
                        saleDate: "DESC"
                    }
                });
                return results;
            }
            catch (err) {
            }
        });
    }
    createSale(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount, category, igv, saleDate, payment_method, saleName, itemId, type_voucher, sellerId, customerId } = body;
                console.log('body:', body);
                let newSale = new Sale_1.Sale();
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
                if (category == 'servicio') {
                    yield subscriptionLogic.createSubscription({ user_id: customerId, service: itemId, startDate: date, endDate: date });
                }
                else if (category == 'producto') {
                    yield purchaseLogic.createPurchase({ user_id: customerId, product_id: itemId, amount: amount });
                }
                const savedSale = yield data_source_1.AppDataSource.getRepository(Sale_1.Sale).save(newSale);
                return savedSale;
            }
            catch (err) {
                console.log('error: ', err);
                throw err;
            }
        });
    }
}
exports.SaleLogic = SaleLogic;
