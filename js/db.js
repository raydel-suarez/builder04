import { STORAGE_KEY } from './constants.js';
import { state }       from './state.js';

export function loadDB() {
  try { state.db = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { state.db = {}; }
}
export function saveDB() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.db));
}
