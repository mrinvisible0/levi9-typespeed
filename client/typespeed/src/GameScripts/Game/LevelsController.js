import Level from "./Level";
//takes sorted array (by difficulty) of words(or rather {word, diff} objects) and callback
//on each level, it provides harder words
class LevelsController{
    constructor(words, onLevelUp){
        this.levelsData = [
            [1500, 2000, 1],
            [1000, 1600, 2],
            [500, 1200, 3],
            [200, 800, 4],
            [100, 400, 5]
        ];
        this.currentLevelIndex = -1;
        this.currentLevel = null;
        this.allWords = words;
        this.onLevelUp = onLevelUp;
        this.levelStep = Math.floor(words.length / this.levelsData.length);
        this.minIndex = 0;
        this.maxIndex = this.levelStep;
        this.currentWords = this.allWords.slice(this.minIndex, this.maxIndex);
        this.correctCount = 0;
        this.numberOfWordsForLevelUp = 5;

        //explicit bindings
        for(let p of Object.getOwnPropertyNames(LevelsController.prototype)) {
            if(p !== "constructor" && typeof this[p] === "function"){
                this[p] = this[p].bind(this);
            }
        }
        this.levelUp();
    }
    //called by Game to notify lvlController that new words has been correctly typed
    //this function determines when to level up
    handleCorrectWord(){
        if (++this.correctCount % this.numberOfWordsForLevelUp === 0) {
            if (!this.currentLevel.increaseWordSpeed()) {
                if(this.currentLevelIndex < this.levelsData.length) { //if there are more levels
                    this.levelUp();
                }
            }
        }
    }
    //level up logic, calls onLevelUp from Game
    levelUp(){
        this.currentLevel = new Level(...this.levelsData[++this.currentLevelIndex]);
        this.minIndex = this.currentLevelIndex * this.levelStep;
        this.maxIndex = (this.currentLevelIndex + 1) * this.levelStep;
        this.currentWords = this.allWords.slice(this.minIndex, this.maxIndex);
        this.currentWords = this.shuffleCurrentWords(); //shuffle them so that different words are chosen every time
        this.onLevelUp(this.currentLevel, this.currentWords);
    }

    //Fisher–Yates shuffle
    shuffleCurrentWords(){
        for (let i = this.currentWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentWords[i], this.currentWords[j]] = [this.currentWords[j], this.currentWords[i]];
        }
        return this.currentWords;
    }

}

export default LevelsController;