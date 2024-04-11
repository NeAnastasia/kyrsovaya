class Draggable{
  constructor(el, x, y, width, height){
      this.parentSel = null;
      this.el = el;
      this.x = x;
      this.y = y; //Left upper corner
      this.width = width;
      this.height = height;
      this.headerPadding = 100;
      this.fontSize = 20;
      this.startingPos = null
      this.#initEvents();
  }
  #initEvents(){
      this.el.addEventListener("mousedown", this.mousedown.bind(this));
      window.addEventListener("mousemove", this.move.bind(this));
      window.addEventListener("mouseup", this.mouseup.bind(this))
  }
  setParent(sel){
      this.parentSel = sel;
      if(sel == null){
          this.el.classList.remove("selected")
      }
      else{
          this.el.classList.add("selected")
      }
  }
  setHeaderPadding(headerPadding){
      this.headerPadding = headerPadding;
  }
  mousedown(e, ignore){
      this.startingPos = [e.pageX, e.pageY];
      this.elPos = [this.x, this.y]
      if(!this.parentSel){
          if(!e.shiftKey){
              Selection.singleton.clear();
          }
          Selection.singleton.add(this)
      }
      if(this.parentSel && !ignore){
          this.parentSel.startAll(this, e);
      }
      e.stopPropagation()
  }
  move(e, ignore){
      if(this.startingPos == null){
          return;
      }
      const dx = e.pageX - this.startingPos[0]
      const dy = e.pageY - this.startingPos[1]
      this.translate(dx, dy)
      if(this.parentSel && !ignore){
          this.parentSel.moveAll(this, e);
      }
  }
  mouseup(e, ignore){
      if(this.startingPos == null){
          return;
      }
      this.elPos = null;
      this.startingPos = null;
      if(this.parentSel && !ignore){
          this.parentSel.stopAll(this, e);
      }
  }
  translate(dx, dy){
      this.x = this.elPos[0] + dx
      this.y = this.elPos[1] + dy
      this.update();
  }
  update(){
      this.el.children[1].setAttribute("font-size", this.fontSize)
      this.el.children[1].setAttribute("x", `${this.x+this.headerPadding/2}`)
      this.el.children[1].setAttribute("y", `${this.y+this.headerPadding/2}`);
      this.el.children[0].setAttribute("d", `M${this.x} ${this.y} ${this.x+this.width} ${this.y} ${this.x+this.width} ${this.y+this.height} ${this.x} ${this.y+this.height} ${this.x} ${this.y}M${this.x} ${this.y+this.headerPadding} ${this.x+this.width} ${this.y+this.headerPadding}`);
  }
}


function createDefault(){
  const el = document.createElementNS('http://www.w3.org/2000/svg', "g");
  el.classList.add("draggable");
  const text = document.createElementNS('http://www.w3.org/2000/svg', "text")
  const path = document.createElementNS('http://www.w3.org/2000/svg', "path")
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "black")
  path.setAttribute("stroke-width", "1")
  el.appendChild(path)
  el.appendChild(text)
  text.innerHTML = "Заголовок"
  el.setAttribute("pointer-events", "all")
  
  const drag = new Draggable(el, 150, 150, 200, 200)
  document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg")[0].appendChild(el)
  drag.update();
  
  return drag;
}

window.addEventListener("load", function(){
  const svg = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg")[0]
  svg.addEventListener("mousedown", ()=>{Selection.singleton.clear()})
})