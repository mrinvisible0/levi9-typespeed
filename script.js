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

    changeWordAndRestart(word){
        this.word = word;
        this.__createElem();
        this.__startAnimation();
    }

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
                this.onFinished(this.word);
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

function* getFromSet(set){
    for(let s of set){
        yield s;
    }
}

//TODO: this function is way to big, refactor to class, make use of encapsulation
//      get rid of arrow functions, they are there only bcs they capture scope, once it is class, there is no need for that
function load(_e) {
    const root = $("#root")[0];
    const MIN_PERIOD = 1500;
    const MAX_PERIOD = 5000;
    let words = new Set(["trlababalan",
        ..."nisam nisam devojka tvoga druga".split(" "),
        ..."da se ja pitam ja bi tuda protero autobus".split(" "), "stewardess"]);
    let r = new WordDifficultyMeter(qwerty);
    for(let s of words){
        console.log(s + ": " + r.meassure(s));
    }
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
                let tmp = wordObjectsOnScreen[text];
                wordObjectsOnScreen[text] = undefined;
                delete wordObjectsOnScreen[text];
                wordObjectsTrashcan.push(tmp);
                cnt += 1;
                scoreElem.innerHTML = cnt;
            }
        }
    };
    let wordObjectsOnScreen = {};
    let wordObjectsTrashcan = [];

    let onFinished = (word)=>{
        let tmp = wordObjectsOnScreen[word];
        wordObjectsOnScreen[word] = undefined;
        delete wordObjectsOnScreen[word];
        wordObjectsTrashcan.push(tmp);
        missed++;
        missedElem.innerHTML = missed;
    };
    let timeout = (wordsIterator)=>{
        let next = wordsIterator.next();
        if (next.done){
            return;
        }
        setTimeout(() => {
            //TODO: check race condition for wordObjectsTrashcan
            let word = next.value;
            if(wordObjectsTrashcan.length === 0) {
                wordObjectsOnScreen[word] = new Word(word, gameField, onFinished);
            }
            else{
                let tmp = wordObjectsTrashcan.pop();
                tmp.changeWordAndRestart(word);
                wordObjectsOnScreen[word] = tmp;
            }
            timeout(wordsIterator);
        }, Math.floor(MIN_PERIOD + Math.random() * (MAX_PERIOD - MIN_PERIOD)))

    };
    let wordsGenerator = getFromSet(words);
    timeout(wordsGenerator);
}
