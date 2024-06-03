import {Draggable} from "./draggable.js"
import {Socket} from "./socket.js"
import {Selection} from "./selection.js"
import { View } from "./view.js";

export class Node{
    static idC = 0;
    static nodes = {}
    constructor(el, name = "", type="default"){
        this.id = Node.idC;
        Node.idC++;
        Node.nodes[this.id] = this;
        this.el = el;
        this.drag = new Draggable(el, this.onNodePressed.bind(this), this.onNodeReleased.bind(this), this.onNodeMove.bind(this));
        this.pos = [0, 0]
        this.opos = null;
        this.sockets = {
            "up":new Socket($(el).find(".node-connection-socket.up")[0], this, "up"),
            "left":new Socket($(el).find(".node-connection-socket.left")[0], this, "left"),
            "down":new Socket($(el).find(".node-connection-socket.down")[0], this, "down"),
            "right":new Socket($(el).find(".node-connection-socket.right")[0], this, "right"),
        }
        this.type = type;
        this.ptype = this.type;
        this.el.classList.add(this.type)
        this.name = name
        this.textEl = $(this.el).find(".node-text")[0]
        this.textEl.addEventListener("dblclick", ()=>{
            $(this.textEl).attr("contenteditable", true)
            this.textEl.focus();
            window.getSelection().selectAllChildren(this.textEl)
        })
        this.textEl.addEventListener("focusout", (e)=>{
            this.onRename(e)
            $(this.textEl).attr("contenteditable", false)
        })
        this.update();
    }
    onNodeMove(e, delta){
        Selection.singleton.moveAll(delta)
    }
    moveOn(delta){
        this.pos = [this.opos[0] + delta[0], this.opos[1] + delta[1]]
        this.update();
    }
    press(e){
        this.opos = [...this.pos];
    }
    onNodePressed(e){
        
        if(!e.shiftKey){
            Selection.singleton.clear();
        }
        Selection.singleton.add(this)
        Selection.singleton.pressAll(e)
        this.el.classList.add("selected")
        
    }
    onNodeReleased(e){
        this.opos = null;
    }
    update(){
        this.el.style.transform = `translate(${this.pos[0]}px, ${this.pos[1]}px)`
        for(const key in this.sockets){
            this.sockets[key].update();
        }
        this.textEl.innerHTML = this.name;
        if(this.type != this.ptype){
            this.el.classList.remove(this.ptype)
            this.ptype = this.type;
            this.el.classList.add(this.type)
        }
    }
    static create(templateName, text, type){
        const el = $($(`#${templateName}`).html());
        console.log(el)
        View.singleton.el.appendChild(el[0])
        return new Node(el[0], text, type)
    }
    destroy(){
        for(const key in this.sockets){
            this.sockets[key].destroy();
        }
    }
    onRename(e){
        this.name = this.textEl.innerHTML
    }
}

