# MVP - Organizador Pessoal

Escopo mínimo para a primeira versão (MVP):

- Interface web simples em React (Vite)
- Criar/editar/excluir tarefas principais
- Subtarefas aninhadas com comportamento de cascata de status
- Marcação de status: vazio (""), andamento ("/"), concluído ("x")
- Reordenar tarefas principais via drag-and-drop (dnd-kit)
- Ordenação alternativa por mais recentes e por prioridade
- Edição de título, prioridade, tags e prazo (datetime)
- Persistência local usando `localStorage` para salvar o estado

Critérios de aceitação:

- A aplicação inicia sem erros em `npm run dev`
- Criação e edição persistem após reload (localStorage)
- Subtarefas atualizam o status do pai corretamente
- Drag-and-drop funciona para itens do nível principal

Decisões de implementação notáveis:

- Estrutura em árvore para permitir subtarefas arbitrárias
- Sincronização de status feita em duas fases: forçar filhos (top-down) e sincronizar pais (bottom-up)
- UI minimalista e responsiva com CSS modular

Próximos passos após MVP:

- Persistência remota com API e autenticação
- Histórico/undo das ações
- Testes automatizados e CI
- Export / import de tarefas
