import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatPatientsTable } from "../app/statistics/statistics-service";
import { samplePatients } from "./helpers/fixtures";

describe("formatPatientsTable", () => {
    it("retorna uma linha por paciente com os campos esperados", () => {
        const table = formatPatientsTable(samplePatients, samplePatients);

        assert.equal(table.length, 3);
        assert.deepEqual(Object.keys(table[0]), [
            "Índice",
            "Nome",
            "Idade",
            "Sintomas",
            "Data de chegada",
            "Prioridade",
            "Classificação",
            "Atendido",
        ]);
    });

    it("usa o índice correto na lista completa", () => {
        const filtered = [samplePatients[1]];
        const table = formatPatientsTable(filtered, samplePatients);

        assert.equal(table[0].Índice, 2);
        assert.equal(table[0].Nome, "Bruno Costa");
    });

    it("formata sintomas e status de atendimento", () => {
        const table = formatPatientsTable([samplePatients[0]], samplePatients);

        assert.equal(table[0].Sintomas, "febre, tosse");
        assert.equal(table[0].Atendido, "Não");
        assert.equal(table[0]["Data de chegada"], "15/01/2026");
    });
});
