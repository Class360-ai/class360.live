import { motion } from 'framer-motion';
import { ArrowRight, Flame, PlayCircle, Target, BookOpen, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getPlanCompletionCount,
  getPlanProgress,
  getStreak,
  savePlanProgress,
} from '../utils/planGenerator';
import { useEffect, useMemo, useState } from 'react';
import { isPremiumUser, requestUpgrade } from '../utils/premium';
import { TEST_SETUP_KEY, normalizeTestSetup } from '../utils/testFlow';
import { linkPlanTaskToTest } from '../utils/planGenerator';

function normalizeTaskType(task) {
  return String(task?.taskType || task?.type || '').trim().toLowerCase();
}

function progressMessage(completed, total) {
  const ratio = total ? completed / total : 0;
  if (ratio >= 1) return "Amazing. You're finishing the whole plan.";
  if (ratio >= 0.66) return "You're improving. Keep going.";
  if (ratio >= 0.33) return "Good start. One more task will build momentum.";
  return 'Start strong with one small task today.';
}

export default function DailyPlan({ plan }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(() => getPlanProgress());
  const [refreshKey, setRefreshKey] = useState(0);
  const premium = isPremiumUser();

  useEffect(() => {
    const syncPlan = () => {
      setProgress(getPlanProgress());
      setRefreshKey((value) => value + 1);
    };

    window.addEventListener('storage', syncPlan);
    window.addEventListener('class360-storage-changed', syncPlan);
    return () => {
      window.removeEventListener('storage', syncPlan);
      window.removeEventListener('class360-storage-changed', syncPlan);
    };
  }, []);

  const planData = useMemo(() => plan, [plan, refreshKey]);
  const tasks = premium ? planData?.tasks || [] : (planData?.tasks || []).slice(0, 1);
  const streak = getStreak();
  const counts = getPlanCompletionCount();
  const completedCount = counts.completed;
  const totalCount = counts.total;
  const completionRatio = totalCount ? completedCount / totalCount : 0;

  const message = progressMessage(completedCount, totalCount);

  const markComplete = (taskId) => {
    savePlanProgress(taskId, true);
    setProgress(getPlanProgress());
    setRefreshKey((value) => value + 1);
  };

  const launchTask = (task) => {
    const taskType = normalizeTaskType(task);
    const normalizedDifficulty = task.difficulty || (taskType === 'practice' ? 'easy' : 'medium');
    const setup = {
      subject: task.subject || plan?.subject || 'maths',
      difficulty: normalizedDifficulty,
      topic: task.topic,
      taskId: task.id,
      taskType,
      fromDailyPlan: true,
      isRetake: Boolean(progress[task.id]),
      questionCount: task.questionCount || task.questions || 0,
    };
    const normalized = normalizeTestSetup(setup);
    const payload = { ...setup, ...normalized };
    // Temporary debug logs for task launch tracing.
    console.log('clicked task', task);
    console.log('navigate state', payload);
    linkPlanTaskToTest(task.id, payload);
    sessionStorage.setItem(TEST_SETUP_KEY, JSON.stringify(payload));
    navigate('/test', { state: payload });
  };

  const unlockFullPlan = () => {
    requestUpgrade('Unlock the full daily plan and premium smart study features.');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6 shadow-premium sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            <Target className="h-4 w-4" />
            Today&apos;s Smart Study Plan
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Study the right things, in the right order
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {premium
              ? 'Your plan adapts to recent test results, weak topics, and streak momentum so daily practice feels focused.'
              : 'Your free plan includes a smart starter routine. Upgrade for the full daily plan and deeper topic tracking.'}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              <Flame className="mr-2 inline-block h-4 w-4 text-amber-300" />
              Current streak: {streak} days
            </div>
            <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              {completedCount}/{totalCount || 3} tasks completed
            </div>
            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[300px] lg:grid-cols-1">
          <button
            type="button"
            onClick={() =>
              launchTask({
                id: 'weak-topics',
                type: 'Practice',
                topic: 'Weak topics',
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Practice Weak Topics <PlayCircle className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/test-series')}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            Take Full Test <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 transition-all duration-500"
          style={{ width: `${Math.max(8, completionRatio * 100)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span>Progress</span>
        <span>{Math.round(completionRatio * 100)}%</span>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {tasks.map((task) => {
          const done = Boolean(progress[task.id]);
          const taskType = normalizeTaskType(task);
          const launchable = taskType === 'test' || taskType === 'practice';
          const title = task.title || task.topic || 'Daily task';
          const canMarkComplete = taskType === 'revision';
          return (
            <motion.article
              key={task.id}
              whileHover={{ y: -4 }}
              className={`relative z-10 rounded-[1.75rem] border p-5 shadow-sm transition ${
                done ? 'border-emerald-200 bg-white' : 'border-slate-200 bg-white/90'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">{task.type || task.taskType}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-slate-950">{title}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {done ? 'Done' : 'Pending'}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <BookOpen className="h-4 w-4 text-cyan-600" />
                <span>{task.questionCount ?? task.questions ?? 0} questions</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (launchable) {
                    launchTask(task);
                    return;
                  }

                  if (canMarkComplete && !done) {
                    markComplete(task.id);
                  }
                }}
                className={`relative z-10 mt-5 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg ${
                  launchable
                    ? 'cursor-pointer bg-slate-950'
                    : done || !canMarkComplete
                      ? 'cursor-default bg-emerald-600'
                      : 'cursor-pointer bg-slate-950'
                }`}
              >
                {launchable ? (done ? 'Retake Test' : 'Start Test') : done ? 'Completed' : 'Mark Complete'}
              </button>
            </motion.article>
          );
        })}
        {!premium ? (
          <motion.button
            type="button"
            whileHover={{ y: -3 }}
            onClick={unlockFullPlan}
            className="rounded-[1.75rem] border border-dashed border-amber-200 bg-amber-50 p-5 text-left shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Premium locked</p>
                <h3 className="mt-1 font-display text-xl font-bold text-slate-950">Unlock full daily plan</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Get the complete 3-step plan, advanced weak-topic tracking, and a smarter daily workflow.
            </p>
          </motion.button>
        ) : null}
      </div>
    </motion.section>
  );
}
