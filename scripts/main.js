import { Node } from "./elements/node.js";
import { View } from "./elements/view.js";
import { Selection } from "./logic/nodes/selection.js";
import { ContextMenu, ContextItem } from "./components/context.js";
import { ArrowType } from "./enum/ArrowType.js";
import { Authentication } from "./logic/authentication/authentication.js";
import { renderPage } from "./rendering/router.js";
import { renderNavbar } from "./rendering/renderNavbar.js";
import { isLoggedIn } from "./utils/helpers.js";
import { getDiagram } from "./api/http/diagramsApiRequests.js";

!(function (items) {
  for (const key in items) {
    globalThis[key] = items[key];
  }
})({
  Node: Node,
});

$(document).ready(function (e) {
  console.log(isLoggedIn());
  renderNavbar();
  const hash = window.location.hash;
  $(window).on("hashchange", function (e) {
    renderPage();
  });
  const toggle = document.getElementById("navbar-toggle");
  const menu = document.querySelector(".navbar-menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  const isLogged = isLoggedIn();

  if (hash) {
    if ((hash === "#login" || hash === "#register") && isLogged) {
      window.location.hash = "#diagrams";
    } else if ((hash !== "#login" || hash !== "#register") && !isLogged) {
      window.location.hash = "#login";
    } else {
      if (/^#diagram\/[a-zA-Z0-9\-]+$/.test(hash)) {
        const id = window.location.hash.split("/").pop();
        getDiagram(id, true);
      } else {
        renderPage();
      }
    }
  } else {
    if (isLogged) {
      window.location.hash = "#diagrams";
    } else {
      window.location.hash = "#login";
    }
  }
});
