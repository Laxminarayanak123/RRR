const mongoose = require('mongoose');

const multer = require('multer');

const path = require('path');

const hotelModel = require('../model/hotelModel');

const menuModel = require('../model/menuModel');

const postPicturePath = path.join('/uploads/posts');

const postSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'UserOrHotel'
    },
    content:{
        type : String,
        required:true 
    },
    hotelName:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Hotel'
    },
    menuModel:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    },
    upVotesCount:{
        type:Number,
        required:true
    },
    upVotes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UpVote'
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    picturePath:{
        type:String,
    },
    UserOrHotel:{
        type:String,
        required:true,
        enum:['User','Hotel']
    }

},{
    timestamps:true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',postPicturePath));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});
  
 

postSchema.statics.uploadPicture =  multer({storage:storage}).single('picturePath');

postSchema.statics.picPath = postPicturePath;

const Post = mongoose.model('Post',postSchema);

module.exports = Post;