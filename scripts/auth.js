import { BaseAuthURL } from "./consts/baseUrl.js";
import { Navbar } from "./navbar.js";
import { navigate } from "./router.js";

export class Authentication {
  static singleton = new Authentication();
  constructor() {
    this.isLogin = false;
    this.errorMessage = "";
  }

  isLoginSet(isLogin) {
    this.isLogin = isLogin;
    this.takeElements();
  }

  takeElements() {
    this.formContainer = document.getElementById("formContainer");
    this.formTitle = document.getElementById("formTitle");
    this.authForm = document.getElementById("authForm");
    this.errorMessage = document.getElementById("errorMessage");
    this.toggleForm = document.getElementById("toggleForm");

    this.authForm.addEventListener("submit", (event) => {
      event.preventDefault();
      errorMessage.textContent = "";

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (this.isLogin) {
        this.sendLogInInfo(username, password);
      } else {
        this.sendRegistrationInfo(username, password);
      }
    });

    this.toggleForm.addEventListener("click", (e) => {
      navigate(e);
      this.isLoginSet();
    });
  }

  sendRegistrationInfo(username, password) {
    $.ajax({
      url: BaseAuthURL + "/register",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: username,
        password: password,
      }),
      success: () => {
        this.sendLogInInfo(username, password);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        this.errorMessage.innerHTML = "Не удалось зарегистрироваться";
        console.error("Reg failed:", textStatus, errorThrown);
      },
    });
  }

  sendLogInInfo(username, password) {
    $.ajax({
      url: BaseAuthURL + "/login",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: username,
        password: password,
      }),
      success: (response) => {
        localStorage.setItem("token", response.token);
        console.log("Login successful:", response);
        Navbar.singleton.login();
        window.location.hash = "#diagrams";
      },
      error: (jqXHR, textStatus, errorThrown) => {
        this.errorMessage.textContent =
          "Не удалось совершить вход. Неверные юзернейм или пароль";
        console.error("Login failed:", textStatus, errorThrown);
      },
    });
  }
}
