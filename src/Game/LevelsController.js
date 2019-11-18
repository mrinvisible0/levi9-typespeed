
//takes sorted array (by difficulty) of words(or rather {word, diff} objects) and callback
//on each level, it provides harder words

class LevelsController{
    constructor(words, onLevelUp){
        this.__levelsData = [
            [1500, 2000, 1],
            [1000, 1600, 2],
            [500, 1200, 3],
            [200, 800, 4],
            [100, 400, 5]
        ];
        this.__currentLevelIndex = -1;
        this.__currentLevel = null;
        this.__allWords = words;
        this.__onLevelUp = onLevelUp;
        this.__levelStep = Math.floor(words.length / this.__levelsData.length);
        this.__minIndex = 0;
        this.__maxIndex = this.__levelStep;
        this.__currentWords = this.__allWords.slice(this.__minIndex, this.__maxIndex);
        this.__correctCount = 0;
        this.__numberOfWordsForLevelUp = 5;

        //explicit bindings
        for(let p of Object.getOwnPropertyNames(Game.prototype)) {
            if(p !== "constructor" && typeof this[p] === "function"){
                this[p] = this[p].bind(this);
            }
        }
        this.__levelUp();
    }
    //called by Game to notify lvlController that new words has been correctly typed
    //this function determines when to level up
    handleCorrectWord(){
        if (++this.__correctCount % this.__numberOfWordsForLevelUp === 0) {
            if (!this.__currentLevel.increaseWordSpeed()) {
                if(this.__currentLevelIndex < this.__levelsData.length) { //if there are more levels
                    this.__levelUp();
                }
            }
        }
    }
    //level up logic, calls onLevelUp from Game
    __levelUp(){
        this.__currentLevel = new Level(...this.__levelsData[++this.__currentLevelIndex]);
        this.__minIndex = this.__currentLevelIndex * this.__levelStep;
        this.__maxIndex = (this.__currentLevelIndex + 1) * this.__levelStep;
        this.__currentWords = this.__allWords.slice(this.__minIndex, this.__maxIndex);
        this.__currentWords = this.__shuffleCurrentWords(); //shuffle them so that different words are chosen every time
        this.__onLevelUp(this.__currentLevel, this.__currentWords);
    }

    //Fisher–Yates shuffle
    __shuffleCurrentWords(){
        for (let i = this.__currentWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.__currentWords[i], this.__currentWords[j]] = [this.__currentWords[j], this.__currentWords[i]];
        }
        return this.__currentWords;
    }

}