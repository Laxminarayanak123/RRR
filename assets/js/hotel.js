async function followHotel(value){
    await $.get(`/hotel/follow/${value}`,(data)=>{
        document.getElementById('fbutton').innerHTML=data.followBtn;
        document.getElementById('followers').innerHTML=data.followers.length;
        document.getElementById('following').innerHTML=data.following.length;
    });
}





    // for colours
    
    function updateColor() {
        var select = document.getElementById("typeSelect");
        var input = document.getElementById("colorInput");
        var colors = JSON.parse('<%- JSON.stringify(HotelProfile.colors) %>');
      //   console.log(colors);
        var index = select.value;
        if (colors[index]) {
          // console.log(colors[index]);
          input.value = colors[index];
        } else {
          input.value = "#000000"; // default to black if no color is defined
        }
      }


      const openPopupButton = document.getElementById("open-popup");
      const closePopupButton = document.getElementById("close-popup");
      const popupContainer = document.getElementById("popup-container");
  
      const onlyForm = document.getElementById('popup-form');

      openPopupButton.addEventListener("click", () => {
          popupContainer.style.display = "flex";

          popupContainer.addEventListener('click',event=>{
                  if(!onlyForm.contains(event.target)){
                      // console.log("new test");
                      popupContainer.style.display = "none";
                  }
              })
      });

      closePopupButton.addEventListener("click", () => {
      popupContainer.style.display = "none";
      });
  
      // collage script
      const openPopupButton1 = document.getElementById("open-popup1");
      const closePopupButton1 = document.getElementById("close-popup1");
      const popupContainer1 = document.getElementById("popup-container1");
  
      const onlyForm1 = document.getElementById('popup-form1');

      openPopupButton1.addEventListener("click", () => {
          popupContainer1.style.display = "flex";

          popupContainer1.addEventListener('click',event=>{
                  if(!onlyForm1.contains(event.target)){
                      // console.log("new test");
                      popupContainer1.style.display = "none";
                  }
              })
      });
  
      closePopupButton1.addEventListener("click", () => {
      popupContainer1.style.display = "none";
      });

      // for menu form
      const openPopupButton2 = document.getElementById("open-popup2");
      const closePopupButton2 = document.getElementById("close-popup2");
      const popupContainer2 = document.getElementById("popup-container2");
  
      const onlyForm2 = document.getElementById('popup-form2');

      openPopupButton2.addEventListener("click", () => {
          popupContainer2.style.display = "flex";

          popupContainer2.addEventListener('click',event=>{
                  if(!onlyForm2.contains(event.target)){
                      // console.log("new test");
                      popupContainer2.style.display = "none";
                  }
              })
      });
  
      closePopupButton2.addEventListener("click", () => {
      popupContainer2.style.display = "none";
      });

      // for cover photo
      const openPopupButton3 = document.getElementById("open-popup3");
      const closePopupButton3 = document.getElementById("close-popup3");
      const popupContainer3 = document.getElementById("popup-container3");
      const onlyForm3 = document.getElementById('popup-form3');

      openPopupButton3.addEventListener("click", () => {
          popupContainer3.style.display = "flex";

          popupContainer3.addEventListener('click',event=>{
                  if(!onlyForm3.contains(event.target)){
                      // console.log("new test");
                      popupContainer3.style.display = "none";
                  }
              })
      });
  
      closePopupButton3.addEventListener("click", () => {
      popupContainer3.style.display = "none";
      });



      const coverFormButton = document.getElementById("cover-form-button");
      const colorFormButton = document.getElementById("color-form-button");
      const coverForm = document.getElementById("cover-form");
      const colorForm = document.getElementById("color-form");

      // Set the cover photo form as the active form
      coverFormButton.classList.add("active");
      colorForm.style.display = "none";

      // Add click event listeners to the form toggle buttons
      coverFormButton.addEventListener("click", () => {
      coverFormButton.classList.add("active");
      colorFormButton.classList.remove("active");
      coverForm.style.display = "block";
      colorForm.style.display = "none";
      });

      colorFormButton.addEventListener("click", () => {
      coverFormButton.classList.remove("active");
      colorFormButton.classList.add("active");
      coverForm.style.display = "none";
      colorForm.style.display = "block";
      });