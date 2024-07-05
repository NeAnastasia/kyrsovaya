import { Connector } from "./connector.js";

export class Socket{
    constructor(el, parent = null, type="up"){
        if(el == null){return}
        this.parent = parent;
        this.el = el;
        this.type = type
        this.connections = []
        this.el.addEventListener("mousedown", (e)=>{
            e.preventDefault();
            e.stopPropagation();
            if(Connector.singleton.currentSocket == null){
                Connector.singleton.currentSocket = this;
                console.log("grabbed")
            }
            else{
                Connector.singleton.connect(this)
                console.log("connected")
            }
        })
        
    }
    addConnection(conn){
        this.connections.push(conn)
        return this;
    }
    removeConnection(conn){
        const index = this.connections.indexOf(conn)
        if(index == -1){
            return this;
        }
        this.connections.splice(index, 1)
        return this;
    }
    getAbsolutePosition(){
        return [this.parent.pos[0] + this.el.offsetLeft + this.el.offsetWidth/2, this.parent.pos[1] + this.el.offsetTop + this.el.offsetHeight/2]
    }
    update(){
        if(this.el == null){return}
        for(const item of this.connections){
            item.update();
        }
    }
    destroy(){
        const conns = [...this.connections]
        for(const c of conns){
            c.destroy()
        }
    }
}