import { state }         from './state.js';
import { uid, todayKey } from './utils.js';
import { saveDB }        from './db.js';
import { renderCal }     from './calendar.js';
import { renderPanel }   from './panel.js';

export function openModal(id) {
  state.editId = id || null;
  const fTitle = document.getElementById('fTitle');
  if (id) {
    const task = _findTask(id);
    if (!task) return;
    document.getElementById('modalTitle').textContent = 'EDITAR TAREA';
    fTitle.value = task.title;
    document.getElementById('fPriority').value = task.priority;
    document.getElementById('fStatus').value   = task.status;
    document.getElementById('fDate').value     = task.dk;
  } else {
    document.getElementById('modalTitle').textContent = 'NUEVA TAREA';
    fTitle.value = '';
    document.getElementById('fPriority').value = 'Media';
    document.getElementById('fStatus').value   = 'Pendiente';
    document.getElementById('fDate').value     = state.selDay || todayKey();
  }
  fTitle.classList.remove('error');
  document.getElementById('taskOverlay').classList.add('open');
  setTimeout(() => fTitle.focus(), 60);
}
export function closeModal() {
  document.getElementById('taskOverlay').classList.remove('open');
  state.editId = null;
}
export function saveTask() {
  const title    = document.getElementById('fTitle').value.trim();
  const priority = document.getElementById('fPriority').value;
  const status   = document.getElementById('fStatus').value;
  let   dk       = document.getElementById('fDate').value;
  if (!title) {
    const fi = document.getElementById('fTitle');
    fi.classList.add('error'); fi.focus(); return;
  }
  if (!dk) dk = state.selDay || todayKey();
  if (state.editId) {
    for (const old of Object.keys(state.db)) {
      const idx = state.db[old].findIndex(t => t.id === state.editId);
      if (idx > -1) { state.db[old].splice(idx,1); if (!state.db[old].length) delete state.db[old]; break; }
    }
    if (!state.db[dk]) state.db[dk] = [];
    state.db[dk].push({ id: state.editId, title, priority, status });
  } else {
    if (!state.db[dk]) state.db[dk] = [];
    state.db[dk].push({ id: uid(), title, priority, status });
  }
  state.selDay = dk;
  saveDB(); closeModal(); renderCal(); renderPanel();
}
function _findTask(id) {
  for (const dk of Object.keys(state.db)) {
    const t = state.db[dk].find(t => t.id === id);
    if (t) return { ...t, dk };
  }
  return null;
}
