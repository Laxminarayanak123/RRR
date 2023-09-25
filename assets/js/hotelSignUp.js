var passwordInput = document.getElementById("password");
var confirmPasswordInput = document.getElementById("confirmPassword");
var errorText = document.getElementById("errorText");
var submitButton = document.getElementById("submitButton");

confirmPasswordInput.addEventListener("input", validatePasswords);
passwordInput.addEventListener("input", validatePasswords);

function validatePasswords() {
  var password = passwordInput.value;
  var confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    errorText.textContent = "Passwords do not match!";
    submitButton.disabled = true;
  } else {
    errorText.textContent = "";
    submitButton.disabled = false;
  }
}



// eye button toggle for password shoing and hiding
  var passwordInput = document.getElementById("password");
  var togglePasswordIcon = document.querySelector(".toggle-password");

  togglePasswordIcon.addEventListener("click", function() {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordIcon.classList.remove("fa-eye-slash");
      togglePasswordIcon.classList.add("fa-eye");
    } else {
      passwordInput.type = "password";
      togglePasswordIcon.classList.remove("fa-eye");
      togglePasswordIcon.classList.add("fa-eye-slash");
    }
  });


  var passwordInput1 = document.getElementById("confirmPassword");
  var togglePasswordIcon1 = document.querySelector(".toggle-password-confirm");

  togglePasswordIcon1.addEventListener("click", function() {
    if (passwordInput1.type === "password") {
      passwordInput1.type = "text";
      togglePasswordIcon1.classList.remove("fa-eye-slash");
      togglePasswordIcon1.classList.add("fa-eye");
    } else {
      passwordInput1.type = "password";
      togglePasswordIcon1.classList.remove("fa-eye");
      togglePasswordIcon1.classList.add("fa-eye-slash");
    }
  });

   // ajax request for otp
   $('#originalForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Serialize the form data
    const formData = $(this).serialize();

    $.ajax({
        url: '/hotel/sendOtpVerification',
        type: 'POST',
        data: formData,
        success: function(data) {
            // console.log(response);
            // console.log(data);
            if(data.change){
              $('#originalForm')[0].style.display='none';
              $('#otpVersion')[0].style.display='flex';
            }
            if (data.redirectUrl) {
              // Perform the redirect on the client-side
              window.location.href = data.redirectUrl;
            }
        },
        error: function(xhr, status, error) {
            console.error("Error:", status, error);
        }
    });

  })
  // processing otp
  $('#otpVersion').submit(function(event) {
    event.preventDefault();

    // const otpData = $(this).serialize();

    // const otpData =  document.getElementById('otpValueInForm').value;
    // console.log(otpData);
    const values = Array.from(inputs)
                  .map((input) => input.value)
                  .filter((value) => value !== '');
    const combinedValue = values.join('').slice(0, 4);
    const otpData = combinedValue;

    var formData = $('#originalForm').serialize();

    var errorTextAjax = document.getElementById("errorTextAjax");

    formData=formData+'&otp='+otpData;
    $.ajax({
        url: '/hotel/create',
        type: 'POST',
        data: formData,
        success: function(data) {
            // console.log(response);
            // console.log(data);
            if (data.redirectUrl) {
              // Perform the redirect on the client-side
              window.location.href = data.redirectUrl;
            }
            if(data.msg){
              errorTextAjax.textContent=data.msg;
            }
        },
        error: function(xhr, status, error) {
            console.error("Error:", status, error);
        }
    });
  })
  //for otpform
  const inputs =  document.querySelectorAll('.inputsOtp'),
      button = document.getElementById('otpButton');

      // iterate over all inputs
      inputs.forEach((input, index1) => {
        input.addEventListener("keyup", (e) => {
          // console.log('running');
          // This code gets the current input element and stores it in the currentInput variable
          // This code gets the next sibling element of the current input element and stores it in the nextInput variable
          // This code gets the previous sibling element of the current input element and stores it in the prevInput variable
          const currentInput = input,
            nextInput = input.nextElementSibling,
            prevInput = input.previousElementSibling;

          // if the value has more than one character then clear it
          if (currentInput.value.length > 1) {
            currentInput.value = "";
            return;
          }
          // if the next input is disabled and the current value is not empty
          //  enable the next input and focus on it
          if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
            nextInput.removeAttribute("disabled");
            nextInput.focus();
          }

          // if the backspace key is pressed
          if (e.key === "Backspace") {
            // iterate over all inputs again
            inputs.forEach((input, index2) => {
              // if the index1 of the current input is less than or equal to the index2 of the input in the outer loop
              // and the previous element exists, set the disabled attribute on the input and focus on the previous element
              if (index1 <= index2 && prevInput) {
                input.setAttribute("disabled", true);
                input.value = "";
                prevInput.focus();
              }
            });
          }
          //if the fourth input( which index number is 3) is not empty and has not disable attribute then
          //add active class if not then remove the active class.
          if (!inputs[3].disabled && inputs[3].value !== "") {
            button.classList.add("active");
            return;
          }
          button.classList.remove("active");
        });
      });

      //focus the first input which index is 0 on window load
      window.addEventListener("load", () => inputs[0].focus());