import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseBrazilianDate } from "../app/helpers/converter";
import {
    isValidBrazilianDate,
    isValidId,
    isValidPriority,
} from "../app/helpers/validator";

describe("isValidPriority", () => {
    it("aceita prioridades entre 1 e 10", () => {
        assert.equal(isValidPriority("1"), true);
        assert.equal(isValidPriority("5"), true);
        assert.equal(isValidPriority("10"), true);
    });

    it("rejeita prioridades fora do intervalo", () => {
        assert.equal(isValidPriority("0"), false);
        assert.equal(isValidPriority("11"), false);
        assert.equal(isValidPriority("abc"), false);
    });
});

describe("isValidBrazilianDate", () => {
    it("aceita datas no formato dd/mm/yyyy", () => {
        assert.equal(isValidBrazilianDate("15/01/2026"), true);
        assert.equal(isValidBrazilianDate("01/12/2025"), true);
    });

    it("rejeita formatos inválidos", () => {
        assert.equal(isValidBrazilianDate("2026-01-15"), false);
        assert.equal(isValidBrazilianDate("15/01"), false);
        assert.equal(isValidBrazilianDate("32/13/2026"), false);
        assert.equal(isValidBrazilianDate(""), false);
    });
});

describe("isValidId", () => {
    it("aceita índices válidos dentro da lista", () => {
        assert.equal(isValidId(1, 3), true);
        assert.equal(isValidId(3, 3), true);
    });

    it("rejeita índices fora do intervalo", () => {
        assert.equal(isValidId(0, 3), false);
        assert.equal(isValidId(4, 3), false);
        assert.equal(isValidId(1.5, 3), false);
    });
});

describe("parseBrazilianDate", () => {
    it("converte data brasileira para Date", () => {
        const date = parseBrazilianDate("15/01/2026");
        assert.equal(date.getFullYear(), 2026);
        assert.equal(date.getMonth(), 0);
        assert.equal(date.getDate(), 15);
    });

    it("lança erro para data inválida", () => {
        assert.throws(() => parseBrazilianDate("data-invalida"), /Data inválida/);
    });
});
