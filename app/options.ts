import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { Options } from "./types";

export const mainOptions: Options[] = [
    {
        label: "Cadastrar paciente",
        description: "Cadastra um novo paciente",
        id: 1
    },
    {
        label: "Atualizar paciente",
        description: "Atualiza um paciente",
        id: 2
    },
    {
        label: "Listar todos os pacientes",
        description: "Lista todos os pacientes",
        id: 3
    },
    {
        label: "Atender próximo paciente conforme prioridade",
        description: "Atende o próximo paciente conforme prioridade",
        id: 4
    },
    {
        label: "Estatísticas",
        description: "Exibe as estatísticas do sistema",
        id: 5
    },
    {
        label: "Buscar paciente",
        description: "Busca um paciente pelo nome",
        id: 6
    },
    {
        label: "Sair",
        description: "Sai do sistema",
        id: 7
    }
]

export const displayMainOptions = (): Promise<number> => {
    const rl = readline.createInterface({ input, output });
    console.log("Bem-vindo ao sistema de atendimento do UPA");
    console.log("Selecione uma opção:");
    mainOptions.forEach((option: Options) => {
        console.log(`${option.id} - ${option.label}`);
    });

    return new Promise((resolve) => {
        rl.question("Digite o número da opção: ", (escolha) => {
            resolve(Number(escolha));
            rl.close();
        });
    });
}
