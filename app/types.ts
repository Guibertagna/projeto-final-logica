export interface Patient {
    name: string;
    age: number;
    symptoms: string[];
    arrivalDate: Date;
    priority: number;
    isAttended: boolean;
}



export interface Options {
    label: string;
    description: string;
    id: number
}