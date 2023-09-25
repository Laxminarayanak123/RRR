const mongoose = require('mongoose');

const  upVoteSchema = new mongoose.Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'UserOrHotel'
    },
    votable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'postORcomment'
    },
    upVoted:{
        type:Boolean,
        required:true,
    },
    postORcomment:{
        type:String,
        required:true,
        enum:['Post','Comment']
    },
    UserOrHotel:{
        type:String,
        required:true,
        enum:['User','Hotel']

    }
     

});


const upVote = mongoose.model('UpVote',upVoteSchema);

module.exports = upVote;