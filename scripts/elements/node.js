import { Draggable } from "../logic/nodes/draggable.js";
import { NodeSocket } from "./socket.js";
import { Selection } from "../logic/nodes/selection.js";
import { View } from "./view.js";
import { TextMenu } from "../components/textMenu.js";
import { NodeType } from "../enum/NodeType.js";
import { SocketType } from "../enum/SocketType.js";
import { Point } from "../utils/point.js";
import { BaseOperationsURL } from "../consts/baseUrl.js";
import { OperationType } from "../enum/OperationType.js";
import { WebSocketConnection } from "../api/webSocket/webSocket.js";
import {
  moveAnyElementRequest,
  removeElementRequest,
} from "../api/http/elementsApiRequests.js";
import {
  scaleElementRequest,
  updateTextOfElementRequest,
} from "../api/http/nodeApiRequests.js";
import { NodeFieldType } from "../enum/NodeFieldType.js";

export class Node {
  static idC = 0;
  static nodes = {};
  #width;
  #height;
  #ptype;
  #opos;
  #pressType;
  #contentEls;
  #moveRequestCounter;
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
  constructor(name = "", type = NodeType.Default, id = "", position) {
    if (id === "") {
      this.id = "node-" + Node.idC;
      Node.idC++;
    } else {
      this.id = id;
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
    this.position = new Point(position.x, position.y);
    this.#opos = null;
    this.#pressType = 0;
    this.#width = 140;
    this.#height = 140;
    this.#moveRequestCounter = 0;

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
    this.name = name;
    this.#contentEls = $(this.el).find(".node-text-content");
    this.label = $(this.el).find(".node-text")[0];
    this.label.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    this.label.innerHTML = this.name;
    const allTextElements = $(this.label).add(this.#contentEls);
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
        TextMenu.getInstance().appearing(target);
      } else {
        TextMenu.getInstance().changeObject(target);
      }
      $(target).attr("contenteditable", true);
      target.focus();
    });
    $(allTextElements).on("focusout", (e) => {
      this.isDblClick = false;
      $(e.target).attr("contenteditable", false);
      
    });
    $(this.label).on("input", (e) => {
      this.#onRename(e);
    });
    window.addEventListener("mousemove", this.#mouseMoveRaw.bind(this));
    this.update();
  }
  getPosition() {
    return this.position;
  }
  #mouseMoveRaw(e) {
    const coords = new Point(e.pageX, e.pageY);
    const rect = this.el.getBoundingClientRect();
    e.preventDefault();
    if (
      coords.x > rect.x + rect.width - 20 &&
      coords.y > rect.y + rect.height - 20
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
      Selection.getInstance().moveAll(delta);
    } else {
      this.#width = Math.max(this.#opos.x + delta.x, 40);
      this.#height = Math.max(this.#opos.y + delta.y, 40);
      scaleElementRequest(this.id, this.#width, this.#height, this);
      this.update();
    }
  }
  moveOn(delta) {
    this.position.set(this.#opos.x + delta.x, this.#opos.y + delta.y);
    this.#moveRequestCounter++;
    if (this.#moveRequestCounter >= 100) {
      this.#moveElementRequest();
      this.#moveRequestCounter = 0;
    }
    this.update();
  }
  press(e) {
    this.#opos = new Point(this.position.x, this.position.y);
  }
  #onNodePressed(e) {
    const coords = new Point(e.pageX, e.pageY);
    const rect = this.el.getBoundingClientRect();
    if (
      coords.x > rect.x + rect.width - 20 &&
      coords.y > rect.y + rect.height - 20
    ) {
      this.#opos = new Point(this.#width, this.#height);
      e.preventDefault();
      this.#pressType = 1;
      this.el.classList.add("selected");
      return;
    }
    this.#pressType = 0;
    if (!e.shiftKey) {
      Selection.getInstance().clear();
    } else {
      e.preventDefault();
    }
    Selection.getInstance().add(this);
    Selection.getInstance().pressAll(e);
    this.el.classList.add("selected");
  }
  #onNodeReleased(e) {
    this.#opos = null;
    
    if (this.#moveRequestCounter !== 0) {
      this.#moveElementRequest();
      this.#moveRequestCounter = 0;
    }
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
    if (this.label.innerHTML !== this.name) {
      this.label.innerHTML = this.name;
    }
  }
  removeHTMLElement() {
    $(this.el).remove();
  }
  remove() {
    removeElementRequest(this.id, this);
    this.removeHTMLElement();
  }
  destroy() {
    for (const key in this.sockets) {
      this.sockets[key].destroy();
    }
    
  }
  scaleNode(width, height) {
    this.#width = width;
    this.#height = height;
    this.update();
  }
  #onRename(e) {
    this.name = this.label.innerHTML;
    updateTextOfElementRequest(this.id, NodeFieldType.Label, this.name, this);
    this.update();
  }
  getSocketByPosition(x, y) {
    return (
      Object.values(this.sockets).find((socket) => {
        const position = socket.getAbsolutePosition(); // Получаем позицию сокета
        return position.x === x && position.y === y; // Сравниваем координаты
      }) || null
    ); // Возвращаем найденный сокет или null, если не найден
  }
  #moveElementRequest() {
    for (const key in this.sockets) {
      this.sockets[key].updateArrowsPositionInDB();
    }
    moveAnyElementRequest(this.id, this.position, this);
  }
  static fromJSONofAnotherUser(json) {
    const node = this.fromJSON(json);
    node.id = json.Id;
    
  }
  static fromJSON(json) {
    const tname = json.NodeType || NodeType.Default;
    let node;
    switch (tname) {
      case NodeType.Default:
        {
          node = new RectNode(json.Label, tname, json.Id, {
            x: json.x,
            y: json.y,
          });
        }
        break;
      case NodeType.Rhombus:
        {
          node = new RhombusNode(json.Label, tname, json.Id, {
            x: json.x,
            y: json.y,
          });
        }
        break;
      case NodeType.Object:
        {
          node = new ObjectNode(json.Label, tname, json.Id, json.Content1, {
            x: json.x,
            y: json.y,
          });
        }
        break;
      case NodeType.Class:
        {
          node = new ClassNode(
            json.Label,
            tname,
            json.Id,
            json.Content1,
            json.Content2,
            { x: json.x, y: json.y }
          );
        }
        break;

      default:
        {
          node = new Node(json.Label, tname, json.Id, { x: json.x, y: json.y });
        }
        break;
    }
    node.#width = json.width !== undefined ? json.width : node.#width;
    node.#height = json.height !== undefined ? json.height : node.#height;
    View.getInstance().addNode(node);
    node.update();
    return node;
  }
  toJSON() {
    return {
      position: { x: this.position.x, y: this.position.y },
      size: { width: this.#width, height: this.#height },
      node_type: this.type,
      color: "#FF00FF",
      label: this.label.innerHTML,
    };
  }
  get textWidth() {
    return Math.max(this.label.clientWidth, 40);
  }
  get textHeight() {
    return Math.max(this.label.clientHeight, 40);
  }
  get width() {
    return this.#width;
  }
  get height() {
    return this.#height;
  }
}

class RectNode extends Node {
  constructor(name, type, id, position) {
    super(name, type, id, position);

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
  constructor(name, type, id, position) {
    super(name, type, id, position);

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
  constructor(name, type, id, content, position) {
    super(name, type, id, position);

    this.svgArea = $(this.el).find("svg");

    this.svgArea.html(
      `<line></line><line></line><line></line><line></line><line></line>`
    );
    this.lines = this.svgArea.find("line");
    this.textContent1 = content || "";
    this.textContentEl = $(this.el).find(".node-text-content");
    this.textContentEl.html(this.textContent1);
    this.textContentEl.on("input", () => {
      this.textContent1 = this.textContentEl.html();
      updateTextOfElementRequest(
        this.id,
        NodeFieldType.Content1,
        this.textContent1,
        this
      );
      
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
    return this.textContent1;
  }
  set content(v) {
    this.textContent1 = v;
    this.update();
  }

  update() {
    super.update();
    if (!this.svgArea) {
      return;
    }

    if (this.textContentEl.html() !== this.textContent1) {
      this.textContentEl.html(this.textContent1);
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
    json.content1 = this.textContent1;
    return json;
  }
}

class ClassNode extends Node {
  constructor(name, type, id, fieldTexts, methodTexts, position) {
    super(name, type, id, position);

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
      updateTextOfElementRequest(
        this.id,
        NodeFieldType.Content1,
        this.textContent1,
        this
      );
      
    });
    $(this.textContentEl2).on("input", () => {
      this.textContent2 = this.textContentEl2.html();
      this.update();
      updateTextOfElementRequest(
        this.id,
        NodeFieldType.Content2,
        this.textContent2,
        this
      );
      
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

    if (this.textContentEl1.html() !== this.textContent1) {
      this.textContentEl1.html(this.textContent1);
    }
    if (this.textContentEl2.html() !== this.textContent2) {
      this.textContentEl2.html(this.textContent2);
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
