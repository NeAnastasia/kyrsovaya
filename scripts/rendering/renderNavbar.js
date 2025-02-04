import { isLoggedIn } from "../utils/helpers.js";

export const renderNavbar = () => {
  const isLogged = isLoggedIn();
  const navlinks = document.querySelector(".navbar-menu");

  if (isLogged) {
    navlinks.innerHTML = `
        <li><a href="#diagrams">Диаграммы</a></li>
        <li><a href="#logout">Выход</a></li>`;
  } else {
    navlinks.innerHTML = `
        <li><a href="#login">Вход</a></li>
        <li><a href="#register">Регистрация</a></li>`;
  }
}
