import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { Options } from "./types";

export const options: Options[] = [
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
        label: "Listar pacientes",
        description: "Lista todos os pacientes",
        id: 3
    },
    {
        label: "Atender próximo paciente",
        description: "Atende o próximo paciente",
        id: 4
    },
    {
        label: "Alterar prioridade",
        description: "Altera a prioridade de um paciente",
        id: 5
    },
    {
        label: "Estatísticas",
        description: "Exibe as estatísticas do sistema",
        id: 6
    },
    {
        label: "Buscar paciente",
        description: "Busca um paciente pelo nome",
        id: 7
    },
    {
        label: "Sair",
        description: "Sai do sistema",
        id: 8
    }
]

export const displayOptions = (): Promise<number> => {
    const rl = readline.createInterface({ input, output });
    console.log("Bem-vindo ao sistema de atendimento do UPA");
    console.log("Selecione uma opção:");
    options.forEach((option) => {
        console.log(`${option.id} - ${option.label}`);
    });

   return new Promise((resolve) => {
    rl.question("Digite o número da opção: ", (escolha) => {
        resolve(Number(escolha));
        rl.close();
    });
   });
}