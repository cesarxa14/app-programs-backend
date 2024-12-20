import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { Package } from "../entities/Package";
import { User } from "../entities/User";
import { Program } from "../entities/Program";
import { Role } from "../entities/Role";
import { Subscription } from "../entities/Subscription";
import { Purchase } from "../entities/Purchase";
import { Book } from "../entities/Book";
import { Sale } from "../entities/Sale";
import { Product } from "../entities/Product";
import { Assist } from "../entities/Assists";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;
const options : DataSourceOptions= {
  type: "postgres",
  host: DB_HOST || '192.168.100.138',
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME || 'postgres',
  password: DB_PASSWORD || 'admin',
  database: DB_DATABASE || 'app-programas',

  // synchronize: NODE_ENV === "dev" ? false : false,
  synchronize: true,
//logging logs sql command on the treminal
  logging: NODE_ENV === "dev" ? false : false,
  entities: [User, Program,Package, Role, Subscription, Purchase, Book, Sale, Product, Assist], 

  // migrations: [__dirname + "/migration/*.ts"],
  // subscribers: [],
}

// console.log('options: ', options )
export const AppDataSource = new DataSource(options)

  AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });