import { TaskItem } from './TaskItem.jsx';

export function Checklist({ tarefas, ...props }) {
  if (!tarefas || tarefas.length === 0) return null;

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {tarefas.map((tarefa) => (
        <TaskItem 
          key={tarefa.id} 
          task={tarefa} 
          {...props} // Repassa alternarStatus, deletarTarefa, abrirModalEdicao e podeArrastar
        /> 
      ))}
    </ul>
  );
}