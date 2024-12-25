import { BaseAuthURL } from "./consts/baseUrl.js";

export class Authentication {
  constructor() {
    this.takeElements();
    this.isLogin = false;
  }

  isLoginSwitch() {
    this.isLogin = !this.isLogin;
    this.takeElements();
  }

  takeElements() {
    this.formContainer = document.getElementById("formContainer");
    this.formTitle = document.getElementById("formTitle");
    this.authForm = document.getElementById("authForm");
    this.errorMessage = document.getElementById("errorMessage");
    this.toggleForm = document.getElementById("toggleForm");

    console.log(this.formContainer, this.formTitle, this.authForm, this.errorMessage, this.toggleForm);
    
    authForm.addEventListener("submit", (event) => {
      console.log("mlemььь");
      event.preventDefault();
      errorMessage.textContent = "";
      console.log("mlem");

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (this.isLogin) {
        this.#sendLogInInfo(username, password);
      } else {
        this.#sendRegistrationInfo(username, password);
      }
    });
  }

  #sendRegistrationInfo(username, password) {
    $.ajax({
      url: BaseAuthURL + "/register", 
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
          username: username,
          password: password
      }),
      success: function(response) {
          // Обработка успешного ответа
          console.log('Reg successful:', response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // Обработка ошибок
          console.error('Reg failed:', textStatus, errorThrown);
      }
  });
  }

  #sendLogInInfo(username, password) {
    $.ajax({
      url: BaseAuthURL + "/login", 
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
          username: username,
          password: password
      }),
      success: function(response) {
          // Обработка успешного ответа
          console.log('Login successful:', response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          // Обработка ошибок
          console.error('Login failed:', textStatus, errorThrown);
      }
  });
  }
}
