require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: "127.0.0.1",
    dialect: "postgres",
    operatorsAliases: 0,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
  // test: {
  //   username: root,
  //   password: null,
  //   database: database_test,
  //   host: "127.0.0.1",
  //   dialect: postgres,
  //   operatorsAliases: false
  // },
  // production: {
  //   username: root,
  //   password: null,
  //   database: database_production,
  //   host: "127.0.0.1",
  //   dialect: postgres,
  //   operatorsAliases: false
  // }
}
