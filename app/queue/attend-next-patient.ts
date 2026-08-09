import { formatBrazilianDate, toPatientDate } from "../helpers/converter";
import { attendNextPatient, getOrderedQueue } from "./queue-service";

const attendNextPatientAction = async (): Promise<void> => {
    console.log("Carregando fila de atendimento...");
    const queue = await getOrderedQueue();

    if (queue.length === 0) {
        console.log("Não há pacientes aguardando atendimento.");
        return;
    }

    console.log("\nFila de atendimento (por prioridade):");
    queue.forEach((patient, index) => {
        console.log(
            `${index + 1}. ${patient.name} — prioridade ${patient.priority} — chegada ${formatBrazilianDate(toPatientDate(patient.arrivalDate))}`
        );
    });

    const attended = await attendNextPatient();

    if (!attended) {
        console.log("Não foi possível atender o próximo paciente.");
        return;
    }

    console.log("\nPaciente chamado para atendimento:");
    console.log(`Nome: ${attended.name}`);
    console.log(`Idade: ${attended.age}`);
    console.log(`Sintomas: ${attended.symptoms.join(", ")}`);
    console.log(`Prioridade: ${attended.priority}`);
    console.log(`Data de chegada: ${formatBrazilianDate(toPatientDate(attended.arrivalDate))}`);
};

export default attendNextPatientAction;
