# Organizador Pessoal — MVP

Versão inicial (MVP) do Organizador Pessoal — uma aplicação leve para gerenciar tarefas, subtarefas, prioridades, prazos e tags.

**Stack:** React + Vite + dnd-kit

**Funcionalidades do MVP:**
- Criar tarefas principais
- Subtarefas aninhadas (hierarquia)
- Alternar status (vazio / andamento / concluído) com propagação
- Ordenação manual por arrastar e soltar
- Ordenação por mais recentes e por prioridade
- Edição de tarefa: título, prioridade, tags e prazo
- Persistência simples em `localStorage`

**Instalação (desenvolvimento):**

```bash
npm install
npm run dev
```

Abra no navegador em `http://localhost:5173` (padrão do Vite).

**Build para produção:**

```bash
npm run build
npm run preview
```

**Próximos passos (sugestões):**
- Adicionar testes unitários
- Suporte a autenticação / múltiplos usuários
- Sincronização com backend (API) e backup
- Melhor acessibilidade e temas

Para detalhes do escopo inicial e decisões do MVP, veja o arquivo `MVP.md`.
