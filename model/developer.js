const mongoose = require('mongoose');


const developerSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'UserOrHotel'
    },
    content:{
        type : String,
        required:true 
    },
    FeedBackType:{
        type:String,
        required:true,
        enum:['Feature','Bug']
    },
    UserOrHotel:{
        type:String,
        required:true,
        enum:['User','Hotel']
    }
},{
    timestamps:true
});


const Developer = mongoose.model('Developer',developerSchema);

module.exports = Developer;