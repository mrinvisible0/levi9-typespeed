class Game {
    constructor() {
        this.root = $("#GameRoot")[0];
        //these will regulate game speed
        this.MIN_PERIOD = 1500;
        this.MAX_PERIOD = 5000;
        //set of words, will be populated later
        this.words = new Set(["trlababalan",
            ..."nisam nisam devojka tvoga druga".split(" "),
            ..."da se ja pitam ja bi tuda protero autobus".split(" "), "stewardess", "koliko"]);

        this.__initGameLayout();
        //counters
        this.correctCount = 0;
        this.missedCount = 0;

        //generator
        this.wordsGenerator = this.__getWordGenerator();

        this.wordObjectsOnScreen = {};
        this.wordObjectsTrashcan = [];

        //explicit bindings
        for(let p of Object.getOwnPropertyNames(Game.prototype)) {
            if(p !== "constructor" && typeof this[p] === "function"){
                this[p] = this[p].bind(this);
            }
        }
    }

    //generator
    * __getWordGenerator(){
        for(let s of this.words){
            yield s;
        }
    }
    __initGameLayout() {
        this.gameField = createAndAppend("div", {"class": "col-9 ml-1 mr-1 gameField"}, this.root);
        this.gameInfo = createAndAppend("div", {"class": "col-2 ml-1 gameInfo"}, this.root);
        this.scoreElem = createAndAppend("p", {}, this.gameInfo);
        this.missedElem = createAndAppend("p", {}, this.gameInfo);
        this.missedElem.innerHTML = 0;
        this.scoreElem.innerHTML = 0;
        this.inputField = createAndAppend("input", {"type": "text", "class": "row ml-1 mt-1"}, this.root);
        //has to be lambda
        this.inputField.onkeypress = (e)=>this.__inputFieldOnPressHandler(e);
    }

    __inputFieldOnPressHandler(e){
        if(e.key === "Enter"){
            console.log(this);
            let text = this.inputField.value;
            this.inputField.value = "";
            if(this.wordObjectsOnScreen.hasOwnProperty(text)){
                this.wordObjectsOnScreen[text].erase();
                this.__throwInTrashcan(text);
                this.correctCount += 1;
                this.scoreElem.innerHTML = this.correctCount;
            }
        }
    }

    //takes word(string), throws in trashcan object with that word
    __throwInTrashcan(word){
        let tmp = this.wordObjectsOnScreen[word];
        this.wordObjectsOnScreen[word] = undefined;
        delete this.wordObjectsOnScreen[word];
        this.wordObjectsTrashcan.push(tmp);
    }

    __onWordOutOfBounds(word){
        this.__throwInTrashcan(word);
        this.missedCount++;
        this.missedElem.innerHTML = this.missedCount;
    }

    __wordInserter(){
        let next = this.wordsGenerator.next();
        if (next.done){
            return;
        }
        setTimeout(() => {
            //TODO: check race condition for wordObjectsTrashcan
            let word = next.value;
            if(this.wordObjectsTrashcan.length === 0) {
                this.wordObjectsOnScreen[word] = new Word(word, this.gameField, this.__onWordOutOfBounds);
            }
            else{
                let tmp = this.wordObjectsTrashcan.pop();
                tmp.changeWordAndRestart(word);
                this.wordObjectsOnScreen[word] = tmp;
            }
            this.__wordInserter();
        }, Math.floor(this.MIN_PERIOD + Math.random() * (this.MAX_PERIOD - this.MIN_PERIOD)))
    }

    start(){
        this.__wordInserter();
    }
}




