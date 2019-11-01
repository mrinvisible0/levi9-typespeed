class Word {
    constructor(word, parent){
        this.word = word;
        this.wordElem = createAndAppend("span", {"class": "word", "id": "word"}, parent);
        this.wordElem.innerHTML = word;
        this.height = this.wordElem.clientHeight;
        this.wordElem.style.top = Math.floor(Math.random()*(500-this.height)) + "px";
        this.pos = 0;
        this.width = this.wordElem.clientWidth;
        this.gameFieldWidth = parent.clientWidth;
        this.intervalId = setInterval(()=>{
            if(this.pos + this.width >= this.gameFieldWidth){
                clearInterval(this.intervalId);
                this.wordElem.innerHTML="";
            }
            else{
                this.pos += 10;
                this.wordElem.style.left = this.pos + 'px';
            }
        }, 100);
    }


}

function createAndAppend(tagName, attributes, appendTo){
    let el = document.createElement(tagName);
    for(const [key, value] of Object.entries(attributes)){
        el.setAttribute(key, value);
    }
    appendTo.appendChild(el);
    return el;
}

function load(_e) {
    const root = $("#root")[0];
    const MIN_PERIOD = 500;
    const MAX_PERIOD = 2000;
    let words = new Set(["trlababalan",
        ..."nisam nisam devojka tvoga druga".split(" "),
        ..."da se ja pitam ja bi tuda protero autobus".split(" ")]);
    const gameField = createAndAppend("div", {"class": "col-9 ml-1 mr-1 gameField"}, root);
    const gameInfo = createAndAppend("div", {"class": "col-2 ml-1 gameInfo"}, root);
    let wordObjects = [];
    let wordObjectsTrashcan = [];
    //this goes to another thread
    for (const word of words) {
        setTimeout(() => {
            wordObjects.push(new Word(word, gameField));
        }, Math.floor(MIN_PERIOD + Math.random() * (MAX_PERIOD - MIN_PERIOD)))
    }
}