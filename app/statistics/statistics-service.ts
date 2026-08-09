import { formatBrazilianDate, toPatientDate } from "../helpers/converter";
import { getPriorityLabel } from "../helpers/priority-label";
import { ConsolidatedStatistics, Patient } from "../types";

const CRITICAL_PRIORITY_THRESHOLD = 8;

export const filterPatientsByPriority = (patients: Patient[], priority: number): Patient[] => {
    return patients.filter((patient) => patient.priority === priority);
};

export const findPatientByName = (patients: Patient[], name: string): Patient | undefined => {
    const normalizedName = name.trim().toLowerCase();
    return patients.find((patient) => patient.name.toLowerCase().includes(normalizedName));
};

export const findPatientsByName = (patients: Patient[], name: string): Patient[] => {
    const normalizedName = name.trim().toLowerCase();
    return patients.filter((patient) => patient.name.toLowerCase().includes(normalizedName));
};

export const hasCriticalPatientsWaiting = (patients: Patient[]): boolean => {
    return patients.some(
        (patient) => !patient.isAttended && patient.priority >= CRITICAL_PRIORITY_THRESHOLD
    );
};

export const getConsolidatedStatistics = (patients: Patient[]): ConsolidatedStatistics => {
    const accumulated = patients.reduce(
        (acc, patient) => {
            acc.total += 1;
            acc.attended += patient.isAttended ? 1 : 0;
            acc.waiting += patient.isAttended ? 0 : 1;
            acc.sumAge += patient.age;
            acc.sumPriority += patient.priority;
            acc.countByPriority[patient.priority] = (acc.countByPriority[patient.priority] || 0) + 1;
            acc.symptoms.push(...patient.symptoms.map((symptom) => symptom.trim()));
            return acc;
        },
        {
            total: 0,
            attended: 0,
            waiting: 0,
            sumAge: 0,
            sumPriority: 0,
            countByPriority: {} as Record<number, number>,
            symptoms: [] as string[],
        }
    );

    const uniqueSymptoms = accumulated.symptoms.filter(
        (symptom, index, list) => symptom.length > 0 && list.indexOf(symptom) === index
    );

    return {
        total: accumulated.total,
        attended: accumulated.attended,
        waiting: accumulated.waiting,
        averageAge: accumulated.total ? accumulated.sumAge / accumulated.total : 0,
        averagePriority: accumulated.total ? accumulated.sumPriority / accumulated.total : 0,
        countByPriority: accumulated.countByPriority,
        allSymptomsJoined: uniqueSymptoms.join(", "),
        hasCriticalWaiting: hasCriticalPatientsWaiting(patients),
    };
};

export const formatPatientsTable = (patients: Patient[], allPatients: Patient[]) => {
    return patients.map((patient) => {
        const index = allPatients.indexOf(patient);
        return {
            Índice: index + 1,
            Nome: patient.name,
            Idade: patient.age,
            Sintomas: patient.symptoms.join(", "),
            "Data de chegada": formatBrazilianDate(toPatientDate(patient.arrivalDate)),
            Prioridade: patient.priority,
            Classificação: getPriorityLabel(patient.priority),
            Atendido: patient.isAttended ? "Sim" : "Não",
        };
    });
};

export const formatPriorityDistribution = (countByPriority: Record<number, number>): string => {
    return Object.entries(countByPriority)
        .map(([priority, count]) => `Prioridade ${priority}: ${count} paciente(s)`)
        .join("\n");
};
