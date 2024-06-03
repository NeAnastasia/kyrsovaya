import { Draggable } from "./draggable.js"
import { Selection } from "./selection.js";

export class View{
    static singleton = new View();
    constructor(){
        this.el = $("#view-area")[0]
        this.container = $("#view")[0]
        window.addEventListener("mousedown", this.down.bind(this))
        window.addEventListener("mouseup", this.up.bind(this))
        window.addEventListener("mousemove", this.move.bind(this))
        window.addEventListener("click", this.click.bind(this))
        this.opos = null;
        this.pos = [0, 0]
    }
    down(e){
        e.preventDefault();
        e.stopPropagation();
        Selection.singleton.clear();
        this._sp = [e.pageX, e.pageY]
        this.opos = [...this.pos];
        //document.activeElement.blur()
    }
    up(e){
        e.preventDefault();
        e.stopPropagation();
        this.opos = null;
        this._sp = null
        
    }
    move(e){
        e.preventDefault();
        e.stopPropagation();
        if(this.opos == null){return}
        this.pos = [this.opos[0] + e.pageX - this._sp[0], this.opos[1] + e.pageY - this._sp[1]]
        this.update();
    }
    click(e){
        document.activeElement.blur()
    }
    update(){this.el.style.transform = `translate(${this.pos[0]}px, ${this.pos[1]}px)`}
}