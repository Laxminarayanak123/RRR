const console = require('console');
const Post = require('../model/postModel');
const User = require('../model/User');
const upVote = require('../model/upVote');
const Hotel = require('../model/hotelModel');
const Comment = require('../model/comment');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const authenticateAdmin = require('../config/jwtMiddleware');




module.exports.PostConroller = async function(req,res){

    try {
       Post.uploadPicture(req,res,async function(err){

            // console.log(req.user);
            if(err){
                console.error(err);
    
            }
            const user_type = req.query.type;
    
            var hotelName ;
            var menuModel ;
    
            if(user_type=="User"){
                hotelName = req.body.hotel;
                menuModel = req.body.menuItem;
            }
            // console.log("----------------------------------");
            let presentPost = await Post.create({
                user:req.user._id,
                content:req.body.content,
                picturePath:Post.picPath + "/"+req.file.filename,
                upVotesCount:req.body.upVotesCount,
                UserOrHotel:req.body.userType,
                hotelName : hotelName,
                menuModel : menuModel
            });
    
            
    
            let post_User;
    
            if(user_type=="User"){
                
                post_User = await User.findById(req.user._id);
                
                if(req.body.hotel){
    
                    const hotel = await Hotel.findById(req.body.hotel);
    
                    hotel.reviewPosts.push(presentPost.id);
    
                    await hotel.save();
    
                }
    
                post_User.posts.push(presentPost.id);             
    
            }
            else{
    
                post_User = await Hotel.findById(req.user._id);
    
                post_User.posts.push(presentPost.id);
                
            }
            
            let upvote = await upVote.create({
                votable:presentPost.id,
                postORcomment:"Post",
                user : req.user.id,
                upVoted:false,
                UserOrHotel:req.body.userType
            });
    
            presentPost.upVotes.push(upvote.id);
    
            await presentPost.save();
    
            await post_User.save();
    
            await req.flash('message', [
                { type: 'flash-success', text: 'Post Created' },
              ]);
        
            return res.redirect('/');
        });
    } catch (error) {
        console.log(error);
    }
    

    
}

module.exports.deletePost = async function(req,res,next){

    // console.log(req.params.uID,req.params.pID,req.query.type);

    let type = req.query.type;

    let PostUser;

    
    if(type == 'User'){
        
        PostUser = await User.findById(req.params.uID);
        
    }else{
        
        PostUser = await Hotel.findById(req.params.uID);
        
    }
    
    const post = await Post.findById(req.params.pID)
    .populate({
        path:'user',
        select:'id'
    });
    
    if(post){
        // console.log("in this", req.user.id,post.user.id,req.user.isAdmin);
        if(req.user.id == post.user.id || req.user.isAdmin){
    
            let commentData = post.comments;
            
            if (commentData.length > 0){
                for (const comment of commentData){
                    await upVote.deleteOne({votable:comment._id});
                    await Comment.deleteOne({id:comment._id});
                }
            }
        
            await PostUser.posts.pull(req.params.pID);
        
            await upVote.deleteMany({votable:req.params.pID});
        
            // unlink the image
            const oldProfilePath = path.join(__dirname,'../',post.picturePath);
            fs.unlinkSync(oldProfilePath);
    
            await post.remove();
        
        
            await PostUser.save();
            await req.flash('message', [
                { type: 'flash-warning', text: 'Post Deleted' },
              ]);
            return res.redirect('back');
        }
        else{
            await req.flash('message', [
                { type: 'flash-warning', text: "Can't delete" },
              ]);
            return res.redirect('back');
        }
    }
    else{
        await req.flash('message', [
            { type: 'flash-warning', text: "Post Unavailable" },
          ]);
        return res.redirect('back');
    }
    

}

module.exports.download = async function(req,res){
    const postId = req.params.id;

    const currentPost =  await Post.findById(postId);
    if(currentPost==null){
        await req.flash('message', [
            { type: 'flash-warning', text: "Post Unavailable !" },
          ]);
          return res.redirect('back');
    }

    const imgPath = path.join(__dirname,'../',currentPost.picturePath);
    const outputPath = path.join(__dirname,'../uploads/buffer/');
    

    const convertedImageBuffer = await sharp(imgPath)
      .toFormat('jpeg')
      .toBuffer();

    // console.log(convertedImageBuffer,"testing");

    // const uniqueFilename = `${uuidv4()}.jpg`;
    const uniqueFilename = 'rrr' + '-' + Date.now()+'.jpg';
    const outputFile = path.join(outputPath, uniqueFilename);


    fs.writeFileSync(outputFile, convertedImageBuffer);

    // const downloadFileName = `${currentPost.picturePath}.jpeg`;
    // const downloadFilePath = path.resolve(outputPath);
    // res.set('Content-Disposition', `attachment; filename="${downloadFileName}"`);

    // console.log(outputPath,"-------",outputFile);
    const downloadFilePath =path.join(__dirname,'../uploads/buffer/',uniqueFilename);

    // console.log(downloadFilePath);
    // await req.flash('message', [
    //     { type: 'flash-success', text: 'Download Success' },
    //   ]);
    await res.download(downloadFilePath, (err) => {
        if (err) {
          console.error('Error downloading image:', err);
          res.status(404).send('Image not found');
        }
        fs.unlinkSync(downloadFilePath);
      });

}