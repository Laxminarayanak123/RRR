const comment = require("../model/comment");

const post = require("../model/postModel");

const upVote = require("../model/upVote");

module.exports.commentController = async function(req,res){

    const user_type = req.query.type;
    console.log(user_type);
    if(user_type=="User"){
        var UserOrHotel = "User"
    }
    else{
        var UserOrHotel = "Hotel"
        
    }

    let commentData = await comment.create({
        user:req.user.id,
        content:req.body.content,
        upVotesCount:0,
        UserOrHotel:UserOrHotel
    });

    let upvote = await upVote.create({
        votable: commentData.id,
        postORcomment:"Comment",
        user : req.user.id,
        upVoted:false,
        UserOrHotel:UserOrHotel

    });

    let postData = await post.findById(req.body.post_id);

    await commentData.upVotes.push(upvote.id);

    await commentData.save();

    await postData.comments.push(commentData.id);

    await postData.save();


    // judging picture type
    // const typeOfCommenter=req.user.UserOrHote

    var picture = req.user.avatar;
    
    
    var picturePath="";

    if(picture){

        if(user_type == "User"){
            picturePath = `${picture}`;
        }
        else{
            picturePath = `${picture}`;
    
        }
    }

    else{
        picturePath = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }


    // console.log(picturePath);
    await req.flash('message', [
        { type: 'flash-success', text: 'Comment Added' },
      ]);

    if(req.xhr){
        
        return res.status(200).json({
            data:{
                comment:commentData,
                userName : req.user.name,
                userId : req.user.id,
                commentID:commentData.id,
                typeOfCommenter:user_type,
                picturePath:picturePath,
                commentUpVoteCount:commentData.upVotesCount,
                countOfComments:postData.comments.length,
                message: await req.flash('message')
            }
            
        })

    }     
    return res.redirect('back');
    
}

module.exports.deleteComment = async function(req,res){

    // console.log("hello",req.body.cID,req.body.pID);


    if(req.xhr){
        console.log("xhr");

        let commentData = await comment.findById(req.body.cID)
        .populate({
            path:'user',
            select:'id'
        });;


        if(!commentData){

            return res.status(401).json({
                deleted:false
            })

        }

        if(req.user.id == commentData.user.id || req.user.isAdmin){

            let postData = await post.findById(req.body.pID);
        
            let commentUpvotes = commentData.upVotes;
        
            commentUpvotes.map(async data => {
         
                await upVote.findByIdAndDelete(data.toString());
        
            });
        
            await postData.comments.pull(commentData.id);
        
            await postData.save();
        
            await commentData.remove();
    
            await req.flash('message', [
                { type: 'flash-warning', text: 'Comment Deleted !' },
              ]);
        
            return res.status(200).json({
                deleted:true,
                countOfComments:postData.comments.length,
                postId:postData.id,
                message: await req.flash('message')
            })
        }
        else{
            await req.flash('message', [
                { type: 'flash-warning', text: "Can't delete" },
              ]);
        
            return res.status(200).json({
                message: await req.flash('message')
            })
        }

    }

    

}
