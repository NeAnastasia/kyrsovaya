import { ArrowType } from "./enum/ArrowType.js";
import { View } from "./view.js";

export class ArrowsMenu {
  static singleton = new ArrowsMenu();
  #connection;
  #el;

  constructor() {
    this.#connection = null;
    this.#el =
      $(`<div class="menu d-flex flex-column justify-content-center" id="menu" tabindex="0">
      <div class="d-flex justify-content-center">
<div class="btn-group">
          <div class="dropdown ms-2 mt-2" id="menu-arrowhead-start">
            <button
        class="btn btn-secondary me-1"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        id="dropdown-arrowhead-start"
      >
       <svg width="16px" height="16px" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="currentColor"></path> </g></svg>
      </button>
      <ul class="dropdown-menu arrowhead-start" aria-labelledby="dropdown-arrowhead-end">
      <li id="none-start"><a class="dropdown-item"><svg width="30px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"></path> </g></svg></a></li>
        <li id="default-start"><a class="dropdown-item"><svg id="default" xmlns="http://www.w3.org/2000/svg" width="30" height="18" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><path d="m14.707 12.707-4 4a1 1 0 0 1-1.414-1.414L12.586 12 9.293 8.707a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414z" style="fill:#1c1b1e"/></svg></a></li>
        <li id="hollow-start"><a class="dropdown-item"><svg id="hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><path d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414zM11 13.586v-3.172L12.586 12z" style="fill:#1c1b1e" data-name="Right"/></svg></a></li>
        <li id="filled-start"><a class="dropdown-item"><svg id="filled" xmlns="http://www.w3.org/2000/svg" width="30" height="18" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><path d="M10 3.116 v12.991 l6,-6.496 -6,-6.495 z M8,0"/></svg></a></li>
        <li id="rhombus-hollow-start"><a class="dropdown-item"><svg id="rhombus-hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path fill="#444" d="M8 0L0 8l8 8 8-8-8-8zM2 8l6-6 6 6-6 6-6-6z"></path></svg></a></li>
        <li id="rhombus-start"><a class="dropdown-item"><svg id="rhombus" fill="#000000" width="18px" height="18px" viewBox="0 0 11.52 11.52" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="m6.439 1.014 4.068 4.068c0.375 0.375 0.375 0.983 0 1.358L6.439 10.506c-0.375 0.375 -0.983 0.375 -1.358 0L1.014 6.439c-0.375 -0.375 -0.375 -0.983 0 -1.358L5.081 1.014c0.375 -0.375 0.983 -0.375 1.358 0"/></svg></a></li>
      </ul>
</div>
<div>
    <button
    class="btn btn-secondary my-2"
    type="button"
    id="reverse"
    >
    <svg fill="#ffffff" width="16px" height="16px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrows-rotate</title> <path d="M29.949 13.902c-0.046-0.37-0.358-0.653-0.736-0.653-0.037 0-0.074 0.003-0.11 0.008l0.004-0.001c-0.37 0.050-0.653 0.365-0.653 0.745 0 0.034 0.002 0.067 0.007 0.1l-0-0.004c0.073 0.527 0.115 1.137 0.115 1.756 0 0.002 0 0.003 0 0.005v-0c-0.009 7.314-5.936 13.241-13.249 13.249h-0.001c-0.013 0-0.028 0-0.043 0-4.296 0-8.11-2.063-10.505-5.253l-0.024-0.034h5.643c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0h-7.071c-0.020 0-0.037 0.010-0.056 0.011-0.050 0.005-0.096 0.015-0.14 0.029l0.005-0.001c-0.058 0.014-0.108 0.033-0.156 0.056l0.004-0.002c-0.015 0.008-0.031 0.008-0.045 0.016-0.022 0.018-0.041 0.035-0.060 0.054l-0 0c-0.044 0.032-0.082 0.067-0.117 0.106l-0.001 0.001c-0.056 0.069-0.102 0.149-0.135 0.235l-0.002 0.006c-0.016 0.047-0.027 0.101-0.032 0.157l-0 0.003c-0.006 0.021-0.011 0.047-0.015 0.074l-0 0.004v7.072c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-4.77c2.698 3.209 6.715 5.235 11.205 5.235 0.016 0 0.032-0 0.047-0h-0.002c8.142-0.010 14.74-6.607 14.75-14.748v-0.001c-0-0.69-0.046-1.369-0.136-2.034l0.009 0.078zM3.121 18.893c0.035 0 0.070-0.002 0.104-0.006l-0.004 0c0.37-0.051 0.651-0.364 0.651-0.744 0-0.035-0.002-0.070-0.007-0.104l0 0.004c-0.074-0.529-0.116-1.139-0.116-1.76v-0c0.009-7.314 5.936-13.241 13.249-13.25h0.001c0.013-0 0.028-0 0.043-0 4.296 0 8.11 2.064 10.505 5.254l0.024 0.034h-5.643c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h7.072c0.019 0 0.035-0.009 0.053-0.011 0.107-0.014 0.204-0.043 0.294-0.084l-0.006 0.003c0.015-0.008 0.032-0.008 0.046-0.016 0.022-0.018 0.042-0.036 0.060-0.055l0-0c0.044-0.033 0.083-0.068 0.118-0.108l0.001-0.001c0.027-0.033 0.053-0.070 0.074-0.109l0.002-0.004c0.050-0.080 0.082-0.175 0.091-0.277l0-0.002c0.007-0.024 0.013-0.053 0.017-0.083l0-0.004v-7.071c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 4.771c-2.698-3.211-6.716-5.238-11.208-5.238-0.015 0-0.031 0-0.046 0h0.002c-8.147 0.003-14.75 6.608-14.75 14.755 0 0.689 0.047 1.367 0.139 2.030l-0.009-0.077c0.050 0.369 0.363 0.65 0.742 0.65h0z"></path> </g></svg>
    </button>
    </div>
    <div class="dropdown my-2 me-2 ms-1" id="menu-arrowhead-end">
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
        <li id="none-end"><a class="dropdown-item"><svg width="30px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"></path> </g></svg></a></li>
        <li id="default-end"><a class="dropdown-item"><svg id="default" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="m14.707 12.707-4 4a1 1 0 0 1-1.414-1.414L12.586 12 9.293 8.707a1 1 0 1 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414z" style="fill:#1c1b1e"/></svg></a></li>
        <li id="hollow-end"><a class="dropdown-item"><svg id="hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="m14.707 11.293-4-4A1 1 0 0 0 9 8v8a1 1 0 0 0 1.707.707l4-4a1 1 0 0 0 0-1.414zM11 13.586v-3.172L12.586 12z" style="fill:#1c1b1e" data-name="Right"/></svg></a></li>
        <li id="filled-end"><a class="dropdown-item"><svg id="filled" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path d="M10 3.116 v12.991 l6,-6.496 -6,-6.495 z M8,0"/></svg></a></li>
        <li id="rhombus-hollow-end"><a class="dropdown-item"><svg id="rhombus-hollow" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><path fill="#444" d="M8 0L0 8l8 8 8-8-8-8zM2 8l6-6 6 6-6 6-6-6z"></path></svg></a></li>
        <li id="rhombus-end"><a class="dropdown-item"><svg id="rhombus" fill="#000000" width="18px" height="18px" viewBox="0 0 11.52 11.52" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="m6.439 1.014 4.068 4.068c0.375 0.375 0.375 0.983 0 1.358L6.439 10.506c-0.375 0.375 -0.983 0.375 -1.358 0L1.014 6.439c-0.375 -0.375 -0.375 -0.983 0 -1.358L5.081 1.014c0.375 -0.375 0.983 -0.375 1.358 0"/></svg></a></li>
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
        <li id="flat"><a class="dropdown-item"><svg id="flat" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><line x1="0" y1="0" x2="30" y2="0" stroke-width="2" stroke="#000"/></svg></a></li>
        <li id="dashed"><a class="dropdown-item"><svg id="dashed" xmlns="http://www.w3.org/2000/svg" width="30" height="18"><line x1="0" y1="0" x2="30" y2="0" stroke-width="2" stroke="#000" stroke-dasharray="6"/></svg></a></li>
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
  }

  appearing(connection, left, top) {
    View.singleton.removeAlert();
    this.#connection = connection;
    $(this.#el).appendTo("#view-area")[0];
    $(this.#el).on("blur", (e) => {
      if (
        e.relatedTarget &&
        (e.relatedTarget ===
          document.querySelector("#input-cardinal-number-1") ||
          e.relatedTarget ===
            document.querySelector("#input-cardinal-number-2") ||
          e.relatedTarget ===
            document.querySelector("#input-cardinal-number-3"))
      ) {
        e.target.addEventListener("blur", (e) => {}, { once: true });
        return;
      }
      this.#deleteMenu();
    });
    document.getElementById("menu").style["top"] = top + "px";
    document.getElementById("menu").style["left"] = left + "px";
    this.dropdownMenu = document.querySelectorAll("ul.dropdown-menu>li");
    document.getElementById("input-cardinal-number-1").value = "";
    document.getElementById("input-cardinal-number-2").value = "";
    document.getElementById("input-cardinal-number-3").value = "";
    if (
      this.#connection.spanIn.textContent !==
      document.getElementById("input-cardinal-number-1").value
    ) {
      document.getElementById("input-cardinal-number-1").value =
        this.#connection.spanIn.textContent;
    }

    if (
      this.#connection.spanCenter.textContent !==
      document.getElementById("input-cardinal-number-2").value
    ) {
      document.getElementById("input-cardinal-number-2").value =
        this.#connection.spanCenter.textContent;
    }

    if (
      this.#connection.spanOut.textContent !==
      document.getElementById("input-cardinal-number-3").value
    ) {
      document.getElementById("input-cardinal-number-3").value =
        this.#connection.spanOut.textContent;
    }

    this.#el.focus();

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
        this.#el.focus();
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
        this.#deleteMenu();
      }
    });

    $(document.getElementById("input-cardinal-number-1")).on("input", (e) => {
      this.#connection.spanIn.textContent = $(
        document.getElementById("input-cardinal-number-1")
      ).val();
    });

    $(document.getElementById("input-cardinal-number-2")).on("input", (e) => {
      this.#connection.spanCenter.textContent = $(
        document.getElementById("input-cardinal-number-2")
      ).val();
    });

    $(document.getElementById("input-cardinal-number-3")).on("input", (e) => {
      this.#connection.spanOut.textContent = $(
        document.getElementById("input-cardinal-number-3")
      ).val();
    });

    $(document.getElementById("input-cardinal-number-2")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".menu") &&
        e.relatedTarget !==
          document.querySelector("#input-cardinal-number-1") &&
        e.relatedTarget !== document.querySelector("#input-cardinal-number-3")
      ) {
        this.#deleteMenu();
      }
    });

    $(document.getElementById("input-cardinal-number-3")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".menu") &&
        e.relatedTarget !==
          document.querySelector("#input-cardinal-number-1") &&
        e.relatedTarget !== document.querySelector("#input-cardinal-number-2")
      ) {
        this.#deleteMenu();
      }
    });

    $(document.getElementById("delete")).click((e) => {
      e.stopPropagation();
      this.#deleteArrow();
      this.#deleteMenu();
    });

    $(document.getElementById("reverse")).click((e) => {
      e.stopPropagation();
      this.#connection.reverseArrowHeads();
    });

    $(document.getElementById("color-input")).on("change", (e) => {
      this.#connection.changeColor(e.target.value);
    });
    this.dropdownMenu.forEach((element) => {
      $(element).on("click", (e) => {
        e.stopPropagation();
        switch (element.id) {
          case "none-end":
            this.#connection.changeArrowHeadEnd(ArrowType.None);
            break;
          case "default-end":
            this.#connection.changeArrowHeadEnd(ArrowType.DefaultEnd);
            break;
          case "hollow-end":
            this.#connection.changeArrowHeadEnd(ArrowType.HollowEnd);
            break;
          case "filled-end":
            this.#connection.changeArrowHeadEnd(ArrowType.FilledEnd);
            break;
          case "rhombus-hollow-end":
            this.#connection.changeArrowHeadEnd(ArrowType.RhombusHollow);
            break;
          case "rhombus-end":
            this.#connection.changeArrowHeadEnd(ArrowType.Rhombus);
            break;
          case "none-start":
            this.#connection.changeArrowHeadStart(ArrowType.None);
            break;
          case "default-start":
            this.#connection.changeArrowHeadStart(ArrowType.DefaultStart);
            break;
          case "hollow-start":
            this.#connection.changeArrowHeadStart(ArrowType.HollowStart);
            break;
          case "filled-start":
            this.#connection.changeArrowHeadStart(ArrowType.FilledStart);
            break;
          case "rhombus-hollow-start":
            this.#connection.changeArrowHeadStart(ArrowType.RhombusHollow);
            break;
          case "rhombus-start":
            this.#connection.changeArrowHeadStart(ArrowType.Rhombus);
            break;
          case "flat":
            this.#connection.updateLine(false);
            break;
          case "dashed":
            this.#connection.updateLine(true);
            break;
          default:
            this.#connection.changeArrowHeadEnd(ArrowType.None);
        }
      });
    });
  }

  #deleteArrow() {
    this.#connection.destroy();
    this.#connection = null;
  }
  #deleteMenu() {
    $(".menu").remove();
  }
}
