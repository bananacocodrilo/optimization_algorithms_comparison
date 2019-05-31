/*
*    Parses the input and generates some more suitable data structures 
*    for different kind of solutions.
*
*/

import fs = require('fs');
import { Day, RawTask, Task, Problem} from "./interfaces";


const oneDay = 1000 * 60 * 60 * 24;


export class Schedule { 
    tasks: Task[] = [];
    calendar: Day[] = [];
    
    constructor(file: string) {
        let minDate: number, maxDate: number;
        
        try {
            const rawData = JSON.parse(fs.readFileSync(file, 'utf8'));
            
            if (!rawData.length) { 
                console.log('Data file is empty.');
                process.exit();
            }
            
            [minDate, maxDate, this.tasks] = this.prepareInfo(rawData);
            this.calendar = this.generateCalendar(this.tasks, minDate, maxDate);
            
        } catch (e) { 
            console.log(`Some error occurred while analazing the data. Error: ${e.message}`);
            process.exit();
        }

    }

    // Try to reduce complexity of the problem by dividing it into independent problems
    // If there is an empty day, tasks at either side are not affected by the others.
    getDividedSchedule():Problem[]  { 
        const problems: Problem[] = [{ days: [], tasks:[], tasksList: [], startingDay:0}];
        let j = 0;
        
        for (let i = 0; i < this.calendar.length; i++){
            //If the current group have something and this is a "gap" day, 
            //start the next group
            if (problems[j].days.length !== 0 && this.calendar[i].candidates.length === 0) { 
                j++;
                
                problems[j] = {
                    days: [],
                    tasks: [],
                    tasksList: [],
                    startingDay: i + 1,
                };

            } else if (this.calendar[i].candidates.length !== 0) {
                problems[j].days.push(this.calendar[i]);
            } else {
                problems[j].startingDay = i + 1;
            }
        }

        //This should never happen since there are not empty trailing days but better be safe
        if (problems[problems.length - 1].days.length === 0) {
            problems.pop();
        }


        // Create a summary of taks for each subproblem
        problems.forEach(problem => {
            problem.days.forEach(day => {
                day.candidates.forEach(candidate => {
                    if (!problem.tasksList.includes(candidate.name)) {
                        problem.tasksList.push(candidate.name);
                        problem.tasks.push(candidate);
                    }
                });
            });
        });
            


        return problems;
    }


    private generateCalendar = (
        tasks: Task[],
        minDate: number,
        maxDate: number
    ): Day[] => {
        const numDays = Math.round((maxDate - minDate) / (oneDay));
        const days: Day[] = [];
        
        for (let i = 0; i < numDays; i++) { 
            days.push({
                candidates: [],
            });
        }

        tasks.forEach(task => {
            for (let i = task.start; i <= task.end; i++) { 
                days[i].candidates.push(task);
            }
        });

        return days;    
    }


    //Prepare the info for easier manipulation later. 
    private prepareInfo = (rawData: [RawTask]) : [number, number, Task[]] => { 
        const tasks: Task[] = [];
        let maxDate = 0;
        let minDate = Infinity; 

        rawData.forEach(data => {

            const start = new Date(data.startingDay).getTime();
           

            if (isNaN(start) ||
                start === 0 ||
                typeof (data.duration) !== 'number' ||
                data.duration <= 0) { 
                    console.log(`Found data with wrong format: ${JSON.stringify(data)}`);
                    process.exit();
                } 




            
            const end = start + data.duration * oneDay;
            
            if (start < minDate) {
                minDate = start;
            }
            if (end > maxDate) {
                maxDate = end;
            }
        });

        rawData.forEach(data => {
            const start = Math.floor((new Date(data.startingDay).getTime() - minDate) / (oneDay));
            const end = start + data.duration - 1;
            const task: Task = {
                start,
                end,
                name: tasks.length + '_' + Math.random().toString(36).substr(2, 9),
            };
            tasks.push(task);
        });

        return [minDate, maxDate, tasks];
    }
}
