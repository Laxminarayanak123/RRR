// for bugs and features
const openPopupButton5 = document.getElementsByClassName("open-popup5");
const closePopupButton5 = document.getElementById("close-popup5");
const popupContainer5 = document.getElementById("popup-container5");
const onlyForm5 = document.getElementById('popup-form5');

for (var i = 0; i < openPopupButton5.length; i++) {
    openPopupButton5[i].addEventListener("click", () => {
         popupContainer5.style.display = "flex";

        popupContainer5.addEventListener('click',event=>{
            if(!onlyForm5.contains(event.target)){
                popupContainer5.style.display = "none";
            }
        })

    });
}
closePopupButton5.addEventListener("click", () => {
popupContainer5.style.display = "none";
});

 // for districts
 const openPopupButton6 = document.getElementsByClassName("open-popup6");
const closePopupButton6 = document.getElementById("close-popup6");
const popupContainer6 = document.getElementById("popup-container6");
const onlyForm6 = document.getElementById('popup-form6');

for (var i = 0; i < openPopupButton6.length; i++) {
    openPopupButton6[i].addEventListener("click", () => {
         popupContainer6.style.display = "flex";

        popupContainer6.addEventListener('click',event=>{
            if(!onlyForm6.contains(event.target)){
                popupContainer6.style.display = "none";
            }
        })

    });
}
closePopupButton6.addEventListener("click", () => {
popupContainer6.style.display = "none";
});

// for approval
const openPopupButton7 = document.getElementsByClassName("open-popup7");
const closePopupButton7 = document.getElementById("close-popup7");
const popupContainer7 = document.getElementById("popup-container7");
const onlyForm7 = document.getElementById('popup-form7');

for (var i = 0; i < openPopupButton7.length; i++) {
    openPopupButton7[i].addEventListener("click", () => {
         popupContainer7.style.display = "flex";

        popupContainer7.addEventListener('click',event=>{
            if(!onlyForm7.contains(event.target)){
                popupContainer7.style.display = "none";
            }
        })

    });
}
closePopupButton7.addEventListener("click", () => {
popupContainer7.style.display = "none";
});

// for email
const openPopupButton8 = document.getElementsByClassName("open-popup8");
const closePopupButton8 = document.getElementById("close-popup8");
const popupContainer8 = document.getElementById("popup-container8");
const onlyForm8 = document.getElementById('popup-form8');

for (var i = 0; i < openPopupButton8.length; i++) {
    openPopupButton8[i].addEventListener("click", () => {
         popupContainer8.style.display = "flex";

        popupContainer8.addEventListener('click',event=>{
            if(!onlyForm8.contains(event.target)){
                popupContainer8.style.display = "none";
            }
        })

    });
}
closePopupButton8.addEventListener("click", () => {
popupContainer8.style.display = "none";
});


 
const openPopupButton9 = document.getElementsByClassName("open-popup9");
const closePopupButton9 = document.getElementById("close-popup9");
const popupContainer9 = document.getElementById("popup-container9");
const onlyForm9 = document.getElementById('popup-form9');

for (var i = 0; i < openPopupButton9.length; i++) {
    openPopupButton9[i].addEventListener("click", () => {
         popupContainer9.style.display = "flex";

        popupContainer9.addEventListener('click',event=>{
            if(!onlyForm9.contains(event.target)){
                popupContainer9.style.display = "none";
            }
        })

    });
}
closePopupButton9.addEventListener("click", () => {
popupContainer9.style.display = "none";
});