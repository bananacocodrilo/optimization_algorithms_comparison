import { Task } from ".";

export interface Day {
    candidates: Task[]; //Task that could be executed that day
    selected?: string; //Task that will run that day
}