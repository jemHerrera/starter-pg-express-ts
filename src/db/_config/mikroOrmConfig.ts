import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import entities from "../entities/index";
import "reflect-metadata";

const mikroOrmConfig: Options<PostgreSqlDriver> = {
  entities,
  type: "postgresql",
  dbName: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  host: "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  migrations: {
    pathTs: "src/db/migrations",
  },
};

export default mikroOrmConfig;
