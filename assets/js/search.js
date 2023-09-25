$(document).on('DOMContentLoaded',function(){

    $('#search-input').on('input', function(){
        let sr = document.getElementById('search-results');
        sr.style.display = 'flex';
        search();
    });
    $('#search-input').on('focus', function(){
        let sr = document.getElementById('search-results');
        sr.style.display = 'flex';
        search();
    });

    $("#search-form").on('submit',function(e){
        e.preventDefault();
        let sr = document.getElementById('search-results');
        sr.style.display = 'flex';
        search();
        $('#search-input').html("");
    });

    // if i click outside the search bar then results has to be disappear
    document.addEventListener('click', (event) => {
        let sf = document.getElementById('search-form');
        let sr = document.getElementById('search-results');
        if (!sf.contains(event.target) && !sr.contains(event.target)) {
            sr.style.display = 'none';
            // console.log("test");
        }
    });
    function search() {
        let name = $('#search-input').val();
        $.ajax({
            url: '/search',
            method: 'Post',
            data: { name: name },
            success: function(results) {

                $('#search-results').empty();
         
                if(name.length == 0){
                    // let li = $('<li>').text('Type a User or Restaurant Name');
                    // li.addClass('list-group-item');
                    // $('#search-results').append(li);
                }
                else if (results && (results.Users.length > 0 || results.Hotels.length)) {
                    
                    results.Users.forEach(function(result){
                        
                        let aTag = $('<a>');
                        aTag.attr("href",`/user/profile/${result._id}/`);
                        aTag.text(`${result.name}`);
                        let li = $('<li>');
                        li.addClass('list-group-item');
                        li.attr('data-id', result._id);
                        li.append(aTag);

                        let elementLi = 
                                `<a style="text-decoration:none" href='/user/profile/${result._id}'>
                                <li class='ListStyle'>
                                        <div>
                                            <img src='${result.avatar}' class="imageInSearch"/>
                                        </div>
                                        <div>
                                            <h6 class="nameInList">${result.name}</h6>
                                        </div>
                                </li>
                                </a> 
                               `
                        $('#search-results').addClass('test');
                        $('#search-results').append(elementLi);
                    });

                    results.Hotels.forEach(function(result) {
                        
                        let aTag = $('<a>');
                        aTag.attr("href",`/hotel/profile/${result._id}/`);
                        aTag.text(`${result.name}`);
                        let li = $('<li>');
                        li.addClass('list-group-item');
                        li.attr('data-id', result._id);
                        li.append(aTag);
                        let elementLi = 
                                `<a style="text-decoration:none" href='/hotel/profile/${result._id}'>
                                <li class='ListStyle'>
                                        <div>
                                            <img src='${result.avatar}' class="imageInSearch"/>
                                        </div>
                                        <div>
                                            <h6 class="nameInList">${result.name}</h6>
                                        </div>
                                </li>
                                </a> 
                               `
                        $('#search-results').append(elementLi);
                    });

                } else {
                    let li = $('<li>').text('No results found.');
                    li.addClass('list-group-item');

                    let elementLi = 
                        `<li class="listStyle">
                        <div>
                            <h6 class="nameInList">No results found.</h6>
                        </div>
                        </li>`
                    $('#search-results').append(elementLi);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    }



    //  document.getElementById('search-input').addEventListener('onKeyPressDown',()=>{
    //     const btn =  document.getElementById('search-btn');
    //     btn.innerText=null;
    //  })

        // const inp = document.getElementById('search-input');
        // inp.onkeydown(()=>{
        //     if($(this).length!=0){
        //         const btn =  document.getElementById('search-btn');
        //     btn.innerHTML='<i class="fa-solid fa-xmark"></i>';
        //     }
        // })

        // const btn =  document.getElementById('search-btn');
        // btn.innerHTML='<i class="fa-solid fa-xmark"></i>';


        
    // document.getElementById('search-input').onkeyup(()=>{
    //     console.log('press')
    //     if($(this).length!=0){
    //         const btn =  document.getElementById('search-btn');
    //         btn.innerHTML='<i class="fa-solid fa-xmark"></i>';
    //     }
    // }) 


    var searchInput = document.getElementById('search-input');

    searchInput.addEventListener('keyup', function(event) {
    var inputValue = event.target.value;
    const btn =  document.getElementById('search-btn');

    if (inputValue.length === 0) {
        btn.innerHTML='<i id="hotelSearchBtn" class="fas fa-search"></i>';
        $('#search-results').removeClass('test');
    } else {
        btn.innerHTML='<i style="color:red;" id="hotelSearchBtn" class="fa-solid fa-xmark"></i>';
    }
    });


    var searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click',()=>{
        var searchInput = document.getElementById('search-input');
        searchInput.value=null       
        $('#search-results').removeClass('test')
        searchBtn.innerHTML='<i id="hotelSearchBtn" class="fas fa-search"></i>';



        // emptying search results

        var searchResults = document.getElementById('search-results');
        searchResults.innerHTML=null;
    })

});







