const Post = require('../model/postModel');

const Hotel = require('../model/hotelModel');

const User = require('../model/User');

const Districts = require('../model/districts');

const loadash = require('lodash');

module.exports.HomePage = async function(req,res){
    var typeOfUser="Hotel";
    if (req.user && req.user.constructor.modelName === 'User') {
        typeOfUser = "User";
    }
    if (req.user && req.user.constructor.modelName === 'Admin') {
        typeOfUser = "Admin";
    }

    const postData = await Post.find({})
    .populate('user')
    .populate({
        path:'upVotes',
        populate:{
            path:'user'
        }
       
    })
    .populate({
        path:'comments',
        options: { sort: { createdAt: -1 } },
        populate:{
            path:'upVotes'
        },
    })
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
    }).populate({
        path:'hotelName'
    }).populate({
        path:'menuModel'
    })

    const HotelData = await Hotel.find(
        {$and:[
            {isVisible:{$ne:false}},
            {district:{$ne:null}}
        ]})
        .populate();
    const ShuffleHotelData = loadash.shuffle(HotelData);

    const users = await User.find({}).populate();
    const ShuffleUserData = loadash.shuffle(users);


    postData.reverse();

    // console.log(postData);

    
    // for all districts 
    const allDistricts = await Districts.find({});
    
    
    // presentDistrict
    var presentDistrict=''
    if(allDistricts[0]){
        presentDistrict = allDistricts[0].id;
    }
    if(req.user.district){
       presentDistrict = req.user.district
    }
    if(req.query.distId){
        presentDistrict= req.query.distId
    }
    // render by district
    if(presentDistrict){
        var districtData =  await Districts.findById(presentDistrict)
        .populate({
            path:'hotels'
        }) ;
    }
    else{
       var districtData ="";
    }


    return res.render('homePage',{
        
        title : "RRR",
        postData:postData,
        typeOfUser:typeOfUser,
        hotelNames: ShuffleHotelData,
        users:ShuffleUserData,
        userId:req.user.id,
        districtData:districtData,
        allDistricts:allDistricts,
        presentDistrict:presentDistrict,
        message: await req.flash('message') ,
    });

}