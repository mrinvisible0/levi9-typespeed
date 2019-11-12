//this class is not essentially needed, it is here just for better code readability
class Level{
    constructor(minSpawnPeriod, maxSpawnPeriod){
        this.minSpawnPeriod = minSpawnPeriod;
        this.maxSpawnPeriod = maxSpawnPeriod;
        this.__wordSpeed = 300;
        this.reward = 1;
    }
    increaseWordSpeed(){
        this.__wordSpeed -= 100;
        this.reward ++;
    }
    wordTimeout(){
        return this.__wordSpeed;
    }
}
