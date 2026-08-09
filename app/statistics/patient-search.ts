import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { getPatients } from "../patients/patient-storage";
import { findPatientByName, findPatientsByName, formatPatientsTable } from "./statistics-service";

const patientSearch = async (): Promise<void> => {
    console.log("Carregando pacientes...");
    const patients = await getPatients();

    if (patients.length === 0) {
        console.log("Nenhum paciente cadastrado.");
        return;
    }

    const rl = readline.createInterface({ input, output });

    return new Promise((resolve) => {
        const askSearch = (): void => {
            rl.question("Digite o nome (ou parte do nome) do paciente: ", (name) => {
                const query = name.trim();

                if (!query) {
                    console.log("Nome inválido. Tente novamente.");
                    askSearch();
                    return;
                }

                const exactMatch = findPatientByName(patients, query);
                const allMatches = findPatientsByName(patients, query);

                if (!exactMatch) {
                    console.log("Paciente não encontrado. Tente novamente.");
                    askSearch();
                    return;
                }

                console.log(`\n${allMatches.length} paciente(s) encontrado(s):`);
                console.table(formatPatientsTable(allMatches, patients));

                rl.close();
                resolve();
            });
        };

        askSearch();
    });
};

export default patientSearch;
