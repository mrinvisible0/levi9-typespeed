LEVELS = [
    [1000,2000, 1],
    [500,1600, 2],
    [200, 1200, 3],
    [100, 800, 4],
    [50, 400, 5]
];

class Game {
    constructor() {
        this.__root = $("#GameRoot")[0];
        this.__currLevelIndex = 0;
        this.__currentLevel = new Level(...LEVELS[this.__currLevelIndex]);
        this.__initGameLayout();
        //counters
        this.__score = 0;
        this.__correctCount = 0;
        this.__missedCount = 0;

        //generator
        this.__serbianWordsGenerator = null;
        // this.__englishWordsGenerator = null;
        this.__wordsGenerator = null; // maybe someday I will add more languages so this will stay as single point of entry
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
        this.__serbianWords = null;
        // this.__englishWords = null;
        let basePath = "http://localhost:63342/levi9-typespeed/data/";
        $.get(basePath + "sr_cleaned.txt", (r)=>{
            this.__serbianWords = new Set(r.split("\n"));
            this.__serbianWordsGenerator = this.__getWordGenerator(this.__serbianWords);
            this.__wordsGenerator = this.__serbianWordsGenerator;
            this.__ready = true;
            this.__begin();
            // $.get(basePath + "en_cleaned.txt", (r)=>{
            //     this.__englishWords = new Set(r.split("\n"));
            //     this.__englishWordsGenerator = this.__getWordGenerator(this.__englishWords);
            //     this.__ready = true;
            //     this.__begin();
            // });
        });

    }

    //generator
    __getWordGenerator = function*(set) {
        for(let s of set){
            yield s;
        }
    };
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
                this.__score += this.__wordObjectsOnScreen[text].reward;
                this.__wordObjectsOnScreen[text].erase();
                this.__throwInTrashcan(text);
                this.__correctCount ++;
                if(this.__correctCount % 5 === 0){
                    if(!this.__currentLevel.increaseWordSpeed()){
                        this.__currentLevel = new Level(...LEVELS[++this.__currLevelIndex]);
                    }
                }
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
                                                            this.__currentLevel.wordTimeout(), this.__currentLevel.reward);
            }
            else{
                let tmp = this.__wordObjectsTrashcan.pop();
                tmp.changeWordAndRestart(word, this.__currentLevel.wordTimeout(), this.__currentLevel.reward);
                this.__wordObjectsOnScreen[word] = tmp;
            }
            this.__wordInserter();
        }, Math.floor(randomInRange(this.__currentLevel.minSpawnPeriod, this.__currentLevel.maxSpawnPeriod)));
    }

    //this function is given to user, he can start it but game wont begin until all data is ready
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



