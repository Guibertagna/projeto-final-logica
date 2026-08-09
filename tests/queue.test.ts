import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    findNextPatientIndex,
    getWaitingPatients,
    sortQueue,
} from "../app/queue/queue-service";
import { samplePatients } from "./helpers/fixtures";
import { Patient } from "../app/types";

describe("getWaitingPatients", () => {
    it("retorna apenas pacientes que ainda não foram atendidos", () => {
        const waiting = getWaitingPatients(samplePatients);

        assert.equal(waiting.length, 2);
        assert.equal(waiting[0].name, "Ana Silva");
        assert.equal(waiting[1].name, "Bruno Costa");
    });

    it("retorna lista vazia quando todos já foram atendidos", () => {
        const allAttended = samplePatients.map((patient) => ({
            ...patient,
            isAttended: true,
        }));

        assert.deepEqual(getWaitingPatients(allAttended), []);
    });
});

describe("sortQueue", () => {
    it("ordena por prioridade decrescente", () => {
        const sorted = sortQueue(getWaitingPatients(samplePatients));

        assert.equal(sorted[0].name, "Bruno Costa");
        assert.equal(sorted[0].priority, 9);
        assert.equal(sorted[1].name, "Ana Silva");
        assert.equal(sorted[1].priority, 5);
    });

    it("desempata por data de chegada mais antiga quando a prioridade é igual", () => {
        const patients: Patient[] = [
            {
                name: "Paciente Recente",
                age: 40,
                symptoms: ["febre"],
                arrivalDate: new Date(2026, 0, 20),
                priority: 7,
                isAttended: false,
            },
            {
                name: "Paciente Antigo",
                age: 35,
                symptoms: ["tosse"],
                arrivalDate: new Date(2026, 0, 5),
                priority: 7,
                isAttended: false,
            },
        ];

        const sorted = sortQueue(patients);

        assert.equal(sorted[0].name, "Paciente Antigo");
        assert.equal(sorted[1].name, "Paciente Recente");
    });

    it("não altera a lista original", () => {
        const waiting = getWaitingPatients(samplePatients);
        const originalOrder = waiting.map((patient) => patient.name);

        sortQueue(waiting);

        assert.deepEqual(
            waiting.map((patient) => patient.name),
            originalOrder
        );
    });
});

describe("findNextPatientIndex", () => {
    it("retorna o índice do paciente com maior prioridade na lista original", () => {
        const index = findNextPatientIndex(samplePatients);

        assert.equal(index, 1);
        assert.equal(samplePatients[index!].name, "Bruno Costa");
    });

    it("retorna null quando não há pacientes aguardando", () => {
        const allAttended = samplePatients.map((patient) => ({
            ...patient,
            isAttended: true,
        }));

        assert.equal(findNextPatientIndex(allAttended), null);
    });

    it("retorna null para lista vazia", () => {
        assert.equal(findNextPatientIndex([]), null);
    });

    it("desempata por chegada mais antiga quando há empate de prioridade", () => {
        const patients: Patient[] = [
            {
                name: "Primeiro",
                age: 30,
                symptoms: ["febre"],
                arrivalDate: new Date(2026, 0, 10),
                priority: 8,
                isAttended: false,
            },
            {
                name: "Segundo",
                age: 31,
                symptoms: ["tosse"],
                arrivalDate: new Date(2026, 0, 5),
                priority: 8,
                isAttended: false,
            },
        ];

        const index = findNextPatientIndex(patients);

        assert.equal(index, 1);
        assert.equal(patients[index!].name, "Segundo");
    });
});
