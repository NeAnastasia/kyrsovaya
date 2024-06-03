import { ArrowType } from "./enum/ArrowType.js";

export class Menu {
  static singleton = new Menu();
  constructor(arrowType, isDashed) {
    this.curArrowType = arrowType;
    this.isDashed = isDashed;
    this.arrow = null;
    this.el = $(`<div class="menu btn-group" id="menu" tabindex="0">
    <div class="dropdown m-2" id="menu-arrowhead">
      <button
        class="btn btn-secondary"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        id="dropdown-arrowhead"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-right-short"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
          />
        </svg>
      </button>
      <ul class="dropdown-menu arrowhead" aria-labelledby="dropdown-arrowhead">
        <li><a class="dropdown-item" id="default"><svg id="default" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="m14.707 12.707-4 4a1 1 0 0 1-1.414-1.414L12.586 12 9.293 8.707a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414z" style="fill:#1c1b1e"/></svg></a></li>
        <li><a class="dropdown-item" id="hollow"><svg id="hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414zM11 13.586v-3.172L12.586 12z" style="fill:#1c1b1e" data-name="Right"/></svg></a></li>
        <li><a class="dropdown-item" id="filled"><svg id="filled" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="M10 3.116v12.991l6-6.496-6-6.495zM8"/></svg></a></li>
        <li><a class="dropdown-item" id="rhombus-hollow"><svg id="rhombus-hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path fill="#444" d="M8 0L0 8l8 8 8-8-8-8zM2 8l6-6 6 6-6 6-6-6z"></path></svg></a></li>
        <li><a class="dropdown-item" id="rhombus"><svg id="rhombus" fill="#000000" width="18px" height="18px" viewBox="0 0 11.52 11.52" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="m6.439 1.014 4.068 4.068c0.375 0.375 0.375 0.983 0 1.358L6.439 10.506c-0.375 0.375 -0.983 0.375 -1.358 0L1.014 6.439c-0.375 -0.375 -0.375 -0.983 0 -1.358L5.081 1.014c0.375 -0.375 0.983 -0.375 1.358 0"/></svg></a></li>
      </ul>
    </div>
    <div class="dropdown m-2" id="menu-line">
      <button
        class="btn btn-secondary"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        id="dropdown-line"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="5"><line x1="0" y1="0" x2="16" y2="0" stroke-width="2" stroke="white"/></svg>
      </button>
      <ul class="dropdown-menu line" aria-labelledby="dropdown-line">
        <li><a class="dropdown-item" id="flat"><svg id="flat" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><line x1="0" y1="0" x2="30" y2="0" stroke-width="2" stroke="#000"/></svg></a></li>
        <li><a class="dropdown-item" id="dashed"><svg id="dashed" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><line x1="0" y1="0" x2="30" y2="0" stroke-width="2" stroke="#000" stroke-dasharray="6"/></svg></a></li>
      </ul>
    </div>
    <div>
    <button
    class="btn btn-secondary m-2"
    type="button"
    id="delete"
    >
    <svg width="16px" height="16px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.5 7.08499V21.415C6.5 21.695 6.72 21.915 7 21.915H17C17.28 21.915 17.5 21.695 17.5 21.415V7.08499" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 5.08499H10V3.58499C10 3.30499 10.22 3.08499 10.5 3.08499H13.5C13.78 3.08499 14 3.30499 14 3.58499V5.08499Z" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5 5.08499H19" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 10.465V17.925" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15 9.465V18.925" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 9.465V18.925" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    </button>
    </div>
  </div>`)[0];

    this.el.addEventListener("blur", (e) => {
      this.deleteMenu();
    });
  }

  appearing(arrow, left, top) {
    this.arrow = arrow;
    $(this.el).appendTo("#view-area")[0];
    document.getElementById("menu").style["top"] = top + "px";
    document.getElementById("menu").style["left"] = left + "px";
    this.dropdownMenu = document.querySelectorAll("ul.dropdown-menu>li");

    this.el.focus();

    $(document.getElementById("menu-arrowhead")).click((e) => {
      e.stopPropagation();
      $(".menu ul.dropdown-menu.arrowhead").toggle();
    });

    $(document.getElementById("menu-line")).click((e) => {
      e.stopPropagation();
      $(".menu ul.dropdown-menu.line").toggle();
    });

    $(document.getElementById("delete")).click((e) => {
      e.stopPropagation();
      this.deleteArrow();
      this.deleteMenu();
    });

    console.log(this.dropdownMenu);
    this.dropdownMenu.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        switch (e.target.id) {
          case "default":
            arrow.changeArrowHead(ArrowType.Default);
            break;
          case "hollow":
            arrow.changeArrowHead(ArrowType.Hollow);
            break;
          case "filled":
            arrow.changeArrowHead(ArrowType.Filled);
            break;
          case "rhombus-hollow":
            arrow.changeArrowHead(ArrowType.RhombusHollow);
            break;
          case "rhombus":
            arrow.changeArrowHead(ArrowType.Rhombus);
            break;
          case "flat":
            arrow.updateLine(false);
            break;
          case "dashed":
            arrow.updateLine(true);
            break;
          default:
            arrow.changeArrowHead(ArrowType.Default);
        }
      });
    });
  }

  deleteArrow() {
    this.arrow.destroy();
    this.arrow = null;
  }
  deleteMenu() {
    $(".menu").remove();
  }
}
