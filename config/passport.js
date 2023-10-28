const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User')
const Hotel = require('../model/hotelModel')
const Follow = require('../model/follow');
const mailerExp = require('./mailer');
const bcrypt = require('bcrypt');
const axios = require('axios');
const path = require('path')
const fs = require('fs')

//intilizing passport local strategy
passport.use('local-user',new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email,password,done){
        User.findOne({email: email},async function(err,user){
          if(err){
            return done(err);
          }
          if(user){
            const validatePassword = await bcrypt.compare(password,user.password)
            // const validatePassword = user.password != password;
            // if(!user || user.password != password){
  
            if(!user || !validatePassword){
              req.flash('message', [
                { type: 'flash-warning', text: 'Invalid Credentials' },
              ]);
              return done(null,false);
            }
            // console.log("in the passport local",req.sessionID);
             
              return done(null,user);
          }
          else{
            req.flash('message', [
              { type: 'flash-warning', text: 'Invalid Credentials' },
            ]);
            return done(null,false);
          }
        })
    }
));


passport.use('local-hotel',new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    function(req,email,password,done){
        // console.log("test1");

        Hotel.findOne({email: email},async function(err,hotel){
            if(err){
                return done(err);
            }
            // console.log("test2");
            if(hotel){
              const validatePassword = await bcrypt.compare(password,hotel.password)

              if(!hotel || !validatePassword){
  
                  // console.log("error +++++++++++++++++++++++++++++++");
                  req.flash('message', [
                    { type: 'flash-warning', text: 'Invalid Credentials' },
                  ]);
                  return done(null,false);
              }
              if(!hotel.follow && hotel.isVisible==false){
                  req.flash('message', [
                    { type: 'flash-success', text: 'Approval needed' },
                  ]);
                  return done(null,false);
              }
              return done(null,hotel);
            }
            else{
              req.flash('message', [
                { type: 'flash-warning', text: 'Invalid Credentials' },
              ]);
              return done(null,false);
            }

        })
    }
));


// google oauth20

var GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use('userGoogle',new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/user/google/callback",
    passReqToCallback:true
  },
  function(req,accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.findOne({ googleId: profile.id }, async function (err, user) {
        if (err) { return cb(err); }
        if (!user) {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password:profile.id,
            isAdmin: profile.emails[0].value === process.env.adminUserHemanth || profile.emails[0].value === process.env.adminUserVenom
          });
            let follow = await Follow.create({
            user:newUser.id,
            UserOrHotel:'User'
            })

            newUser.follow = follow;
            // console.log(profile);
            if( profile._json['picture']){
              // newUser.avatar= profile._json['picture']
  
              const imageUrl = profile._json['picture']; 
              const imageName = `avatar-${Date.now()}`; 

              try {
                const downloadDirectory = path.join(__dirname,'../uploads/userProfile/pics');
                
                const response = await axios.get(imageUrl, { responseType: 'stream' });
                
                const filePath = path.join(downloadDirectory, imageName);
                const fileStream = fs.createWriteStream(filePath);
                // console.log(downloadDirectory,filePath);

                response.data.pipe(fileStream);

                // Handle success
                fileStream.on('finish', () => {
                  // res.status(200).send('Image downloaded successfully!');
                  // console.log('Image downloaded successfully!');
                });

                // Handle errors
                fileStream.on('error', (err) => {
                  console.error('Error while downloading the image:', err);
                  // res.status(500).send('Error downloading the image.');
                });
              } catch (error) {
                console.error('Error fetching the image:', error);
                // res.status(500).send('Error fetching the image.');
              }
              newUser.avatar=`/uploads/userProfile/pics/${imageName}`
            }
            else{
              newUser.avatar = "https://i.imgur.com/ce3eomA.png";
            }
 
            mailerExp('newuser',`${profile.emails[0].value}`)
    
            await newUser.save(function (err) {
              if (err) { return cb(err); }
              return cb(null, newUser);
            });
            
          } else {
            // console.log(user);
            // req.session.shareid = 
            // console.log("in user google auth",req.query);

            // console.log("in the passport google ",req.query);
            // console.log(profile);

            return cb(null, user);
        }
      });
    }
));

var GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID_Hotel = process.env.GOOGLE_CLIENT_ID_Hotel;
const GOOGLE_CLIENT_SECRET_Hotel = process.env.GOOGLE_CLIENT_SECRET_Hotel;
passport.use('hotelGoogle',new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID_Hotel,
    clientSecret: GOOGLE_CLIENT_SECRET_Hotel,
    callbackURL: "/hotel/google/callback",
    passReqToCallback:true
  },
  function(req,accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    Hotel.findOne({ googleId: profile.id }, async function (err, user) {
        if (err) { return cb(err); }
        if (!user) {
          const newUser = await Hotel.create({
            name: "Change Name",
            email: profile.emails[0].value,
            googleId: profile.id,
            password:profile.id
          });
            // let follow = await Follow.create({
            // user:newUser.id,
            // UserOrHotel:'Hotel'
            // })

            // newUser.follow = follow;
            newUser.avatar = "https://i.imgur.com/YMw6j9z.png";
            
            newUser.collage.push("")
            newUser.collage.push("")
            newUser.collage.push("")
            newUser.collage.push("")

            newUser.colors.push("")
            newUser.colors.push("")
            newUser.colors.push("")
    
            mailerExp('pendingapproval',`${profile.emails[0].value}`);


            newUser.save(function (err) {
            if (err) 
            { 
              return cb(err); 
            }
            req.flash('message', [
              { type: 'flash-success', text: 'Approval needed' },
            ]);
            return cb(null, false);
          });
        } else {
            // console.log(user);
            if(!user.follow && user.isVisible==false){
              req.flash('message', [
                { type: 'flash-success', text: 'Approval needed' },
              ]);
              return cb(null, false);
            }
            return cb(null, user);
        }
      });
    }
));

//encrypting user

passport.serializeUser(function(user,done){
    // console.log("in serializer",user.id);
    done(null,user.id);
})
//decrypting user
passport.deserializeUser(async function(id,done){
    
    const user = await User.findById(id);
    if(user){
        return done(null,user);
    }
    else{
        const user2 = await Hotel.findById(id);
        return done(null,user2);
    }
    
});

//checking wheather user is logged in and cookie is active
passport.checkAuthentication  = function(req,res,next){
    
    if(req.isAuthenticated()){
        // console.log("inside checkAuthentication");
        return next();
    }
    // req.session.shareUrl = `/share/${req.params.shareid}`;
    // console.log("inside check share");
    return res.redirect('/user/signIn');
}


// for the share thing
// passport.checkAuthenticationShare  = function(req,res,next){
    
//   if(req.isAuthenticated()){
//       console.log("inside checkshareAuthentication");
//       return next();
//   }
//   req.session.redirectUrl = `/share/${req.params.id}`;
//   console.log("inside check share",req.session);
//   return res.redirect('/user/signIn');
// }


//making user object from passport available for locals
passport.setAuthenticated = function(req,res,next){
    if(req.isAuthenticated()){
      // console.log("in set authenticated",req.session);
        res.locals.user = req.user;
        // console.log('------------------',res.locals,"--------------");
    }
    next();
}

module.exports = passport;