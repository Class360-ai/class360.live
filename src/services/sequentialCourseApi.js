import { getStoredUser } from '../utils/authStorage';

const API_BASE_URL = (import.meta.env.VITE_LEARNING_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

function getIdentity() {
  const user = getStoredUser();
  return {
    userId: user?.email || 'student@class360.live',
    email: user?.email || 'student@class360.live',
    name: user?.name || user?.fullName || 'Demo Student',
  };
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/sequential-course${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || `Request failed: ${response.status}`);
    }
    return data;
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchSequentialCourseDashboard() {
  const identity = getIdentity();
  const params = new URLSearchParams(identity);
  return request(`/days?${params.toString()}`);
}

export async function fetchSequentialCourseDay(dayNumber) {
  const identity = getIdentity();
  const params = new URLSearchParams(identity);
  return request(`/days/${dayNumber}?${params.toString()}`);
}

export async function fetchSequentialCourseProgress() {
  const identity = getIdentity();
  const params = new URLSearchParams(identity);
  return request(`/user-progress?${params.toString()}`);
}

export async function fetchSequentialCourseUnlockStatus() {
  const identity = getIdentity();
  const params = new URLSearchParams(identity);
  return request(`/unlock-status?${params.toString()}`);
}

export async function updateSequentialCourseProgress(payload) {
  return request('/update-progress', {
    method: 'POST',
    body: JSON.stringify({
      ...getIdentity(),
      ...payload,
    }),
  });
}

function postTrack(path, payload) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify({
      ...getIdentity(),
      ...payload,
    }),
  });
}

export function trackSequentialCourseVideo(payload) {
  return postTrack('/track/video', payload);
}

export function trackSequentialCourseNotes(payload) {
  return postTrack('/track/notes', payload);
}

export function trackSequentialCoursePodcast(payload) {
  return postTrack('/track/podcast', payload);
}

export function trackSequentialCourseQuiz(payload) {
  return postTrack('/track/quiz', payload);
}
