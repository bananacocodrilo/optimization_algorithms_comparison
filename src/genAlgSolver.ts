import { Problem, Day, Task, Specie } from "./interfaces";

/*
 *   Solves the problem aplying a genetic algorithm. 
 * 
 */

export class GenAlgSolver {
    solution: boolean[] = [];
    calendar: Day[];
    tasks: Task[];
    startingDay: number;

    genSize: number; // algorithm configuration variables 
    timeout: number;
    genTimeOut: number;
    mutationRate: number;

    specimens: Specie[] = []; // Specimens for the evolution


    constructor(problem: Problem, genSize = 100, timeout = 3000, genTimeOut = 999, mutationRate = 0.51) {       
        this.tasks = [...problem.tasks];
        this.calendar = problem.days;
        this.startingDay = problem.startingDay;

        this.genSize = genSize;
        this.timeout = Date.now() + timeout;
        this.genTimeOut = genTimeOut;
        this.mutationRate = mutationRate;


        // Generate rthis.andom first generation
        for (let i = 0; i < genSize; i++){
            // first shuffle the order
            problem.tasks.sort((a, b) => Math.random() - 0.5);
            // then make a copy
            this.specimens.push({
                genotype: [...problem.tasks],
                fitness: 0,
                score: 0,
                phenotype: [],
                calendar: this.copyCalendar(),
            });
        }
    }




    solve = ():number => {
        let genIndex = 0,
            lastImprovement = 0;
        
        let currentBest = 0,
            previousBest = 0;
        
        
        while ((Date.now() < this.timeout) && // Time timeout
            (genIndex - lastImprovement) < this.genTimeOut) {  // Gens without improvement timeout
            // console.log('------------------------------------ NEW GEN ---------------------------------------');
            
            
            // Calculate the solution provided by each specimen
            currentBest = this.calculatePhenotype(this.specimens);
            // console.log(`currentBest: ${currentBest}`);

            // Assign a fitness score
            const totalFitness = this.calculateFitness(this.specimens);
            
            // Create the next generation
            this.specimens = this.createNewGeneration(this.specimens, totalFitness);
            
        
        
            // Update vars
            if (currentBest > previousBest) { 
                previousBest = currentBest;
                lastImprovement = genIndex;
                console.log(`Improvement in gen ${genIndex}; currentBest: ${currentBest}`);

            }
            genIndex++;   
        }

        console.log(genIndex);
        
        // Return the max amount of tasks we've been able to execute
        return previousBest;
    }
    




    private calculatePhenotype = (specimens: Specie[]): number => {
        let currentBest = 0;

        // for each specimen
        specimens.forEach(specimen => {

            // test each gen 
            specimen.genotype.forEach(gen => {
                // Try to execute its task

                const executed = this.executeTask(gen, specimen.calendar);
                // Exprese the result in the phenotype
                specimen.phenotype.push(executed);
                // Update its score accordingly
                if (executed) { 
                    specimen.score++;
                }

            });


            if (specimen.score > currentBest) { 
                currentBest = specimen.score;
            }
        });

        return currentBest;
    }



    private calculateFitness = (specimens: Specie[]): number => { 
        let totalFitness = 0;
        specimens.forEach(specimen => {
            specimen.fitness = Math.pow(specimen.score, 2);
            totalFitness += specimen.fitness;
        });
        return totalFitness;
    };







    private createNewGeneration = (specimens: Specie[], totalFitness: number): Specie[] => { 
        const nextGeneration: Specie[] = [];


        for (let i = 0; i < this.genSize; i++) { 
            const firstParent = this.chooseRandomParent(this.specimens, totalFitness);
            const secondParent = this.chooseRandomParent(this.specimens, totalFitness);
        
            let genotype = this.crossOver(firstParent, secondParent);
            genotype = this.mutate(genotype);
            
            nextGeneration.push({
                genotype,
                fitness: 0,
                score: 0,
                phenotype: [],
                calendar:  this.copyCalendar(),
            });
        
        }

        return nextGeneration;
    };





    private chooseRandomParent = (specimens: Specie[], totalFitness: number): Specie => {
        let dice = totalFitness * Math.random();
        let i: number;
        
        for (i = 0; dice > specimens[i].fitness; i++) { 
            dice -= specimens[i].fitness;
        }
        return specimens[i];
    }

    private crossOver = (firstParent: Specie, secondParent: Specie): Task[] => { 
        const genotype: Task[] = [];

        // First I want to select length/2 sucesive gens form the first parent, 
        // so at most I can start selecting at the middle
        const start = Math.floor(Math.random() * firstParent.genotype.length / 2);
        for (let i = 0; i < firstParent.genotype.length / 2; i++) { 
            genotype.push(firstParent.genotype[i]);
        }

        // And after that fill the rest of the gens in the order of the second parent.
        secondParent.genotype.forEach(gen => {
            if (!genotype.includes(gen)) {
                genotype.push(gen);
            }
        });
        
        return genotype;
    }




    private mutate = (genotype: Task[]): Task[] => { 
        // With a probability exchange two random elements
        if (Math.random() <= this.mutationRate) {
            const first = Math.floor(Math.random() * genotype.length);
            const second = Math.floor(Math.random() * genotype.length);
            const aux = genotype[first];
            genotype[first] = genotype[second]
            genotype[second] = aux;
        }

        return genotype;
    }


    private executeTask = (task: Task, calendar: Day[]): boolean => {
        let valid = true;
        
        // Check if that task days are free
        for (let j = task.start; j <= task.end; j++) {
            const day = j - this.startingDay;
                            
            // If some of the days was already marked then this solution is invalid
            if (calendar[day].selected !== undefined) {
                valid = false;
                break;
            }
        }

        // If can be executed then mark each day
        if (valid) {
            for (let j = task.start; j <= task.end; j++) {
                const day = j - this.startingDay;
                calendar[day].selected = task.name;
            }
        }

        return valid;
    }


    private copyCalendar = ():Day[] => { 
        const newCal: Day[] = [];

        this.calendar.forEach(day => {
            const newDay: Day = {
                candidates: day.candidates,
            };
            newCal.push(newDay);
            
        });
        return newCal;
    }

}