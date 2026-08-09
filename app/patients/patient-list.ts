
import { getPatients } from "./patient-storage";
import { formatBrazilianDate, toPatientDate } from "../helpers/converter";
import { getPriorityLabel } from "../helpers/priority-label";


const patientList = async (): Promise<void> => {
  console.log("Carregando pacientes...");
  const patients = await getPatients();
  const patientList = patients.map((patient, index) => {
    return {
      Índice: index + 1,
      Nome: patient.name,
      Idade: patient.age,
      Sintomas: patient.symptoms.join(", "),
      'Data de chegada': formatBrazilianDate(toPatientDate(patient.arrivalDate)),
      Prioridade: patient.priority,
      Classificação: getPriorityLabel(patient.priority),
      'Atendido': patient.isAttended ? 'Sim' : 'Não'
    }
  });
  console.table(patientList);

}

export default patientList;