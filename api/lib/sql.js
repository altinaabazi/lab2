import sql from "mssql";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prismaSql = new PrismaClient();

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export async function getSqlPool() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("SQL Connection Error:", error);
    throw error;
  }
}

export { sql, prismaSql };
