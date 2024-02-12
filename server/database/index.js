const mongoose = require('mongoose');
const { dbHost, dbPort, dbUser, dbPass, dbName, dbUrl} = require('../app/config');

mongoose.connect(`${dbUrl}://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`);
const db = mongoose.connection;
console.log('database running mystore cloud');

module.exports = db;