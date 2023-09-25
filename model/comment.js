const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'UserOrHotel'
    },
    content:{
        type:String,
        required:true
    },

    upVotesCount:{
        type:Number,
        required:true
    },
    upVotes:[{

        type: mongoose.Schema.Types.ObjectId,
        ref:'UpVote'

    }],
    UserOrHotel:{
        type:String,
        required:true,
        enum:['User','Hotel']
    }

});

const comment = mongoose.model('Comment',CommentSchema);

module.exports = comment;

