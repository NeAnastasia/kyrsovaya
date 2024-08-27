import { View } from "./view.js";
import { Node } from "./node.js";
export class ContextItem{
    #name
    #parent
    constructor(parent, name, templateName){
        this.#parent = parent
        this.templateName = templateName;
        this.#name = name
        this.el = $(`<div class="context-item"><div class="context-view-area"></div><div class="context-item-name">${this.#name}</div></div>`)
        this.viewArea = this.el.find("div.context-view-area")
        this.nameEl = this.el.find("div.context-item.name")
        this.#parent.container.append(this.el)
        this.el.on("click", ()=>{
            const pos = [0, 0]
            const r = View.singleton.el.getBoundingClientRect()
            pos[0] = View.singleton.el.clientWidth/2 - r.left
            pos[1] = View.singleton.el.clientHeight/2 - r.top
            const data = {
                type:ContextMenu.list[this.#name],
                text:"text",
                pos:pos,
            }
            const n = Node.fromJSON(data)
            console.log(n)
        })
        this.render()
        
    }
    get name(){return this.#name}
    set name(v){this.#name = v; this.nameEl.html(this.#name)}
    render(){
        const i = $($(`#${this.templateName}-context`).html())
        this.viewArea.html(i)
    }
}

export class ContextMenu{
    #el
    #container
    #title = "Фигуры";
    #titleEl
    #items = []
    static list = {
        "Прямоугольник":"default",
        "Ромб":"rhombus",
        "Объект":"object",
        "Класс":"class",
    }
    constructor(){
        this.#el = $(`<div id="context-menu"><div class="context-menu-title">${this.#title}</div><div class="context-menu-container"></div></div>`)
        this.#container = this.#el.find("div.context-menu-container")
        this.#titleEl = this.#el.find("div.context-menu-title")
        this.refreshList()
        this.#el.appendTo(document.body)
    }
    get title(){return this.#title}
    set title(v){this.#title=v;this.#titleEl.html(this.#title)}
    refreshList(){
        this.#container.html("")
        this.#items.splice(0)
        for(const name in this.constructor.list){
            this.#items.push(new ContextItem(this, name, this.constructor.list[name]))
        }
    }
    get container(){return this.#container}
}