import { Authentication } from "../logic/authentication/authentication.js";
import { defineElementsForAllDiagrams } from "../logic/diagrams/diagrams.js";
import { View } from "../elements/view.js";
import { ContextMenu } from "../components/context.js";
import { renderNavbar } from "./renderNavbar.js";
import { renderLoginPage } from "./renderLoginPage.js";
import { renderRegistrationPage } from "./renderRegistrationPage.js";
import { renderDiagramPage } from "./renderDiagramPage.js";
import { renderDiagramsPage } from "./renderDiagramsPage.js";
import { getDiagram } from "../api/http/diagramsApiRequests.js";

export const renderPage = (isDiagramGot = false) => {
  let page = window.location.hash.replace("#", "") || "home"; // Получаем имя страницы

  if (/^diagram\/[a-zA-Z0-9\-]+$/.test(page)) {
    page = "diagram";
    const id = window.location.hash.split("/").pop();
    if (!isDiagramGot) {
      getDiagram(id)
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
      content.innerHTML = renderLoginPage();
      Authentication.getInstance().isLoginSet(true);
      break;
    case "register":
      content.innerHTML = renderRegistrationPage();
      Authentication.getInstance().isLoginSet(false);
      break;
    case "user":
      content.innerHTML = "To the future...";
      break;
    case "diagram":
      content.innerHTML = renderDiagramPage();
      View.getInstance().defineElements();
      window.contextMenu = new ContextMenu();
      View.getInstance().fromJSON();
      break;
    case "diagrams":
      content.innerHTML = renderDiagramsPage();
      defineElementsForAllDiagrams();
      break;
    case "logout":
      localStorage.clear();
      renderNavbar();
      window.location.hash = "login";
      break;
    default:
      content.innerHTML = "<h1>404 Not Found</h1>";
  }
  return content;
};

export const navigate = (event) => {
  event.preventDefault();
  const page = event.target.getAttribute("href");
  window.location.hash = page;
  renderPage(page);
};
