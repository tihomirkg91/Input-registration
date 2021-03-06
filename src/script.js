const selectedEmailBtn = document.querySelector(".navbar__option-email");
const selectedMobileBtn = document.querySelector(".navbar__option-mobile");
const inputEmail = document.querySelector(".form-body__input--email");
const inputMobile = document.querySelector(".form-body__input--mobile");
const emailLabel = document.querySelector(".label-active__email");
const mobileLabel = document.querySelector(".label-active__phone");
const emailPositionBtn = document.querySelector("#navbar__radio-one");
const form = document.getElementById("form");
const errorMessage = document.querySelector(".render__error-msg");
const successfulMessage = document.querySelector(".render__successful-msg");
const backgroundBlur = document.querySelector(".form__blur");
const spinner = document.querySelector(".form__spinner");
////////////////////////////////////////////////////////
//Messeges
const serverErrorMsg = "Server is not responding! Try again latter";
const emailErrorMsg = "Please enter a valid e-mail address";
const phoneErrorMsg = "Please enter a valid phone number";
const termsServiceMsg = "Please accept Terms of Service";
const accountCreateMsg = "Your account is successfully created";

//Functions
const renderFormInput = function () {
   if (selectedEmailBtn.checked === true) {
      inputEmail.style.display = "block";
      inputMobile.style.display = "none";
   } else {
      inputEmail.style.display = "none";
      inputMobile.style.display = "block";
   }
};

const renderDefaultLabel = function () {
   emailPositionBtn.checked = true;
   inputEmail.style.display = "block";
   inputMobile.style.display = "none";
};

[selectedEmailBtn, selectedMobileBtn].forEach((option) =>
   option.addEventListener("click", () => {
      renderFormInput();
   })
);

const clearMessages = function () {
   form.reset();
   renderDefaultLabel();
   setTimeout(() => {
      successfulMessage.innerHTML = "";
      errorMessage.innerHTML = "";
   }, 3000);
};

const renderError = function (msg) {
   setTimeout(() => {
      clearMessages();
      errorMessage.innerHTML = msg;
   }, 500);
};

const renderSuccessfulMsg = function (msg) {
   setTimeout(() => {
      clearMessages();
      successfulMessage.innerHTML = msg;
   }, 500);
};

const renderSpinner = function () {
   backgroundBlur.classList.toggle("form__blur--hidden");
   spinner.classList.toggle("form__spinner--hidden");
};

// Render Errors for user
const checkRenderOnUserInput = function (data, response) {
   const dataObj = Object.fromEntries(data);
   const { emailOrNumber, email, tel, termsAndConditions } = dataObj;

   try {
      if (emailOrNumber === "email") {
         if (
            email.indexOf("@", 0) < 0 ||
            email.indexOf(".", 0) < 0 ||
            email === ""
         )
            throw Error(emailErrorMsg);
      }
      if (emailOrNumber === "number") {
         if (tel === "" || isNaN(tel)) {
            throw Error(phoneErrorMsg);
         }
      }
      if (termsAndConditions !== "on") {
         throw Error(termsServiceMsg);
      }
      if (response.ok === false) throw Error(serverErrorMsg);
   } catch (err) {
      renderError(err);
      return;
   }
   renderSuccessfulMsg(accountCreateMsg);
};

const AJAX = async function (data) {
   try {
      const response = await fetch("https://formspree.io/f/xjvjakog", {
         method: "POST",
         body: data,
         headers: {
            Accept: "application/json",
         },
      });
      checkRenderOnUserInput(data, response);
   } catch (err) {
      console.error(err);
   }
};

// Form submit
const handleSubmit = function (event) {
   event.preventDefault();
   renderSpinner();
   setTimeout(() => {
      renderSpinner();
   }, 1000);
   const data = new FormData(event.target);
   AJAX(data);
};
form.addEventListener("submit", handleSubmit);
