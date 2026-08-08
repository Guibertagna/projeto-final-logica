import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { isValidBrazilianDate, isValidPriority } from "../helpers/validator";
import { parseBrazilianDate } from "../helpers/converter";
import { Patient } from "../types";
import { addPatient } from "./patient-storage";



const patientRegistration = (): Promise<Patient> => {
    const rl = readline.createInterface({ input, output });
    return new Promise((resolve) => {

        rl.question("Digite o nome do paciente: ", (name) => {
            const askAge = (): void => {
                rl.question("Digite a idade do paciente: ", (age) => {
                    if (isNaN(parseInt(age))) {
                        console.log("Idade inválida. Digite um número inteiro.");
                        askAge();
                        return;
                    }
                    rl.question("Digite os sintomas do paciente, separados por vírgula: ", (symptoms) => {
                        const askArrivalDate = (): void => {
                            rl.question("Digite a data de chegada do paciente (dd/mm/yyyy): ", (arrivalDate) => {
                                if (!isValidBrazilianDate(arrivalDate)) {
                                    console.log("Data inválida. Use o formato dd/mm/yyyy.");
                                    askArrivalDate();
                                    return;
                                }
                                const askPriority = (): void => {
                                    rl.question("Digite a prioridade do paciente entre 1 e 10: ", (priority) => {
                                        if (!isValidPriority(priority)) {
                                            console.log("Prioridade inválida. Digite um número inteiro entre 1 e 10.");
                                            askPriority();
                                            return;
                                        }
                                        const patient: Patient = {
                                            name: name,
                                            age: parseInt(age),
                                            symptoms: symptoms.split(",").map(symptom => symptom.trim()),
                                            arrivalDate: parseBrazilianDate(arrivalDate),
                                            priority: parseInt(priority),
                                            isAttended: false
                                        };
                                        rl.close();
                                        console.log("Paciente registrado");
                                        addPatient(patient);
                                        resolve(patient);
                                    });
                                }
                                askPriority();
                            });
                        };

                        askArrivalDate();
                    })
                })
            };
            askAge();
        })
    })

}

export default patientRegistration;