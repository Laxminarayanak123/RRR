const express = require('express');

const passport = require('passport');

const { Module } = require('module');

const router = express.Router();

const userController = require('../controllers/userController');

const User = require('../model/User');

const otpVerify = require('../config/otpVerifyMiddleware');

router.get('/signIn',userController.signIn);

router.get('/signUp',userController.signUp);

router.post('/create',otpVerify,userController.create);

router.post('/create-session',passport.authenticate(
    
    'local-user',
    {failureRedirect: '/user/signIn'}

),userController.createSession);

router.get('/google/callback',
    passport.authenticate('userGoogle',{
        failureRedirect:'/user/signIn'
    }),userController.GoogleSession);

router.get('/signOut',userController.destroySession);


router.get('/profile/:uID/',passport.checkAuthentication,userController.userProfile);

router.post('/profile/update/:id',userController.editProfile);

router.get('/follow/:id',userController.FollowOrUnfollow);

router.post('/cover',userController.coverPic);

router.get('/cover/remove',userController.removeCoverPic);

router.post('/sendOtpVerification',userController.sendOtpVerification);

router.get('/changeDistrict/:id',userController.changeDistrict,);

module.exports = router;

