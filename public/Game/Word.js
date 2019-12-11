class Word {
    constructor(word, parent, onFinished, timeout, reward){
        this.setWord(word);
        this.parent = parent;
        this.gameFieldWidth = parent.clientWidth;
        this.onFinished = onFinished;
        this.timeout = timeout;
        this.reward = reward;
        this.createElem();
        this.startAnimation();
    }

    erase(){
        if(this.intervalId){
            clearInterval(this.intervalId);
            this.wordElem.innerHTML = "";
            this.parent.removeChild(this.wordElem);
            this.intervalId = this.word = this.width = this.height = this.reward = null;
        }
    }

    setWord(word){
        this.word = word;
    }

    changeWordAndRestart(word, timeout, reward){
        this.setWord(word);
        this.timeout = timeout;
        this.reward = reward;
        this.createElem();
        this.startAnimation();
    }

    createElem(){
        this.wordElem = createAndAppend("span", {"class": "word", "id": "word"}, this.parent);
        this.wordElem.innerHTML = this.word;
        this.height = this.wordElem.clientHeight;
        this.wordElem.style.top = Math.floor(Math.random()*(500-this.height)) + "px";
        this.pos = 0;
        this.width = this.wordElem.clientWidth;
    }

    startAnimation(){
        this.intervalId = setInterval(()=>{
            if(this.pos + this.width >= this.gameFieldWidth){
                this.onFinished(this.word);
                this.erase();
            }
            else{
                this.pos += 10;
                this.wordElem.style.left = this.pos + 'px';
            }
        }, this.timeout);
    }


}
