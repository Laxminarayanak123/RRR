const express = require('express');

const Developer = require('../model/developer');
const User = require('../model/User');

module.exports.Developer = async function(req,res){
   return res.render('developer',{
    layout:false
   })
}

module.exports.Suggest = async function(req,res){
   const user = req.user.id;
   
   const content =req.body.content;
   const FeedBackType = req.body.FeedBackType
   const userType =req.body.userType
   // console.log(user,FeedBackType,userType);
   const feedback = await Developer.create({
      user:user,
      content:content,
      FeedBackType:FeedBackType,
      UserOrHotel:userType
   })
   await req.flash('message', [
      { type: 'flash-success', text: 'Posted Successfully' },
    ]);
   return res.redirect('/');
}


module.exports.GetFeedback = async function(req,res){
   const data = await Developer.find({});
   res.json(data);
}