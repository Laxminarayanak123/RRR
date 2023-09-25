const { Int32, Double } = require('mongodb');
const mongoose = require('mongoose');

const path = require('path');

const profilePicturePath = path.join('/uploads/menuPics');

const multer = require('multer');



const MenuSchema = new mongoose.Schema({
    hotel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel'
    },
    name:{
        type:String
    },
    content:{
        type : String,
        required:true 
    },
    picturePath:{
        type:String,
    },
    averageRating:{
        type:Number
    },
    isAvailable:{
        type:Boolean
    },
    rating:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Rating'
    }]
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(__dirname);
      cb(null, path.join(__dirname,'..',profilePicturePath));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
});

MenuSchema.statics.uploadPicture =  multer({storage:storage}).single('picturePath');

MenuSchema.statics.picPath = profilePicturePath;

const Menu = mongoose.model('Menu',MenuSchema);

module.exports = Menu;