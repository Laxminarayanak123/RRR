const express = require('express');

 

const router = express.Router();

const passport = require('../config/passport');

const upVoteController = require('../controllers/upVoteController');

const HomePageController = require('../controllers/homePage');

const ShareController = require('../controllers/shareController');

const authenticateAdmin = require('../config/jwtMiddleware');


router.get('/',passport.checkAuthentication,HomePageController.HomePage);

// router.get('/auth/user/google' , passport.authenticate('userGoogle',{scope : ['email' , 'profile'],state: req.query.shareid}));
router.get('/auth/user/google', (req, res, next) => {
    passport.authenticate('userGoogle', {
      scope: ['email', 'profile'],
      state: req.query.shareid
    })(req, res, next);
  });

router.get('/auth/hotel/google' , passport.authenticate('hotelGoogle',{scope : ['email' , 'profile']}));

router.use('/posts',require('./posts'));

router.use('/user',require('./user'));

router.use('/hotel',require('./hotel'));

router.use('/search',require('./search'));

router.use('/developer',require('./developer'));

router.use('/Admin',authenticateAdmin, require('./admin'));

router.post('/upVote/:id',upVoteController.upVoteController);

router.get('/share/:shareid',ShareController.Share);



module.exports = router;