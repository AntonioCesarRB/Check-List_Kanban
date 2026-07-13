import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Checklist } from './Checklist.jsx';
import styles from './TaskItem.module.css';

const PALETA_TAGS = [
  { bg: '#e8f4fd', color: '#2980b9', border: '#bce0fd' },
  { bg: '#eafaf1', color: '#27ae60', border: '#a3e4d7' },
  { bg: '#f4ecf7', color: '#8e44ad', border: '#d7bde2' },
  { bg: '#fef5e7', color: '#d35400', border: '#f8c471' },
  { bg: '#fdedec', color: '#c0392b', border: '#f5b7b1' },
  { bg: '#eef2f3', color: '#2c3e50', border: '#bdc3c7' }
];

const gerarCorDaTag = (textoTag) => {
  let hash = 0;
  const textoLimpo = textoTag.toLowerCase(); 
  for (let i = 0; i < textoLimpo.length; i++) {
    hash = textoLimpo.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETA_TAGS.length;
  return PALETA_TAGS[index];
};

export function TaskItem({ task, alternarStatus, adicionarSubtarefa, deletarTarefa, abrirModalEdicao, podeArrastar }) {
  const [adicionandoSub, setAdicionandoSub] = useState(false);
  const [novoSubTitulo, setNovoSubTitulo] = useState("");

  // Configuração do dnd-kit para este item específico
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: task.id,
    disabled: !podeArrastar // Desativa o gancho caso o filtro não seja manual ou seja uma subatividade
  });

  // Estilos dinâmicos de movimentação aplicados diretamente na tag <li>
  const styleDnd = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1
  };

  const statusClass = task.status === "" ? styles.vazio : task.status === "/" ? styles.andamento : styles.concluido;

  const handleAdicionarSub = (e) => {
    e.preventDefault();
    if (novoSubTitulo.trim() === "") return;
    adicionarSubtarefa(task.id, novoSubTitulo);
    setNovoSubTitulo("");
    setAdicionandoSub(false);
  };

  return (
    // Ligamos o setNodeRef e os estilos de transformação ao container da lista
    <li ref={setNodeRef} style={styleDnd} className={styles.taskContainer}>
      
      <div className={styles.mainLine}>
        {/* NOVA ALÇA DE ARRASTAR: Só aparece se 'podeArrastar' for true */}
        {podeArrastar && (
          <button 
            className={styles.dragHandle} 
            {...attributes} 
            {...listeners}
            title="Arrastar para reordenar"
            type="button"
          >
            ☰
          </button>
        )}

        <button className={`${styles.statusButton} ${statusClass}`} onClick={() => alternarStatus(task.id)}>
          {task.status}
        </button>
        
        <span className={styles.title}>
          {task.titulo}
        </span>
        
        {task.dataLimite && (
          <span className={styles.deadlineBadge} title="Data Limite">
            ⏱️ {new Date(task.dataLimite).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' })}
          </span>
        )}
        
        {task.prioridade !== undefined && (
          <span className={styles.priorityBadge}>{task.prioridade}</span>
        )}

        <div className={styles.actions}>
          <button onClick={() => setAdicionandoSub(!adicionandoSub)} className={styles.actionButton} title="Adicionar Subtarefa">+</button>
          <button onClick={() => abrirModalEdicao(task)} className={styles.actionButton} title="Editar">✏️</button>
          <button onClick={() => deletarTarefa(task.id)} className={styles.actionButton} title="Apagar">🗑️</button>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {task.tags.map((tag, index) => {
            const tema = gerarCorDaTag(tag);
            return (
              <span key={index} className={styles.tagBadge} style={{ backgroundColor: tema.bg, color: tema.color, borderColor: tema.border }}>
                {tag}
              </span>
            );
          })}
        </div>
      )}

      {adicionandoSub && (
        <form onSubmit={handleAdicionarSub} className={styles.subtaskForm}>
          <input type="text" autoFocus value={novoSubTitulo} onChange={(e) => setNovoSubTitulo(e.target.value)} placeholder="Nome da subtarefa..." className={styles.subtaskInput}/>
          <button type="submit" className={styles.subtaskSubmit}>Salvar</button>
          <button type="button" onClick={() => setAdicionandoSub(false)} className={styles.subtaskCancel}>Cancelar</button>
        </form>
      )}

      {task.subitens && task.subitens.length > 0 && (
        <div className={styles.subItemsContainer}>
          {/* Bloqueamos o arrasto nas listas filhas passando podeArrastar={false} */}
          <Checklist 
            tarefas={task.subitens} 
            alternarStatus={alternarStatus} 
            adicionarSubtarefa={adicionarSubtarefa}
            deletarTarefa={deletarTarefa}
            abrirModalEdicao={abrirModalEdicao}
            podeArrastar={false} 
          />
        </div>
      )}
    </li>
  );
}