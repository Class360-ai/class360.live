const API_BASE_URL = (import.meta.env.VITE_LEARNING_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Request failed: ${response.status} ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    return { error: error.message || error };
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function loadLiveClasses() {
  return await request('/live-classes');
}

export async function joinLiveClass(classId) {
  return await request(`/live-classes/${encodeURIComponent(classId)}/join`, {
    method: 'POST',
  });
}

export async function setLiveClassReminder(classId) {
  return await request(`/live-classes/${encodeURIComponent(classId)}/reminder`, {
    method: 'POST',
  });
}
