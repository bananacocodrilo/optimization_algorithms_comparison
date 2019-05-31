export interface Task { 
    start: number; //Start and end are in number of days relative to the earliest starting task.
    end: number;
    name: string;
}