import { displayOptions } from "./options";
import patientList from "./patients/patient-list";
import patientRegistration from "./patients/patient-registration";


async function main() {
    const option: number = await displayOptions();
    switch (option) {
        case 1:
            await patientRegistration();
            main()
            break;
        case 2:
        
            break;
        case 3:
             patientList();
            main()
            break;
        case 4:
            console.log("Você selecionou a opção 4");
            break;
        case 5:
            console.log("Você selecionou a opção 5");
            break;
        case 6:
            console.log("Você selecionou a opção 6");
            break;
        case 7:
            console.log("Você selecionou a opção 7");
            break;
        case 8:
            console.log("Você selecionou a opção 8");
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


main();