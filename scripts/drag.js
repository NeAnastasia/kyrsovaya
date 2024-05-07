class Draggable {
  constructor(el, text, x, y, width, height, circles) {
    this.parentSel = null;
    this.text = text;
    this.el = el;
    this.x = x;
    this.y = y; //Left upper corner
    this.width = width;
    this.height = height;
    this.headerPadding = 100;
    this.fontSize = 20;
    this.circles = [
      new Circle(this.x + this.width, this.y + this.height / 2, 10),
      new Circle(this.x, this.y + this.height / 2, 10),
      new Circle(this.x + this.width / 2, this.y, 10),
      new Circle(this.x + this.width / 2, this.y + this.height, 10)
    ];
    this.startingPos = null;
    this.#initEvents();
  }
  #initEvents() {
    this.el.addEventListener("mousedown", this.mousedown.bind(this));
    this.el.addEventListener("mouseenter", this.mouseenter.bind(this));
    this.el.addEventListener("mouseleave", this.mouseleave.bind(this));
    window.addEventListener("mousemove", this.move.bind(this));
    window.addEventListener("mouseup", this.mouseup.bind(this));
  }
  setParent(sel) {
    this.parentSel = sel;
    if (sel == null) {
      this.el.classList.remove("selected");
    } else {
      this.el.classList.add("selected");
    }
  }
  setHeaderPadding(headerPadding) {
    this.headerPadding = headerPadding;
  }
  mousedown(e, ignore) {
    this.startingPos = [e.pageX, e.pageY];
    this.elPos = [this.x, this.y];
    if (!this.parentSel) {
      if (!e.shiftKey) {
        Selection.singleton.clear();
      }
      Selection.singleton.add(this);
    }
    if (this.parentSel && !ignore) {
      this.parentSel.startAll(this, e);
    }
    e.stopPropagation();
  }
  move(e, ignore) {
    if (this.startingPos == null) {
      return;
    }
    const dx = e.pageX - this.startingPos[0];
    const dy = e.pageY - this.startingPos[1];
    this.translate(dx, dy);
    if (this.parentSel && !ignore) {
      this.parentSel.moveAll(this, e);
    }
  }
  mouseup(e, ignore) {
    if (this.startingPos == null) {
      return;
    }
    this.elPos = null;
    this.startingPos = null;
    if (this.parentSel && !ignore) {
      this.parentSel.stopAll(this, e);
    }
  }
  mouseenter(e, ignore) {
    for (var i = 0; i < this.circles.length; i++) {
      this.el.parentElement.appendChild(this.circles[i].element);
    }
  }
  mouseleave(e, ignore) {
    console.log("AAAA");
  }
  translate(dx, dy) {
    this.x = this.elPos[0] + dx;
    this.y = this.elPos[1] + dy;
    this.update();
  }
  update() {
    this.text.style.left =
      this.x + this.width + this.headerPadding / 2 + 150 + "px";
    this.text.style.top = this.y + this.headerPadding / 2 + "px";
    this.el.children[0].setAttribute(
      "d",
      `M${this.x} ${this.y} ${this.x + this.width} ${this.y} ${
        this.x + this.width
      } ${this.y + this.height} ${this.x} ${this.y + this.height} ${this.x} ${
        this.y
      }M${this.x} ${this.y + this.headerPadding} ${this.x + this.width} ${
        this.y + this.headerPadding
      }`
    );

    this.circles[0].element.parentNode.removeChild(this.circles[0].element)
    // for(var i = 0; i<this.circles.length; i++){
    //   this.circles[i].update(100);
    // }
  }
}
