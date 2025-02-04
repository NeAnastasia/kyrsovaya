import {
  sendLogInInfo,
  sendRegistrationInfo,
} from "../../api/http/authenticationApiRequests.js";

export class Authentication {
  static #instance;

  constructor() {
    if (Authentication.#instance) {
      throw new Error(
        "Use Authentication.getInstance() to get the singleton instance."
      );
    }
    Authentication.#instance = this;
    this.isLogin = false;
    this.errorMessage = "";
  }

  static getInstance() {
    if (!Authentication.#instance) {
      Authentication.#instance = new Authentication();
    }
    return Authentication.#instance;
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

    this.authForm.addEventListener("submit", this.handleSubmit.bind(this));
    this.toggleForm.addEventListener("click", this.handleToggleForm.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    this.errorMessage.textContent = "";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (this.isLogin) {
      sendLogInInfo(username, password);
    } else {
      sendRegistrationInfo(username, password);
    }
  }

  handleToggleForm(event) {
    navigate(event);
    this.isLoginSet(!this.isLogin);
  }
}
