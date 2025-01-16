import { Authentication } from "./auth.js";
import { Diagrams } from "./diagrams.js";
import { View } from "./view.js";
import { ContextMenu, ContextItem } from "./context.js";
import { Navbar } from "./navbar.js";

export function renderPage(isDiagramGot = false) {
  let page = window.location.hash.replace("#", "") || "home"; // Получаем имя страницы

  if (/^diagram\/[a-zA-Z0-9\-]+$/.test(page)) {
    page = "diagram";
    const id = window.location.hash.split("/").pop();
    if(!isDiagramGot) {
      Diagrams.singleton.getDiagram(id);
    }
  } else {
    if (window.contextMenu instanceof ContextMenu) {
      window.contextMenu.destroy();
      window.contextMenu = null; // Обнуляем ссылку на контекстное меню
    }
  }
  let content = $("#content")[0];
  switch (page) {
    case "login":
      content.innerHTML = `<div class="auth-container" id="formContainer">
      <h2 class="main-text" id="formTitle">Login</h2>
      <form id="authForm">
        <div class="error" id="errorMessage"></div>
        <input
          class="auth-input"
          type="text"
          id="username"
          placeholder="Username"
          required
        /><input
          class="auth-input"
          type="password"
          id="password"
          placeholder="Password"
          required
        /><button class="auth-button" type="submit">Login</button>
        <div class="toggle-link" id="toggleForm" href="#register">
          Don\'t have an account? Register
        </div>
      </form>
    </div>`;
      Authentication.singleton.isLoginSet(true);
      break;
    case "register":
      content.innerHTML = `<div class="auth-container" id="formContainer">
      <h2 class="main-text" id="formTitle">Register</h2>
      <form id="authForm">
        <div class="error" id="errorMessage"></div>
        <input
          class="auth-input"
          type="text"
          id="username"
          placeholder="Username"
          required
        /><input
          class="auth-input"
          type="password"
          id="password"
          placeholder="Password"
          required
        /><button class="auth-button" type="submit">Register</button>
        <div class="toggle-link" id="toggleForm" href="#login">
          Already have an account? Login
        </div>
      </form>
    </div>`;
      Authentication.singleton.isLoginSet(false);
      break;
    case "user":
      content.innerHTML =
        "<h1>Contact Page</h1><p>Contact us at example@example.com.</p>";
      break;
    case "diagram":
      content.innerHTML = '<div id="view"><div id="view-area"></div></div>';
      View.singleton.defineElements();
      window.contextMenu = new ContextMenu();
      View.singleton.fromJSON();
      break;
    case "diagrams":
      content.innerHTML = `
    <div id="Diagrams" class="diagrams-container">
    </div>
    <div id="errorMessage" class="error"></div>
      <div class="new-diagrams-container">
        <input type="text" id="textInput" placeholder="Введите название" class="text-input">
        <button id="createButton" class="create-button">Создать</button>
    </div>`;
      Diagrams.singleton.defineElements();
      break;
    case "logout":
      localStorage.clear();
      Navbar.singleton.login();
      //Authentication.singleton.isLoginSet(false);
      window.location.hash = "login";
      break;
    default:
      content.innerHTML = "<h1>404 Not Found</h1>";
  }
  return content;
}

export function navigate(event) {
  event.preventDefault();
  const page = event.target.getAttribute("href");
  window.location.hash = page;
  renderPage(page);
}
