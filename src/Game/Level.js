//this class is not essentially needed, it is here just for better code readability
class Level{
    constructor(minSpawnPeriod, maxSpawnPeriod, reward){
        this.minSpawnPeriod = minSpawnPeriod;
        this.maxSpawnPeriod = maxSpawnPeriod;
        this.__wordSpeed = 300;
        this.reward = reward;
    }
    increaseWordSpeed(){
        this.__wordSpeed -= 100;
        this.reward ++;
        return this.__wordSpeed !== 0;
    }
    wordTimeout(){
        return this.__wordSpeed;
    }
}
