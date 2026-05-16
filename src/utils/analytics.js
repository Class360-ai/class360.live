const ANALYTICS_KEY = 'class360_analytics_events';
const MAX_EVENTS = 200;

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAnalyticsEvents() {
  return safeRead(ANALYTICS_KEY, []);
}

export function trackEvent(name, payload = {}) {
  const events = getAnalyticsEvents();
  const nextEvent = {
    name,
    payload,
    createdAt: new Date().toISOString(),
  };
  safeWrite(ANALYTICS_KEY, [nextEvent, ...events].slice(0, MAX_EVENTS));
  window.dispatchEvent(new Event('class360-analytics-changed'));
  return nextEvent;
}

export function clearAnalyticsEvents() {
  localStorage.removeItem(ANALYTICS_KEY);
  window.dispatchEvent(new Event('class360-analytics-changed'));
}
