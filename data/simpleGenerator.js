const oneDay = 86400000;

const groupSize = 2000000; // number of days in a group
const groups = 1; // groups of tasks separated by a gap
const tasksNumber = 10000;

const durationMean = 100; // Mean duration of the tasks
const durationVariation = 50 // Variation of the duration of the tasks

const res = []

const baseDate = Date.now();
// const baseTime = baseDate.getTime();
for (let i = 0; i < groups; i++){
    
    for (let j = 0; j < tasksNumber / groups; j++) {

        let base = baseDate + (groupSize * Math.random()) * oneDay;
        let offset = i *(groupSize + durationMean + durationVariation + 1) * oneDay; 
        let startingDay = new Date(base + offset);
        let duration = Math.round(durationMean
            - (durationVariation / 2)
            + durationVariation * Math.random());

        startingDay = startingDay.toISOString();
        
        res.push({
            startingDay,
            duration
        });
    
    }
}
console.log(JSON.stringify(res));