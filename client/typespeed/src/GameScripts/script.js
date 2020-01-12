import Game  from"./Game/Game.js";
function createAndAppend(tagName, attributes, appendTo){
    let el = document.createElement(tagName);
    for(const [key, value] of Object.entries(attributes)){
        el.setAttribute(key, value);
    }
    appendTo.appendChild(el);
    return el;
}

function load() {
    let g = new Game();
    g.start();
}
export {createAndAppend, load};
