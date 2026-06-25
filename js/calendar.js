import { MONTHS, WD }                            from './constants.js';
import { state }                                 from './state.js';
import { isoDate, todayKey, tasksOf, isOverdue } from './utils.js';

export function renderCal() {
  const grid = document.getElementById('calGrid');
  const td   = todayKey();
  let html   = '';
  const mStart = state.halfYear * 6;
  for (let m = mStart; m < mStart + 6; m++) {
    const firstDow    = new Date(state.year, m, 1).getDay();
    const daysInMonth = new Date(state.year, m+1, 0).getDate();
    html += `<div class="month-card"><div class="month-name">${MONTHS[m]}</div><div class="wd-row">`;
    WD.forEach(w => { html += `<div class="wd">${w}</div>`; });
    html += `</div><div class="days-row">`;
    for (let i = 0; i < firstDow; i++) html += `<div class="day empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const dk = isoDate(state.year, m, d);
      const ts = tasksOf(dk);
      const ov = isOverdue(dk);
      let cls = 'day';
      if (dk === td)           cls += ' today';
      if (ov)                  cls += ' overdue';
      if (dk === state.selDay) cls += ' selected';
      html += `<div class="${cls}" data-dk="${dk}">${d}`;
      if (ts.length > 0) html += `<div class="badge${ov?' is-overdue':''}">${ts.length>9?'9+':ts.length}</div>`;
      html += `</div>`;
    }
    html += `</div></div>`;
  }
  grid.innerHTML = html;
}
