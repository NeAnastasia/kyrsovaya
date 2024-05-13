
export class Draggable{
    constructor(el, onMouseDown = ()=>{}, onMouseUp=()=>{}, onMouseMove=()=>{}){
        this.el = el;
        window.addEventListener("mousemove", this.move.bind(this))
        this.el.addEventListener("mousedown", this.down.bind(this))
        window.addEventListener("mouseup", this.up.bind(this))
        this._sp = null;
        this.md = onMouseDown;
        this.mu = onMouseUp;
        this.mm = onMouseMove;
    }
    down(e){
        e.preventDefault();
        e.stopPropagation();
        
        if(this.sp != null){
            console.log("Already downed")
            return;
        }
        this._sp = [e.pageX, e.pageY]
        this.md(e, this._sp);
    }
    up(e){
        e.preventDefault();
        e.stopPropagation();
        if(this._sp == null){
            console.log("Not downed")
            return;
        }
        this._sp = null;
        this.mu(e)
    }
    move(e){
        e.preventDefault();
        e.stopPropagation();
        if(this._sp == null){
            return;
        }
        const delta = [e.pageX - this._sp[0], e.pageY - this._sp[1]]
        this.mm(e, delta)
    }
}