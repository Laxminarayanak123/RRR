const express = require('express');

const expressEjsLayouts = require('express-ejs-layouts');

const path = require('path');

const port = 8000;

const app = express();

const db = require('./config/mongoose');

const session = require('express-session');

const passport = require('passport');

const passportLocal = require('./config/passport');

const mongoose = require('mongoose');

const MongoStore = require('connect-mongo');

const flash = require('connect-flash');

const exp = require('constants');

const webpush = require('web-push');

const cookieParser = require('cookie-parser');

const kue = require('kue');

const schedule = require('node-schedule');

const OtpVerify = require('./model/otpVerify')

require('dotenv').config()

// console.log(process.env.port);
//to encode url
app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use(expressEjsLayouts);

app.set('view engine','ejs');

app.set('views',path.join(__dirname,'views')); 

//creating cookie using express-session and stroing session in Mongostore to prevent users from logging out while the server restarts
app.use(session({
    
    name:"RRR",
    secret: process.env.cookieSecretKey,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(100000*60*100) 
    },
    //address for storing cookie in DB
    store: new MongoStore({

        mongoUrl: db._connectionString,
        collectionName:'sessionCookies'
    })

}));

// for flash messages
app.use(flash());


//starting the passport authentication
app.use(passport.initialize());
//passport session intialization
app.use(passport.session());
//making active user avaliable for views
app.use(passport.setAuthenticated);

// for cookies
app.use(cookieParser());


//making upload folder available to browser

app.use('/uploads',express.static(__dirname +"/uploads"));

app.use('/assets',express.static(__dirname+"/assets"));


// app.use('/',express.static(__dirname+"/assets/input"));
// app.use('/user/profile',express.static(__dirname+"/assets/js"));

//seperate directory for routes
app.use('/',require('./routes'));


// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys);
// const vapidKeys = {
//     publicKey: 'BNfuRLxYhSowPcZcNrPtYnkYXmk30uBCBgxi6u6UtDaOr8vb2QW5Ac0yiwgrPa3qevv-ns58uOVpXkAA7vw-Vfc',
//     privateKey: 'VwsEfHe3ZCzmuAHcvtfWvqIc35QddULTmzXS5J06kK8'
// };
// webpush.setVapidDetails(
//     'mailto:fullstackwebdevelopersteam@gmail.com',
//     vapidKeys.publicKey,
//     vapidKeys.privateKey
//   );

kue.app.listen(process.env.kuePort);

// Set up a schedule to delete expired records every hour (adjust as needed)
schedule.scheduleJob('0 0 */5 * *', async () => {
    const currentTime = new Date();
    console.log('Running OTP cleanup job...',currentTime.getHours());
    await OtpVerify.deleteExpiredRecords();
    console.log('OTP cleanup job completed!. for every 5 days');
});

app.listen(port,(err)=>{

    if(err){
        console.log("error in express",err);
    }
    console.log("express is running");

});
