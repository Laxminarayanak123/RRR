const express = require('express');

const passport = require('passport');

const router = express.Router();

const hotelController = require('../controllers/hotelController');

const menuController = require('../controllers/menuController');

const ratingController = require('../controllers/ratingController');

const otpVerify = require('../config/otpVerifyMiddleware');

router.get('/signIn',hotelController.signIn);

router.get('/signUp',hotelController.signUp);

router.post('/create',otpVerify,hotelController.create);

router.post('/create-session',passport.authenticate(
    
    'local-hotel',
    {failureRedirect: '/hotel/signIn'}

),hotelController.createSession);

router.get('/google/callback',
    passport.authenticate('hotelGoogle',{
        failureRedirect:'/hotel/signIn'
    }),hotelController.GoogleSession);

router.get('/signOut',hotelController.destroySession);

router.get('/profile/:uID/',passport.checkAuthentication,hotelController.userProfile);

router.post('/toggleAvailability',menuController.toggleAvaialability);

router.post('/profile/update/:id',hotelController.editProfile);

router.post('/addMenu/:id',menuController.addMenu);

router.post('/addRating/:id',ratingController.addRating);

router.post('/showMenu',menuController.getMenu);

router.get('/follow/:id',hotelController.FollowOrUnfollow);

router.post('/collage',hotelController.collage);

router.post('/cover',hotelController.coverPic);

router.get('/cover/remove',hotelController.removeCoverPic);

router.post('/color',hotelController.colors);

router.post('/sendOtpVerification',hotelController.sendOtpVerification);



module.exports = router;

