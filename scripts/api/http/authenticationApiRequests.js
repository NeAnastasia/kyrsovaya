import { BaseAuthURL } from "../../consts/baseUrl.js";
import { renderNavbar } from "../../rendering/renderNavbar.js";

export const sendRegistrationInfo = (username, password) => {
  const errorMessage = document.getElementById("errorMessage");
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
      errorMessage.innerHTML = "Не удалось зарегистрироваться";
      console.error("Reg failed:", textStatus, errorThrown);
    },
  });
};

export const sendLogInInfo = (username, password) => {
  const errorMessage = document.getElementById("errorMessage");
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
      renderNavbar();
      window.location.hash = "#diagrams";
    },
    error: (jqXHR, textStatus, errorThrown) => {
      errorMessage.textContent =
        "Не удалось совершить вход. Неверные юзернейм или пароль";
      console.error("Login failed:", textStatus, errorThrown);
    },
  });
};
