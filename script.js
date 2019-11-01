function createAndAppend(tagName, attributes, appendTo){
    let el = document.createElement(tagName);
    for(const [key, value] of Object.entries(attributes)){
        el.setAttribute(key, value);
    }
    appendTo.appendChild(el);
    return el;
}

function load(e){
    const root = $("#root")[0];
    const gameField = createAndAppend("div", {"class":"col-9 ml-1 mr-1 gameField"}, root);
    const gameInfo = createAndAppend("div", {"class": "col-2 ml-1 gameInfo"}, root);
    let wordElem = createAndAppend("span", {"class": "word", "id": "word"}, gameField);
    wordElem.innerHTML = word;
    let pos = 0;
    let width = wordElem.clientWidth;
    let gameFieldWidth = gameField.clientWidth;
    console.log(width);
    console.log(gameFieldWidth);
    var id = setInterval(()=>{
        if(pos + width >= gameFieldWidth){
            clearInterval(id);
        }
        else{
            pos += 10;
            wordElem.style.left = pos + 'px';
        }
    }, 100);
}
