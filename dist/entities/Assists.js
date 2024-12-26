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
exports.Assist = exports.productStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Program_1 = require("./Program");
const Package_1 = require("./Package");
var productStatus;
(function (productStatus) {
    productStatus["HABILITADO"] = "HABILITADO";
    productStatus["DESAHABILITADO"] = "DESHABILITADO";
})(productStatus || (exports.productStatus = productStatus = {}));
let Assist = class Assist {
};
exports.Assist = Assist;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Assist.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'assistant_id' }),
    __metadata("design:type", User_1.User)
], Assist.prototype, "assistant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", User_1.User)
], Assist.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Program_1.Program, (program) => program.id, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'program_id' }),
    __metadata("design:type", Program_1.Program)
], Assist.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Package_1.Package, (pack) => pack.id, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'package_id' }),
    __metadata("design:type", Package_1.Package)
], Assist.prototype, "package", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], Assist.prototype, "classHour", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'varchar' }),
    __metadata("design:type", String)
], Assist.prototype, "additional_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'smallint', default: 0 }),
    __metadata("design:type", Number)
], Assist.prototype, "deleted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_at' }),
    __metadata("design:type", Date)
], Assist.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updated_at' }),
    __metadata("design:type", Date)
], Assist.prototype, "updatedAt", void 0);
exports.Assist = Assist = __decorate([
    (0, typeorm_1.Entity)({ name: 'assists' })
], Assist);
module.exports = { Assist };
