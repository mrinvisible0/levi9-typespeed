//this class is not essentially needed, it is here just for better code readability
class Level{
    constructor(minSpawnPeriod, maxSpawnPeriod, reward){
        this.minSpawnPeriod = minSpawnPeriod;
        this.maxSpawnPeriod = maxSpawnPeriod;
        this.wordSpeed = 300;
        this.reward = reward;
    }
    increaseWordSpeed(){
        if(this.wordSpeed > 100){
            this.wordSpeed -= 100;
            this.reward ++;
        }
        return this.wordSpeed > 100;
    }
    wordTimeout(){
        return this.wordSpeed;
    }
}

export default Level;