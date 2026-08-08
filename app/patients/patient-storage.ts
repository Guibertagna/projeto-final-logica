import path from "node:path";
import * as fs from "node:fs";
import { Patient } from "../types";

export const addPatient = (patient: Patient): void => {
    const filePath = path.join(__dirname, "../data/patients.json");
    let patients: Patient[] = [];
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8").trim();
        if (content) {
            patients = JSON.parse(content);
        }
    }
    patients.push(patient);
    fs.writeFileSync(filePath, JSON.stringify(patients, null, 2));
}

export const getPatients = (): Patient[] => {
    const filePath = path.join(__dirname, "../data/patients.json");
    let patients: Patient[] = [];
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8").trim();
        if (content) {
            patients = JSON.parse(content);
        }
    }
    return patients;
}
