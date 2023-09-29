const express = require('express');
const Post = require('../model/postModel');



module.exports.Share = async function(req,res){
    // console.log(req.session);

    var typeOfUser="Hotel";
    if (req.user && req.user.constructor.modelName === 'User') {
        typeOfUser = "User";
    }

    if(req.isAuthenticated()){
        const sharedPost = await Post.findById(req.params.shareid)
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


        // console.log("logged in ",req.params.shareid);
        return res.render('share',{
            title : "RRR",
            post:sharedPost,
            typeOfUser:typeOfUser,
            userId:req.user.id,
            message: await req.flash('message') ,
        })

    }
    return res.redirect(`/user/signIn?shareid=${req.params.shareid}`)
}