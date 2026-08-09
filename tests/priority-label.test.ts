import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getPriorityLabel } from "../app/helpers/priority-label";

describe("getPriorityLabel", () => {
    it("classifica prioridade alta (7-10)", () => {
        assert.equal(getPriorityLabel(7), "Alta");
        assert.equal(getPriorityLabel(10), "Alta");
    });

    it("classifica prioridade média (4-6)", () => {
        assert.equal(getPriorityLabel(4), "Média");
        assert.equal(getPriorityLabel(6), "Média");
    });

    it("classifica prioridade baixa (1-3)", () => {
        assert.equal(getPriorityLabel(1), "Baixa");
        assert.equal(getPriorityLabel(3), "Baixa");
    });
});
