import { Task, Day  } from ".";

export interface Specie {
    genotype: Task[]; //Order in which the tasks will be tested
    fitness: number; // Fitness score for evolution
    score: number; // How many tasks this specimen can execute
    phenotype: boolean[]; // Executed tasks
    calendar: Day[]; // Its own copy of the calendar

}