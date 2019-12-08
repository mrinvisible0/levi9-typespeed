import {measureTextDifficulty} from "./wordDifficultyMeter"
import fs from 'fs';
fs.readFile("../../data/sr_cleaned.txt", 'utf8', (err, data)=>{
    if (err){
        console.log(err);
    }
    else{
        let arr = data.split('\n');
        let res = [];
        let cnt = 0;
        for(const word of arr){
            if(word.length >= 3){
                let diff = measureTextDifficulty(word);
                cnt ++;
                if(cnt % 100000 === 0){
                    console.log(cnt)
                }
                res.push(word + " " + diff);
            }
        }
        console.log("measured, writing");
        fs.writeFile("../../data/sr_measured.txt", res.join('\n'), 'utf8', (err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("done");
            }
        })

    }
});
