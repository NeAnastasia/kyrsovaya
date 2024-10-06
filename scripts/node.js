import { Draggable } from "./draggable.js";
import { Socket } from "./socket.js";
import { Selection } from "./selection.js";
import { View } from "./view.js";
import { TextMenu } from "./textMenu.js";

export class Node {
  static idC = 0;
  static nodes = {};
  #width = 140;
  #height = 140;
  static deductTemplate(type) {
    switch (type) {
      case "object": {
        return "object-node-template";
      }
      case "class": {
        return "class-node-template";
      }
      default: {
        return "node-template";
      }
    }
  }
  constructor(name = "", type = "default", id = "") {
    if (id === "") {
      this.id = "node-" + Node.idC;
      Node.idC++;
    } else {
      this.id = id;
      Node.idC = parseInt(id.replace("node-", ""), 10);
      Node.idC = Node.idC + 1;
    }
    this.type = type;
    this.ptype = this.type;
    Node.nodes[parseInt(id.replace("node-", ""), 10)] = this;
    this.templateName = Node.deductTemplate(this.type);
    this.el = $($(`#${this.templateName}`).html())[0];
    this.drag = new Draggable(
      this.el,
      this.onNodePressed.bind(this),
      this.onNodeReleased.bind(this),
      this.onNodeMove.bind(this)
    );
    this.pos = [0, 0];
    this.opos = null;
    this.pressType = 0;

    this.sockets = {
      up: new Socket(
        $(this.el).find(".node-connection-socket.up")[0],
        this,
        "up"
      ),
      upright: new Socket(
        $(this.el).find(".node-connection-socket.upright")[0],
        this,
        "upright"
      ),
      upleft: new Socket(
        $(this.el).find(".node-connection-socket.upleft")[0],
        this,
        "upleft"
      ),
      left: new Socket(
        $(this.el).find(".node-connection-socket.left")[0],
        this,
        "left"
      ),
      leftup: new Socket(
        $(this.el).find(".node-connection-socket.leftup")[0],
        this,
        "leftup"
      ),
      leftdown: new Socket(
        $(this.el).find(".node-connection-socket.leftdown")[0],
        this,
        "leftdown"
      ),
      down: new Socket(
        $(this.el).find(".node-connection-socket.down")[0],
        this,
        "down"
      ),
      downright: new Socket(
        $(this.el).find(".node-connection-socket.downright")[0],
        this,
        "downright"
      ),
      downleft: new Socket(
        $(this.el).find(".node-connection-socket.downleft")[0],
        this,
        "downleft"
      ),
      right: new Socket(
        $(this.el).find(".node-connection-socket.right")[0],
        this,
        "right"
      ),
      rightup: new Socket(
        $(this.el).find(".node-connection-socket.rightup")[0],
        this,
        "rightup"
      ),
      rightdown: new Socket(
        $(this.el).find(".node-connection-socket.rightdown")[0],
        this,
        "rightdown"
      ),
    };
    this.el.classList.add(this.type);
    this.name = name;
    this.textEl = $(this.el).find(".node-text")[0];
    this.textEl.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    $(this.textEl).click((e) => {
      if ($(".text-menu").length === 0) {
        TextMenu.singleton.appearing(e.target.classList, e.target);
      } else {
        TextMenu.singleton.changeObject(e.target.classList, e.target);
      }
      $(this.textEl).attr("contenteditable", true);
      this.textEl.focus();
      window.getSelection().selectAllChildren(this.textEl);
    });
    $(document.getElementsByClassName("node-text-content")).click((e) => {
      e.stopPropagation();
      if ($(".text-menu").length === 0) {
        TextMenu.singleton.appearing(e.target.classList, e.target);
      } else {
        TextMenu.singleton.changeObject(e.target.classList, e.target);
      }
    });
    $(this.textEl).on("focusout", (e) => {
      this.onRename(e);
      $(this.textEl).attr("contenteditable", false);
      window.dispatchEvent(new Event("viewupdate"));
    });
    this.textEl.addEventListener("input", (e) => {
      this.onRename(e);
    });
    window.addEventListener("mousemove", this.#mmraw.bind(this));
    this.update();
  }
  #mmraw(e) {
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
    return this.pos[1] + this.#height;
  }
  getAcrossXPosition() {
    return this.pos[0] + this.#width;
  }
  onNodeMove(e, delta) {
    if (this.pressType == 0) {
      Selection.singleton.moveAll(delta);
    } else {
      this.#width = Math.max(this.opos[0] + delta[0], 40);
      this.#height = Math.max(this.opos[1] + delta[1], 40);
      this.scaleElementRequest();
      this.update();
    }
  }
  moveOn(delta) {
    this.pos = [this.opos[0] + delta[0], this.opos[1] + delta[1]];
    this.moveElementRequest();
    this.update();
  }
  press(e) {
    this.opos = [...this.pos];
  }
  onNodePressed(e) {
    const coords = [e.pageX, e.pageY];
    const rect = this.el.getBoundingClientRect();
    if (
      coords[0] > rect.x + rect.width - 20 &&
      coords[1] > rect.y + rect.height - 20
    ) {
      this.opos = [this.#width, this.#height];
      e.preventDefault();
      this.pressType = 1;
      this.el.classList.add("selected");
      return;
    }
    this.pressType = 0;
    if (!e.shiftKey) {
      Selection.singleton.clear();
    } else {
      e.preventDefault();
    }
    Selection.singleton.add(this);
    Selection.singleton.pressAll(e);
    this.el.classList.add("selected");
  }
  onNodeReleased(e) {
    this.opos = null;
    window.dispatchEvent(new Event("viewupdate"));
  }
  update() {
    this.el.style.transform = `translate(${this.pos[0]}px, ${this.pos[1]}px)`;
    this.el.style.width = `${this.#width}px`;
    this.el.style.height = `${this.#height}px`;
    for (const key in this.sockets) {
      this.sockets[key].update();
    }
    if (this.textEl.innerHTML != this.name) {
      this.textEl.innerHTML = this.name;
    }

    if (this.type != this.ptype) {
      this.el.classList.remove(this.ptype);
      this.ptype = this.type;
      this.el.classList.add(this.type);
    }
  }
  remove() {
    this.removeElementRequest();
    $(this.el).remove();
  }
  destroy() {
    for (const key in this.sockets) {
      this.sockets[key].destroy();
    }
    window.dispatchEvent(new Event("viewupdate"));
  }
  onRename(e) {
    this.name = this.textEl.innerHTML;
    this.update();
  }
  moveElementRequest() {
    $.ajax({
      url: "/diagram/" + localStorage.getItem("diagramId") + "/operation/move",
      method: "post",
      dataType: "json",
      data: {
        elementId: this.id,
        position: {
          x: this.pos[0],
          y: this.pos[1],
        },
      },
      success: function () {
        console.log("moveInfoIsSent");
      },
    });
  }
  scaleElementRequest() {
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
  removeElementRequest() {
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
  addElementRequest() {
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
    const tname = json.type || "default";
    let node;
    switch (tname) {
      case "default":
        {
          node = new RectNode(json.text, json.type, json.id);
        }
        break;
      case "rhombus":
        {
          node = new RhombusNode(json.text, json.type, json.id);
        }
        break;
      case "object":
        {
          node = new ObjectNode(json.text, json.type, json.id, json.content1);
        }
        break;
      case "class":
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

    node.pos = [...json.pos];
    View.singleton.addNode(node);
    node.update();
    return node;
  }
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      pos: this.pos,
      text: this.name,
    };
  }
  get textWidth() {
    return Math.max(this.textEl.clientWidth, 40);
  }
  get textHeight() {
    return Math.max(this.textEl.clientHeight, 40);
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
      this.textContent = this.textContentEl.val();
      window.dispatchEvent(new Event("viewupdate"));
    });
  }

  onContentEdited(e) {
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

    if (this.textContent != this.textContentEl.val()) {
      this.textContentEl.val(this.textContent);
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
    this.textContentEl1.val(this.textContent1);
    this.textContentEl2.val(this.textContent2);

    this.textContentEl1.on("input", () => {
      this.textContent1 = this.textContentEl1.val();
      this.checkPlus();
      window.dispatchEvent(new Event("viewupdate"));
    });
    this.textContentEl2.on("input", () => {
      this.textContent2 = this.textContentEl2.val();
      this.checkPlus();
      window.dispatchEvent(new Event("viewupdate"));
    });
    this.container = $(this.el).find(".node-inner");
    this.checkPlus();
  }
  checkPlus() {
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
    if (this.textContentEl1.val() != this.textContent1) {
      this.textContentEl1.val(this.textContent1);
    }
    if (this.textContentEl2.val() != this.textContent2) {
      this.textContentEl2.val(this.textContent2);
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
