const express = require('express');

const Admin = require('../model/User');

const bcrypt = require('bcrypt');

const Developer = require('../model/developer')

const Hotel = require('../model/hotelModel')

const Districts = require('../model/districts');

const { name } = require('ejs');

const Follow = require('../model/follow');

const mailerExp = require('../config/mailer');
const { ObjectId } = require('mongodb');


module.exports.adminPage = async function(req,res){
    // console.log(req.headers.cookie,"in admin controller");
    // bug data
    const data = await Developer.find({})
    .populate({
        path:'user',
        select:'name email'
    });

    // approve data
    const toApproveHotels = await Hotel.find({$and:[{isVisible:false},{follow:null}]});

    // allHotels
    const allHotels = await Hotel.find({follow:{$ne:null}});

    if(req.user.isAdmin){
        return res.render('admin',{
            layout:false,
            bugData:data,
            toApproveHotels:toApproveHotels,
            allHotels:allHotels
        })
    }
    return res.redirect('back');
}

module.exports.deleteFeedback = async function(req,res){
    const FeedbackId = req.params.id;
    const data = await Developer.findByIdAndDelete(FeedbackId);

    res.redirect('back');
}

module.exports.GetFeedback = async function(req,res){
    const data = await Developer.find({});
    res.json(data);
 }


 module.exports.addDistricts = async function(req,res){
    // check if already similar district is available
    const already = await Districts.findOne({name:req.body.name});
    
    if(!already){
        const newDistrict = await Districts.create({
            name:req.body.name,
        })

        await newDistrict.save();
    }
    return res.redirect('back');

    // for(var i=2 ;i<7;i++){
    //     mailerExp()
    // }
    return res.redirect('back');

 }


 module.exports.approveHotel = async function(req,res){
    const toApproveHotelId = req.params.id;
    const toApproveHotel = await Hotel.findById(toApproveHotelId);
    
    let follow = await Follow.create({
        user:toApproveHotel.id,
        UserOrHotel:'Hotel'
    })

    toApproveHotel.follow = follow;

    toApproveHotel.isVisible=true;

    await toApproveHotel.save();

    mailerExp('approved',`${toApproveHotel.email}`);

    res.redirect('back');
 }

 module.exports.disapproveHotel = async function(req,res){
    const disapproveHotelId = req.params.id;

    const disapproveHotel = await Hotel.findByIdAndDelete(disapproveHotelId);

    mailerExp('disapproved',`${disapproveHotel.email}`);

    res.redirect('back');

 }

 module.exports.promotionalMail = async function(req,res){
    // const mailData = req.body.mail; 
    mailerExp('promotional',"");
    res.redirect('back');
 }

 module.exports.promotionalSampleMail = async function(req,res){
    // const mailData = req.body.mail; 
    mailerExp('promotionalSample',"");
    res.redirect('back');
 }

 module.exports.manageHotel = async function(req,res){
    const toManageHotelId = req.params.id;
    const toManageHotel = await Hotel.findById(toManageHotelId);

    // console.log(toManageHotel.isVisible);
    if(toManageHotel.isVisible){
        toManageHotel.isVisible = false;
    }
    else{
        toManageHotel.isVisible = true;
    }
    await toManageHotel.save();
    res.redirect('back');

 }