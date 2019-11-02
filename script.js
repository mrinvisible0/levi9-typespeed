class Word {
    constructor(word, parent, onFinished){
        this.word = word;
        this.parent = parent;
        this.gameFieldWidth = parent.clientWidth;
        this.onFinished = onFinished;
        this.__createElem();
        this.__startAnimation();
    }

    erase(){
        if(this.intervalId){
            clearInterval(this.intervalId);
            this.wordElem.innerHTML = "";
            this.parent.removeChild(this.wordElem);
            this.intervalId = this.word = this.width = this.height = null;
        }
    }

    // changeWordAndRestart(word){
    //     this.word = word;
    //     this.__createElem();
    //     this.__startAnimation();
    // }

    __createElem(){
        this.wordElem = createAndAppend("span", {"class": "word", "id": "word"}, this.parent);
        this.wordElem.innerHTML = this.word;
        this.height = this.wordElem.clientHeight;
        this.wordElem.style.top = Math.floor(Math.random()*(500-this.height)) + "px";
        this.pos = 0;
        this.width = this.wordElem.clientWidth;
    }

    __startAnimation(){
        this.intervalId = setInterval(()=>{
            if(this.pos + this.width >= this.gameFieldWidth){
                this.onFinished();
                this.erase();
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
    const scoreElem = createAndAppend("p", {}, gameInfo);
    const missedElem = createAndAppend("p", {}, gameInfo);
    missedElem.innerHTML = 0;
    scoreElem.innerHTML =  0;
    const inputField = createAndAppend("input", {"type":"text", "class": "row ml-1 mt-1"}, root);
    let cnt = 0;
    let missed = 0;
    inputField.onkeypress = (e)=>{
        if(e.key === "Enter"){
            let text = inputField.value;
            inputField.value = "";
            if(wordObjectsOnScreen.hasOwnProperty(text)){
                wordObjectsOnScreen[text].erase();
                delete wordObjectsOnScreen[text];
                cnt += 1;
                scoreElem.innerHTML = cnt;
            }
        }
    };
    let wordObjectsOnScreen = {};
    // let wordObjectsTrashcan = [];
    //this goes to another thread
    for (const word of words) {
        setTimeout(() => {
            wordObjectsOnScreen[word] = new Word(word, gameField, ()=>{
                delete wordObjectsOnScreen[word];
                missed++;
                missedElem.innerHTML = missed;
            });
        }, Math.floor(MIN_PERIOD + Math.random() * (MAX_PERIOD - MIN_PERIOD)))
    }
}