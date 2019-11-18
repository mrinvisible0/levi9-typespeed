class Game {
    constructor() {
        this.__root = $("#GameRoot")[0];
        this.__currentLevel = null;
        this.__initGameLayout();
        //counters
        this.__score = 0;
        this.__missedCount = 0;
        this.__gameOver = false;
        //generator
        this.__wordsGenerator = null;
        this.__wordObjectsOnScreen = {};
        this.__wordObjectsTrashcan = [];
        this.__ready = false;
        this.__started = false;
        //explicit bindings
        for(let p of Object.getOwnPropertyNames(Game.prototype)) {
            if(p !== "constructor" && typeof this[p] === "function"){
                this[p] = this[p].bind(this);
            }
        }
        this.__words = null;
        //NOTE:
        //THIS PATH/URL WORKS ON MY LOCAL MACHINE WHEN PROJECT IS RAN BY WEBSTORM
        //for testing, either run in webstorm and possibly change port number or run by some other local
        //server
        let basePath = "http://localhost:63342/levi9-typespeed/data/";
        $.get(basePath + "sr_measured.txt", (r)=>{
            let maxDiff = 0;
            let minDiff = 3000;
            this.__words = r.split("\n").map((w)=>{
                let tmp = w.split(" ");
                let word = tmp[0];
                let diff = parseInt(tmp[1], 10);
                if(diff < minDiff){
                    minDiff = diff;
                }
                else if(diff > maxDiff){
                    maxDiff = diff;
                }
                return {
                    word: word,
                    diff: diff
                }
            });
            this.__words.sort((x, y)=>{
                return x.diff > y.diff;
            });
            this.__levelsControler = new LevelsController(this.__words, this.onLevelUp);
            this.__ready = true;
            this.__begin();
        });

    }

    onLevelUp(lvl, words){
        this.__currentLevel = lvl;
        this.__wordsGenerator = this.__getWordGenerator(words);
    }

    //generator
    * __getWordGenerator(collection) {
        for(let s of collection){
            yield s;
        }
    };
    __initGameLayout() {
        this.__gameField = createAndAppend("div", {"class": "col-9 ml-1 mr-1 gameField"}, this.__root);
        this.__gameInfo = createAndAppend("div", {"class": "col-2 ml-1 gameInfo"}, this.__root);


        this.__scoreWraper = createAndAppend("div", {"class" : "row"}, this.__gameInfo);
        this.__scoreLabel = createAndAppend("p", {"class": "col-5"}, this.__scoreWraper);
        this.__scoreLabel.innerHTML = "Poeni: ";
        this.__scoreElem = createAndAppend("p", {"class": "col"}, this.__scoreWraper);

        this.__missedWraper = createAndAppend("div", {"class" : "row"}, this.__gameInfo);
        this.__missedLabel = createAndAppend("p", {"class": "col-5"}, this.__missedWraper);
        this.__missedLabel.innerHTML = "Promašaji: ";
        this.__missedElem = createAndAppend("p", {"class": "col"}, this.__missedWraper);


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
                this.__score += this.__wordObjectsOnScreen[text].reward;
                this.__wordObjectsOnScreen[text].erase();
                this.__throwInTrashcan(text);
                this.__levelsControler.handleCorrectWord();
                this.__scoreElem.innerHTML = this.__score;
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

    __gameOverCondition(){
        return this.__missedCount > this.__score;
    }

    __onWordOutOfBounds(word){
        this.__missedCount++;
        this.__missedElem.innerHTML = this.__missedCount;

        if((this.__gameOver = this.__gameOverCondition())){
            for(let [k,v] of Object.entries(this.__wordObjectsOnScreen)){
                v.erase();
            }
            alert("KRAJ! OSTVARILI STE " + this.__score + " POENA!");
            return;
        }
        //this is called only if it is not game over
        this.__throwInTrashcan(word);
    }

    __wordInserter(){
        let next = this.__wordsGenerator.next();
        if (next.done){
            return;
        }
        setTimeout(() => {
            if(!this.__gameOver) {
                let wordObj = next.value;
                let word = wordObj.word;
                if (this.__wordObjectsTrashcan.length === 0) {
                    this.__wordObjectsOnScreen[word] = new Word(word, this.__gameField, this.__onWordOutOfBounds,
                        this.__currentLevel.wordTimeout(), this.__currentLevel.reward);
                } else {
                    let tmp = this.__wordObjectsTrashcan.pop();
                    tmp.changeWordAndRestart(word, this.__currentLevel.wordTimeout(), this.__currentLevel.reward);
                    this.__wordObjectsOnScreen[word] = tmp;
                }
                this.__wordInserter();
            }
        }, Math.floor(randomInRange(this.__currentLevel.minSpawnPeriod, this.__currentLevel.maxSpawnPeriod)));
    }

    //this function is given to user, he can start it but game won't begin until all data is ready
    start(){
        this.__started = true;
        this.__begin();
    }
    __begin(){
        if(this.__started && this.__ready){
            this.__wordInserter();
        }
    }
}

function randomInRange(min, max){
    return min + Math.random() * (max - min);
}



