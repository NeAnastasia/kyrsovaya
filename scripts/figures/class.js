function createDefaultClass(){
    const el = document.createElementNS('http://www.w3.org/2000/svg', "g");
    el.classList.add("draggable");
    const path = document.createElementNS('http://www.w3.org/2000/svg', "path")
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black")
    path.setAttribute("stroke-width", "1")
    path.addEventListener("dblclick", mouseoverArrow)
    el.appendChild(path)
    el.setAttribute("pointer-events", "all")
    const text = document.createElement("div")
    text.addEventListener("dblclick", writingInside)
    text.setAttribute("class", "text")
    text.innerHTML = "Заголовок";
    document.getElementById("text-container").appendChild(text);
    const drag = new Draggable(el, text, 150, 150, 200, 200)
    document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg")[1].appendChild(el)
    
    drag.update();
    
    return drag;
  }
  
  window.addEventListener("load", function(){
    const svg = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", "svg")[1]
    svg.addEventListener("mousedown", ()=>{Selection.singleton.clear()})
  })