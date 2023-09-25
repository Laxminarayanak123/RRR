const Hotel = require('../model/hotelModel');  
const fs = require('fs');
const path = require('path');
const Menu = require('../model/menuModel');
const User = require('../model/User');
const Rating = require('../model/rating');


module.exports.addRating = async(req,res)=>{
    try {
        if(req.xhr){

            const user = await User.findById(req.body.ratingUser);

            const menu = await Menu.findById(req.body.idData)
            .populate({
                path:'rating',
                populate:{
                    path:'ratedBy'
                }
            });

            let total=0;

            let sum=0;

            let hasUserRated = false;

            let rating;

            menu.rating.map((data)=>{

                total = total+1;

                if(data.ratedBy.id == req.body.ratingUser){

                    hasUserRated = true;

                    rating = req.body.ratingValue;

                    data.rating = req.body.ratingValue;

                    sum += data.rating;

                    data.save();

                    return true;

                }else{
                    sum += data.rating
                }

            });

            if(hasUserRated == true){

                menu.averageRating = sum/total;

            }else{

                let newRating = await Rating.create({
                    rating:req.body.ratingValue,
                    ratedBy:user
                });

                rating = req.body.ratingValue;

                if(menu.rating.length == 0){
                    menu.averageRating = newRating.rating;
                }else{
                    menu.averageRating = sum/total;
                }

                menu.rating.push(newRating.id);
            }

            menu.save();

            return res.status(200).json({
                average:menu.averageRating.toFixed(1),
                rating:rating
            })
        }
    }
    catch(err){
        console.log(err);
    }

}