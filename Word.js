class Word {
    constructor(word, parent, onFinished){
        this.setWord(word);
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

    setWord(word){
        this.word = word;
        this.difficulty = measureTextDifficulty(word);
    }

    changeWordAndRestart(word){
        this.setWord(word);
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
