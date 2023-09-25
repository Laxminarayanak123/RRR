const User = require('../model/User');
const otpVerify = require('../model/otpVerify');
const bcrypt = require('bcrypt');

async function verifyOtpUser(req, res, next) {

    try {
        // console.log(req.query);
        let {email,otp} = req.body;
        const record = await otpVerify.find({user:email});
        // console.log(record[0].otp, 'the otp from records');
        if(record.length<=0){
            console.log("in verify model this doesn't exists");
            return res.json({msg:'Error! Generate new code'});
        }
        else{
            console.log("in verify model this exists");
            const {expiredAt} = record[0];
            const hashedOtp = record[0].otp;

            if(expiredAt<Date.now()){
                await otpVerify.deleteMany({user:email});
                // code expired message
                // console.log('code expires');
                return res.json({msg:'Code expired! Generate new code'});
            }
            else{
                const validOtp = await bcrypt.compare(otp,hashedOtp);
                if(!validOtp){
                    // given otp is wrong ,message
                // console.log('wrong otp');
                return res.json({msg:'Entered Wrong Otp!'});

                }
                else{
                    await otpVerify.deleteMany({user:email});
                    next();
                }
            }
        }

    } catch (error) {
        res.json({
            message:error.message
        })
    }

}

module.exports = verifyOtpUser;
