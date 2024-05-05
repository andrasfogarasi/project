import createPool from "mysql";

const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "works_for_students",
    connectionLimit: 10
})
