"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Package_1 = require("../entities/Package");
const User_1 = require("../entities/User");
const Program_1 = require("../entities/Program");
const Role_1 = require("../entities/Role");
const Subscription_1 = require("../entities/Subscription");
const Purchase_1 = require("../entities/Purchase");
const Book_1 = require("../entities/Book");
const Sale_1 = require("../entities/Sale");
const Product_1 = require("../entities/Product");
const Assists_1 = require("../entities/Assists");
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;
const options = {
    type: "postgres",
    host: DB_HOST || 'localhost',
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME || 'nadar_user',
    password: DB_PASSWORD || '$naD4r,.*v1da',
    database: DB_DATABASE || 'nadardb',
    // synchronize: NODE_ENV === "dev" ? false : false,
    synchronize: true,
    //logging logs sql command on the treminal
    logging: NODE_ENV === "dev" ? false : false,
    entities: [User_1.User, Program_1.Program, Package_1.Package, Role_1.Role, Subscription_1.Subscription, Purchase_1.Purchase, Book_1.Book, Sale_1.Sale, Product_1.Product, Assists_1.Assist],
    // migrations: [__dirname + "/migration/*.ts"],
    // subscribers: [],
};
// console.log('options: ', options )
exports.AppDataSource = new typeorm_1.DataSource(options);
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization', err);
});
