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
exports.PackageLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const Package_1 = require("../entities/Package");
class PackageLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getPackageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageData = yield data_source_1.AppDataSource.getRepository(Package_1.Package).findOne({
                    where: {
                        id: id
                    },
                    relations: ["program"]
                });
                return packageData;
            }
            catch (err) {
                console.log('err: ', err);
                throw err;
            }
        });
    }
    getNumClassesByUser(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = query;
                let sql = `
                SELECT pa.*
                FROM packages pa
                INNER JOIN programs pr ON pa.program_id = pr.id
                INNER JOIN subscriptions s ON s.package_id = pa.id
                INNER JOIN users u ON u.id = s.user_id
                WHERE u.id = $1
                AND  s."isActive" = true
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
exports.PackageLogic = PackageLogic;
