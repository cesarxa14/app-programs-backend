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
exports.ProgramLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
class ProgramLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getProgramsBuyedByCustomer(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                let sql = `
                SELECT pr.* 
                    FROM programs pr
                    INNER JOIN packages pa ON pa.program_id = pr.id
                    INNER JOIN subscriptions s ON s.package_id = pa.id
                    WHERE s."isActive" = true
                    AND s.user_id = $1
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
    getProgramValidByUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                console.log('userId', userId);
                let sql = `
                    SELECT s.*, p."activeHours", pr.id as program_id, pr.name as program_name
                        FROM subscriptions s
                        INNER JOIN packages p ON p.id = s.package_id
                        INNER JOIN programs pr ON pr.id = p.program_id
                        WHERE s.user_id = $1
                        AND s."isActive" = true
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
}
exports.ProgramLogic = ProgramLogic;
