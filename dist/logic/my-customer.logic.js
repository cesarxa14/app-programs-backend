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
exports.MyCustomerLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
class MyCustomerLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getMyCustomers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('query', query);
                const { userId } = query;
                let sql = `
                SELECT *
                    FROM users
                    WHERE role = 3
                    AND "createdBy" in ($1, -1)
                    AND deleted = 0
            `;
                const results = yield data_source_1.AppDataSource.query(sql, [userId]);
                return results;
            }
            catch (err) {
                // console.log('err: ', err)
                throw err;
            }
        });
    }
    getMyCustomersBySearch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, byDocument, byName } = query;
                const params = [];
                let sql = `
                SELECT *
                    FROM users
                    WHERE role = 3
                    AND "createdBy" in ($1, -1)
                    AND deleted = 0
            `;
                params.push(userId);
                if (byDocument) {
                    sql += ` AND document LIKE '%${byDocument.toLowerCase()}%'`;
                }
                if (byName) {
                    sql += ` AND (LOWER(name) LIKE '%${byName.toLowerCase()}%' OR LOWER(lastname) LIKE '%${byName.toLowerCase()}%')`;
                }
                console.log(sql);
                const results = yield data_source_1.AppDataSource.query(sql, params);
                return results;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
}
exports.MyCustomerLogic = MyCustomerLogic;
