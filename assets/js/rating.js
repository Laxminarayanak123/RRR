class ratingClass {

    constructor(id,userID){

        this.id = id;
        this.form = $(`#rating-${this.id}`);
        this.ajaxFunction();
        this.userID = userID;
        this.prevAverageWrap = $(`#average-${this.id}`);
        this.prevAverageContainer = $(`#span-${this.id}`);
        this.rated = false;
        this.button = $(`#button-${this.id}`);
        this.formWrap = $(`#formWrap-${this.id}`);
        this.rateAgainButton = $(`#press-${this.id}`);
        this.prevRatingWrap = $(`#givenRating-${this.id}`);
        this.averageRatingElement = $(`#avgRating-${this.id}`)
             
        let altThis = this;

        this.rateAgainButton.on('click',function(){
            altThis.rated=false;
            altThis.rateAgainButton.remove();
            altThis .buttonHandler();
            let ratingForm = altThis.addFormAndButtonBack();
            altThis.formWrap.html(ratingForm);
            new ratingClass(altThis.id,altThis.userID);
            altThis.destruct();
        });


         

    }

    destruct(){
        this.rateAgainButton.off('click');
    }

    ajaxFunction(){

        let self = this;

        this.form.on('submit',function(e){

            let ratingValue = self.form.find(`input[name="stars"]:checked`).val();

            if (!ratingValue){
                ratingValue = 0;
            }

            let idData = self.id;

            let ratingUser = self.userID;

            e.preventDefault();
            
            $.ajax({

                type:'Post',
    
                url:self.form.attr('action'),

                data : {ratingValue,idData,ratingUser},

                success: (data) => {

                    if(self.rated == false){
                        let newAverage = self.averageMakerAndFormRemover(data);
                        self.prevAverageWrap.html(newAverage);
                        console.log("2")
                        console.log(self.rateAgainButton);
                        self.form.remove();
                        console.log("3")
                        console.log(self.rateAgainButton);
                        self.button.remove();
                        console.log("4")
                        console.log(self.rateAgainButton);
                        self.prevRatingWrap.remove();
                        self.addAverageRating(data)
                        console.log("5")
                    
                        console.log(self.rateAgainButton);
                        console.log("6")
                        console.log(self.rateAgainButton);
                        self.buttonHandler();
                        self.rated = true;
                    } 

                }

            });


        }); 
        
    }

    averageMakerAndFormRemover(data){

        console.log("1");


        this.prevAverageContainer.remove();

        console.log(this.rateAgainButton);


        return(`

        <div id="givenRating-${this.id}" style="
            display: flex;
            justify-content: space-between;
            width: 100%;
            text-align: center;
         ">

            <div style="
                display: flex;
                align-items: center;
                width: 100%;
                margin-top: 5px;
                ">

                ${data.rating == 1 ? 
                    `<span style="width: 100%;">you have rated 1 star for this item</span>` :
                    `<span style="width: 100%;">you have rated ${data.rating} stars for this item</span>`
                }

            </div>
           

        </div>

    `)

     

}

    buttonHandler(){
        
        console.log("7")

        console.log(this.rateAgainButton);

        console.log(this.rated);

        if(this.rated == false){
            console.log("triggered")
           
            this.rateAgainButton.attr('hidden',false);
        }else{
            this.rateAgainButton.attr('hidden',true);
        }

        console.log(this.rateAgainButton);

    }

    addAverageRating(data){

        this.averageRatingElement.html(
            `<span id="span-${this.id}" style="font-size: 2.5rem;">
                            ★ ${data.average}
            </span>`
        )

    }

    addFormAndButtonBack(){

        return(`
                    <div class="ratingStars">

                        <form class="rating" id="rating-${this.id}"  method="POST" action="/hotel/addRating/${this.id}" style="margin-bottom: 0px;">

                            <label>
                            <input type="radio" name="stars" value="1" />
                            <span class="icon">★</span>
                            </label>
                            <label>
                            <input type="radio" name="stars" value="2" />
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            </label>
                            <label>
                            <input type="radio" name="stars" value="3" />
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            <span class="icon">★</span>   
                            </label>
                            <label>
                            <input type="radio" name="stars" value="4" />
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            </label>
                            <label>
                            <input type="radio" name="stars" value="5" />
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            <span class="icon">★</span>
                            </label>

                        </form>

                        <div style="display: flex; height: 50%; align-self: center;">
                            <button form="rating-${this.id}" id="button-${this.id}" style="height:30%; background-color:transparent; border: none; color: #fd7e14;">
                                <i class="fa-solid fa-paper-plane" style="font-size: 2rem;"></i>
                            </button>
                        </div>

                    </div>



                    

                    <div style="text-align: center;">
                        <button id="press-${this.id}" hidden class="animated-button8" style="padding: 0.5rem;">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span> 
                            Rate Again
                        </button>
                    </div>



        `)

    }


}