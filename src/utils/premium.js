const PREMIUM_KEY = 'class360_premium';
const DAILY_USAGE_KEY = 'class360_daily_test_usage';
const UPGRADE_PROMPT_KEY = 'class360_upgrade_prompt';

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

function emitChange() {
  window.dispatchEvent(new Event('class360-premium-changed'));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function isPremiumUser() {
  return Boolean(safeRead(PREMIUM_KEY, false));
}

export function activatePremium() {
  safeWrite(PREMIUM_KEY, true);
  emitChange();
  return true;
}

export function deactivatePremium() {
  safeWrite(PREMIUM_KEY, false);
  emitChange();
  return false;
}

export function getDailyTestUsage() {
  const fallback = { day: todayKey(), count: 0 };
  const usage = safeRead(DAILY_USAGE_KEY, fallback);
  if (usage.day !== todayKey()) {
    return fallback;
  }
  return {
    day: usage.day || todayKey(),
    count: Number(usage.count || 0),
  };
}

export function recordDailyTestUsage() {
  const usage = getDailyTestUsage();
  const next = { day: todayKey(), count: Number(usage.count || 0) + 1 };
  safeWrite(DAILY_USAGE_KEY, next);
  emitChange();
  return next;
}

export function canTakeFullTestToday() {
  if (isPremiumUser()) return true;
  return getDailyTestUsage().count < 1;
}

export function getUsageLimitMessage() {
  if (isPremiumUser()) return 'Unlimited tests unlocked with Premium.';
  const usage = getDailyTestUsage();
  const remaining = Math.max(0, 1 - Number(usage.count || 0));
  if (remaining > 0) return 'You have 1 free full test today.';
  return 'Free plan limit reached for today.';
}

export function setUpgradePrompt(reason = '') {
  safeWrite(UPGRADE_PROMPT_KEY, {
    reason,
    createdAt: new Date().toISOString(),
  });
  emitChange();
}

export function requestUpgrade(reason = '') {
  setUpgradePrompt(reason);
  window.dispatchEvent(new Event('class360-open-upgrade-modal'));
}

export function consumeUpgradePrompt() {
  const prompt = safeRead(UPGRADE_PROMPT_KEY, null);
  localStorage.removeItem(UPGRADE_PROMPT_KEY);
  emitChange();
  return prompt;
}

export function getUpgradePrompt() {
  return safeRead(UPGRADE_PROMPT_KEY, null);
}

export function clearPremiumState() {
  localStorage.removeItem(PREMIUM_KEY);
  localStorage.removeItem(DAILY_USAGE_KEY);
  localStorage.removeItem(UPGRADE_PROMPT_KEY);
  emitChange();
}
