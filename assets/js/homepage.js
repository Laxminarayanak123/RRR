// for cover photo
const openPopupButton4 = document.getElementById("open-popup4");
const closePopupButton4 = document.getElementById("close-popup4");
const popupContainer4 = document.getElementById("popup-container4");
const onlyForm4 = document.getElementById('popup-form4');
openPopupButton4.addEventListener("click", () => {
    popupContainer4.style.display = "flex";

        popupContainer4.addEventListener('click',event=>{
            if(!onlyForm4.contains(event.target)){
                // console.log("new test");
                popupContainer4.style.display = "none";
            }
        })


});
closePopupButton4.addEventListener("click", () => {
popupContainer4.style.display = "none";
});

// for List of users
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


// for List of hotels
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



function runCarousel() {
    const container = document.querySelector('.carousel-container');
    const items = container.querySelectorAll('.carousel-item');
    const prevButton = container.querySelector('.carousel-prev');
    const nextButton = container.querySelector('.carousel-next');
    const itemCount = items.length;
    let currentIndex = 0;
    let intervalId = null;

    function showItem(index) {
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
    }

    function showPrevItem() {
        clearInterval(intervalId);
        currentIndex = (currentIndex - 1 + itemCount) % itemCount;
        showItem(currentIndex);
        intervalId = setInterval(showNextItem, 5000);
    }

    function showNextItem() {
        clearInterval(intervalId);
        currentIndex = (currentIndex + 1) % itemCount;
        showItem(currentIndex);
        intervalId = setInterval(showNextItem, 5000);
    }

    prevButton.addEventListener('click', showPrevItem);
    nextButton.addEventListener('click', showNextItem);

    intervalId = setInterval(showNextItem, 5000);
    }

    runCarousel();



// 


// let popupActive =false;
//     function runCarousel() {
//         const container = document.querySelector('.carousel-container');
//         const items = container.querySelectorAll('.carousel-item');
//         const prevButton = container.querySelector('.carousel-prev');
//         const nextButton = container.querySelector('.carousel-next');
//         const itemCount = items.length;
//         let currentIndex = 0;
//         let intervalId = null;

//         function showItem(index) {
//             items.forEach(item => item.classList.remove('active'));
//             items[index].classList.add('active');
//         }

//         function showPrevItem() {
//             clearInterval(intervalId);
//             currentIndex = (currentIndex - 1 + itemCount) % itemCount;
//             showItem(currentIndex);
//             if (!popupActive) {
//             intervalId = setInterval(showNextItem, 3000);
//             }
//         }

//         function showNextItem() {
//             clearInterval(intervalId);
//             currentIndex = (currentIndex + 1) % itemCount;
//             showItem(currentIndex);
//             if (!popupActive) {
//             intervalId = setInterval(showNextItem, 3000);
//             }
//         }

//         prevButton.addEventListener('click', showPrevItem);
//         nextButton.addEventListener('click', showNextItem);

//         if (!popupActive) {
//             intervalId = setInterval(showNextItem, 3000);
//         }
//     }

//         let intervalId = null;

//         function stopCarousel() {
//         clearInterval(intervalId);
//         return;
//         }

//         function startCarousel() {
//         runCarousel();
//         return;
//         }

// // Show popup when clicking a button
// const button = document.querySelector('#usersModalId');
// button.addEventListener('click', async() => {
//   popupActive = true;
//   // Stop carousel animation
//   await stopCarousel();
//   // Show popup
//   $('#usersModal').modal('show');
// });

// // Hide popup when closing it
// const modal = document.querySelector('#usersModal');
// modal.addEventListener('hidden.bs.modal', () => {
//   popupActive = false;
//   // Start carousel animation
//   startCarousel();
// });

// const usersClose = document.getElementById('usersClose');
// usersClose.addEventListener('click',()=>{
//     popupActive = false;
//     $('#usersModal').modal('hide');

//     startCarousel();
// })

// // Start carousel animation on page load
// startCarousel();