import pg from "pg";

const pool = new pg.Pool({
    user: "myuser",
    host: "host.docker.internal",
    database: "mydb",
    password: "mypassword",
    port: 5432,
});

export default pool;