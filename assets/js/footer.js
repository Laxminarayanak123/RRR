// for list of users
const openPopupButton55 =document.getElementById("open-popup5-footer");
const closePopupButton55 = document.getElementById("close-popup5");
const popupContainer55 = document.getElementById("popup-container5");
const onlyForm55 = document.getElementById('popup-form5');

// console.log(openPopupButton55,"----");
openPopupButton55.addEventListener('click',()=>{
        popupContainer55.style.display = 'flex';

        popupContainer55.addEventListener('click',event=>{
                if(!onlyForm55.contains(event.target)){
                    // console.log("new test");
                    popupContainer55.style.display = "none";
                }
            })
    })

closePopupButton55.addEventListener("click", () => {
popupContainer55.style.display = "none";
});


// for list of hotels
const openPopupButton66 =document.getElementById("open-popup6-footer");
const closePopupButton66 = document.getElementById("close-popup6");
const popupContainer66 = document.getElementById("popup-container6");
const onlyForm66 = document.getElementById('popup-form6');

// console.log(openPopupButton66,"----");
openPopupButton66.addEventListener('click',()=>{
        popupContainer66.style.display = 'flex';

        popupContainer66.addEventListener('click',event=>{
                if(!onlyForm66.contains(event.target)){
                    // console.log("new test");
                    popupContainer66.style.display = "none";
                }
            })
    })

closePopupButton66.addEventListener("click", () => {
popupContainer66.style.display = "none";
});


//  script for feature/ bug
    // const openPopupButton7 = document.getElementById("open-popup7");
    // const closePopupButton7 = document.getElementById("close-popup7");
    // const popupContainer7 = document.getElementById("popup-container7");

    // const onlyForm7 = document.getElementById('popup-form7');

    // openPopupButton7.addEventListener("click", () => {
    //     popupContainer7.style.display = "flex";

    //     popupContainer7.addEventListener('click',event=>{
    //             if(!onlyForm7.contains(event.target)){
    //                 // console.log("new test");
    //                 popupContainer7.style.display = "none";
    //             }
    //         })
    // });
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