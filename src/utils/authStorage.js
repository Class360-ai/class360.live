const PROFILE_KEY = 'class360_student_profile';
const SESSION_KEY = 'class360_auth_session';
const LEGACY_USER_KEYS = ['user', 'class360User', 'authUser', 'currentUser'];

const COMPETITIVE_GOALS = new Set(['IIT JEE', 'NEET', 'SSC', 'Banking', 'CUET']);

function deriveStudentType(classGoal) {
  const goal = String(classGoal || '').trim();
  if (!goal) return 'school';
  if (goal === 'Foundation') return 'school';
  if (COMPETITIVE_GOALS.has(goal)) return 'competitive';
  return goal.toLowerCase().includes('foundation') ? 'school' : 'competitive';
}

function deriveClassLevel(classGoal, fallback = 6) {
  const goal = String(classGoal || '');
  const match = goal.match(/\b(10|9|8|7|6|5|4|3|2|1)\b/);
  return match ? Number(match[1]) : Number(fallback) || 6;
}

export function getRouteForStudentType(studentType) {
  return String(studentType || '').toLowerCase() === 'school' ? '/learning/dashboard' : '/dashboard';
}

export function normalizeStudentType(user) {
  if (user?.studentType) return String(user.studentType).toLowerCase();
  const goal = String(user?.classGoal || '').trim();
  if (goal === 'Foundation') return 'school';
  if (COMPETITIVE_GOALS.has(goal)) return 'competitive';
  return goal ? 'competitive' : 'school';
}

export function getPostAuthRoute(user) {
  return getRouteForStudentType(normalizeStudentType(user));
}

export function getClassLevelLabel(classLevel) {
  const raw = String(classLevel || '').trim();
  if (!raw) return 'Class 6';
  if (/^class\s+/i.test(raw)) return raw.replace(/^class\s+/i, 'Class ');
  return `Class ${raw}`;
}

function emitAuthChange() {
  window.dispatchEvent(new Event('class360-auth-changed'));
}

function createDemoCredentialHash(password, email = '') {
  const input = `${String(email).trim().toLowerCase()}:${String(password || '')}`;
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(index);
  }
  return `demo_${(hash >>> 0).toString(36)}`;
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

export function getStoredAdminCandidate() {
  const keys = [PROFILE_KEY, ...LEGACY_USER_KEYS];

  try {
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch {
    // Fall through to the regular profile reader below.
  }

  return getStoredUser();
}

export function signupUser(userData) {
  const classGoal = String(userData.classGoal || '').trim();
  const studentType = deriveStudentType(classGoal);
  const classLevel = deriveClassLevel(userData.classLevel ?? classGoal, 6);
  const name = String(userData.name || userData.fullName || '').trim();
  const board = String(userData.board || userData.boardStream || '').trim();
  const language = String(userData.language || userData.preferredLanguage || '').trim();
  const user = {
    name,
    fullName: name,
    email: String(userData.email || '').trim().toLowerCase(),
    credentialHash: createDemoCredentialHash(userData.password, userData.email),
    classGoal,
    studentType,
    classLevel,
    board,
    boardStream: board,
    language,
    preferredLanguage: language,
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
  const expectedHash = createDemoCredentialHash(password, normalizedEmail);
  const legacyPasswordMatch = user.password && user.password === String(password || '');
  if (user.email !== normalizedEmail || (user.credentialHash !== expectedHash && !legacyPasswordMatch)) {
    return { ok: false, message: 'Email or password is incorrect. Please try again.' };
  }

  let authenticatedUser = user;
  if (legacyPasswordMatch || user.password) {
    const { password: _unusedPassword, ...userWithoutPassword } = user;
    authenticatedUser = {
      ...userWithoutPassword,
      credentialHash: expectedHash,
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(authenticatedUser));
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, loggedInAt: new Date().toISOString() }));
  emitAuthChange();
  return { ok: true, user: authenticatedUser };
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
  if (patch?.fullName || patch?.name) {
    const displayName = String(patch.fullName || patch.name || '').trim();
    nextUser.name = displayName;
    nextUser.fullName = displayName;
  }
  if (patch?.board || patch?.boardStream) {
    const board = String(patch.board || patch.boardStream || '').trim();
    nextUser.board = board;
    nextUser.boardStream = board;
  }
  if (patch?.language || patch?.preferredLanguage) {
    const language = String(patch.language || patch.preferredLanguage || '').trim();
    nextUser.language = language;
    nextUser.preferredLanguage = language;
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(nextUser));
  emitAuthChange();
  return nextUser;
}
