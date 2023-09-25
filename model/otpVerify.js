const mongoose = require('mongoose');


const OtpVerifySchema = new mongoose.Schema({
    user:{
        type:String
    },
    UserOrHotel:{
        type:String,
        required:true,
        enum:['User','Hotel']
    },
    otp:{
        type:String
    },
    createdAt:{
        type:Date
    },
    expiredAt:{
        type:Date
    }

})

// Method to delete expired records
OtpVerifySchema.statics.deleteExpiredRecords = async function () {
    const currentTime = new Date();
    try {
        await this.deleteMany({ expiredAt: { $lte: currentTime } });
    } catch (err) {
        console.error('Error deleting  records:', err);
    }
};

const OtpVerify = mongoose.model('OtpVerify',OtpVerifySchema);

module.exports = OtpVerify;
