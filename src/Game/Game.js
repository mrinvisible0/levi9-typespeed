class Game {
    constructor() {
        this.__root = $("#GameRoot")[0];
        this.__currentLevel = new Level(1000, 3000);
        //set of words, will be populated later
        this.__words = new Set(["trlababalan",
            ..."nisam nisam devojka tvoga druga".split(" "),
            ..."da se ja pitam ja bi tuda protero autobus".split(" "), "stewardess", "koliko"]);

        this.__initGameLayout();
        //counters
        this.__correctCount = 0;
        this.__missedCount = 0;

        //generator
        this.__wordsGenerator = this.__getWordGenerator();

        this.__wordObjectsOnScreen = {};
        this.__wordObjectsTrashcan = [];

        //explicit bindings
        for(let p of Object.getOwnPropertyNames(Game.prototype)) {
            if(p !== "constructor" && typeof this[p] === "function"){
                this[p] = this[p].bind(this);
            }
        }
    }

    //generator
    * __getWordGenerator(){
        for(let s of this.__words){
            yield s;
        }
    }
    __initGameLayout() {
        this.__gameField = createAndAppend("div", {"class": "col-9 ml-1 mr-1 gameField"}, this.__root);
        this.__gameInfo = createAndAppend("div", {"class": "col-2 ml-1 gameInfo"}, this.__root);
        this.__scoreElem = createAndAppend("p", {}, this.__gameInfo);
        this.__missedElem = createAndAppend("p", {}, this.__gameInfo);
        this.__missedElem.innerHTML = 0;
        this.__scoreElem.innerHTML = 0;
        this.__inputField = createAndAppend("input", {"type": "text", "class": "row ml-1 mt-1"}, this.__root);
        //has to be lambda
        this.__inputField.onkeypress = (e)=>this.__inputFieldOnPressHandler(e);
    }

    __inputFieldOnPressHandler(e){
        if(e.key === "Enter"){
            let text = this.__inputField.value;
            this.__inputField.value = "";
            if(this.__wordObjectsOnScreen.hasOwnProperty(text)){
                this.__wordObjectsOnScreen[text].erase();
                this.__throwInTrashcan(text);
                this.__correctCount += this.__currentLevel.reward;
                if(this.__correctCount % 5 === 0){
                    this.__currentLevel.increaseWordSpeed();
                }
                this.__scoreElem.innerHTML = this.__correctCount;
            }
        }
    }

    //takes word(string), throws in trashcan object with that word
    __throwInTrashcan(word){
        let tmp = this.__wordObjectsOnScreen[word];
        this.__wordObjectsOnScreen[word] = undefined;
        delete this.__wordObjectsOnScreen[word];
        this.__wordObjectsTrashcan.push(tmp);
    }

    __onWordOutOfBounds(word){
        this.__throwInTrashcan(word);
        this.__missedCount++;
        this.__missedElem.innerHTML = this.__missedCount;
    }

    __wordInserter(){
        let next = this.__wordsGenerator.next();
        if (next.done){
            return;
        }
        setTimeout(() => {
            //TODO: check race condition for wordObjectsTrashcan
            let word = next.value;
            if(this.__wordObjectsTrashcan.length === 0) {
                this.__wordObjectsOnScreen[word] = new Word(word, this.__gameField, this.__onWordOutOfBounds,
                                                            this.__currentLevel.wordTimeout());
            }
            else{
                let tmp = this.__wordObjectsTrashcan.pop();
                tmp.changeWordAndRestart(word, this.__currentLevel.wordTimeout());
                this.__wordObjectsOnScreen[word] = tmp;
            }
            this.__wordInserter();
        }, Math.floor(randomInRange(this.__currentLevel.minSpawnPeriod, this.__currentLevel.maxSpawnPeriod)));
    }

    start(){
        this.__wordInserter();
    }
}

function randomInRange(min, max){
    return min + Math.random() * (max - min);
}



