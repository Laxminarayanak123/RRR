 

class deleteComment{

    constructor(id){

        this.id = id;
        console.log("commentID",this.id);
        this.deleteForm = $(`#commentDelete-${this.id}`);
        this.deleteComment();
        this.liWrap = $(`#commentArea-${this.id}`);
        console.log(this.liWrap);
        // console.log(this.id,"=====================",id)

    }


    deleteComment(){

        let self = this;
        
        this.deleteForm.on('submit',function(e){

            e.preventDefault();

            

            let callSelf = this;
            

            $.ajax({

                url:self.deleteForm.attr("action"),

                type:'Post',

                data : $(callSelf).serialize(),

                success: (data) => {

                    self.removeDOM(data.deleted);

                    // console.log(data.countOfComments);
                    // console.log(data.postId);

                    let commentCount =document.getElementById(`ajaxCommentsCount-${data.postId}`);
                    commentCount.innerHTML = data.countOfComments + " comments";


                    if (data.message !== '') {
                        var flashMessage = $('<div>', {
                          class: 'flash ' + data.message[0].type + ' fade'
                        }).appendTo('body');
                  
                        $('<p>').text(data.message[0].text).appendTo(flashMessage);
                  
                        setTimeout(function() {
                          flashMessage.fadeOut(function() {
                            $(this).remove();
                          });
                        }, 4000);
                      }
                },
                error: (err) => {

                    console.log(err);
                    window.location.reload(); 
                }

            });


        })

         
    }

    removeDOM(data){

        if(data == true){

            console.log("YES",this.liWrap);
            this.liWrap.remove();
        }
        
    }



}