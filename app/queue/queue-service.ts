import { getPatients, updatePatient } from "../patients/patient-storage";
import { toPatientDate } from "../helpers/converter";
import { Patient } from "../types";

export const getWaitingPatients = (patients: Patient[]): Patient[] => {
    return patients.filter((patient) => !patient.isAttended);
};

export const compareByQueueOrder = (first: Patient, second: Patient): number => {
    if (first.priority !== second.priority) {
        return second.priority - first.priority;
    }

    return toPatientDate(first.arrivalDate).getTime() - toPatientDate(second.arrivalDate).getTime();
};

export const sortQueue = (patients: Patient[]): Patient[] => {
    return [...patients].sort(compareByQueueOrder);
};

export const getOrderedQueue = async (): Promise<Patient[]> => {
    const waitingPatients = getWaitingPatients(await getPatients());
    return sortQueue(waitingPatients);
};

export const findNextPatientIndex = (patients: Patient[]): number | null => {
    const waitingPatients = patients
        .map((patient, index) => ({ patient, index }))
        .filter(({ patient }) => !patient.isAttended);

    if (waitingPatients.length === 0) {
        return null;
    }

    const [nextPatient] = waitingPatients.sort((first, second) =>
        compareByQueueOrder(first.patient, second.patient)
    );

    return nextPatient.index;
};

export const attendNextPatient = async (): Promise<Patient | null> => {
    const patients = await getPatients();
    const index = findNextPatientIndex(patients);

    if (index === null) {
        return null;
    }

    return updatePatient(index, { isAttended: true });
};
