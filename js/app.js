import { state }                           from './state.js';
import { loadDB }                           from './db.js';
import { renderCal }                        from './calendar.js';
import { renderPanel }                      from './panel.js';
import { openModal, closeModal, saveTask }  from './modal.js';
import { confirmDelete, clearDelConfirm }   from './delete.js';

function pickDay(dk) {
  state.selDay = dk; renderCal(); renderPanel();
  if (window.innerWidth <= 768) document.getElementById('taskPanel').classList.add('open');
}
document.getElementById('calGrid').addEventListener('click', e => {
  const day = e.target.closest('.day:not(.empty)');
  if (day) pickDay(day.getAttribute('data-dk'));
});
document.getElementById('panelBody').addEventListener('click', e => {
  const editBtn = e.target.closest('[data-act="edit"]');
  const delBtn  = e.target.closest('[data-act="del"]');
  if (editBtn) { e.stopPropagation(); clearDelConfirm(); openModal(editBtn.getAttribute('data-id')); }
  if (delBtn)  { e.stopPropagation(); confirmDelete(delBtn.getAttribute('data-id'), delBtn); }
});
function setHalf(half) {
  state.halfYear = half; state.selDay = null;
  document.getElementById('btnHalf0').classList.toggle('active', half === 0);
  document.getElementById('btnHalf1').classList.toggle('active', half === 1);
  renderCal(); renderPanel();
}
document.getElementById('btnHalf0').addEventListener('click', () => setHalf(0));
document.getElementById('btnHalf1').addEventListener('click', () => setHalf(1));
document.getElementById('btnPrevYear').addEventListener('click', () => {
  state.year--; state.selDay = null;
  document.getElementById('yearLabel').textContent = state.year;
  renderCal(); renderPanel();
});
document.getElementById('btnNextYear').addEventListener('click', () => {
  state.year++; state.selDay = null;
  document.getElementById('yearLabel').textContent = state.year;
  renderCal(); renderPanel();
});
document.getElementById('btnAddTask').addEventListener('click', () => openModal(null));
document.getElementById('btnClosePanel').addEventListener('click', () => {
  document.getElementById('taskPanel').classList.remove('open');
  state.selDay = null; renderCal(); renderPanel();
});
document.getElementById('btnModalSave').addEventListener('click', saveTask);
document.getElementById('btnModalCancel').addEventListener('click', closeModal);
document.getElementById('taskOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
document.getElementById('fTitle').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveTask();
  if (e.key === 'Escape') closeModal();
});
document.getElementById('fTitle').addEventListener('input', function() { this.classList.remove('error'); });
loadDB();
document.getElementById('yearLabel').textContent = state.year;
renderCal(); renderPanel();
