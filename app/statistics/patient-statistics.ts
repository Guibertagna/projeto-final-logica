import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { isValidPriority } from "../helpers/validator";
import { getPatients } from "../patients/patient-storage";
import {
    filterPatientsByPriority,
    formatPatientsTable,
    formatPriorityDistribution,
    getConsolidatedStatistics,
} from "./statistics-service";

const patientStatistics = async (): Promise<void> => {
    console.log("Carregando dados para análise...");
    const patients = await getPatients();

    if (patients.length === 0) {
        console.log("Nenhum paciente cadastrado.");
        return;
    }

    const stats = getConsolidatedStatistics(patients);

    console.log("\n=== Estatísticas consolidadas ===");
    console.log(`Total de pacientes: ${stats.total}`);
    console.log(`Atendidos: ${stats.attended}`);
    console.log(`Aguardando: ${stats.waiting}`);
    console.log(`Média de idade: ${stats.averageAge.toFixed(1)} anos`);
    console.log(`Média de prioridade: ${stats.averagePriority.toFixed(1)}`);
    console.log(`Pacientes críticos aguardando (prioridade >= 8): ${stats.hasCriticalWaiting ? "Sim" : "Não"}`);
    console.log("\nDistribuição por prioridade:");
    console.log(formatPriorityDistribution(stats.countByPriority));
    console.log("\nSintomas registrados:");
    console.log(stats.allSymptomsJoined || "Nenhum sintoma registrado.");

    const rl = readline.createInterface({ input, output });

    return new Promise((resolve) => {
        const askPriority = (): void => {
            rl.question("\nDigite uma prioridade (1-10) para listar pacientes ou Enter para voltar: ", (priorityInput) => {
                if (!priorityInput.trim()) {
                    rl.close();
                    resolve();
                    return;
                }

                if (!isValidPriority(priorityInput)) {
                    console.log("Prioridade inválida. Digite um número inteiro entre 1 e 10.");
                    askPriority();
                    return;
                }

                const priority = Number(priorityInput);
                const filteredPatients = filterPatientsByPriority(patients, priority);

                if (filteredPatients.length === 0) {
                    console.log(`Nenhum paciente encontrado com prioridade ${priority}.`);
                } else {
                    console.log(`\nPacientes com prioridade ${priority}:`);
                    console.table(formatPatientsTable(filteredPatients, patients));
                }

                askPriority();
            });
        };

        askPriority();
    });
};

export default patientStatistics;
