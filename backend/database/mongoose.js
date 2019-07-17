const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_HOST;

mongoose.connect(mongoUri, { useNewUrlParser: true, keepAlive: 1, useFindAndModify: false });

var connection = mongoose.connection;
connection.on('connected', () => {
    console.log('DB connected');
})

connection.on('error', err => {
    console.log('DB connection error', err);
})

connection.on('disconnected', () => {
    console.log('DB disconnected');
});