// Simple client-side quiz history store using localStorage
// Schema: { id, reviewerId, reviewerTitle, quizId, title, finishedAt, stats {correct, total, percentage}, answers, questions }

const STORAGE_KEY = 'quiz_history_v1';

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addAttempt(attempt) {
  const list = loadAll();
  list.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2,8)}`, ...attempt });
  saveAll(list);
}

export function getAllAttempts() {
  return loadAll();
}

export function getAttemptById(id) {
  return loadAll().find(a => a.id === id) || null;
}
