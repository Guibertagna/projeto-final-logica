import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    filterPatientsByPriority,
    findPatientByName,
    findPatientsByName,
    getConsolidatedStatistics,
    hasCriticalPatientsWaiting,
} from "../app/statistics/statistics-service";
import { samplePatients } from "./helpers/fixtures";

describe("getConsolidatedStatistics", () => {
    it("calcula totais, médias e sintomas consolidados", () => {
        const stats = getConsolidatedStatistics(samplePatients);

        assert.equal(stats.total, 3);
        assert.equal(stats.attended, 1);
        assert.equal(stats.waiting, 2);
        assert.equal(stats.averageAge, 32.333333333333336);
        assert.equal(stats.averagePriority, 17 / 3);
        assert.equal(stats.allSymptomsJoined, "febre, tosse, dor no peito, tontura");
        assert.equal(stats.countByPriority[5], 1);
        assert.equal(stats.countByPriority[9], 1);
        assert.equal(stats.countByPriority[3], 1);
    });
});

describe("filterPatientsByPriority", () => {
    it("retorna apenas pacientes com a prioridade informada", () => {
        const filtered = filterPatientsByPriority(samplePatients, 5);

        assert.equal(filtered.length, 1);
        assert.equal(filtered[0].name, "Ana Silva");
    });

    it("retorna lista vazia quando não há pacientes com a prioridade", () => {
        const filtered = filterPatientsByPriority(samplePatients, 1);
        assert.deepEqual(filtered, []);
    });
});

describe("hasCriticalPatientsWaiting", () => {
    it("retorna true quando há paciente crítico aguardando", () => {
        assert.equal(hasCriticalPatientsWaiting(samplePatients), true);
    });

    it("retorna false quando não há paciente crítico aguardando", () => {
        const patients = samplePatients.map((patient) =>
            patient.priority >= 8 ? { ...patient, isAttended: true } : patient
        );

        assert.equal(hasCriticalPatientsWaiting(patients), false);
    });
});

describe("findPatientByName", () => {
    it("encontra paciente por parte do nome sem diferenciar maiúsculas", () => {
        const found = findPatientByName(samplePatients, "ana");

        assert.equal(found?.name, "Ana Silva");
    });

    it("retorna undefined quando não encontra", () => {
        const found = findPatientByName(samplePatients, "Inexistente");
        assert.equal(found, undefined);
    });
});

describe("findPatientsByName", () => {
    it("retorna todos os pacientes que correspondem à busca", () => {
        const found = findPatientsByName(samplePatients, "silva");

        assert.equal(found.length, 1);
        assert.equal(found[0].name, "Ana Silva");
    });
});
