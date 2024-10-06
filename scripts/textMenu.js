export class TextMenu {
  static singleton = new TextMenu();
  constructor() {
    this.el = $(`<div
  class="text-menu d-flex flex-column justify-content-center"
  id="text-menu"
  tabindex="0"
>
  <div class="d-flex justify-content-center">
  <div class="form-check m-2">
  <input class="form-check-input" type="checkbox" value="bold" id="checkbox-bold">
  <label class="form-check-label" for="checkbox-bold">
    <svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1H8.625C11.0412 1 13 2.95875 13 5.375C13 6.08661 12.8301 6.75853 12.5287 7.35243C13.4313 8.15386 14 9.32301 14 10.625C14 13.0412 12.0412 15 9.625 15H2V1ZM5.5 9.75V11.5H9.625C10.1082 11.5 10.5 11.1082 10.5 10.625C10.5 10.1418 10.1082 9.75 9.625 9.75H5.5ZM5.5 6.25H8.625C9.10825 6.25 9.5 5.85825 9.5 5.375C9.5 4.89175 9.10825 4.5 8.625 4.5H5.5V6.25Z" fill="#000000"></path> </g></svg>
  </label>
</div>
<div class="form-check m-2">
  <input class="form-check-input" type="checkbox" value="italic" id="checkbox-italic">
  <label class="form-check-label" for="checkbox-italic">
   <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 3H20M4 21H14M15 3L9 21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  </label>
</div>
<div class="form-check m-2">
  <input class="form-check-input" type="checkbox" value="text-decoration-underline" id="checkbox-underline">
  <label class="form-check-label" for="checkbox-underline">
  <svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 1V7C3 9.76142 5.23858 12 8 12C10.7614 12 13 9.76142 13 7V1H10V7C10 8.10457 9.10457 9 8 9C6.89543 9 6 8.10457 6 7V1H3Z" fill="#000000"></path> <path d="M14 16V14H2V16H14Z" fill="#000000"></path> </g></svg>
  </label>
</div>
<div class="form-check m-2">
  <input class="form-check-input" type="checkbox" value="text-decoration-line-through" id="checkbox-line-through">
  <label class="form-check-label" for="checkbox-line-through">
  <svg fill="#000000" width="16px" height="16px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1471.2 1261.689c9.24 67.2 4.92 138.84-16.32 215.64-53.16 190.08-176.64 319.56-348 364.8-46.44 12.24-94.56 17.76-143.04 17.76-209.16 0-424.92-104.04-546.84-225.12l-52.44-56.04 175.68-163.68 49.2 52.92c98.76 97.92 303.48 182.16 456.24 142.08 89.28-23.64 147.48-87.96 177.96-196.92 16.56-60 17.16-109.44 3.12-151.44Zm-31.92-991.08-163.8 175.32c-105.12-98.16-319.2-176.16-469.8-134.76-85.8 23.28-141.6 82.08-170.64 179.76-54.48 183.24 66.72 252 377.76 345.48 71.04 21.36 133.56 40.68 183.96 65.28H1920v240H0v-240h561.72c-135.6-96.84-226.68-243.6-156.72-479.16 67.08-225.84 220.68-311.16 337.8-343.08 247.8-66.72 543.6 48.36 696.48 191.16Z" fill-rule="evenodd"></path> </g></svg>
  </label>
</div>
  </div>
</div>`)[0];
    this.classes = [];
    this.textEl = null;
  }
  appearing(classes, textEl) {
    this.classes = classes;
    this.textEl = textEl;
    $(this.el).appendTo(document.body);
    console.log(document.activeElement);
    document.querySelector("#checkbox-bold").checked = false;
    document.querySelector("#checkbox-italic").checked = false;
    document.querySelector("#checkbox-underline").checked = false;
    document.querySelector("#checkbox-line-through").checked = false;

    if (this.classes.contains("bold")) {
      document.querySelector("#checkbox-bold").checked = true;
    }
    if (this.classes.contains("italic")) {
      document.querySelector("#checkbox-italic").checked = true;
    }
    if (this.classes.contains("text-decoration-underline")) {
      document.querySelector("#checkbox-underline").checked = true;
    }
    if (this.classes.contains("text-decoration-line-through")) {
      document.querySelector("#checkbox-line-through").checked = true;
    }

    $(document.getElementById("checkbox-bold")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".text-menu") &&
        e.relatedTarget !== document.querySelector("#checkbox-italic") &&
        e.relatedTarget !== document.querySelector("#checkbox-underline") &&
        e.relatedTarget !== document.querySelector("#checkbox-line-through")
      ) {
        this.deleteMenu();
      }
    });

    $(document.getElementById("checkbox-italic")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".text-menu") &&
        e.relatedTarget !== document.querySelector("#checkbox-bold") &&
        e.relatedTarget !== document.querySelector("#checkbox-underline") &&
        e.relatedTarget !== document.querySelector("#checkbox-line-through")
      ) {
        this.deleteMenu();
      }
    });

    $(document.getElementById("checkbox-underline")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".text-menu") &&
        e.relatedTarget !== document.querySelector("#checkbox-bold") &&
        e.relatedTarget !== document.querySelector("#checkbox-italic") &&
        e.relatedTarget !== document.querySelector("#checkbox-line-through")
      ) {
        this.deleteMenu();
      }
    });

    $(document.getElementById("checkbox-line-through")).blur((e) => {
      if (
        e.relatedTarget !== document.querySelector(".text-menu") &&
        e.relatedTarget !== document.querySelector("#checkbox-bold") &&
        e.relatedTarget !== document.querySelector("#checkbox-italic") &&
        e.relatedTarget !== document.querySelector("#checkbox-underline")
      ) {
        this.deleteMenu();
      }
    });

    $(document.getElementsByClassName("form-check-input")).click((e) => {
      console.log(document.activeElement);
      if (e.target.checked) {
        this.textEl.classList.add(e.target.value);
      } else {
        this.textEl.classList.remove(e.target.value);
      }
    });
  }
  changeObject(classes, textEl) {
    this.classes = classes;
    this.textEl = textEl;
  }
  deleteMenu() {
    $(".text-menu").remove();
  }
}
