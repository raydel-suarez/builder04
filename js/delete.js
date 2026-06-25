import { state }       from './state.js';
import { saveDB }      from './db.js';
import { renderCal }   from './calendar.js';
import { renderPanel } from './panel.js';

export function findTask(id) {
  for (const dk of Object.keys(state.db)) {
    const t = state.db[dk].find(t => t.id === id);
    if (t) return { ...t, dk };
  }
  return null;
}
export function deleteTask(id) {
  for (const dk of Object.keys(state.db)) {
    const idx = state.db[dk].findIndex(t => t.id === id);
    if (idx > -1) {
      state.db[dk].splice(idx, 1);
      if (!state.db[dk].length) delete state.db[dk];
      break;
    }
  }
  state.pendingDeleteId = null;
  saveDB(); renderCal(); renderPanel();
}
export function clearDelConfirm() {
  document.querySelector('.del-confirm')?.remove();
  state.pendingDeleteId = null;
}
export function confirmDelete(id, btnEl) {
  if (state.pendingDeleteId === id) { clearDelConfirm(); return; }
  clearDelConfirm();
  state.pendingDeleteId = id;
  const box = document.createElement('div');
  box.className = 'del-confirm open';
  box.innerHTML = `<p>¿Eliminar esta tarea? No se puede deshacer.</p><div class="del-confirm-btns"><button class="btn-danger">Sí, eliminar</button><button class="btn-sm-ghost">Cancelar</button></div>`;
  box.querySelector('.btn-danger').addEventListener('click', () => deleteTask(id));
  box.querySelector('.btn-sm-ghost').addEventListener('click', clearDelConfirm);
  const card = btnEl.closest('.task-card');
  card.parentNode.insertBefore(box, card);
}
