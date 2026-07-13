import { useState } from 'react';
import styles from './TaskModal.module.css';

const formatarParaInputDate = (isoString) => {
  if (!isoString) return "";
  const data = new Date(isoString);
  data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
  return data.toISOString().slice(0, 16);
};

export function TaskModal({ tarefa, onClose, onSave }) {
  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [prioridade, setPrioridade] = useState(tarefa.prioridade !== undefined ? tarefa.prioridade : "");
  
  // ESTADO DAS TAGS: Pega o array existente e transforma em texto com vírgulas para edição
  const [tagsInput, setTagsInput] = useState(
    tarefa.tags && Array.isArray(tarefa.tags) ? tarefa.tags.join(", ") : ""
  );
  
  const [possuiPrazo, setPossuiPrazo] = useState(!!tarefa.dataLimite);
  const [prazoExato, setPrazoExato] = useState(!!tarefa.dataLimite); 
  const [dataManual, setDataManual] = useState(tarefa.dataLimite ? formatarParaInputDate(tarefa.dataLimite) : "");
  const [qtdRelativa, setQtdRelativa] = useState(1);
  const [unidadeRelativa, setUnidadeRelativa] = useState("dias");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (titulo.trim() === "") return;
    
    let dataLimiteFinal = null;
    
    if (possuiPrazo) {
      if (prazoExato && dataManual) {
        dataLimiteFinal = new Date(dataManual).toISOString();
      } else if (!prazoExato) {
        const agora = new Date();
        const qtd = Number(qtdRelativa);
        
        if (unidadeRelativa === "horas") agora.setHours(agora.getHours() + qtd);
        if (unidadeRelativa === "dias") agora.setDate(agora.getDate() + qtd);
        if (unidadeRelativa === "semanas") agora.setDate(agora.getDate() + (qtd * 7));
        if (unidadeRelativa === "meses") agora.setMonth(agora.getMonth() + qtd);
        
        dataLimiteFinal = agora.toISOString();
      } else {
        dataLimiteFinal = tarefa.dataLimite; 
      }
    }

    // LÓGICA DAS TAGS: Divide pela vírgula, tira espaços sobrando e remove itens vazios
    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const novosDados = {
      titulo,
      prioridade: prioridade === "" ? undefined : Number(prioridade),
      dataLimite: dataLimiteFinal,
      tags: tagsArray // Adicionamos a lista limpa aos novos dados
    };

    onSave(tarefa.id, novosDados);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Editar Atividade</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className={styles.inputGroup}>
            <label>Título</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} autoFocus />
          </div>

          {/* NOVO CAMPO DE TAGS */}
          <div className={styles.inputGroup}>
            <label>Tags / Rótulos</label>
            <input 
              type="text" 
              value={tagsInput} 
              onChange={(e) => setTagsInput(e.target.value)} 
              placeholder="Ex: Trabalho, Estudos, QA..."
            />
            <span className={styles.helperText}>Separe as tags por vírgula.</span>
          </div>

          <div className={styles.inputGroup}>
            <label>Prioridade (0 a 9)</label>
            <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
              <option value="">Sem prioridade</option>
              <option value="9">9 - Máxima</option>
              <option value="8">8</option>
              <option value="7">7</option>
              <option value="6">6</option>
              <option value="5">5 - Média</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
              <option value="0">0 - Mínima</option>
            </select>
          </div>

          <fieldset className={styles.deadlineGroup}>
            <legend>Prazo de Conclusão</legend>
            {!possuiPrazo ? (
              <button type="button" className={styles.btnToggleText} onClick={() => setPossuiPrazo(true)}>
                + Definir um prazo para esta atividade
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!prazoExato && (
                  <div className={styles.relativeRow}>
                    <span style={{ fontSize: '0.9rem' }}>Daqui a:</span>
                    <input type="number" min="1" value={qtdRelativa} onChange={(e) => setQtdRelativa(e.target.value)} className={styles.numberInput}/>
                    <select value={unidadeRelativa} onChange={(e) => setUnidadeRelativa(e.target.value)} style={{ flexGrow: 1 }}>
                      <option value="horas">Horas</option>
                      <option value="dias">Dias</option>
                      <option value="semanas">Semanas</option>
                      <option value="meses">Meses</option>
                    </select>
                  </div>
                )}
                {prazoExato && (
                  <input type="datetime-local" value={dataManual} onChange={(e) => setDataManual(e.target.value)} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" checked={prazoExato} onChange={(e) => setPrazoExato(e.target.checked)} />
                    Escolher data exata no calendário
                  </label>
                  <button type="button" className={`${styles.btnToggleText} ${styles.dangerText}`} onClick={() => setPossuiPrazo(false)}>
                    Remover
                  </button>
                </div>
              </div>
            )}
          </fieldset>
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnCancel}>Cancelar</button>
            <button type="submit" className={styles.btnSave}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}