const mongoose = require('mongoose');


const districtSchema = new mongoose.Schema({
    name:{
        type : String,
        required:true 
    },
    hotels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel'
    }],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    isVisible:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const Districts = mongoose.model('Districts',districtSchema);

module.exports = Districts;