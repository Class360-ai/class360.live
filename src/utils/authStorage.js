const PROFILE_KEY = 'class360_student_profile';
const SESSION_KEY = 'class360_auth_session';

function emitAuthChange() {
  window.dispatchEvent(new Event('class360-auth-changed'));
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function signupUser(userData) {
  const user = {
    fullName: String(userData.fullName || '').trim(),
    email: String(userData.email || '').trim().toLowerCase(),
    password: String(userData.password || ''),
    classGoal: String(userData.classGoal || '').trim(),
    boardStream: String(userData.boardStream || '').trim(),
    preferredLanguage: String(userData.preferredLanguage || '').trim(),
    joinedAt: userData.joinedAt || new Date().toISOString(),
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, loggedInAt: new Date().toISOString() }));
  emitAuthChange();
  return user;
}

export function loginUser(email, password) {
  const user = getStoredUser();
  if (!user) {
    return { ok: false, message: 'No account found yet. Please sign up first.' };
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (user.email !== normalizedEmail || user.password !== String(password || '')) {
    return { ok: false, message: 'Email or password is incorrect. Please try again.' };
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, loggedInAt: new Date().toISOString() }));
  emitAuthChange();
  return { ok: true, user };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}

export function isAuthenticated() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed?.email);
  } catch {
    return false;
  }
}

export function updateStoredUser(patch) {
  const user = getStoredUser();
  if (!user) return null;

  const nextUser = { ...user, ...patch };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(nextUser));
  emitAuthChange();
  return nextUser;
}
