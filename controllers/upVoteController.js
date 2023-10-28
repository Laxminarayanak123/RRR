const upVote = require("../model/upVote");

const Post = require("../model/postModel");

const Comment = require("../model/comment");
 

module.exports.upVoteController = async function(req,res){

     

    let postORcom;

    if(req.query.type == 'Post'){
      

        postORcom = await Post.findById(req.params.id);
         
    }else{
        

        postORcom = await Comment.findById(req.params.id);
    }
    if(postORcom==null){
        if(req.xhr){
            if(req.query.type == 'Post'){
                await req.flash('message', [
                    { type: 'flash-warning', text: "Post Unavailable !" },
                  ]);
            }
            else{
                await req.flash('message', [
                    { type: 'flash-warning', text: "Comment Not Found" },
                  ]);
            }
            // return res.redirect('back');
            return res.status(404).json({redirectUrl: '/user/signUp' })
        }
    }
    const user_type = req.query.type1;
    if(user_type=="User"){
        // var post_User = await User.findById(req.user._id);
        var UserOrHotel = "User"
    }
    else{
        // var post_User = await Hotel.findById(req.user._id);
        var UserOrHotel = "Hotel"
        
    }


    let upvoteInfo = await upVote.findOne({
        votable: req.params.id,
        user : req.user.id,

    });

     

    if(upvoteInfo == null){
        // console.log("ENTERED");
        let newUpVote = await upVote.create({
            votable: req.params.id,
            postORcomment : req.query.type,
            user : req.user.id,
            upVoted:false,
            UserOrHotel:UserOrHotel
        })

        // console.log(newUpVote);

        postORcom.upVotes.push(newUpVote.id);
 
        upvoteInfo = newUpVote;
    }



    if(upvoteInfo.upVoted == true){
        upvoteInfo.upVoted = false;
        postORcom.upVotesCount--;
    }else{
        upvoteInfo.upVoted = true;
        postORcom.upVotesCount++;
    }

    upvoteInfo.save();

    postORcom.save();

    if(req.xhr){
        return res.status(200).json({
            data:{
                upVote : upvoteInfo,
                count:postORcom.upVotesCount
            }
        })
    }


    return res.redirect('back');
     
    

}