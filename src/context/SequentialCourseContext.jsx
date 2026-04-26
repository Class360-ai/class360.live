import { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchSequentialCourseDashboard,
  fetchSequentialCourseDay,
  fetchSequentialCourseProgress,
  fetchSequentialCourseUnlockStatus,
  trackSequentialCourseNotes,
  trackSequentialCoursePodcast,
  trackSequentialCourseQuiz,
  trackSequentialCourseVideo,
  updateSequentialCourseProgress,
} from '../services/sequentialCourseApi';

const SequentialCourseContext = createContext(null);

function mergeDays(previousDays = [], nextDays = []) {
  const nextMap = new Map(nextDays.map((day) => [day.dayNumber, day]));
  return previousDays.length
    ? previousDays.map((day) => nextMap.get(day.dayNumber) || day)
    : nextDays;
}

export function SequentialCourseProvider({ children }) {
  const [dashboard, setDashboard] = useState({
    totalDays: 365,
    completedDays: 0,
    progressPercent: 0,
    highestUnlockedDay: 1,
    streakDays: 0,
    nextDay: null,
    days: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const hydrateDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      // Merge the dashboard, progress, and unlock views into one frontend snapshot.
      const [daysResponse, progressResponse, unlockResponse] = await Promise.all([
        fetchSequentialCourseDashboard(),
        fetchSequentialCourseProgress(),
        fetchSequentialCourseUnlockStatus(),
      ]);

      setDashboard((current) => ({
        ...current,
        ...daysResponse,
        user: daysResponse.user || progressResponse.user || current.user,
        completedDays: progressResponse.completedDays ?? daysResponse.completedDays ?? current.completedDays,
        progressPercent: progressResponse.progressPercent ?? daysResponse.progressPercent ?? current.progressPercent,
        streakDays: progressResponse.streakDays ?? daysResponse.streakDays ?? current.streakDays,
        highestUnlockedDay: unlockResponse.highestUnlockedDay ?? daysResponse.highestUnlockedDay ?? current.highestUnlockedDay,
        nextDay: progressResponse.nextDay ?? daysResponse.nextDay ?? current.nextDay,
        performanceStats: progressResponse.performanceStats ?? daysResponse.performanceStats ?? current.performanceStats,
        days: mergeDays(current.days, daysResponse.days || []),
      }));
    } catch (requestError) {
      setError(requestError.message || 'Unable to load sequential course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateDashboard();
  }, []);

  const refreshDay = async (dayNumber) => {
    const response = await fetchSequentialCourseDay(dayNumber);
    setDashboard((current) => ({
      ...current,
      highestUnlockedDay: response.highestUnlockedDay ?? current.highestUnlockedDay,
      days: mergeDays(current.days, [response.day]),
    }));
    return response.day;
  };

  const saveDayProgress = async (payload) => {
    setSaving(true);
    setError('');

    try {
      const response = await updateSequentialCourseProgress(payload);
      setDashboard((current) => ({
        ...current,
        ...response,
        days: mergeDays(current.days, response.days || []),
      }));
      return response;
    } catch (requestError) {
      setError(requestError.message || 'Unable to save day progress');
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const value = {
    dashboard,
    days: dashboard.days || [],
    loading,
    saving,
    error,
    hydrateDashboard,
    refreshDay,
    saveDayProgress,
    trackVideo: async (payload) => {
      const response = await trackSequentialCourseVideo(payload);
      setDashboard((current) => ({ ...current, ...response, days: mergeDays(current.days, response.days || []) }));
      return response;
    },
    trackNotes: async (payload) => {
      const response = await trackSequentialCourseNotes(payload);
      setDashboard((current) => ({ ...current, ...response, days: mergeDays(current.days, response.days || []) }));
      return response;
    },
    trackPodcast: async (payload) => {
      const response = await trackSequentialCoursePodcast(payload);
      setDashboard((current) => ({ ...current, ...response, days: mergeDays(current.days, response.days || []) }));
      return response;
    },
    trackQuiz: async (payload) => {
      const response = await trackSequentialCourseQuiz(payload);
      setDashboard((current) => ({ ...current, ...response, days: mergeDays(current.days, response.days || []) }));
      return response;
    },
  };

  return <SequentialCourseContext.Provider value={value}>{children}</SequentialCourseContext.Provider>;
}

export function useSequentialCourse() {
  const context = useContext(SequentialCourseContext);
  if (!context) {
    throw new Error('useSequentialCourse must be used within SequentialCourseProvider');
  }
  return context;
}
