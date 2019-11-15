class Word {
    constructor(word, parent, onFinished, timeout, reward){
        this.__setWord(word);
        this.__parent = parent;
        this.__gameFieldWidth = parent.clientWidth;
        this.__onFinished = onFinished;
        this.__timeout = timeout;
        this.reward = reward;
        this.__createElem();
        this.__startAnimation();
    }

    erase(){
        if(this.__intervalId){
            clearInterval(this.__intervalId);
            this.__wordElem.innerHTML = "";
            this.__parent.removeChild(this.__wordElem);
            this.__intervalId = this.__word = this.__width = this.__height = this.reward = null;
        }
    }

    __setWord(word){
        this.__word = word;
        this.difficulty = measureTextDifficulty(word);
    }

    changeWordAndRestart(word, timeout, reward){
        this.__setWord(word);
        this.__timeout = timeout;
        this.reward = reward;
        this.__createElem();
        this.__startAnimation();
    }

    __createElem(){
        this.__wordElem = createAndAppend("span", {"class": "word", "id": "word"}, this.__parent);
        this.__wordElem.innerHTML = this.__word;
        this.__height = this.__wordElem.clientHeight;
        this.__wordElem.style.top = Math.floor(Math.random()*(500-this.__height)) + "px";
        this.__pos = 0;
        this.__width = this.__wordElem.clientWidth;
    }

    __startAnimation(){
        this.__intervalId = setInterval(()=>{
            if(this.__pos + this.__width >= this.__gameFieldWidth){
                this.__onFinished(this.__word);
                this.erase();
            }
            else{
                this.__pos += 10;
                this.__wordElem.style.left = this.__pos + 'px';
            }
        }, this.__timeout);
    }


}
