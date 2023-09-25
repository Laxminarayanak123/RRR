
 
class commentDOMClass {

    constructor(postID){
        
        this.postID = postID;
        this.postCommentForm = $(`#commentForm-${postID}`);
        this.createComment(this.postID);
        this.commentUl = postID;
         

    }
    createComment(postID){

        let self = this;
        $(this.postCommentForm).on("submit",(e)=>{

            e.preventDefault();
            
            // console.log(postID,"-----------------------------");
            
    
            let commentForm = $(".commentFormClass").attr('id');
            
            $.ajax({
                type:'Post',
                url: $('.commentFormClass').attr('action'),
                data: $(self.postCommentForm).serialize(),
                success:(data)=>{

                    let freshComment = this.commentDOM(data.data);
                    
                    $(`#commentUL-${this.postID}`).prepend(freshComment);
                    

                    new deleteComment(data.data.comment._id);

                    // console.log(data.data.countOfComments,"------------------------",this.postID);
                    let commentCount =document.getElementById(`ajaxCommentsCount-${this.postID}`);
                    commentCount.innerHTML = data.data.countOfComments + " comments";

                    if (data.data.message !== '') {
                        var flashMessage = $('<div>', {
                          class: 'flash ' + data.data.message[0].type + ' fade'
                        }).appendTo('body');
                  
                        $('<p>').text(data.data.message[0].text).appendTo(flashMessage);
                  
                        setTimeout(function() {
                          flashMessage.fadeOut(function() {
                            $(this).remove();
                          });
                        }, 4000);
                      }


                    //   var flashmessage = 
                    //     `<div class="flash ${data.data.message[0].type} fade">
                    //         <p>
                    //             ${data.data.message[0].text}
                    //         </p>
                    //     </div>`

                    //     $('body').append(flashmessage);

                  
                    //     setTimeout(function() {
                    //       flashmessage.fadeOut(function() {
                    //         $(this).remove();
                    //       });
                    //     }, 4000);
                    
                },
                error: (err)=>{
                    console.log(err.responseText);
                }
                
            })
            let input11 = document.getElementById(`commentInput-${postID}`);
            input11.value="";
    
        })

    }
     

    commentDOM(data){

        console.log(data.picturePath,"from commentDOM");
        return(`
                <li id="commentArea-${data.commentID}" class="comments commentList">

                
                <div id="commentsDiv">
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <img src="${data.picturePath}" width="30" height="30px" class="rounded-circle">
                            <a class="nameInPost" href="${data.typeOfCommenter}/profile/${data.userId}"> <b> <span class="name">${data.userName}</span> </b> </a>
                        </div>

                        <div> 
                            <div class="dropleft">
                                <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="border: none; background-color: transparent; ">
                                    <i style="color: #fff;" class="fas fa-ellipsis-h"></i>
                                </button>
                                <div class="dropdown-menu" style="background-color: rgb(18,18,18);">
                                    <div class="dropdown-item">
                                        <form action="/posts/comment/delete/" method="post" id="commentDelete-${data.commentID}" style="margin-bottom: 0;">
                    
                                                <input type="hidden" value="${data.commentID}" name="cID">
                            
                                                <input type="hidden" value="${this.postID}" name="pID">
                            
                                                <button style="border: none; background-color: transparent;  color: rgb(175, 40, 40); display: flex; justify-content: space-between; width: 100%; align-items: center;">
                                                    <div>
                                                        Remove
                                                    </div>
                                                    <div>
                                                        <i style="font-size: 18px; font-weight: 100;" class="fas fa-trash-alt"></i>
                                                    </div>    
                                                </button>
                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div class="d-flex flex-column ml-2" style="overflow: hidden;"> 

                            <small  class="comment-text caption">${data.comment.content}</small>
                            <div style="margin-top: 10px;">
                                <form action="/upVote/${data.commentID}/?type=Comment" method="POST" id="commentUpVoteForm-${data.commentID}">
                                                
                                    <div id="commentContainer-${data.commentID}">
                                            
                                            <button style="border: none; background-color: transparent; color:white;"><i class="fa-regular fa-circle-up"></i></button>
                                    
                                        <span class="likesCount">
                                            ${data.commentUpVoteCount}
                                        </span>

                                    </div>
                                
                                </form>
                            </div>
                        </div>
                </div>

    </li>


                <script>
                    new upVoteClass("comment","${data.commentID}");

                </script>
    
    
    
        `)

    }

}