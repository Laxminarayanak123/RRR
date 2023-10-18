const Hotel = require('../model/hotelModel');  
const fs = require('fs');
const path = require('path');
const Menu = require('../model/menuModel');
const User = require('../model/User');
const Post = require('../model/postModel');
const Follow = require('../model/follow');
const Districts = require('../model/districts');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const mailer = require('../config/mailer');
const otpVerify = require('../model/otpVerify');
const lodash = require('lodash');
const tinycolor = require('tinycolor2');




module.exports.signUp = async function(req,res){
    if(req.isAuthenticated()){
        const user = req.user.id
        return res.redirect(`/profile/${user}`);
    }
    
    return res.render("hotelSignUp",{
        title: "RRR",
        message: await req.flash('message') ,
        
    })
}

module.exports.signIn =async function(req,res){

    // console.log("Yes+++++++++++++++++++++++++++++++++++++++++++++");

    if(req.isAuthenticated()){
        const user = req.user.id
        return res.redirect(`/`);
    } 

    return res.render("hotelSignIn",{
        title: "RRR",
        message: await req.flash('message') ,
         
    })
}
//for sign up
module.exports.create = async function(req,res){

    
    if(req.body.password != req.body.confirm_password){
       
        return res.redirect('back');
    }
    let user = await Hotel.findOne({email:req.body.email});
    if(!user){
        
        newUser = await Hotel.create(req.body);

        // let follow = await Follow.create({
        //     user:newUser.id,
        //     UserOrHotel:'Hotel'
        // })
        // newUser.follow = follow;

        // generating hash
        const salt = await bcrypt.genSalt(10);
        // hashing here
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        newUser.password = hashPassword;


        newUser.avatar = "/uploads//hotelProfile/logo.png";
        
        newUser.collage.push("")
        newUser.collage.push("")
        newUser.collage.push("")
        newUser.collage.push("")


        newUser.colors.push("")
        newUser.colors.push("")
        newUser.colors.push("")


        
        await newUser.save();
        

        await req.flash('message', [
            { type: 'flash-success', text: 'Approval Pending' },
          ]);

        mailer('pendingapproval',`${req.body.email}`);
        // return res.redirect('/hotel/signIn');
        return res.json({ redirectUrl: '/hotel/signIn' });

    }else{
        await req.flash('message', [
            { type: 'flash-warning', text: 'Email Already Exists' },
          ]);
        return res.redirect('back');
    }
    

}


//for creating session and signIN
module.exports.createSession =async function(req,res){
  
    const id = req.user.id;
    await req.flash('message', [
        { type: 'flash-success', text: 'Login Success' },
      ]);
    return res.redirect(`/hotel/profile/${id}`);
}
 
//for creating session and signIN using google

module.exports.GoogleSession =async function(req,res){
  
    const id = req.user.id;
    await req.flash('message', [
        { type: 'flash-success', text: 'Login Success' },
      ]);
    return res.redirect(`/hotel/profile/${id}`);
}


//for deleting session cookie created by passport
module.exports.destroySession = async function(req,res,next){
    console.log(req.user);
    req.logout(async function(err) {
       
        if (err) { return next(err); }
        await req.flash('message', [
            { type: 'flash-warning', text: 'Logged out' },
          ]);
        res.redirect('/user/signIn');
    });
    

}
var quotes ={
    0:"Where every flavor tells a story.",
    1:"Think Delicious , Eat delicious",
    2:"For the love of delicious food.",
    3:"A taste you’ll remember.",
    4:"Chicken dinner is a winner.",
    5:"Hundreds of flavors under one roof.",
    6:"Food that tells a story.",
    7:"Sensory indulgence unlocked.",
    8:"Life is short, make it sweet.",
    9:"A pinch of passion in every dish.",
    10:"Wake up your taste buds."
};
module.exports.userProfile = async function(req,res){  
    
    

    const userToVisit = req.params.uID;
    console.log(userToVisit);
 
    let visitor = await User.findById(req.user.id);

    // let model;
 

    // if(visitor){
    //     model = "User"
    // }else{
    //     model = "Hotel"
    // }
    var typeOfUser="Hotel";
    if (req.user && req.user.constructor.modelName === 'User') {
        typeOfUser = "User";
    }
    
    if (req.user && req.user.constructor.modelName === 'Admin') {
        typeOfUser = "Admin";
    }

    const userId = req.user._id.toString();
    
    const profileUSerData = await Hotel.findById(req.params.uID)
    .populate({
        path:'district',
        select:'name'
    })
    .populate({
        path:'menuArray',
        populate:{
            path:'rating'
        }
    }).populate({
        path:'reviewPosts',
        populate:{
            path:'user'
        }
    })
    .populate({
        path:'reviewPosts',
        populate:{
            path:'upVotes',
            populate:{
                path:'user'
            }
        }
    })
    .populate({
        path:'reviewPosts',
        populate:{
            path:'comments',
            options: { sort: { createdAt: -1 } },
            populate:{
                path:'upVotes'
            }
        }
    })
    .populate({
        path:'reviewPosts',
        populate:{
            path:'comments',
            populate:{
                path:'user'
            }
        }
    })
    .populate({
        path:'reviewPosts',
        populate:{
            path:'hotelName'
        }
    })
    .populate({
        path:'reviewPosts',
        populate:{
            path:'menuModel'
        }
    });

    var followbtn = true;
    const follow = await Follow.findById(profileUSerData.follow)
    .populate({
        path:'followers',
        populate:{
            path:'user',
            select:'name avatar follow'
        }
    })
    .populate({
        path:'followings',
        populate:{
            path:'user',
            select:'name avatar follow'
        }
    });;
    // console.log("````````````````",follow);
    for(var i=0 ; i<follow.followers.length;i++){
        // console.log("`````````````````",follow.followers[i].toString());
        if(follow.followers[i]._id == req.user.follow.toString()){
            followbtn =false;
            break;
        }
    }


    console.log(follow);

    // populating user and hotels for footer
    const HotelData = await Hotel.find({}).populate();

    const users = await User.find({}).populate();

    // for districts data
    const districts = await Districts.find({});

    // for shuffling customer section rp=reviewPosts
    if(profileUSerData.reviewPosts.length<3){
        var rp = profileUSerData.reviewPosts
    }
    else{
        var shuffledList = lodash.shuffle(profileUSerData.reviewPosts);
        var rp = shuffledList.slice(0,3);
    }

    // for quotes
    var shuffleQuotes = lodash.shuffle(quotes)
    var oneQuote = shuffleQuotes[0];


    // for paragraph colors 
    var backgroundColor1 = profileUSerData.colors[0];
    if(!backgroundColor1){
        backgroundColor1 = '#ddd'
    }
    const textColor1 = tinycolor(backgroundColor1).isDark() ? '#fff' : '#000';
    
    //for about-us heading
    const aboutUsColor = tinycolor(backgroundColor1).isDark() ? '#FFD700' : '#000080';
     

    var backgroundColor2 = profileUSerData.colors[2];
    if(!backgroundColor2){
        backgroundColor2 = '#000000e6'
    }
    const textColor2 = tinycolor(backgroundColor2).isDark() ? '#ACF4DB' : '#000';


    return res.render('hotel',{
        
        title:"RRR",
        HotelProfile :profileUSerData,
        userToVisit:userToVisit,
        userId:userId,
        typeOfUser:typeOfUser,
        followbtn:followbtn,
        followers:follow.followers,
        following:follow.followings,
        hotelNames: HotelData,
        users:users,
        message: await req.flash('message') ,
        districts:districts,
        rp:rp,
        oneQuote:oneQuote,
        textColor1,
        textColor2,
        aboutUsColor
    
    });


}

module.exports.editProfile =async(req,res)=>{

    Hotel.uploadPicture(req,res,async function(err){

        if(err){
            console.log(err);
        }
        const user = await Hotel.findById(req.user.id);
        let email = user.email;
        const nonEmptyValues = JSON.parse(JSON.stringify(req.body));
        const nonEmptyObject = {};

        // console.log("values",nonEmptyValues,req.file);00000000000000000
        // console.log("-----------------------------------",req.user.id,req.params.id);
        if(req.user.id == req.params.id){

            for(let userData in nonEmptyValues){
                if(nonEmptyValues[userData]!=""){
                    nonEmptyObject[userData] = nonEmptyValues[userData];
                }
            }

            nonEmptyObject.email = email
            if(req.file){
                // removing previous file from folder
                if(user.avatar){
                    const oldProfilePath = path.join(__dirname,'../',user.avatar);
                    fs.unlinkSync(oldProfilePath);
                }
                nonEmptyObject.avatar = Hotel.picPath+'/'+req.file.filename;
                console.log(user);
            }
            if(req.body.district){
                // check if already the hotel is in a district then modify it 
                if(user.district){
                    const id1 = ObjectId(user.district.id)
                    const district1 = await Districts.findById(id1);

                    await district1.hotels.pull(user.id);

                    await district1.save();
                }

                // new enrolling
                console.log("in new enroll");
                const district2 = await Districts.findById(req.body.district);
                await district2.hotels.push(user.id);
                await district2.save();


            }
            await Hotel.findByIdAndUpdate(req.user.id,{$set:nonEmptyObject});

        }
        
        await req.flash('message', [
            { type: 'flash-success-hotel', text: 'Edit Successfull' },
          ]);
        return res.redirect('back');
    });
    
}


 
module.exports.FollowOrUnfollow = async(req,res)=>{

    const followedById = req.user.id;
    const toFollowId = req.params.id;
    if(followedById!=toFollowId){
        
     
            var typeOfUser="Hotel";
            if (req.user && req.user.constructor.modelName === 'User') {
                typeOfUser = "User";
            }
            if(typeOfUser=="User"){
                var followedBy = await User.findById(followedById);
            }
            else{
                var followedBy = await Hotel.findById(followedById);
            }
        
        
            const toFollow = await Hotel.findById(toFollowId);
            
        
            const FollowVisitor = await Follow.findById(followedBy.follow);
            const FollowVisitPage = await Follow.findById(toFollow.follow);
             
            if(!FollowVisitPage.followers.includes(FollowVisitor.id)){
                FollowVisitPage.followers.push(FollowVisitor.id);
                FollowVisitor.followings.push(FollowVisitPage.id);
        
                var followBtn = "unfollow"
        
            }
            else{
                FollowVisitPage.followers.pull(FollowVisitor.id);
                FollowVisitor.followings.pull(FollowVisitPage.id);
        
        
                var followBtn = "follow"
        
            }
        
            await FollowVisitPage.save();
            await FollowVisitor.save();
        
            // for front end thing
            const FollowVisitPage1 = await Follow.findById(toFollow.follow)
            .populate('followers')
            .populate('followings');;
            // console.log("22222222222222222222222",FollowVisitPage1);
        
            res.status(200).json(
            {msg:"succeess",followers:FollowVisitPage1.followers,following:FollowVisitPage1.followings,followBtn:followBtn}
            );
    }

}

module.exports.collage = async(req,res)=>{

    Hotel.uploadCollagePicture(req,res,async function(err){
        
        if(err){
            console.log(err);
        }
        
         
        const user = await Hotel.findById(req.user.id);
        

        // reference for thephoto
        const ref = req.body.Photo;

        // removing old photo
        if(user.collage[ref]!=""){
            // console.log("in user.collage");
            const oldProfilePath = path.join(__dirname,'../uploads/hotelProfile/collage',user.collage[ref]);
            fs.unlinkSync(oldProfilePath);
        }

        // console.log(req.file.filename,"in controller");
         user.collage[ref] = req.file.filename;

         await user.save();

         
         await req.flash('message', [
            { type: 'flash-success-hotel', text: 'Collage Updated' },
          ]);
        return res.redirect('back');
    });
    

}


module.exports.coverPic =async(req,res)=>{
  Hotel.coverPic(req,res,async function(err){
    if(err){
        console.log(err);
    }

    const user = await Hotel.findById(req.user.id);

    if(req.file){
        if(user.coverPic){
            const oldProfilePath = path.join(__dirname,'../uploads/hotelProfile/imagesForBack',user.coverPic);
            fs.unlinkSync(oldProfilePath);
        }
    }

    user.coverPic = req.file.filename;
    await user.save();
    await req.flash('message', [
        { type: 'flash-success-hotel', text: 'Cover-pic Updated !' },
      ]);
    return res.redirect('back');
  })
}

module.exports.removeCoverPic = async(req,res)=>{
    const user =await Hotel.findById(req.user.id);
    console.log(user);
    if(user.coverPic){
        const oldProfilePath = path.join(__dirname,'../uploads/hotelProfile/imagesForBack',user.coverPic);
        fs.unlinkSync(oldProfilePath);
    }
     user.coverPic = "";
     await user.save();
     await req.flash('message', [
        { type: 'flash-warning-hotel', text: 'Back to default' },
      ]);
    return res.redirect('back');
     

}

module.exports.colors = async(req,res)=>{
    if(req.body.section){
        const hotel = await Hotel.findById(req.user.id);
        const section = req.body.section;
        console.log(section,"-------------------",req.body.color);

        hotel.colors[section] = req.body.color;

        await req.flash('message', [
            { type: 'flash-success-hotel', text: 'color updated' },
          ]);

        await hotel.save();
    }

    return res.redirect('back');

}


module.exports.sendOtpVerification = async(req,res)=>{
    try {
        if(req.body.password != req.body.confirm_password){
        
            return res.json({ redirectUrl: '/hotel/signUp' });
            // return res.redirect('back');
        }
        let user = await Hotel.findOne({email:req.body.email});
        if(!user){
            // check previous records and delete them
            await otpVerify.deleteMany({user:req.body.email});
            // const data = req.body;

            const otp = `${Math.floor(1000 + Math.random() * 9000)}`; 
            
            // hashing the otp to store
            const salt = 10;
            const hashedOtp = await bcrypt.hash(otp,salt);
            const newOtp = await new otpVerify({
                user:req.body.email,
                otp:hashedOtp,
                UserOrHotel:'Hotel',
                createdAt:Date.now(),
                expiredAt:Date.now() +3600000
            })
            
            // sending mail for otp
            mailer('userOtp',req.body.email,otp);
            
            await newOtp.save();

            return res.json({
                change:true,
                // data:data,

            })
        }else{
        await req.flash('message', [
            { type: 'flash-warning', text: 'User Already Exists' },
          ]);
          return res.json({ redirectUrl: '/user/signUp' });
        }
        

    } catch (error) {
        res.json({
            message:error.message
        })
    }
  }
