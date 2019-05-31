import { Day, Task  } from ".";

export interface Problem {
    days: Day[];
    tasks: Task[];
    tasksList: string[];
    startingDay: number;
}