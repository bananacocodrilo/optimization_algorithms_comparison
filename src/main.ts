'use strict';
import { Schedule } from './schedule';
import { Problem } from './interfaces';
import { BruteSolver } from './bruteSolver';
import { LpSolver } from './lpSolver';
import fs = require('fs');

const flags = require('flags');

flags.defineString('file', 'statement.json', 'The name of the file with the statement. The file should be in the data directory.');
flags.defineBoolean('simple', 'True by default. If set as --simple=false, it will solve the problem with both branch and cut and brute force, and after that compare results and execution times.');
flags.parse();

const file = flags.get('file');
const compare = !flags.get('simple');

let lpResult = 0;
let bfResult = 0;
let lpTime, bfTime, tick;

if (!fs.existsSync(file)) {
    console.log('Data file not found.');
    process.exit();
}

const schedule = new Schedule(file);
// Array of the different subproblems in the statement
const problems:Problem[] = schedule.getDividedSchedule(); 


// Solve the problem with lp
tick = Date.now();
problems.forEach(problem => {
    const solver = new LpSolver(problem);
    const sol = solver.solve();

    lpResult += sol;
});
lpTime = Date.now() - tick;



// If we want to compare solve it too with brute force
if (compare) {
    tick = Date.now();
    problems.forEach(problem => {
        const solver = new BruteSolver(problem);
        const sol = solver.solve();
        
        bfResult += sol;
    });
    bfTime = Date.now() - tick;
}




if (!compare) {
    console.log(`Maximum viable production is ${lpResult} units`);

} else {
    const lpPretty = {
        Method: 'Linear programming',
        Production: lpResult,
        Time: lpTime,
    };

    const bfPretty = {
        Method: 'Brute force',
        Production: bfResult,
        Time: bfTime,
    };

    console.table([lpPretty, bfPretty], ['Method', 'Production', 'Time']);
}

