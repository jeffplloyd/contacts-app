import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  user: process.env.POSTGRES_USER || "myuser",
  host: process.env.POSTGRES_HOST || "host.docker.internal",
  database: process.env.POSTGRES_DB || "mydb",
  password: process.env.POSTGRES_PASSWORD || "mypassword",
  port: 5432,
});

export default pool;
