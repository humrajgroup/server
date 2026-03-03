const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool({
  ...config.mysql,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

module.exports = {
  pool,
  query: (sql, params = []) => pool.execute(sql, params)
};
