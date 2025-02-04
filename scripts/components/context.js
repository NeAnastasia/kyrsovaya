import { View } from "../elements/view.js";
import { Node } from "../elements/node.js";
import { Point } from "../utils/point.js";
import { getNavbarHeight } from "../utils/helpers.js";
import { addElementRequest } from "../api/http/nodeApiRequests.js";

export class ContextItem {
  #name;
  #parent;
  #el;
  #viewArea;
  #nameEl;
  constructor(parent, name, templateName) {
    this.#parent = parent;
    this.templateName = templateName;
    this.#name = name;
    this.#el = $(
      `<div class="context-item"><div class="context-view-area"></div><div class="context-item-name">${
        this.#name
      }</div></div>`
    );
    this.#viewArea = this.#el.find("div.context-view-area");
    this.#nameEl = this.#el.find("div.context-item.name");
    this.#parent.container.append(this.#el);
    this.#el.on("click", (e) => {
      const r = View.getInstance().el.getBoundingClientRect();
      var alert = $(
        `<div class="alert alert-info alert-click" role="alert">
          Нажмите на место, куда хотите поместить объект.
        </div>`
      )[0];
      $(alert).appendTo(document.body);
      $("#view").one("click", (e) => {
        const data = {
          NodeType: ContextMenu.list[this.#name],
          Label: "text",
          x: e.pageX - r.left,
          y: e.pageY - r.top,
        };
        const node = Node.fromJSON(data);
        addElementRequest(node.toJSON(), node);
        $(".alert-info").remove();
      });
    });
    this.render();
  }
  get name() {
    return this.#name;
  }
  set name(v) {
    this.#name = v;
    this.#nameEl.html(this.#name);
  }
  render() {
    const i = $($(`#${this.templateName}-context`).html());
    this.#viewArea.html(i);
  }
  destroy() {
    this.#el.off();
    this.#el.remove();
    this.#el = null;
  }
}

export class ContextMenu {
  #el;
  #container;
  #title = "Фигуры";
  #titleEl;
  #items = [];
  static list = {
    Прямоугольник: "default",
    Ромб: "rhombus",
    Объект: "object",
    Класс: "class",
  };
  constructor() {
    this.#el = $(
      `<div id="context-menu"><div class="context-menu-title">${
        this.#title
      }</div><div class="context-menu-container"></div></div>`
    );
    this.#container = this.#el.find("div.context-menu-container");
    this.#titleEl = this.#el.find("div.context-menu-title");
    this.refreshList();
    this.#el.css("top", getNavbarHeight());
    this.#el.appendTo(document.body);
  }
  get title() {
    return this.#title;
  }
  set title(v) {
    this.#title = v;
    this.#titleEl.html(this.#title);
  }
  refreshList() {
    this.#container.html("");
    this.#items.splice(0);
    for (const name in this.constructor.list) {
      this.#items.push(
        new ContextItem(this, name, this.constructor.list[name])
      );
    }
  }
  get container() {
    return this.#container;
  }
  destroy() {
    this.#items.forEach((item) => {
      item.destroy();
    });
    this.#items = [];
    this.#el.remove();
    this.#el = null;
  }
}
