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
exports.SubscriptionLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const Subscription_1 = require("../entities/Subscription");
const package_logic_1 = require("./package.logic");
const packageLogic = new package_logic_1.PackageLogic(data_source_1.AppDataSource);
class SubscriptionLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    createSubscription(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id, service, startDate, endDate } = body;
                const packageData = yield packageLogic.getPackageById(service);
                console.log('packageData', packageData);
                if (!packageData)
                    throw new Error('Subscription not found');
                let newSubscription = new Subscription_1.Subscription();
                newSubscription.user = user_id;
                newSubscription.service = packageData;
                newSubscription.startDate = packageData.program.startDate;
                newSubscription.endDate = packageData.program.endDate;
                const savedSubscription = yield data_source_1.AppDataSource.getRepository(Subscription_1.Subscription).save(newSubscription);
                return savedSubscription;
            }
            catch (err) {
                console.log('error: ', err);
                throw err;
            }
        });
    }
    getSubscriptionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subData = yield data_source_1.AppDataSource.getRepository(Subscription_1.Subscription).findOne({
                    where: {
                        id: id
                    }
                });
                return subData;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
    getSubscriptionByUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                console.log('userId', userId);
                let sql = `
                 SELECT s.*, pa.name as package_name 
                    FROM subscriptions s
                    INNER JOIN packages pa ON pa.id = s.package_id
                    WHERE s.deleted = 0
                    AND s.user_id = $1
                    ORDER BY s.id DESC
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
    getSubscriptionValidByUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                console.log('userId', userId);
                let sql = `
                    SELECT s.*, p."activeHours"
                    FROM subscriptions s
                    INNER JOIN packages p ON p.id = s.package_id
                    WHERE s.user_id = $1
                    AND p.deleted = 0
                    AND s."endDate" > NOW();
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
    extendSubscription(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Buscar la entidad por ID
                const subscriptionToUpdate = yield data_source_1.AppDataSource.getRepository(Subscription_1.Subscription).findOneBy({ id: Number(id) });
                if (!subscriptionToUpdate) {
                    throw new Error('Subscription not found');
                }
                subscriptionToUpdate.endDate = payload.endDate;
                const updatedSubscription = yield data_source_1.AppDataSource.getRepository(Subscription_1.Subscription).save(subscriptionToUpdate);
                return updatedSubscription;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
}
exports.SubscriptionLogic = SubscriptionLogic;
