
import { getPatients } from "./patient-storage";
import { formatBrazilianDate } from "../helpers/converter";


const patientList = (): void => {
  const patientList = getPatients().map(patient => {
    return {
      Nome: patient.name,
      Idade: patient.age,
      Sintomas: patient.symptoms.join(", "),
      'Data de chegada': formatBrazilianDate(patient.arrivalDate),
      Prioridade: patient.priority,
      'Atendido': patient.isAttended ? 'Sim' : 'Não'
    }
  });
  console.table(patientList);

}

export default patientList;