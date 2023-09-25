class ToggleClass{

    constructor(id){

        this.id = id;
        this.toggleButton = $(`.flexSwitchCheckChecked-${this.id}`);

        let self = this;

        this.toggleButton.on('switchChange.bootstrapSwitch', function(event, state) {
            
            event.preventDefault();

            self.ajaxCall(state,self.id);

        });

    }

    
    ajaxCall(state,id){

        let self = this;

        $.ajax({

            type:'Post',

            url : '/hotel/toggleAvailability/',

            data : {state,id},

            success: (data) => {
                console.log(data);
            },
            error : (err) => {
                console.log(err);
            }

        })

    }

}