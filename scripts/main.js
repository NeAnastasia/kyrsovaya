import {Node} from "./node.js"
import { View } from "./view.js";


!function(items){
    for(const key in items){
        globalThis[key] = items[key]
    }
}(
    {
        "Node":Node,
        "getNode":function(id){return Node.nodes[id];}
    }
)

$(document).ready(function(e){
    Node.create("node-template","test1","default")
    Node.create("node-template","test1","default")
})