const express = require('express');

const router = express.Router();

const passport = require('passport');

const adminController = require('../controllers/adminController');

const authenticateAdmin = require('../config/jwtMiddleware');


// router.get('/profile/:id',adminController.adminPage);

// router.get('/signIn',adminController.signIn);

// router.get('/signUp',adminController.signUp);

// router.post('/create',adminController.create);

// router.post('/create-session',passport.authenticate(
    
//     'local-admin',
//     {failureRedirect: '/admin/signIn'}

// ),adminController.createSession);

// router.get('/signOut',adminController.destroySession);


router.get('/dashboard',adminController.adminPage);

router.get('/data',adminController.GetFeedback);

router.post('/delete_Feedback/:id',adminController.deleteFeedback)

router.post('/add_districts', adminController.addDistricts)

router.post('/approveHotel/:id',adminController.approveHotel);

router.post('/disapproveHotel/:id',adminController.disapproveHotel);

router.post('/promotionalMail',adminController.promotionalMail);

router.post('/promotionalSampleMail',adminController.promotionalSampleMail);

router.get('/manageHotel/:id',adminController.manageHotel);


module.exports = router;