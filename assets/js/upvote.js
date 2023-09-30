
class upVoteClass {

    constructor(type,id){

     

        this.type = type;
        this.id = id;

   

        if(this.type == "post"){
            this.postORCommentForm = $(`#postUpVoteForm-${this.id}`);
        }
        else{
            this.postORCommentForm = $(`#commentUpVoteForm-${this.id}`);
        }

    

        this.upVoteContainer = $(`#${this.type}Container-${this.id}`);

        this.upVoteModifier();
 

    }

    upVoteModifier(){

        // console.log("ajax Function");
        let ajaxCall = null;

       

        if(this.type == 'comment'){
            ajaxCall = $(`#commentUpVoteForm-${this.id}`);
        }else{
            ajaxCall =  $(`#postUpVoteForm-${this.id}`);
        }
        console.log(`#commentUpVoteForm-${this.id}`);
        
        ajaxCall.on("submit",(e)=>{

          

            e.preventDefault();

            

            $.ajax({
                method:'Post',
                url:this.postORCommentForm.attr('action'),
                data:this.postORCommentForm.serialize(),
                success:(data)=>{  

                    
                    let upVoteDOMtemplate = this.upVoteDomMaker(data.data.upVote.upVoted,this.type,data.data.count);
                     
                    $(`#${this.type}Container-${this.id}`).remove();
                    this.postORCommentForm.append(upVoteDOMtemplate);

                },
                error:(data)=>{
                    // console.log(data.redirectUrl);
                    // window.location.href = data.redirectUrl;
                    window.location.reload(); 
                }
            })


        });

    }

    upVoteDomMaker(upVoteBool,type,count){

        if(upVoteBool){
            return(`

                <div class="d-flex flex-row  d-flex align-items-center" id="${type}Container-${this.id}">

                    <button style="border: none; background-color: transparent; color: red;"><i class="fa-regular fa-circle-up"></i></button>
                    <span class="likesCount">
                        ${count}
                    </span>
    
                </div>
                
            `)
        }else{
            return(`

                <div class="d-flex flex-row  d-flex align-items-center" id="${type}Container-${this.id}">
                    <button style="border: none; background-color: transparent; color:white;" ><i class="fa-regular fa-circle-up"></i></button>
                    <span class="likesCount">
                        ${count}
                    </span>
                </div>
                
            `)

        }


    }


}