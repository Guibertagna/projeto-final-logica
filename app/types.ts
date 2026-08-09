export interface Patient {
    id?: string;
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

export interface ConsolidatedStatistics {
    total: number;
    attended: number;
    waiting: number;
    averageAge: number;
    averagePriority: number;
    countByPriority: Record<number, number>;
    allSymptomsJoined: string;
    hasCriticalWaiting: boolean;
}