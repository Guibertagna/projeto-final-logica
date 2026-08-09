import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { formatBrazilianDate, parseBrazilianDate, toPatientDate } from "../helpers/converter";
import { isValidBrazilianDate, isValidId, isValidPriority } from "../helpers/validator";
import { Patient } from "../types";
import { getPatients, updatePatient } from "./patient-storage";

const toDate = (value: Date | string): Date => {
    return toPatientDate(value);
};

const parseAttended = (input: string, current: boolean): boolean | null => {
    const value = input.trim().toLowerCase();
    if (!value) {
        return current;
    }
    if (["s", "sim"].includes(value)) {
        return true;
    }
    if (["n", "nao", "não"].includes(value)) {
        return false;
    }
    return null;
};

const askUpdates = (
    rl: readline.Interface,
    current: Patient,
    index: number,
    resolve: (value: Patient | null) => void
): void => {
    const currentArrivalDate = toDate(current.arrivalDate);

    console.log("\nPaciente selecionado:");
    console.log(`Nome: ${current.name}`);
    console.log(`Idade: ${current.age}`);
    console.log(`Sintomas: ${current.symptoms.join(", ")}`);
    console.log(`Data de chegada: ${formatBrazilianDate(currentArrivalDate)}`);
    console.log(`Prioridade: ${current.priority}`);
    console.log(`Atendido: ${current.isAttended ? "Sim" : "Não"}`);
    console.log("\nPressione Enter para manter o valor atual.\n");

    rl.question(`Nome [${current.name}]: `, (name) => {
        const askAge = (): void => {
            rl.question(`Idade [${current.age}]: `, (age) => {
                if (age.trim() && isNaN(parseInt(age))) {
                    console.log("Idade inválida. Digite um número inteiro.");
                    askAge();
                    return;
                }

                rl.question(`Sintomas [${current.symptoms.join(", ")}]: `, (symptoms) => {
                    const askArrivalDate = (): void => {
                        rl.question(
                            `Data de chegada (dd/mm/yyyy) [${formatBrazilianDate(currentArrivalDate)}]: `,
                            (arrivalDateInput) => {
                                if (arrivalDateInput.trim() && !isValidBrazilianDate(arrivalDateInput)) {
                                    console.log("Data inválida. Use o formato dd/mm/yyyy.");
                                    askArrivalDate();
                                    return;
                                }

                                const askPriority = (): void => {
                                    rl.question(`Prioridade (1-10) [${current.priority}]: `, (priority) => {
                                        if (priority.trim() && !isValidPriority(priority)) {
                                            console.log("Prioridade inválida. Digite um número inteiro entre 1 e 10.");
                                            askPriority();
                                            return;
                                        }

                                        const askAttended = (): void => {
                                            rl.question(
                                                `Atendido (s/n) [${current.isAttended ? "s" : "n"}]: `,
                                                (isAttendedInput) => {
                                                    const attended = parseAttended(isAttendedInput, current.isAttended);
                                                    if (attended === null) {
                                                        console.log("Resposta inválida. Digite s ou n.");
                                                        askAttended();
                                                        return;
                                                    }

                                                    updatePatient(index, {
                                                        name: name.trim() || current.name,
                                                        age: age.trim() ? parseInt(age) : current.age,
                                                        symptoms: symptoms.trim()
                                                            ? symptoms.split(",").map((symptom) => symptom.trim())
                                                            : current.symptoms,
                                                        arrivalDate: arrivalDateInput.trim()
                                                            ? parseBrazilianDate(arrivalDateInput)
                                                            : currentArrivalDate,
                                                        priority: priority.trim() ? parseInt(priority) : current.priority,
                                                        isAttended: attended,
                                                    }).then((updated) => {
                                                        rl.close();

                                                        if (!updated) {
                                                            console.log("Erro ao atualizar paciente.");
                                                            resolve(null);
                                                            return;
                                                        }

                                                        console.log("Paciente atualizado com sucesso.");
                                                        resolve(updated);
                                                    });
                                                }
                                            );
                                        };

                                        askAttended();
                                    });
                                };

                                askPriority();
                            }
                        );
                    };

                    askArrivalDate();
                });
            });
        };

        askAge();
    });
};

const askPatientSelection = (
    rl: readline.Interface,
    resolve: (value: Patient | null) => void
): void => {
    getPatients().then((patients) => {
        if (patients.length === 0) {
            rl.close();
            console.log("Nenhum paciente cadastrado.");
            resolve(null);
            return;
        }

        rl.question("Digite o índice do paciente: ", (query) => {
            const index = Number(query.trim()) - 1;

            if (!isValidId(Number(query.trim()), patients.length)) {
                console.log("Índice inválido. Tente novamente.");
                askPatientSelection(rl, resolve);
                return;
            }

            askUpdates(rl, patients[index], index, resolve);
        });
    });
};

const patientEdit = (): Promise<Patient | null> => {
    const rl = readline.createInterface({ input, output });

    return new Promise((resolve) => {
        askPatientSelection(rl, resolve);
    });
};

export default patientEdit;
