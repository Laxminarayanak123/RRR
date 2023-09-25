 
$('#hotelSelect').on('change', function() {
    
    let hotelID =  $(this).val();

 

    $.ajax({

        type:'Post',

        url: '/hotel/showMenu',

        data : {hotelID},

        success: (data) => {

            $("#itemSelect").remove();


            let selectDOM = menuMaker(data.data);

            $("#addMenuInput").append(selectDOM);

        }

    });

  

});


let menuMaker = (data) => {

    return (`
        <div id="itemSelect"> 
            <div  class="formText">
                <label class="labels">Menu :</label>
            </div>
            <select   name="menuItem" class="select" required>
            
                <option disabled selected>-- Please select an Item --</option>

                    ${data.map((obj) => `<option value = "${obj._id}"> ${obj.name}</li>`).join("")}

            </select>
        </div>
        
    `)

}