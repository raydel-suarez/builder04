import { beforeEach } from 'vitest';
import { state }      from '../js/state.js';

beforeEach(() => { localStorage.clear(); });

export function setupDOM() {
  document.body.innerHTML = `
    <span id="yearLabel"></span>
    <div id="calGrid"></div>
    <aside id="taskPanel" class="task-panel">
      <div id="panelDate" class="panel-date">Selecciona un día del calendario</div>
      <div id="panelBody"></div>
      <div id="panelFoot" style="display:none"><button id="btnAddTask">+ Agregar tarea</button></div>
    </aside>
    <div id="taskOverlay" class="overlay">
      <h3 id="modalTitle">NUEVA TAREA</h3>
      <input type="text" id="fTitle">
      <select id="fPriority"><option value="Alta">Alta</option><option value="Media" selected>Media</option><option value="Baja">Baja</option></select>
      <select id="fStatus"><option value="Pendiente" selected>Pendiente</option><option value="En curso">En curso</option><option value="Completada">Completada</option></select>
      <input type="date" id="fDate">
    </div>
  `;
}

export function resetState() {
  state.year            = 2026;
  state.halfYear        = 0;
  state.selDay          = null;
  state.editId          = null;
  state.pendingDeleteId = null;
  state.db              = {};
}
