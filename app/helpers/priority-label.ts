import { match } from "ts-pattern";

export type PriorityLabel = "Alta" | "Média" | "Baixa";

export const getPriorityLabel = (priority: number): PriorityLabel =>
    match(priority)
        .when((p) => p >= 7, () => "Alta" as const)
        .when((p) => p >= 4, () => "Média" as const)
        .otherwise(() => "Baixa" as const);
