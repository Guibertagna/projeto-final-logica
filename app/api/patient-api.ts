import path from "node:path";
import fs from "node:fs/promises";
import { toPatientDate } from "../helpers/converter";
import { Patient } from "../types";

const PATIENTS_FILE = path.join(__dirname, "../data/patients.json");
const API_DELAY_MS = 300;

type PatientJson = Omit<Patient, "arrivalDate"> & {
    arrivalDate: string | null;
};

export interface ApiResponse<T> {
    data: T;
    fetchedAt: Date;
}

const simulateNetworkDelay = (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, API_DELAY_MS);
    });
};

const parsePatientsFromJson = (rawData: PatientJson[]): Patient[] => {
    return rawData.map((patient) => ({
        ...patient,
        arrivalDate: toPatientDate(patient.arrivalDate),
    }));
};

export const fetchPatients = async (): Promise<ApiResponse<Patient[]>> => {
    await simulateNetworkDelay();

    try {
        const content = await fs.readFile(PATIENTS_FILE, "utf-8");
        const trimmedContent = content.trim();

        if (!trimmedContent) {
            return { data: [], fetchedAt: new Date() };
        }

        const parsed = JSON.parse(trimmedContent) as PatientJson[];
        return { data: parsePatientsFromJson(parsed), fetchedAt: new Date() };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return { data: [], fetchedAt: new Date() };
        }
        throw error;
    }
};

export const savePatients = async (patients: Patient[]): Promise<void> => {
    await simulateNetworkDelay();
    const json = JSON.stringify(patients, null, 2);
    await fs.writeFile(PATIENTS_FILE, json, "utf-8");
};
