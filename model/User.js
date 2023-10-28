const mongoose = require('mongoose');

const multer = require('multer');

const path = require('path');

const profilePicturePath = path.join('/uploads/userProfile/pics');

const coverPicPath = path.join('/uploads/userProfile/coverPics');

const userSchemma = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    googleId:{
        type: String
    },
    avatar:{
        type:String,
    },
    coverPic:{
        type:String,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    follow:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follow'
    },
    district:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Districts',
    },
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(__dirname);
      cb(null, path.join(__dirname,'..',profilePicturePath));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});

const storageBackground = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(__dirname);
      cb(null, path.join(__dirname,'..',coverPicPath));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});


userSchemma.statics.uploadPicture =  multer({storage:storage}).single('avatar');

userSchemma.statics.picPath = profilePicturePath;

userSchemma.statics.coverPic =  multer({storage:storageBackground}).single('cover');


const User = mongoose.model('User',userSchemma);

module.exports = User;