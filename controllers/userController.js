const User = require('../model/User');  
const fs = require('fs');
const path = require('path');
const Hotel = require('../model/hotelModel');
const Follow = require('../model/follow');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailerExp = require('../config/mailer');
const otpVerify = require('../model/otpVerify');
const Districts = require('../model/districts');
const loadash = require('lodash');



// key for jwt secret
const jwtSecret = 'illuminati';

module.exports.signUp =async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    
    return res.render("userSignUp",{
        title: "RRR",
        message: await req.flash('message') ,
    })
}

module.exports.signIn = async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    } 

    // console.log(req.query);
    return res.render("userSignIn",{
        title: "RRR ",
        message: await req.flash('message'),
        shareid:req.query.shareid
    })
}
 
module.exports.create = async function(req,res){
    // console.log(req.body,"from userCreate");
    
   
    if(req.body.password != req.body.confirm_password){
        
        return res.redirect('back');
    }
    let user = await User.findOne({email:req.body.email});
    if(!user){

        // generate hash
        const salt = await bcrypt.genSalt(10);
        // hashing here
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        
        newUser = await User.create(req.body);
        newUser.password = hashPassword;

        let follow = await Follow.create({
            user:newUser.id,
            UserOrHotel:'User'
        })

        newUser.follow = follow;
        newUser.avatar = "https://i.imgur.com/ce3eomA.png";
        await newUser.save();


        await req.flash('message', [
            { type: 'flash-success', text: 'User Created' },
          ]);
        //   mail for new account creation
        mailerExp('newuser',`${req.body.email}`)
        // return res.redirect('/user/signIn');
        return res.json({ redirectUrl: '/user/signIn' });

    }else{
        await req.flash('message', [
            { type: 'flash-warning', text: 'User Already Exists' },
          ]);
        return res.redirect('back');
    }
    

}


//for creating session and signIN
module.exports.createSession = async function(req,res){
    // console.log("came here");

    // jwt token
    if(req.user.isAdmin){
        const token = jwt.sign({ id:req.user.id,isAdmin: req.user.isAdmin }, jwtSecret, { expiresIn: '1h' });
        res.cookie('auth',`Bearer ${token}`)
    }
    
    // mailerExp('newuser',`${req.body.email}`)
    
    await req.flash('message', [
        { type: 'flash-success', text: 'Login Success' },
      ]);
      

    // console.log(req.body.shareid,"--------------");
    if(req.body.shareid){
        // console.log("logged in --- after login ",req.body.shareid);

        return res.redirect(`/share/${req.body.shareid}`)
    }

    return res.redirect('/');
}
//for creating session and signIN using google

module.exports.GoogleSession =async function(req,res){
  
    if(req.user.isAdmin){
        const token = jwt.sign({ id:req.user.id,isAdmin: req.user.isAdmin }, jwtSecret, { expiresIn: '1h' });
        res.cookie('auth',`Bearer ${token}`)
    }
    // const id = req.user.id;
    await req.flash('message', [
        { type: 'flash-success', text: 'Login Success' },
      ]);

    // console.log("in user controller", req.query);
    if(req.query.state){
        // console.log("logged in --- after login ",req.query.state);

        return res.redirect(`/share/${req.query.state}`)
    }
      
    return res.redirect('/');
}
 
//for deleting session cookie created by passport
module.exports.destroySession = async function(req,res,next){
    req.logout(async function(err) {
        if (err) { return next(err); }
        
        await req.flash('message', [
            { type: 'flash-warning', text: 'Logged out' },
          ]);
        res.clearCookie('auth');
        res.redirect('/user/signIn');
    });
    

}

module.exports.userProfile = async function(req,res){   
    
    const userToVisit = req.params.uID;
    const userId = req.user._id.toString();

    // console.log(userToVisit,userId);

    var typeOfUser="Hotel";
    if (req.user && req.user.constructor.modelName === 'User') {
        typeOfUser = "User";
    }
    
    if (req.user && req.user.constructor.modelName === 'Admin') {
        typeOfUser = "Admin";
    }
    const profileUSerData = await User.findById(req.params.uID)
    .populate({
        path:'posts',
        populate:{
            path:'user'
        }
    }).populate({
        path:'posts',
        populate:{
            path:'upVotes',
            populate:{
                path:'user'
            }
        }
    }) 
    .populate({
        path:'posts',
        populate:{
            path:'comments',
            populate:{
                path:'user'
            }
        }
    })
    .populate({
        path:'posts',
        populate:{
            path:'comments',
            populate:{
                path:'upVotes'
            }
        }
    })
    .populate({
        path:'follow',
        populate:{
            path:'followers'
        }
    })
    .populate({
        path:'follow',
        populate:{
            path:'followings'
        }
    })
    .populate({
        path:'posts',
        populate:{
            path:'menuModel'
        }
    })
    .populate({
        path:'posts',
        populate:{
            path:'hotelName'
        },
    });
    
    profileUSerData.posts.reverse();
    
    
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
    });

    //  console.log("in user controller",req.user.follow);
    for(var i=0 ; i<follow.followers.length;i++){
        
        if(follow.followers[i]._id == req.user.follow.toString()){
            followbtn =false;
            break;
        }
    }


    // populating user and hotels for footer
    const HotelData = await Hotel.find(
        {$and:[
            {isVisible:{$ne:false}},
            {district:{$ne:null}}
        ]}
    ).populate();
    const ShuffleHotelData = loadash.shuffle(HotelData);

    const users = await User.find({}).populate();
    const ShuffleUserData = loadash.shuffle(users);


    // console.log("in user controller",follow);
    return res.render('userProfile',{
        
        title:"RRR",
        UserProfile :profileUSerData,
        userToVisit:userToVisit,
        userId:userId,
        typeOfUser:typeOfUser,
        followbtn:followbtn,
        followers:follow.followers,
        following:follow.followings,
        hotelNames: ShuffleHotelData,
        users:ShuffleUserData,
        message: await req.flash('message') ,


    });


}

module.exports.editProfile =async(req,res)=>{

    User.uploadPicture(req,res,async function(err){

        if(err){
            console.log(err);
        }
        const user = await User.findById(req.user.id);
        let email = user.email
        // console.log(user);
        const nonEmptyValues = JSON.parse(JSON.stringify(req.body));
        const nonEmptyObject = {};
        

        // console.log("values",nonEmptyValues,req.file);
        if(req.user.id == req.params.id){

             // if anyone try to change admin via body form
             if(req.body.isAdmin){
                req.body.isAdmin = false;
             }
            for(let userData in nonEmptyValues){
                if(nonEmptyValues[userData]!=""){
                    nonEmptyObject[userData] = nonEmptyValues[userData];
                }

            }


            if(req.file){
                // removing previous file from folder
                if(!user.avatar.startsWith('https://')){
                    // console.log('in the test');
                    const oldProfilePath = path.join(__dirname,'../',user.avatar);
                    fs.unlinkSync(oldProfilePath);
                }
                nonEmptyObject.avatar = User.picPath+'/'+req.file.filename;
                
                // console.log(user);
            }
            
            // if anyone try to change admin
            if(req.body.isAdmin){
                nonEmptyObject.isAdmin=false;
            }

            nonEmptyObject.email = email;
            // for password changes
            if(req.body.password){
                 // generate hash
                const salt = await bcrypt.genSalt(10);
                // hashing here
                const hashPassword = await bcrypt.hash(req.body.password,salt);
                
                nonEmptyObject.password = hashPassword;
            }

            await User.findByIdAndUpdate(req.user.id,{$set:nonEmptyObject});

            const users = await User.findById(req.user.id);
            await user.save();

            await req.flash('message', [
                { type: 'flash-success', text: 'Edit SuccessFull' },
              ]);
        
            return res.redirect('back');
        }
       
    });
   
    
}

module.exports.FollowOrUnfollow = async(req,res)=>{

    const followedById = req.user.id;
    const toFollowId = req.params.id;

    if(followedById!=toFollowId){
        
            // checking user logged in is user or hotel
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
        
        
            const toFollow = await User.findById(toFollowId);
            
            const FollowVisitor = await Follow.findById(followedBy.follow);
            const FollowVisitPage = await Follow.findById(toFollow.follow);
            // console.log("222222222222222222222",FollowVisitPage);
        
            // logic 
        
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
        
 
            const FollowVisitPage1 = await Follow.findById(toFollow.follow)
            .populate('followers')
            .populate('followings');
    
            // console.log(FollowVisitPage1);
            res.status(200).json(
            {msg:"succeess",followers:FollowVisitPage1.followers,following:FollowVisitPage1.followings,followBtn:followBtn}
            );
    }

}

module.exports.coverPic =async(req,res)=>{
    User.coverPic(req,res,async function(err){
      if(err){
          console.log(err);
      }
  
      const user = await User.findById(req.user.id);
  
      if(req.file){
          if(user.coverPic){
              const oldProfilePath = path.join(__dirname,'../uploads/userProfile/coverPics',user.coverPic);
              fs.unlinkSync(oldProfilePath);
          }
      }
  
      user.coverPic = req.file.filename;
      await user.save();
      await req.flash('message', [
        { type: 'flash-success', text: 'Cover Pic Changed ' },
      ]);
      return res.redirect('back');
    })
  }
  
  module.exports.removeCoverPic = async(req,res)=>{
      const user =await User.findById(req.user.id);
      
      if(user.coverPic){
          const oldProfilePath = path.join(__dirname,'../uploads/userProfile/coverPics',user.coverPic);
          fs.unlinkSync(oldProfilePath);
      }
       user.coverPic = "";
       await user.save();
       await  req.flash('message', [
        { type: 'flash-success', text: 'Back to Default Pic ' },
      ]);
      return res.redirect('back');
       
  
  }

  module.exports.sendOtpVerification = async(req,res)=>{
    try {
        if(req.body.password != req.body.confirm_password){
        
            return res.json({ redirectUrl: '/user/signUp' });
            // return res.redirect('back');
        }
        let user = await User.findOne({email:req.body.email});
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
                UserOrHotel:'User',
                createdAt:Date.now(),
                expiredAt:Date.now() +3600000
            })
            
            // sending mail for otp
            mailerExp('userOtp',req.body.email,otp);
            
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

  module.exports.changeDistrict = async(req,res)=>{
   
    const distId = req.params.id;

    const user = await User.findById(req.user.id);

    // check if district exists
    const dist = await Districts.findById(distId);
    if(dist){
        user.district = distId;
        await req.flash('message', [
            { type: 'flash-success', text: 'District Changed!' },
          ]);
    }
    
    await user.save();

    

    return res.redirect('/');

  }
