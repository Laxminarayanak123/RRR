 
 
// for follow 
async function follow(value){
    console.log("clicked");
    await $.get(`/user/follow/${value}`,(data)=>{
        console.log(data);
        document.getElementById('fbutton').innerHTML=data.followBtn;
        // followers and unfollow changes 
        document.getElementById('followers').innerHTML=data.followers.length;
        document.getElementById('following').innerHTML=data.following.length;

    })
}


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

// for user edit
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

