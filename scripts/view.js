import { Connection } from "./connection.js";
import { Draggable } from "./draggable.js"
import { Selection } from "./selection.js";

export class View{
    static singleton = new View();
    constructor(){
        this.el = $("#view-area")[0]
        this.container = $("#view")[0]
        this.container.addEventListener("mousedown", this.down.bind(this))
        window.addEventListener("mouseup", this.up.bind(this))
        window.addEventListener("mousemove", this.move.bind(this))
        window.addEventListener("click", this.click.bind(this))
        this.opos = null;
        this.pos = [0, 0]
        this.nodes = []
        this.connections = []
        window.addEventListener("keydown", (e)=>{
            if(e.key==="Delete"){
                for(const node of Selection.singleton.els){
                    this.removeNode(node)
                }
                Selection.singleton.clear()
            }
        })
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
        if(e.target == this.el || e.target == this.container){
            document.activeElement.blur()
            Selection.singleton.clear()
        }
    }
    addNode(n){
        this.nodes.push(n)
        this.el.appendChild(n.el)
        window.dispatchEvent(new Event("viewupdate"))
    }
    removeNode(n){
        for(const sock of Object.values(n.sockets)){
            if(sock && sock.destroy){
                sock.destroy()
            }
            
        }
        const index = this.nodes.indexOf(n)
        
        if(index != -1){
            const n = this.nodes[index]
            this.nodes.splice(index, 1)
            n.remove();
            window.dispatchEvent(new Event("viewupdate"))
        }

    }
    removeConnection(c){
        const index = this.connections.indexOf(c)
        if(index == -1){
            return;
        }
        this.connections.splice(index, 1);
        c.destroy()
        window.dispatchEvent(new Event("viewupdate"))
    }
    
    addConnection(c){
        this.connections.push(c)
        window.dispatchEvent(new Event("viewupdate"))
    }
    update(){this.el.style.transform = `translate(${this.pos[0]}px, ${this.pos[1]}px)`}
    toJSON(){
        const ret = {
            nodes:[],
            connections:[]
        }
        for(const n of this.nodes){
            ret.nodes.push(n.toJSON())
        }
        for(const c of this.connections){
            ret.connections.push(c.toJSON())
        }
        return ret
    }
    fromJSON(json){
        this.clear()
        for(const n of json.nodes){
            Node.fromJSON(n)
        }
        for(const conn of json.connections){
            Connection.fromJSON(conn)
        }
        window.dispatchEvent(new Event("viewupdate"))
    }
    clear(){
        const tr = Object.values(Node.nodes);
        for(const n of tr){
            this.removeNode(n)
        }
        const trc = [...this.connections]
        for(const c of trc){
            this.removeConnection(c)
        }
        window.dispatchEvent(new Event("viewupdate"))
    }
}