const mongoose = require('mongoose');
require('dotenv').config();



mongoose.set('strictQuery', false);
mongoose.connect(process.env.mongo_url);


const db = mongoose.connection;

db.on('error',console.error.bind(console,'error connecting to db'));

db.once('open',function(){

    console.log('connected to ::DB');

});

module.exports = db;
