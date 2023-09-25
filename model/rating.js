const mongoose = require('mongoose');

const  ratingSchema = new mongoose.Schema({
        
    rating:{
        type:Number,
        default:0
    },
    ratedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const rating = mongoose.model('Rating',ratingSchema);

module.exports = rating;