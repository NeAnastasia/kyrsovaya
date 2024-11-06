import { Draggable } from "./draggable.js";
import { NodeSocket } from "./socket.js";
import { Selection } from "./selection.js";
import { View } from "./view.js";
import { TextMenu } from "./textMenu.js";
import { NodeType } from "./enum/NodeType.js";
import { SocketType } from "./enum/SocketType.js";
import { Point } from "./point.js";

export class Node {
  static idC = 0;
  static nodes = {};
  #width = 140;
  #height = 140;
  #ptype;
  #opos;
  #pressType;
  #name;
  #contentEls;
  #textEl;
  static deductTemplate(type) {
    switch (type) {
      case NodeType.Object: {
        return "object-node-template";
      }
      case NodeType.Class: {
        return "class-node-template";
      }
      default: {
        return "node-template";
      }
    }
  }
  constructor(name = "", type = NodeType.Default, id = "") {
    if (id === "") {
      this.id = "node-" + Node.idC;
      Node.idC++;
    } else {
      this.id = id;
      Node.idC = parseInt(id.replace("node-", ""), 10);
      Node.idC = Node.idC + 1;
    }
    this.isDblClick = false;
    this.type = type;
    this.#ptype = this.type;
    Node.nodes[parseInt(id.replace("node-", ""), 10)] = this;
    this.templateName = Node.deductTemplate(this.type);
    this.el = $($(`#${this.templateName}`).html())[0];
    new Draggable(
      this.el,
      this.#onNodePressed.bind(this),
      this.#onNodeReleased.bind(this),
      this.#onNodeMove.bind(this)
    );
    this.position = new Point(0, 0);
    this.#opos = null;
    this.#pressType = 0;

    this.sockets = {
      up: new NodeSocket(
        $(this.el).find(".node-connection-socket.up")[0],
        this,
        SocketType.Up
      ),
      upright: new NodeSocket(
        $(this.el).find(".node-connection-socket.upright")[0],
        this,
        SocketType.Upright
      ),
      upleft: new NodeSocket(
        $(this.el).find(".node-connection-socket.upleft")[0],
        this,
        SocketType.Upleft
      ),
      left: new NodeSocket(
        $(this.el).find(".node-connection-socket.left")[0],
        this,
        SocketType.Left
      ),
      leftup: new NodeSocket(
        $(this.el).find(".node-connection-socket.leftup")[0],
        this,
        SocketType.Leftup
      ),
      leftdown: new NodeSocket(
        $(this.el).find(".node-connection-socket.leftdown")[0],
        this,
        SocketType.Leftdown
      ),
      down: new NodeSocket(
        $(this.el).find(".node-connection-socket.down")[0],
        this,
        SocketType.Down
      ),
      downright: new NodeSocket(
        $(this.el).find(".node-connection-socket.downright")[0],
        this,
        SocketType.Downright
      ),
      downleft: new NodeSocket(
        $(this.el).find(".node-connection-socket.downleft")[0],
        this,
        SocketType.Downleft
      ),
      right: new NodeSocket(
        $(this.el).find(".node-connection-socket.right")[0],
        this,
        SocketType.Right
      ),
      rightup: new NodeSocket(
        $(this.el).find(".node-connection-socket.rightup")[0],
        this,
        SocketType.Rightup
      ),
      rightdown: new NodeSocket(
        $(this.el).find(".node-connection-socket.rightdown")[0],
        this,
        SocketType.Rightdown
      ),
    };
    this.el.classList.add(this.type);
    this.#name = name;
    this.#contentEls = $(this.el).find(".node-text-content");
    this.#textEl = $(this.el).find(".node-text")[0];
    this.#textEl.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    this.#textEl.innerHTML = this.#name;
    const allTextElements = $(this.#textEl).add(this.#contentEls);
    $(allTextElements).on("dblclick", (e) => {
      this.isDblClick = true;
      let target;
      if (
        $(e.target).hasClass("node-text-content") ||
        $(e.target).hasClass("node-text")
      ) {
        target = e.target;
      } else {
        if ($(e.target).closest(".node-text-content") != undefined) {
          target = $(e.target).closest(".node-text-content");
        } else {
          target = $(e.target).closest(".node-text");
        }
      }
      if ($(".text-menu").length === 0) {
        TextMenu.singleton.appearing(target);
      } else {
        TextMenu.singleton.changeObject(target);
      }
      $(target).attr("contenteditable", true);
      target.focus();
    });
    $(allTextElements).on("focusout", (e) => {
      this.isDblClick = false;
      this.#onRename(e);
      $(e.target).attr("contenteditable", false);
      window.dispatchEvent(new Event("viewupdate"));
    });
    $(this.#textEl).on("input", (e) => {
      this.#onRename(e);
    });
    window.addEventListener("mousemove", this.#mouseMoveRaw.bind(this));
    this.update();
    this.#addElementRequest();
  }
  #mouseMoveRaw(e) {
    const coords = [e.pageX, e.pageY];
    const rect = this.el.getBoundingClientRect();
    e.preventDefault();
    if (
      coords[0] > rect.x + rect.width - 20 &&
      coords[1] > rect.y + rect.height - 20
    ) {
      this.el.style.cursor = "se-resize";
    } else {
      this.el.style.cursor = "default";
    }
  }
  getAcrossYPosition() {
    return this.position.y + this.#height;
  }
  getAcrossXPosition() {
    return this.position.x + this.#width;
  }
  #onNodeMove(e, delta) {
    if (this.#pressType == 0) {
      Selection.singleton.moveAll(delta);
    } else {
      this.#width = Math.max(this.#opos.x + delta[0], 40);
      this.#height = Math.max(this.#opos.y + delta[1], 40);
      this.#scaleElementRequest();
      this.update();
    }
  }
  moveOn(delta) {
    this.position.set(this.#opos.x + delta[0], this.#opos.y + delta[1]);
    // this.#moveElementRequest();
    this.update();
  }
  press(e) {
    this.#opos = new Point(this.position.x, this.position.y);
  }
  #onNodePressed(e) {
    const coords = [e.pageX, e.pageY];
    const rect = this.el.getBoundingClientRect();
    if (
      coords[0] > rect.x + rect.width - 20 &&
      coords[1] > rect.y + rect.height - 20
    ) {
      this.#opos = new Point(this.#width, this.#height);
      e.preventDefault();
      this.#pressType = 1;
      this.el.classList.add("selected");
      return;
    }
    this.#pressType = 0;
    if (!e.shiftKey) {
      Selection.singleton.clear();
    } else {
      e.preventDefault();
    }
    Selection.singleton.add(this);
    Selection.singleton.pressAll(e);
    this.el.classList.add("selected");
  }
  #onNodeReleased(e) {
    this.#opos = null;
    window.dispatchEvent(new Event("viewupdate"));
  }
  update() {
    this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    this.el.style.width = `${this.#width}px`;
    this.el.style.height = `${this.#height}px`;
    for (const key in this.sockets) {
      this.sockets[key].update();
    }
    if (this.type != this.#ptype) {
      this.el.classList.remove(this.#ptype);
      this.#ptype = this.type;
      this.el.classList.add(this.type);
    }
  }
  remove() {
    this.#removeElementRequest();
    $(this.el).remove();
  }
  destroy() {
    for (const key in this.sockets) {
      this.sockets[key].destroy();
    }
    window.dispatchEvent(new Event("viewupdate"));
  }
  #onRename(e) {
    this.#name = this.#textEl.innerHTML;
    this.update();
  }
  #moveElementRequest() {
    $.ajax({
      url: "/diagram/" + localStorage.getItem("diagramId") + "/operation/move",
      method: "post",
      dataType: "json",
      data: {
        elementId: this.id,
        position: {
          x: this.position.x,
          y: this.position.y,
        },
      },
      success: function () {
        console.log("moveInfoIsSent");
      },
    });
  }
  #scaleElementRequest() {
    $.ajax({
      url: "/diagram/" + localStorage.getItem("diagramId") + "/operation/scale",
      method: "post",
      dataType: "json",
      data: {
        elementId: this.id,
        size: {
          x: this.#width,
          y: this.#height,
        },
      },
      success: function () {
        console.log("scaleInfoIsSent");
      },
    });
  }
  #removeElementRequest() {
    $.ajax({
      url:
        "/diagram/" + localStorage.getItem("diagramId") + "/operation/remove",
      method: "post",
      dataType: "json",
      data: {
        elementId: this.id,
      },
      success: function () {
        console.log("removeInfoIsSent");
      },
    });
  }
  #addElementRequest() {
    $.ajax({
      url: "/diagram/" + localStorage.getItem("diagramId") + "/operation/", //!!
      method: "post",
      dataType: "json",
      data: this.toJSON(),
      success: function () {
        console.log("removeInfoIsSent");
      },
    });
  }
  static fromJSON(json) {
    const tname = json.type || NodeType.Default;
    let node;
    switch (tname) {
      case NodeType.Default:
        {
          node = new RectNode(json.text, json.type, json.id);
        }
        break;
      case NodeType.Rhombus:
        {
          node = new RhombusNode(json.text, json.type, json.id);
        }
        break;
      case NodeType.Object:
        {
          node = new ObjectNode(json.text, json.type, json.id, json.content1);
        }
        break;
      case NodeType.Class:
        {
          node = new ClassNode(
            json.text,
            json.type,
            json.id,
            json.content1,
            json.content2
          );
        }
        break;

      default:
        {
          node = new Node(json.text, json.type, json.id);
        }
        break;
    }

    node.position = new Point(json.position.x, json.position.y);
    View.singleton.addNode(node);
    node.update();
    return node;
  }
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      position: this.position,
      text: this.#name,
    };
  }
  get textWidth() {
    return Math.max(this.#textEl.clientWidth, 40);
  }
  get textHeight() {
    return Math.max(this.#textEl.clientHeight, 40);
  }
  get width() {
    return this.#width;
  }
  get height() {
    return this.#height;
  }
}

class RectNode extends Node {
  constructor(name, type, id) {
    super(name, type, id);

    this.svgArea = $(this.el).find("svg");

    this.svgArea.html(`<line></line><line></line><line></line><line></line>`);
    this.lines = this.svgArea.find("line");
  }

  update() {
    super.update();
    if (!this.svgArea) {
      return;
    }
    $(this.lines[0])
      .attr("x1", "0")
      .attr("x2", this.width)
      .attr("y1", "0")
      .attr("y2", "0");
    $(this.lines[1])
      .attr("x1", this.width)
      .attr("x2", this.width)
      .attr("y1", "0")
      .attr("y2", this.height);
    $(this.lines[2])
      .attr("x1", "0")
      .attr("x2", "0")
      .attr("y1", "0")
      .attr("y2", this.height);
    $(this.lines[3])
      .attr("x1", "0")
      .attr("x2", this.width)
      .attr("y1", this.height)
      .attr("y2", this.height);
  }
}

class RhombusNode extends Node {
  constructor(name, type, id) {
    super(name, type, id);

    this.svgArea = $(this.el).find("svg");

    this.svgArea.html(`<line></line><line></line><line></line><line></line>`);
    this.lines = this.svgArea.find("line");
  }

  update() {
    super.update();
    if (!this.svgArea) {
      return;
    }
    $(this.lines[0])
      .attr("x1", "0")
      .attr("x2", this.width / 2)
      .attr("y1", this.height / 2)
      .attr("y2", "0");
    $(this.lines[1])
      .attr("x1", this.width / 2)
      .attr("x2", this.width)
      .attr("y1", "0")
      .attr("y2", this.height / 2);
    $(this.lines[2])
      .attr("x1", "0")
      .attr("x2", this.width / 2)
      .attr("y1", this.height / 2)
      .attr("y2", this.height);
    $(this.lines[3])
      .attr("x1", this.width / 2)
      .attr("x2", this.width)
      .attr("y1", this.height)
      .attr("y2", this.height / 2);
  }
}
class ObjectNode extends Node {
  constructor(name, type, id, content) {
    super(name, type, id);

    this.svgArea = $(this.el).find("svg");

    this.svgArea.html(
      `<line></line><line></line><line></line><line></line><line></line>`
    );
    this.lines = this.svgArea.find("line");
    this.textContent = content || "";
    this.textContentEl = $(this.el).find(".node-text-content");
    this.textContentEl.html(this.textContent);
    this.textContentEl.on("input", () => {
      this.textContent = this.textContentEl.html();
      window.dispatchEvent(new Event("viewupdate"));
    });
    this.update();
  }

  get contentWidth() {
    return Math.max(this.textContentEl[0].clientWidth, 40);
  }

  get contentHeight() {
    return Math.max(this.textContentEl[0].clientHeight, 40);
  }

  get totalWidth() {
    return Math.max(this.contentWidth, this.textWidth);
  }

  get totalHeight() {
    return this.contentHeight + this.textHeight;
  }
  get content() {
    return this.textContent;
  }
  set content(v) {
    this.textContent = v;
    this.update();
  }

  update() {
    super.update();
    if (!this.svgArea) {
      return;
    }

    if (this.textContentEl.html() !== this.textContent) {
      this.textContentEl.html(this.textContent);
    }
    $(this.lines[0])
      .attr("x1", "0")
      .attr("x2", this.width)
      .attr("y1", "0")
      .attr("y2", "0");
    $(this.lines[1])
      .attr("x1", this.width)
      .attr("x2", this.width)
      .attr("y1", "0")
      .attr("y2", this.height);
    $(this.lines[2])
      .attr("x1", "0")
      .attr("x2", "0")
      .attr("y1", "0")
      .attr("y2", this.height);
    $(this.lines[3])
      .attr("x1", "0")
      .attr("x2", this.width)
      .attr("y1", this.height)
      .attr("y2", this.height);
    $(this.lines[4])
      .attr("x1", "0")
      .attr("x2", this.width)
      .attr("y1", this.height)
      .attr("y2", this.height);
  }
  toJSON() {
    const json = super.toJSON();
    json.content = this.textContent;
    return json;
  }
}

class ClassNode extends Node {
  constructor(name, type, id, fieldTexts, methodTexts) {
    super(name, type, id);

    this.svgArea = $(this.el).find("svg");

    this.svgArea.html(
      `<rect fill="none" stroke="black" stroke-width="3"></rect><line></line><line></line>`
    );
    this.lines = this.svgArea.find("line");
    this.rect = this.svgArea.find("rect");
    this.textContent1 = fieldTexts || "";
    this.textContent2 = methodTexts || "";
    this.textContentEl1 = $($(this.el).find(".node-text-content")[0]);
    this.textContentEl2 = $($(this.el).find(".node-text-content")[1]);
    this.textContentEl1.html(this.textContent1);
    this.textContentEl2.html(this.textContent2);

    $(this.textContentEl1).on("input", () => {
      this.textContent1 = this.textContentEl1.html();
      this.update();
      window.dispatchEvent(new Event("viewupdate"));
    });
    $(this.textContentEl2).on("input", () => {
      this.textContent2 = this.textContentEl2.html();
      this.update();
      window.dispatchEvent(new Event("viewupdate"));
    });
    this.container = $(this.el).find(".node-inner");
    this.update();
  }
  get totalWidth() {
    return this.container.width();
  }
  get totalHeight() {
    return this.container.height();
  }
  update() {
    super.update();

    if (!this.svgArea) {
      return;
    }

    this.rect.attr("x", "0").attr({
      x: "0",
      y: "0",
      width: this.width,
      height: this.height,
    });
  }
  toJSON() {
    const json = super.toJSON();
    json.content1 = this.textContent1;
    json.content2 = this.textContent2;
    return json;
  }
}
