"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Product_1 = require("./Product");
let Purchase = class Purchase {
};
exports.Purchase = Purchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Purchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_1.Product, (prod) => prod.id, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Product_1.Product)
], Purchase.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'int' }),
    __metadata("design:type", Number)
], Purchase.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], Purchase.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Purchase.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_at' }),
    __metadata("design:type", Date)
], Purchase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updated_at' }),
    __metadata("design:type", Date)
], Purchase.prototype, "updatedAt", void 0);
exports.Purchase = Purchase = __decorate([
    (0, typeorm_1.Entity)({ name: 'purchases' })
], Purchase);
