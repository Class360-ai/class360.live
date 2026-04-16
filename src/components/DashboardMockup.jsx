import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { appMetrics, dashboardTips, performanceData, weakTopicData } from '../data/siteData';

export default function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative mx-auto max-w-2xl"
    >
      <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-blue-400/25 blur-3xl animate-glowPulse" />
      <div className="absolute -right-4 bottom-16 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl animate-glowPulse" />
      <div className="glass-card relative overflow-hidden rounded-[2rem] border-white/80 p-4 shadow-premium">
        <div className="rounded-[1.6rem] bg-slate-950 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Today’s Smart Dashboard</p>
              <h3 className="font-display text-xl font-bold">Class360 AI Coach</h3>
            </div>
            <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-300">
              Live sync
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {appMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl bg-white/10 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">{metric.label}</p>
                <p className="mt-2 text-lg font-bold text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-3xl bg-white p-4 text-slate-900 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-semibold">Score Trend</h4>
                <span className="text-sm font-semibold text-blue-700">+18.4% this month</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" fill="url(#scoreGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-4 text-slate-900 shadow-lg">
                <h4 className="font-semibold">Weak Topic Analysis</h4>
                <div className="mt-4 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weakTopicData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="subject" type="category" stroke="#64748b" fontSize={12} width={70} />
                      <Tooltip />
                      <Bar dataKey="progress" radius={[0, 10, 10, 0]} fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <h4 className="font-semibold text-white">AI Recommendations</h4>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  {dashboardTips.map((tip) => (
                    <li key={tip} className="rounded-2xl bg-white/10 px-3 py-2">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
