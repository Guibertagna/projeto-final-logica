import { fetchPatients, savePatients } from "../api/patient-api";
import { Patient } from "../types";

export const getPatients = async (): Promise<Patient[]> => {
    const response = await fetchPatients();
    return response.data;
};

export const addPatient = async (patient: Patient): Promise<void> => {
    const patients = await getPatients();
    patients.push(patient);
    await savePatients(patients);
};

export const updatePatient = async (index: number, updates: Partial<Patient>): Promise<Patient | null> => {
    const patients = await getPatients();

    if (index < 0 || index >= patients.length) {
        return null;
    }

    patients[index] = { ...patients[index], ...updates };
    await savePatients(patients);
    return patients[index];
};
