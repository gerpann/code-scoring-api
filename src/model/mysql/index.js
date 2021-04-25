const util = require('util');
const mysql = require('mysql');

const { dbSettings } = require('../../config');

class MysqlDB {
  constructor() {
    this.connection = mysql.createConnection({
      host: dbSettings.host,
      user: dbSettings.user,
      password: dbSettings.password,
      database: dbSettings.database,
    });

    this.pool = mysql.createPool({
      connectionLimit: 32,
      host: dbSettings.host,
      user: dbSettings.user,
      password: dbSettings.password,
      database: dbSettings.database,
    });

    this.connection.on('error', (err) => {
      logger.error(`[model][mysql] error:`, err);
      if (err.fatal) {
        this.create_connection();
      }
    });
  }

  create_connection() {
    this.connection = mysql.createConnection({
      host: dbSettings.host,
      user: dbSettings.user,
      password: dbSettings.password,
      database: dbSettings.database,
    });
  }

  beginTransaction() {
    return util.promisify(this.connection.beginTransaction).call(this.connection);
  }

  poolQuery(sql) {
    return util.promisify(this.pool.query).call(this.pool, sql);
  }

  query(sql) {
    return util.promisify(this.connection.query).call(this.connection, sql);
  }

  commit() {
    return util.promisify(this.connection.commit).call(this.connection);
  }

  rollback() {
    return util.promisify(this.connection.rollback).call(this.connection);
  }

  close() {
    return util.promisify(this.connection.end).call(this.connection);
  }
}

module.exports = MysqlDB;
