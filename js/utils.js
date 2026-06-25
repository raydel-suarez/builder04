import { MONTHS, DOW } from './constants.js';
import { state }       from './state.js';

export function todayKey() {
  const d = new Date();
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}
export function isoDate(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
export function uid() {
  return Math.random().toString(36).slice(2,9) + Date.now().toString(36);
}
export function tasksOf(dk) { return state.db[dk] || []; }
export function hasPending(dk) { return tasksOf(dk).some(t => t.status !== 'Completada'); }
export function isOverdue(dk) { return dk < todayKey() && hasPending(dk); }
export function labelDate(dk) {
  if (!dk) return '';
  const [y,m,d] = dk.split('-').map(Number);
  return `${DOW[new Date(y,m-1,d).getDay()]}, ${d} de ${MONTHS[m-1]} de ${y}`;
}
export function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
