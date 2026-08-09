import { Patient } from "../../app/types";

export const samplePatients: Patient[] = [
    {
        name: "Ana Silva",
        age: 30,
        symptoms: ["febre", "tosse"],
        arrivalDate: new Date(2026, 0, 15),
        priority: 5,
        isAttended: false,
    },
    {
        name: "Bruno Costa",
        age: 45,
        symptoms: ["dor no peito"],
        arrivalDate: new Date(2026, 0, 10),
        priority: 9,
        isAttended: false,
    },
    {
        name: "Carlos Mendes",
        age: 22,
        symptoms: ["tontura"],
        arrivalDate: new Date(2026, 0, 20),
        priority: 3,
        isAttended: true,
    },
];
