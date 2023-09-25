const nodemailer = require("nodemailer");
var kue = require('kue');
const path = require('path');
const fs = require('fs')
const ejs = require('ejs')
const User = require('../model/User');
const Hotel = require("../model/hotelModel");

async function mailerExp(type,toUser,otp) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.email_mailer,
          pass: process.env.pass_mailer
        }
    });

    const queue = kue.createQueue();
    
    async function sendEmail(mailOptions) {
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    }
    
    queue.process('email',10,async (job, done) => {
      const { to, subject, text, html } = job.data;
    
      const mailOptions = {
        from: '"RRR 🍽️" <restaurantreviewsratings@gmail.com>',
        to,
        subject,
        text,
        html
      };
    
      try {
        const info = await sendEmail(mailOptions);
        done(null, info);
      } catch (error) {
        done(error);
      }
    });
    
    if(type=='pendingapproval'){
      // const job = queue.create('email', {
      //   to: `${toUser}`,
      //   subject: 'APPROVED',
      //   text: 'launching messages , on the way , please wait!',
      //   html: `<h1><b>Restaurant Reviews and Ratings</b></h1>
      //          <h3>Your hotel has been <b>Approved</b></h3>
      //          <h4>Now Login To Experience The Platform And Customize Your Own Way of Engaging Customers </h4>
      //          <div style="text-align:center">
      //             <h1>THANK YOU !</h1>
      //             <h5>Team RRR </h5>
      //          </div>`
      // }).delay(5000).priority('high').save();  
      const templateFilePath = path.join(__dirname,'../views/emailPendingApproval.ejs');

      const templateFile = fs.readFileSync(templateFilePath, 'utf8');

      // const user = await User.findOne({email:toUser});

      // const emailData = {
      //   name: user.name
      // };

      const emailBody = ejs.render(templateFile);

      const job = queue.create('email', {
        to: `${toUser}`,
        subject: 'Restaurant Reviews and Ratings',
        html: emailBody
      }).delay(5000).priority('high').save();  
    }
    else if(type=='approved'){
      // const job = queue.create('email', {
      //   to: `${toUser}`,
      //   subject: 'Not Approved',
      //   text: '',
      //   html: `<h1><b>Restaurant Reviews and Ratings</b></h1>
      //          <h3>Your hotel has <b>not</b> been <b>Approved</b></h3>
      //          <h4>Try again to contact Administrator</h4>
      //          <div style="text-align:center">
      //             <h1>THANK YOU !</h1>
      //             <h5>Team RRR </h5>
      //          </div>`
      // }).delay(5000).priority('high').save();
        
      const templateFilePath = path.join(__dirname,'../views/emailApproved.ejs');

      const templateFile = fs.readFileSync(templateFilePath, 'utf8');

      // const user = await User.findOne({email:toUser});

      // const emailData = {
      //   name: user.name
      // };

      const emailBody = ejs.render(templateFile);

      const job = queue.create('email', {
        to: `${toUser}`,
        subject: 'Restaurant Reviews and Ratings',
        html: emailBody
      }).delay(5000).priority('high').save();  
    }
    else if(type=='disapproved'){
      
      const templateFilePath = path.join(__dirname,'../views/emailNotApproved.ejs');

      const templateFile = fs.readFileSync(templateFilePath, 'utf8');

      // const user = await User.findOne({email:toUser});

      // const emailData = {
      //   name: user.name
      // };

      const emailBody = ejs.render(templateFile);

      const job = queue.create('email', {
        to: `${toUser}`,
        subject: 'Restaurant Reviews and Ratings',
        html: emailBody
      }).delay(5000).priority('high').save();  
    }
    else if(type == 'promotionalSample'){
      const templateFilePath = path.join(__dirname,'../views/emailPromotional.ejs');

      const templateFile = fs.readFileSync(templateFilePath, 'utf8');
      
      const emailBody = ejs.render(templateFile);


      const job = queue.create('email', {
        to: 'laxminarayana.koyyana1@gmail.com',
        subject: 'Restaurant Reviews and Ratings',
        html: emailBody
      }).delay(5000).priority('high').save();  
    } 
    else if(type == 'promotional'){
      const templateFilePath = path.join(__dirname,'../views/emailPromotional.ejs');

      const templateFile = fs.readFileSync(templateFilePath, 'utf8');
      
      const emailBody = ejs.render(templateFile);

      const userData = await User.find({});
      const hotelData = await Hotel.find({});
      const allData =[...userData, ...hotelData];

      const allrecipients =  allData.map(item => item.email).join(',');

      const job = queue.create('email', {
        to: allrecipients,
        subject: 'Restaurant Reviews and Ratings',
        html: emailBody
      }).delay(5000).priority('high').save();  
    } 
    else if(type=='userOtp'){

      const templateFilePath = path.join(__dirname,'../views/emailOtp.ejs');
      
      const templateFile = fs.readFileSync(templateFilePath, 'utf8');
      
      const emailData = {
        otp:otp
      }

      const emailBody = ejs.render(templateFile,emailData);

      const job = queue.create('email', {
        to: toUser,
        subject: 'Restaurant Reviews and Ratings',
        html: emailBody
      }).delay(1000).priority('high').save();  
    }

    // for welcome mail
    if(type=='newuser'){

      const templateFilePath = path.join(__dirname,'../views/emailWelcome.ejs');

      const templateFile = fs.readFileSync(templateFilePath, 'utf8');

      const user = await User.findOne({email:toUser});

      const emailData = {
        name: user.name
      };

      const emailBody = ejs.render(templateFile, emailData);

      const job = queue.create('email', {
        to: `${toUser}`,
        subject: 'Restaurant Reviews and Ratings',
        html: emailBody
      }).delay(5000).priority('high').save();  

    }
    
    queue.process();


    

}    

module.exports = mailerExp;