import $ from 'jquery';
import {createAndAppend} from "../script.js";
import LevelsController from"./LevelsController";
import Word from"./Word";

class Game {
    constructor() {
        this.root = $("#GameRoot")[0];
        this.initGameLayout();
        this.setInitValues();
        //explicit bindings
        for(let p of Object.getOwnPropertyNames(Game.prototype)) {
            if(p !== "constructor" && typeof this[p] === "function"){
                this[p] = this[p].bind(this);
            }
        }
        this.__words = null;
        this.basePath = "http://localhost:1025/";

        $.get(this.basePath + "data/sr_measured.txt", (r)=>{
            let maxDiff = 0;
            let minDiff = 3000;
            this.words = r.split("\n").map((w)=>{
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
            this.words.sort((x, y)=>{
                return x.diff > y.diff;
            });
            this.levelsControler = new LevelsController(this.words, this.onLevelUp);
            this.ready = true;
            this.begin();
        });

    }

    setInitValues(){
        this.currentLevel = null;
        //counters
        this.score = 0;
        this.missedCount = 0;
        this.gameOver = false;
        //generator
        this.wordsGenerator = null;
        this.wordObjectsOnScreen = {};
        this.wordObjectsTrashcan = [];
        this.ready = false;
        this.started = false;
        // this.levelsControler = new LevelsController(this.words, this.onLevelUp);
    }

    reset(){
        this.setInitValues();
        this.missedElem.innerHTML = 0;
        this.scoreElem.innerHTML = 0;
        this.levelsControler = new LevelsController(this.words, this.onLevelUp);
        this.wordInserter();
    }

    onLevelUp(lvl, words){
        this.currentLevel = lvl;
        this.wordsGenerator = this.getWordGenerator(words);
    }

    //generator
    * getWordGenerator(collection) {
        for(let s of collection){
            yield s;
        }
    };
    initGameLayout() {
        this.gameField = createAndAppend("div", {"class": "col-9 gameField"}, this.root);
        this.gameInfo = createAndAppend("div", {"class": "col-3 gameInfo"}, this.root);


        this.scoreWraper = createAndAppend("div", {"class" : "row"}, this.gameInfo);
        this.scoreLabel = createAndAppend("p", {"class": "col-5"}, this.scoreWraper);
        this.scoreLabel.innerHTML = "Poeni: ";
        this.scoreElem = createAndAppend("p", {"class": "col"}, this.scoreWraper);

        this.missedWraper = createAndAppend("div", {"class" : "row"}, this.gameInfo);
        this.missedLabel = createAndAppend("p", {"class": "col-5"}, this.missedWraper);
        this.missedLabel.innerHTML = "Promašaji: ";
        this.missedElem = createAndAppend("p", {"class": "col"}, this.missedWraper);

        this.scoreboardRoot = createAndAppend("div", { "id": "scoreboard" }, this.gameInfo);
        this.missedElem.innerHTML = 0;
        this.scoreElem.innerHTML = 0;
        this.inputField = createAndAppend("input", {"type": "text", "class": "row ml-1 mt-1"}, this.root);
        //has to be lambda
        this.inputField.onkeypress = (e)=>this.inputFieldOnPressHandler(e);
    }

    inputFieldOnPressHandler(e){
        if(e.key === "Enter"){
            let text = this.inputField.value;
            this.inputField.value = "";
            if(this.wordObjectsOnScreen.hasOwnProperty(text)){
                this.score += this.wordObjectsOnScreen[text].reward;
                this.wordObjectsOnScreen[text].erase();
                this.throwInTrashcan(text);
                this.levelsControler.handleCorrectWord();
                this.scoreElem.innerHTML = this.score;
            }
        }
    }

    //takes word(string), throws in trashcan object with that word
    throwInTrashcan(word){
        let tmp = this.wordObjectsOnScreen[word];
        this.wordObjectsOnScreen[word] = undefined;
        delete this.wordObjectsOnScreen[word];
        this.wordObjectsTrashcan.push(tmp);
    }


    gameOverCondition(){
        return this.missedCount > this.score;
    }

    onWordOutOfBounds(word){
        this.missedCount++;
        this.missedElem.innerHTML = this.missedCount;

        if((this.gameOver = this.gameOverCondition())){
            for(let [k,v] of Object.entries(this.wordObjectsOnScreen)){
                v.erase();
            }
            for(let v of this.wordObjectsTrashcan){
                v.erase();
            }
            let name = prompt("KRAJ! OSTVARILI STE " + this.score + " POENA!\nUnesite svoje ime");
            if(name !== null && name !== ""){
                $.post(this.basePath + "results", {result: {name: name, score: this.score}}, (resp)=>{
                    console.log(resp);
                });

            }
            if(window.confirm("Da li želite da krenete ponovo?")){
                this.reset();
            }
            else {
                return;
            }
        }
        else {
            //this is called only if it is not game over
            this.throwInTrashcan(word);
        }
    }

    wordInserter(){

        let next = this.wordsGenerator.next();
        if (next.done){
            return;
        }
        setTimeout(() => {
            if(!this.gameOver) {
                let wordObj = next.value;
                let word = wordObj.word;
                if (this.wordObjectsTrashcan.length === 0) {
                    this.wordObjectsOnScreen[word] = new Word(word, this.gameField, this.onWordOutOfBounds,
                        this.currentLevel.wordTimeout(), this.currentLevel.reward);
                } else {
                    let tmp = this.wordObjectsTrashcan.pop();
                    tmp.changeWordAndRestart(word, this.currentLevel.wordTimeout(), this.currentLevel.reward);
                    this.wordObjectsOnScreen[word] = tmp;
                }
                this.wordInserter();
            }
        }, Math.floor(randomInRange(this.currentLevel.minSpawnPeriod, this.currentLevel.maxSpawnPeriod)));
    }

    //this function is given to user, he can start it but game won't begin until all data is ready
    start(){
        this.started = true;
        this.begin();
    }
    begin(){
        if(this.started && this.ready){
            this.wordInserter();
        }
    }
}

function randomInRange(min, max){
    return min + Math.random() * (max - min);
}

export default Game;



