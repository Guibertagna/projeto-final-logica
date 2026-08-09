import { displayMainOptions } from "./options";
import { getPatients } from "./patients/patient-storage";
import attendNextPatient from "./queue/attend-next-patient";
import patientEdit from "./patients/patient-edit";
import patientList from "./patients/patient-list";
import patientRegistration from "./patients/patient-registration";
import patientSearch from "./statistics/patient-search";
import patientStatistics from "./statistics/patient-statistics";


async function main() {
    const option: number = await displayMainOptions();
    switch (option) {
        case 1:
            await patientRegistration();
            main()
            break;
        case 2:
            await patientEdit();
            main();
            break;
        case 3:
            await patientList();
            main()
            break;
        case 4:
            await attendNextPatient();
            main();
            break;
        case 5:
            await patientStatistics();
            main();
            break;
        case 6:
            await patientSearch();
            main();
            break;
        case 7:
            console.log("saindo do sistema...");
            process.exit(0);
            break;
        default:
            console.log("Opção inválida");
            console.log("Digite uma opção válida");
            setTimeout(() => {
                main();
            }, 1000);
            break;
    }
}


async function bootstrap(): Promise<void> {
    console.log("Conectando à API de pacientes...");
    await getPatients();
    await main();
}

bootstrap();