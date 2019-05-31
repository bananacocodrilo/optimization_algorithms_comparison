import { Problem, Day, Task } from "./interfaces";
const tooMuch = 16000000; // ~2^24 This takes about 20 seconds in my pc
/*  
 *   Solves the problem aplying brute force. 
 *   It tries every combination of tasks in order.
 *   It is O(2^n), it's main purpose is compare the result found by other means   
 * 
 */

export class BruteSolver {
    upperBound: number;
    combinations: number;
    solution: boolean[] = [];
    solutionIndex = 1;
    calendar: Day[];
    tasks: Task[];
    startingDay: number;
    
    constructor(problem: Problem) {
        this.upperBound = problem.tasks.length;
        this.combinations = Math.pow(2, problem.tasks.length);
        
        this.tasks = problem.tasks;
        this.calendar = problem.days;
        this.startingDay = problem.startingDay;
    }
    



    solve = ():number => { 
        let best = 0;
        let progress = 0;
        const selectedTasks: string[] = [];
        let bestSolution: boolean[] = [];

        if(this.combinations > tooMuch){ 
            console.log(`About to brute force ${this.combinations} combinations, this may take a while (under ${Math.ceil(this.combinations/(tooMuch*3))} minutes).`);
        }

        while (this.solutionIndex < this.combinations) {
            this.nextSolution();
            
            if (this.combinations > tooMuch &&
                ((this.solutionIndex / this.combinations) > progress + 0.01)) { 
                progress += 0.01;
                console.log(`Progress: ${Math.round(progress * 100)}%`);
            }


            if (this.checkValidSolution()) { 
                const score = this.calculateSolutionScore();
                
                if (score > best) { 
                    best = score;
                    bestSolution = [...this.solution];
                }
            }
        }

        return best;
    }
    


    private checkValidSolution(): boolean { 
        let valid = true;
        this.calendar.forEach(day => {
            day.selected = undefined;
        });
        
        
        // For each task of the problem
        for (let i = 0; i < this.tasks.length && valid; i++) { 

            // If the task is selected
            if (this.solution[i]) {

                // Mark the usage of that task's days
                for (let j = this.tasks[i].start; j <= this.tasks[i].end; j++) {
                    const day = j - this.startingDay;
                    
                    // If some of the days was already marked then this solution is invalid
                    if (this.calendar[day].selected !== undefined) {
                        valid = false;
                        break;
                    } else { 
                        this.calendar[day].selected = this.tasks[i].name;
                    }
                }
            }
        }
        return valid;
    }


    // Count the number of trues in this solution
    private calculateSolutionScore(): number {
        let score = 0;
        for (let i = 0; i < this.solution.length; i++) { 
            if (this.solution[i]) {
                score++;
            }
        }
        return score;
    }

    
    // Counts in binary, it goes lsf but doesnt matter since 
    // we are simply trying to test every combination.
    private nextSolution = ():void => { 
        this.solution = Array.apply(null, new Array(this.upperBound)).map(()=> false);
        const base2 = (this.solutionIndex).toString(2);        
        
        for (let i = 0; i < base2.length; i++) {
            this.solution[base2.length - i -1] = base2[i] === '1';
        }

        this.solutionIndex++;
    }

}