import { ArrowType } from "./enum/ArrowType.js";

export class Menu {
  static singleton = new Menu();
  constructor(arrowType, isDashed) {
    this.curArrowType = arrowType;
    this.isDashed = isDashed;
    this.arrow = null;
    this.el =
      $(`<div class="menu d-flex flex-column justify-content-center" id="menu" tabindex="0">
      <div class="d-flex justify-content-center">
<div class="btn-group">
          <div class="dropdown ms-2 mt-2" id="menu-arrowhead-start">
            <button
        class="btn btn-secondary me-2"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        id="dropdown-arrowhead-start"
      >
       <svg width="16px" height="16px" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="currentColor"></path> </g></svg>
      </button>
      <ul class="dropdown-menu arrowhead-start" aria-labelledby="dropdown-arrowhead-end">
      <li><a class="dropdown-item" id="none-start"><svg width="30px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"></path> </g></svg></a></li>
        <li><a class="dropdown-item" id="default-start"><svg id="default" xmlns="http://www.w3.org/2000/svg" width="30" height="18" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><path d="m14.707 12.707-4 4a1 1 0 0 1-1.414-1.414L12.586 12 9.293 8.707a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414z" style="fill:#1c1b1e"/></svg></a></li>
        <li><a class="dropdown-item" id="hollow-start"><svg id="hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><path d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414zM11 13.586v-3.172L12.586 12z" style="fill:#1c1b1e" data-name="Right"/></svg></a></li>
        <li><a class="dropdown-item" id="filled-start"><svg id="filled" xmlns="http://www.w3.org/2000/svg" width="30" height="18" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><path d="M10 3.116v12.991l6-6.496-6-6.495zM8"/></svg></a></li>
        <li><a class="dropdown-item" id="rhombus-hollow-start"><svg id="rhombus-hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path fill="#444" d="M8 0L0 8l8 8 8-8-8-8zM2 8l6-6 6 6-6 6-6-6z"></path></svg></a></li>
        <li><a class="dropdown-item" id="rhombus-start"><svg id="rhombus" fill="#000000" width="18px" height="18px" viewBox="0 0 11.52 11.52" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="m6.439 1.014 4.068 4.068c0.375 0.375 0.375 0.983 0 1.358L6.439 10.506c-0.375 0.375 -0.983 0.375 -1.358 0L1.014 6.439c-0.375 -0.375 -0.375 -0.983 0 -1.358L5.081 1.014c0.375 -0.375 0.983 -0.375 1.358 0"/></svg></a></li>
      </ul>
</div>
    <div class="dropdown m-2" id="menu-arrowhead-end">
      <button
        class="btn btn-secondary"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        id="dropdown-arrowhead-end"
      >
        <svg width="16px" height="16px" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="currentColor"></path> </g></svg>
      </button>
      <ul class="dropdown-menu arrowhead-end" aria-labelledby="dropdown-arrowhead-end">
        <li><a class="dropdown-item" id="none-end"><svg width="30px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"></path> </g></svg></a></li>
        <li><a class="dropdown-item" id="default-end"><svg id="default" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="m14.707 12.707-4 4a1 1 0 0 1-1.414-1.414L12.586 12 9.293 8.707a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414z" style="fill:#1c1b1e"/></svg></a></li>
        <li><a class="dropdown-item" id="hollow-end"><svg id="hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414zM11 13.586v-3.172L12.586 12z" style="fill:#1c1b1e" data-name="Right"/></svg></a></li>
        <li><a class="dropdown-item" id="filled-end"><svg id="filled" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="M10 3.116v12.991l6-6.496-6-6.495zM8"/></svg></a></li>
        <li><a class="dropdown-item" id="rhombus-hollow-end"><svg id="rhombus-hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path fill="#444" d="M8 0L0 8l8 8 8-8-8-8zM2 8l6-6 6 6-6 6-6-6z"></path></svg></a></li>
        <li><a class="dropdown-item" id="rhombus-end"><svg id="rhombus" fill="#000000" width="18px" height="18px" viewBox="0 0 11.52 11.52" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="m6.439 1.014 4.068 4.068c0.375 0.375 0.375 0.983 0 1.358L6.439 10.506c-0.375 0.375 -0.983 0.375 -1.358 0L1.014 6.439c-0.375 -0.375 -0.375 -0.983 0 -1.358L5.081 1.014c0.375 -0.375 0.983 -0.375 1.358 0"/></svg></a></li>
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
    <input type="color" class="form-control form-control-color mx-2 mt-2" id="color-input" value="#000000" title="Choose color">
    </div>
    </div>
    <div class="d-flex m-2">
    <input type="text" class="form-control" id="input-cardinal-number-1">
    <input type="text" class="form-control" id="input-cardinal-number-2">
    <input type="text" class="form-control" id="input-cardinal-number-3">
    </div>
    </div>`)[0];

    this.el.addEventListener("blur", (e) => {
      if (
        e.relatedTarget &&
        (e.relatedTarget ===
          document.querySelector("#input-cardinal-number-1") ||
          e.relatedTarget ===
            document.querySelector("#input-cardinal-number-2") ||
          e.relatedTarget ===
            document.querySelector("#input-cardinal-number-3"))
      ) {
        e.target.addEventListener(
          "blur",
          (e) => {
            console.log("Ignore blur");
          },
          { once: true }
        );
        return console.log("Ignore blur");
      }
      this.deleteMenu();
    });
  }

  appearing(arrow, left, top) {
    this.arrow = arrow;
    $(this.el).appendTo("#view-area")[0];
    document.getElementById("menu").style["top"] = top + "px";
    document.getElementById("menu").style["left"] = left + "px";
    this.dropdownMenu = document.querySelectorAll("ul.dropdown-menu>li");
    document.getElementById("input-cardinal-number-1").value = "";
    document.getElementById("input-cardinal-number-2").value = "";
    document.getElementById("input-cardinal-number-3").value = "";

    if (this.arrow.spanIn.textContent !== document.getElementById("input-cardinal-number-1").value) {
      document.getElementById("input-cardinal-number-1").value = this.arrow.spanIn.textContent;
    }
    
    if (this.arrow.spanCenter.textContent !== document.getElementById("input-cardinal-number-2").value) {
      document.getElementById("input-cardinal-number-2").value = this.arrow.spanCenter.textContent;
    }

    if (this.arrow.spanOut.textContent !== document.getElementById("input-cardinal-number-3").value) {
      document.getElementById("input-cardinal-number-3").value = this.arrow.spanOut.textContent;
    }

    this.el.focus();

    $(document.getElementById("menu-arrowhead-end")).click((e) => {
      e.stopPropagation();
      $(".menu ul.dropdown-menu.arrowhead-end").toggle();
    });

    $(document.getElementById("menu-arrowhead-start")).click((e) => {
      e.stopPropagation();
      $(".menu ul.dropdown-menu.arrowhead-start").toggle();
    });

    $(document.getElementById("menu-line")).click((e) => {
      e.stopPropagation();
      $(".menu ul.dropdown-menu.line").toggle();
    });

    $(document.getElementById("menu")).click((e) => {
      if (
        e.relatedTarget !==
          document.querySelector("#input-cardinal-number-1") &&
        e.relatedTarget !==
          document.querySelector("#input-cardinal-number-2") &&
        e.relatedTarget !== document.querySelector("#input-cardinal-number-3")
      ) {
        this.el.focus();
      }
    });

    $(document.getElementById("input-cardinal-number-1")).click((e) => {
      e.stopPropagation();
      $(document.getElementById("input-cardinal-number-1")).focus();
    });

    $(document.getElementById("input-cardinal-number-2")).click((e) => {
      e.stopPropagation();
      $(document.getElementById("input-cardinal-number-2")).focus();
    });

    $(document.getElementById("input-cardinal-number-3")).click((e) => {
      e.stopPropagation();
      $(document.getElementById("input-cardinal-number-3")).focus();
    });

    $(document.getElementById("input-cardinal-number-1")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".menu") &&
        e.relatedTarget !==
          document.querySelector("#input-cardinal-number-2") &&
        e.relatedTarget !== document.querySelector("#input-cardinal-number-3")
      ) {
        this.deleteMenu();
      }
    });
    
    document.getElementById("input-cardinal-number-1").addEventListener('input', (e) => {
      this.arrow.spanIn.textContent = $(document.getElementById("input-cardinal-number-1")).val();
      $(this.arrow.spanIn).appendTo("#view-area")[0];
    });

    document.getElementById("input-cardinal-number-2").addEventListener('input', (e) => {
      this.arrow.spanCenter.textContent = $(document.getElementById("input-cardinal-number-2")).val();
      $(this.arrow.spanCenter).appendTo("#view-area")[0];
    });
    
    document.getElementById("input-cardinal-number-3").addEventListener('input', (e) => {
      this.arrow.spanOut.textContent = $(document.getElementById("input-cardinal-number-3")).val();
      $(this.arrow.spanOut).appendTo("#view-area")[0];
    });

    $(document.getElementById("input-cardinal-number-2")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".menu") &&
        e.relatedTarget !==
          document.querySelector("#input-cardinal-number-1") &&
        e.relatedTarget !== document.querySelector("#input-cardinal-number-3")
      ) {
        this.deleteMenu();
      }
    });

    $(document.getElementById("input-cardinal-number-3")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".menu") &&
        e.relatedTarget !==
          document.querySelector("#input-cardinal-number-1") &&
        e.relatedTarget !== document.querySelector("#input-cardinal-number-2")
      ) {
        this.deleteMenu();
      }
    });

    $(document.getElementById("delete")).click((e) => {
      e.stopPropagation();
      this.deleteArrow();
      this.deleteMenu();
    });

    document.getElementById("color-input").addEventListener("change", (e) => {
      this.arrow.changeColor(e.target.value);
    });

    console.log(this.dropdownMenu);
    this.dropdownMenu.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
        switch (e.target.id) {
          case "none-end":
            arrow.changeArrowHeadEnd(ArrowType.None);
            break;
          case "default-end":
            arrow.changeArrowHeadEnd(ArrowType.DefaultEnd);
            break;
          case "hollow-end":
            arrow.changeArrowHeadEnd(ArrowType.HollowEnd);
            break;
          case "filled-end":
            arrow.changeArrowHeadEnd(ArrowType.FilledEnd);
            break;
          case "rhombus-hollow-end":
            arrow.changeArrowHeadEnd(ArrowType.RhombusHollow);
            break;
          case "rhombus-end":
            arrow.changeArrowHeadEnd(ArrowType.Rhombus);
            break;
          case "none-start":
            arrow.changeArrowHeadStart(ArrowType.None);
            break;
          case "default-start":
            arrow.changeArrowHeadStart(ArrowType.DefaultStart);
            break;
          case "hollow-start":
            arrow.changeArrowHeadStart(ArrowType.HollowStart);
            break;
          case "filled-start":
            arrow.changeArrowHeadStart(ArrowType.FilledStart);
            break;
          case "rhombus-hollow-start":
            arrow.changeArrowHeadStart(ArrowType.RhombusHollow);
            break;
          case "rhombus-start":
            arrow.changeArrowHeadStart(ArrowType.Rhombus);
            break;
          case "flat":
            arrow.updateLine(false);
            break;
          case "dashed":
            arrow.updateLine(true);
            break;
          default:
            arrow.changeArrowHeadEnd(ArrowType.None);
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
