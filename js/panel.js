import { state }                              from './state.js';
import { isOverdue, labelDate, tasksOf, esc } from './utils.js';

export function renderPanel() {
  const dateEl = document.getElementById('panelDate');
  const body   = document.getElementById('panelBody');
  const foot   = document.getElementById('panelFoot');
  if (!state.selDay) {
    dateEl.className = 'panel-date';
    dateEl.textContent = 'Selecciona un día del calendario';
    body.innerHTML = makePlaceholder(calSVG(),'SIN DÍA SELECCIONADO','Haz clic en cualquier día<br>para ver y gestionar sus tareas.');
    foot.style.display = 'none';
    return;
  }
  const ov = isOverdue(state.selDay);
  dateEl.className = `panel-date${ov?' is-overdue':''}`;
  dateEl.textContent = labelDate(state.selDay) + (ov?' · Vencido':'');
  foot.style.display = 'block';
  const ts = tasksOf(state.selDay);
  if (!ts.length) {
    body.innerHTML = makePlaceholder(clipSVG(),'SIN TAREAS','No hay tareas para este día.<br>Presiona "+ Agregar tarea".');
    return;
  }
  body.innerHTML = ts.map(t => {
    const pk = t.priority.toLowerCase();
    const sk = t.status.toLowerCase().replace(/ /g,'-');
    return `<div class="task-card p-${pk}" data-id="${t.id}"><div class="task-title">${esc(t.title)}</div><div class="task-meta"><span class="chip chip-${pk}">${esc(t.priority)}</span><span class="chip chip-${sk}">${esc(t.status)}</span></div><div class="task-btns"><button class="tbtn" data-act="edit" data-id="${t.id}" title="Editar">&#9998;</button><button class="tbtn del" data-act="del" data-id="${t.id}" title="Eliminar">&#10005;</button></div></div>`;
  }).join('');
}
export function makePlaceholder(svg, title, msg) {
  return `<div class="placeholder">${svg}<h3>${title}</h3><p>${msg}</p></div>`;
}
function calSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
}
function clipSVG() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`;
}
