const mysql = require('mysql2/promise');
require('dotenv').config();

let conn = null;

const initMySQL = async () => {
    if (!conn) { // ตรวจสอบว่ามีการเชื่อมต่อหรือยัง
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT
        })
        // console.log("MySQL connection established.");
    }
    return conn;
}
// ส่งออก (export) ฟังก์ชันเพื่อให้สามารถเรียกใช้การเชื่อมต่อ
module.exports = { initMySQL };