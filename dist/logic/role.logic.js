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
exports.RoleLogic = void 0;
const data_source_1 = require("../ddbb/data-source");
const Role_1 = require("../entities/Role");
class RoleLogic {
    constructor(dataSource) {
        dataSource = data_source_1.AppDataSource;
        this.dataSource = dataSource;
    }
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield data_source_1.AppDataSource.getRepository(Role_1.Role).find();
                return results;
            }
            catch (err) {
                console.log('err: ', err);
            }
        });
    }
    createRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = body;
                let newRole = new Role_1.Role();
                newRole.name = name;
                const savedRole = yield data_source_1.AppDataSource.getRepository(Role_1.Role).save(newRole);
                return savedRole;
            }
            catch (err) {
            }
        });
    }
}
exports.RoleLogic = RoleLogic;
