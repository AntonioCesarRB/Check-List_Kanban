# Organizador Pessoal (MVP)

Uma aplicação de produtividade baseada em **check-lists** avançados, projetada para gerenciar demandas complexas através de níveis infinitos de subatividades. O projeto foca em uma interface limpa, manipulação de estado complexo e arquitetura front-end escalável.

## 🚀 Funcionalidades Atuais

* **Estrutura em Árvore (Subníveis Infinitos):** Capacidade de criar tarefas dentro de tarefas, permitindo desmembrar demandas macro em passos acionáveis de qualquer profundidade.
* **Sistema de Status:** Alternância rápida entre "Para fazer" (vazio), "Em andamento" (`/`) e "Concluído" (`x`).
* **Priorização:** Atribuição de peso (0 a 9) para ordenação de atividades críticas.
* **Gestão de Prazos:** Inserção de datas limites relativas (ex: daqui a 3 dias) ou manuais via calendário, com cálculo automático.
* **Categorização (Tags/Labels):** Inserção de texto livre transformado em pílulas (badges) visuais com geração dinâmica de cores via algoritmo de *hash*.
* **Ordenação Inteligente:** Filtros de visualização no nível Macro por ordem de inserção manual, mais recentes ou maior prioridade.
* **Persistência de Dados Local:** Salvamento automático de toda a árvore de tarefas no `localStorage` do navegador, imune a *reloads*.

## 🛠️ Tecnologias e Arquitetura

O projeto foi construído priorizando o isolamento de componentes e seletores estáveis, preparando a base de código para futuras implementações de testes E2E e validações de regressão visual.

* **React (via Vite):** Renderização eficiente da interface e controle rigoroso de estado e recursividade.
* **CSS Modules:** Encapsulamento de estilos por componente, garantindo que não haja vazamento de regras de CSS e facilitando a manutenção.
* **Vanilla JS:** Lógica de negócio, *hashing* de cores e cálculos de datas absolutas tratados nativamente sem dependências externas excessivas.

## ⚙️ Pré-requisitos e Instalação

Certifique-se de ter o **Node.js** instalado em seu ambiente local.

```Bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities --save-exact

## 🤖 Iniciando a aplicação
* Clone este repositório.
* Acesse a raiz do projeto no terminal:

```bash
   cd organizador-pessoal
   npm install
```
* Inicie o servidor de desenvolvimento:

```bash
    npm run dev
```
* Acesse o endereço local fornecido no terminal (geralmente http://localhost:5173).

## 🗺️ Roadmap (Próximos Passos)

* [ ] Lógica de Status em Cascata (Bottom-up): Mudança automática do status da atividade macro baseada no progresso das atividades-filhas.
* [ ] Reordenação Visual: Implementação de biblioteca Drag and Drop para o modo de ordenação manual.
* [ ] Cobertura de Qualidade: Mapeamento de cenários base e fluxos críticos utilizando Cypress.
* [ ] Expansão Modular: Construção de painéis adjacentes.