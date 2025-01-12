import { Node } from "./node.js";
import { View } from "./view.js";
import { Selection } from "./selection.js";
import { ContextMenu, ContextItem } from "./context.js";
import { ArrowType } from "./enum/ArrowType.js";
import { Authentication } from "./auth.js";
import { renderPage } from "./router.js";
import { Navbar } from "./navbar.js";
import { Diagrams } from "./diagrams.js";

!(function (items) {
  for (const key in items) {
    globalThis[key] = items[key];
  }
})({
  Node: Node,
  // view: View.singleton,
  // selection: Selection.singleton,
});

$(document).ready(function (e) {
  const hash = window.location.hash;
  $(window).on("hashchange", function (e) {
    renderPage();
  });
  const toggle = document.getElementById("navbar-toggle");
  const menu = document.querySelector(".navbar-menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  const token = localStorage.getItem("token");
  const isLoggedIn = token !== null;

  if (hash) {
    if ((hash === "#login" || hash === "#register") && isLoggedIn) {
      window.location.hash = "#diagrams";
    } else if ((hash !== "#login" || hash !== "#register") && !isLoggedIn) {
      window.location.hash = "#login";
    } else {
      if (/^#diagram\/[a-zA-Z0-9\-]+$/.test(hash)) {
        const id = window.location.hash.split("/").pop();
        Diagrams.singleton.getDiagram(id, true);
      } else {
        renderPage();
      }
    }
  } else {
    if (isLoggedIn) {
      window.location.hash = "#diagrams";
    } else {
      window.location.hash = "#login";
    }
  }

  // window.history.pushState({}, "", "/register");
  // renderPage("register");
  // const auth = new Authentication();
  // window.contextMenu = new ContextMenu();
  // view.fromJSON({
  //   nodes: [
  //     {
  //       id: "node-0",
  //       type: "class",
  //       position: { x: 504, y: 350 },
  //       text: "test1",
  //       content1: "+ 2dx",
  //       content2: "+ ",
  //     },
  //     {
  //       id: "node-1",
  //       type: "rhombus",
  //       position: { x: 605.5, y: 90 },
  //       text: "text",
  //     },
  //   ],
  //   connections: [
  //     {
  //       id: "connection-0",
  //       inSock: {
  //         type: "down",
  //         id: "node-1",
  //       },
  //       outSock: {
  //         type: "up",
  //         id: "node-0",
  //       },
  //       outPoint: null,
  //       isDashed: false,
  //       arrowTypeEnd: ArrowType.DefaultEnd,
  //       arrowTypeStart: ArrowType.None,
  //       color: "#f91a1a",
  //       textStart: "1..*",
  //     },
  //   ],
  // });
  // window.addEventListener("viewupdate", (e) => {
  //   console.log("Что-то изменилось");
  //   const data = view.toJSON();
  // });
});
