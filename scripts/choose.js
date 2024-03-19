isChosen = false;
let getHandle;

getItem();

function getItem () {
    getHandle = document.getElementsByClassName('getItem');
    getHandle.addEventListener('onclick', chooseItem);
}

function chooseItem (event) {
    var element = document.getElementById("main");
    element.insertAdjacentHTML( 'afterend', Elements.Rectangle );
}