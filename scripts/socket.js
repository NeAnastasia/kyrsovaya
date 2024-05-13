import { Connector } from "./connector.js";

export class Socket{
    constructor(el, parent = null, type="up"){
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
        for(const item of this.connections){
            item.update();
        }
        // if(this.connections.length > 0){
        //     if(!this.el.classList.contains("connected")){
        //         this.el.classList.add("connected")
        //     }
        // }
        // else{
        //     if(this.el.classList.contains("connected")){
        //         this.el.classList.remove("connected")
        //     }
        // }
    }
    destroy(){
        for(let i = this.connections.length - 1; i >=0; i++){
            this.connections[i].destroy();
        }
    }
}