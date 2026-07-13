import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  KeyboardSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  arrayMove,
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';

import { Checklist } from './components/Checklist.jsx';
import { TaskModal } from './components/TaskModal.jsx';

export default function App() {
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem('organizador-tarefas');
    return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
  });
  
  const [novoTitulo, setNovoTitulo] = useState("");
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState(null);
  const [modoOrdenacao, setModoOrdenacao] = useState("manual");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    localStorage.setItem('organizador-tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

// =========================================================================
  // MOTOR DE CASCATA (BOTTOM-UP)
  // Percorre a árvore de baixo para cima ajustando o status dos pais
  // =========================================================================
  const sincronizarStatusCascata = (listaTarefas) => {
    return listaTarefas.map(tarefa => {
      // Se não tem filhos, mantém o status intacto
      if (!tarefa.subitens || tarefa.subitens.length === 0) {
        return tarefa;
      }

      // 1. Mergulha até o fundo da árvore e resolve as pontas primeiro
      const subitens = sincronizarStatusCascata(tarefa.subitens);

      // 2. Analisa o resultado dos filhos para ditar o status do pai
      const total = subitens.length;
      const concluidos = subitens.filter(s => s.status === "x").length;
      const vazios = subitens.filter(s => s.status === "").length;

      // Usamos uma const com ternários para blindar contra falsos positivos do linter
      const statusPai = (concluidos === total) ? "x" : (vazios === total) ? "" : "/";

      // Passamos a propriedade usando object shorthand para ficar ainda mais limpo
      return { ...tarefa, status: statusPai, subitens };
    });
  };

  const handleAdicionarTarefa = (e) => {
    e.preventDefault();
    if (novoTitulo.trim() === "") return;
    const novaTarefa = { 
      id: Date.now(), 
      titulo: novoTitulo, 
      status: "", 
      dataCriacao: new Date().toISOString(),
      subitens: [] 
    };
    setTarefas([...tarefas, novaTarefa]);
    setNovoTitulo(""); 
  };

  const alternarStatusTarefa = (id) => {
    // Função auxiliar (Top-down): Força o status novo para todos os filhos
    const forcarStatusFilhos = (lista, statusForcado) => {
      return lista.map(t => ({
        ...t,
        status: statusForcado,
        subitens: forcarStatusFilhos(t.subitens || [], statusForcado)
      }));
    };

    const atualizarEForcar = (listaTarefas) => {
      return listaTarefas.map(tarefa => {
        if (tarefa.id === id) {
          const novoStatus = tarefa.status === "" ? "/" : tarefa.status === "/" ? "x" : "";
          return {
            ...tarefa,
            status: novoStatus,
            subitens: forcarStatusFilhos(tarefa.subitens || [], novoStatus)
          };
        }
        if (tarefa.subitens && tarefa.subitens.length > 0) {
          return { ...tarefa, subitens: atualizarEForcar(tarefa.subitens) };
        }
        return tarefa;
      });
    };

    // Aplica o clique e passa pela sincronização antes de salvar
    const arvoreModificada = atualizarEForcar(tarefas);
    setTarefas(sincronizarStatusCascata(arvoreModificada));
  };

  const adicionarSubtarefa = (parentId, titulo) => {
    const adicionarRecursivo = (listaTarefas) => {
      return listaTarefas.map(tarefa => {
        if (tarefa.id === parentId) {
          const novaSub = { 
            id: Date.now(), 
            titulo: titulo, 
            status: "", 
            dataCriacao: new Date().toISOString(),
            subitens: [] 
          };
          return { ...tarefa, subitens: [...(tarefa.subitens || []), novaSub] };
        }
        if (tarefa.subitens && tarefa.subitens.length > 0) {
          return { ...tarefa, subitens: adicionarRecursivo(tarefa.subitens) };
        }
        return tarefa;
      });
    };
    
    const arvoreModificada = adicionarRecursivo(tarefas);
    setTarefas(sincronizarStatusCascata(arvoreModificada));
  };

  const deletarTarefa = (id) => {
    const removerRecursivo = (listaTarefas) => {
      return listaTarefas
        .filter(tarefa => tarefa.id !== id)
        .map(tarefa => ({ ...tarefa, subitens: removerRecursivo(tarefa.subitens || []) }));
    };
    
    const arvoreModificada = removerRecursivo(tarefas);
    setTarefas(sincronizarStatusCascata(arvoreModificada));
  };

  const salvarEdicao = (id, novosDados) => {
    const editarRecursivo = (listaTarefas) => {
      return listaTarefas.map(tarefa => {
        if (tarefa.id === id) {
          return { ...tarefa, ...novosDados };
        }
        if (tarefa.subitens && tarefa.subitens.length > 0) {
          return { ...tarefa, subitens: editarRecursivo(tarefa.subitens) };
        }
        return tarefa;
      });
    };
    setTarefas(editarRecursivo(tarefas));
    setTarefaEmEdicao(null); 
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTarefas((itensAtuais) => {
      const velhoIndex = itensAtuais.findIndex((item) => item.id === active.id);
      const novoIndex = itensAtuais.findIndex((item) => item.id === over.id);
      return arrayMove(itensAtuais, velhoIndex, novoIndex);
    });
  };

  const tarefasRenderizadas = [...tarefas].sort((a, b) => {
    if (modoOrdenacao === "recente") return b.id - a.id;
    if (modoOrdenacao === "prioridade") {
      const prioA = a.prioridade !== undefined ? a.prioridade : -1;
      const prioB = b.prioridade !== undefined ? b.prioridade : -1;
      if (prioA === prioB) return b.id - a.id;
      return prioB - prioA;
    }
    return 0; 
  });

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Meu Organizador</h1>
      
      <form onSubmit={handleAdicionarTarefa} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input 
          type="text" 
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          placeholder="Adicionar nova atividade principal..." 
          style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#2c3e50', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
          Adicionar
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <select 
          value={modoOrdenacao} 
          onChange={(e) => setModoOrdenacao(e.target.value)}
          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white', color: '#2c3e50', cursor: 'pointer' }}
        >
          <option value="manual">Ordem Manual (Inserção)</option>
          <option value="recente">Mais Recentes</option>
          <option value="prioridade">Maior Prioridade</option>
        </select>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tarefasRenderizadas.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <Checklist 
            tarefas={tarefasRenderizadas}
            alternarStatus={alternarStatusTarefa}
            adicionarSubtarefa={adicionarSubtarefa}
            deletarTarefa={deletarTarefa}
            abrirModalEdicao={setTarefaEmEdicao} 
            podeArrastar={modoOrdenacao === "manual"} 
          />
        </SortableContext>
      </DndContext>

      {tarefaEmEdicao && (
        <TaskModal 
          tarefa={tarefaEmEdicao} 
          onClose={() => setTarefaEmEdicao(null)} 
          onSave={salvarEdicao} 
        />
      )}
    </div>
  );
}