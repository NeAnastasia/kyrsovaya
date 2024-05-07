class Circle {
  constructor(cx, cy, r) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.element = this.createCircle();
    //this.#initEvents();
  }

//   #initEvents() {

//   }
  createCircle() {
    const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", this.cx);
      circle.setAttribute("cy", this.cy);
      circle.setAttribute("r", this.r);
    return circle;
  }

  update() {
    
  }
}
