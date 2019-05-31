const solver = require('javascript-lp-solver');

import { Problem, Day, Task } from "./interfaces";

export class LpSolver {
    upperBound: number;
    combinations: number;
    solution: boolean[] = [];
    solutionIndex = 0;
    calendar: Day[];
    tasks: Task[];
    startingDay: number;
    // tslint:disable-next-line: no-any
    model: any = {
        optimize: "amount",
        opType: "max",
        constraints: {},
        variables: {},
        ints: {},
    };

    constructor(problem: Problem) {

        this.upperBound = problem.tasks.length;
        this.combinations = Math.pow(2, problem.tasks.length);
        
        this.tasks = problem.tasks;
        this.calendar = problem.days;
        this.startingDay = problem.startingDay;


        // Prepare the model for the solver
        // Days are constraints. Each day has a capacity of 1
        for (let i = 0; i < this.calendar.length; i++) {
            this.model.constraints[i] = { max: 1 };
        }
        // Tasks are variables
        for (let i = 0; i < this.tasks.length; i++) {
            const taskName = this.tasks[i].name;
            this.model.variables[taskName] = {};

            // Each task requires a capacity of 1 in each of the days it is executed
            for (let j = this.tasks[i].start; j <= this.tasks[i].end; j++) {
                this.model.variables[taskName][j - this.startingDay] = 1;
            }

            // All the tasks have the same value in the O.F.
            this.model.variables[taskName].amount = 1;
            // All the variables are integers
            this.model.ints[taskName] = 1;
        }
        
    }


    solve = ():number => {
        const res = solver.Solve(this.model);
        return res.result;
    }

    // tslint:disable-next-line: no-any
    getTasksFromSolution = (res:any):string[] => { 
        const tasks: string[] = [];
        const keys = Object.keys(res);
        
        keys.splice(keys.indexOf('feasible'), 1);
        keys.splice(keys.indexOf('result'), 1);
        keys.splice(keys.indexOf('bounded'), 1);
        
        keys.forEach(key => {
            if (res[key]) {
                tasks.push(key);
            }
        });
        
        return tasks;
    }
    
}