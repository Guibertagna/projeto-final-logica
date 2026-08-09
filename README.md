# Sistema de Triagem para UPA

Sistema de triagem e gerenciamento de atendimento para Unidade de Pronto Atendimento (UPA), desenvolvido em TypeScript e executado via terminal (Node.js). O sistema permite cadastrar pacientes, classificar prioridades, gerenciar a fila de atendimento e gerar estatísticas.

## Como rodar

```bash
# Instalar dependências
npm install

# Executar o sistema (menu interativo no terminal)
npm start

# Executar os testes automatizados
npm test
```

## Estrutura do projeto

```
app/
├── api/              # Camada simulada de API (carregamento e persistência JSON)
├── data/             # Arquivo patients.json com dados dos pacientes
├── helpers/          # Validadores, conversores e classificação de prioridade
├── patients/         # Cadastro, edição, listagem e storage
├── queue/            # Regras de fila e atendimento por prioridade
├── statistics/       # Busca, estatísticas e relatórios
├── index.ts          # Ponto de entrada e menu principal
├── options.ts        # Opções do menu
└── types.ts          # Interfaces e tipos do domínio

tests/                # Testes automatizados (node:test)
```

## Mapa de requisitos

### R01 — Cadastro e gerenciamento de pacientes

**Implementação:** O sistema permite cadastrar pacientes com nome, idade, sintomas, data de chegada e prioridade. Também é possível listar e atualizar pacientes existentes.

**Arquivos:**
- `app/patients/patient-registration.ts` — cadastro via terminal
- `app/patients/patient-edit.ts` — atualização de dados
- `app/patients/patient-list.ts` — listagem em tabela
- `app/patients/patient-storage.ts` — persistência (add/update)
- `app/types.ts` — interface `Patient`

**Decisão técnica:** A entidade `Patient` centraliza os campos do domínio. O cadastro valida entrada antes de persistir.

---

### R02 — Organização das funcionalidades do sistema

**Implementação:** O código está dividido em módulos independentes por responsabilidade (pacientes, fila, estatísticas, validações, API).

**Arquivos:**
- `app/patients/` — cadastro e gerenciamento
- `app/queue/` — fila de atendimento
- `app/statistics/` — consultas e relatórios
- `app/helpers/` — funções reutilizáveis
- `app/api/` — camada de dados assíncrona

**Decisão técnica:** Exports named (`getPatients`, `sortQueue`) e default (`patientRegistration`, `patientEdit`) separam a API pública de cada módulo.

---

### R03 — Classificação e gerenciamento da fila de atendimento

**Implementação:** A fila ordena pacientes por prioridade (maior primeiro) e, em caso de empate, pela data de chegada mais antiga. O menu principal usa `switch` para controlar o fluxo.

**Arquivos:**
- `app/queue/queue-service.ts` — regras de ordenação e próximo paciente
- `app/queue/attend-next-patient.ts` — ação de atendimento
- `app/index.ts` — menu com `switch/case`

**Decisão técnica:** Funções puras (`sortQueue`, `findNextPatientIndex`) isolam a lógica de negócio da I/O, facilitando testes.

---

### R04 — Consulta, busca e geração de estatísticas

**Implementação:** Operações de análise usando métodos de array: filtrar por prioridade, buscar por nome, verificar pacientes críticos e gerar estatísticas consolidadas.

**Arquivos:**
- `app/statistics/statistics-service.ts` — `filter`, `find`, `some`, `reduce`, `join`
- `app/statistics/patient-search.ts` — busca interativa
- `app/statistics/patient-statistics.ts` — relatório consolidado

**Decisão técnica:** `getConsolidatedStatistics` usa `reduce` para acumular totais, médias e distribuição por prioridade em uma única passagem.

---

### R05 — Modelagem das entidades do sistema

**Implementação:** Entidades tipadas com interfaces, union types e arrays de objetos.

**Arquivos:**
- `app/types.ts` — `Patient`, `Options`, `ConsolidatedStatistics`
- `app/helpers/priority-label.ts` — union type `PriorityLabel` (`"Alta" | "Média" | "Baixa"`)

**Decisão técnica:** Destructuring e spread operator são usados em `updatePatient` e no parse de JSON da API.

---

### R06 — Simulação de comunicação com uma API

**Implementação:** Camada assíncrona que simula delay de rede, lê e grava pacientes em JSON.

**Arquivos:**
- `app/api/patient-api.ts` — `fetchPatients`, `savePatients` com Promises
- `app/patients/patient-storage.ts` — consome a API simulada

**Decisão técnica:** `Omit<Patient, "arrivalDate">` tipa o JSON (data como string) separado do modelo interno (`Date`). Delay de 300ms simula latência de rede.

---

### R07 — Validação automatizada das funcionalidades

**Implementação:** Testes com Node.js Test Runner (`node:test`) cobrindo validação, classificação, estatísticas, listagem e fila.

**Arquivos:**
- `tests/validator.test.ts` — validação de data, prioridade e índice
- `tests/priority-label.test.ts` — classificação de prioridade
- `tests/statistics.test.ts` — estatísticas e busca
- `tests/listing.test.ts` — formatação de tabela
- `tests/queue.test.ts` — ordenação e próximo paciente da fila

**Decisão técnica:** Fixtures em `tests/helpers/fixtures.ts` evitam duplicação de dados de teste.

---

### RA01 — Validação de dados com Expressões Regulares

**Implementação:** Regex valida formato de data brasileira (`dd/mm/yyyy`).

**Arquivo:** `app/helpers/validator.ts`

```ts
const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
```

**Decisão técnica:** A regex garante o formato antes de converter para `Date`. Prioridade e índice também são validados com regras numéricas.

---

### RA02 — Aperfeiçoamento da tipagem com Utility Types

**Implementação:** Uso de `Partial`, `Omit` e `Record` no contexto do domínio.

**Arquivos:**
- `app/patients/patient-storage.ts` — `Partial<Patient>` em `updatePatient` (atualização parcial)
- `app/api/patient-api.ts` — `Omit<Patient, "arrivalDate">` para tipar JSON
- `app/types.ts` — `Record<number, number>` em `countByPriority`

**Decisão técnica:** `Partial<Patient>` permite atualizar apenas os campos informados sem exigir o objeto completo.

---

### RA03 — Recurso avançado do ecossistema TypeScript

**Implementação:** Pattern matching com a biblioteca `ts-pattern` para classificar prioridade em rótulos legíveis.

**Arquivo:** `app/helpers/priority-label.ts`

```ts
match(priority)
    .when((p) => p >= 7, () => "Alta")
    .when((p) => p >= 4, () => "Média")
    .otherwise(() => "Baixa");
```

**Decisão técnica:** `ts-pattern` substitui cadeias de `if/else` por matching declarativo, com inferência de tipos no retorno (`PriorityLabel`).
