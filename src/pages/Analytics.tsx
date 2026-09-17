import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Shield,
  Clock,
  Users,
  Activity,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';

const disasterTypeData = [
  { type: 'Flood', count: 42, color: '#003366' },
  { type: 'Fire', count: 28, color: '#dc2626' },
  { type: 'Earthquake', count: 16, color: '#d97706' },
  { type: 'Cyclone', count: 12, color: '#0284c7' },
  { type: 'Landslide', count: 19, color: '#65a30d' },
  { type: 'Collapse', count: 9, color: '#ca8a04' },
  { type: 'Medical', count: 35, color: '#9333ea' },
];

const severityData = [
  { name: 'Critical', value: 24, color: '#dc2626' },
  { name: 'High', value: 38, color: '#ea580c' },
  { name: 'Medium', value: 65, color: '#ca8a04' },
  { name: 'Low', value: 34, color: '#16a34a' },
];

const timelineData = [
  { time: '00:00', reports: 12, resolved: 8 },
  { time: '04:00', reports: 18, resolved: 14 },
  { time: '08:00', reports: 45, resolved: 28 },
  { time: '12:00', reports: 82, resolved: 52 },
  { time: '16:00', reports: 68, resolved: 58 },
  { time: '20:00', reports: 39, resolved: 36 },
];

const responseTimeData = [
  { day: 'Mon', minutes: 14.2 },
  { day: 'Tue', minutes: 12.8 },
  { day: 'Wed', minutes: 15.5 },
  { day: 'Thu', minutes: 11.2 },
  { day: 'Fri', minutes: 9.8 },
  { day: 'Sat', minutes: 8.4 },
  { day: 'Sun', minutes: 7.9 },
];

export function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-900 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 rounded-md bg-slate-50 p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#003366] animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-[#003366] uppercase">
              Community Crisis Telemetry System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community Disaster Statistical Bulletin &amp; Analytics
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            सामुदायिक आपदा सांख्यिकी बुलेटिन — Empirical operational metrics measuring emergency dispatch velocity, disaster density, resource consumption curves, and field triage efficiency.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-bold rounded-md text-xs cursor-pointer shadow-xs self-start md:self-auto"
        >
          <FileSpreadsheet className="h-4 w-4 text-[#003366]" /> Export Statistical Report (PDF)
        </Button>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Average Dispatch Velocity"
          value="8.4 mins"
          icon={Clock}
          color="green"
          trend="-3.2m from standard baseline"
          trendUp={false}
        />
        <StatCard
          label="Triage Accuracy"
          value="96.8%"
          icon={Shield}
          color="blue"
          trend="Validated by Ground Response Squads"
          trendUp={false}
        />
        <StatCard
          label="Citizens Assisted"
          value="142,800"
          icon={Users}
          color="purple"
          trend="Across 18 district commands"
          trendUp={false}
        />
        <StatCard
          label="Offline Preservation Rate"
          value="100%"
          icon={Activity}
          color="orange"
          trend="Zero report loss on blackout"
          trendUp={false}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Incidents by Disaster Type */}
        <div className="rounded-md border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#003366]" />
              Incidents by Disaster Category (आपदा श्रेणी अनुसार विवरण)
            </h3>
            <span className="text-xs font-semibold text-slate-500">161 Cases Documented</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disasterTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 6, color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Bar dataKey="count" fill="#003366" radius={[4, 4, 0, 0]}>
                  {disasterTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incidents by Severity Distribution */}
        <div className="rounded-md border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-amber-600" />
              Severity Triage Distribution (गंभीरता स्तर वितरण)
            </h3>
            <span className="text-xs font-semibold text-slate-500">Priority Matrix</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 6, color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs text-slate-700 font-semibold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Reports vs Resolved Over Time */}
        <div className="rounded-md border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-700" />
              Incoming Field Intimations vs Resolved Missions
            </h3>
            <span className="text-xs font-semibold text-slate-500">24-Hour Pan-India Trajectory</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 6, color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Legend formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>} />
                <Area
                  type="monotone"
                  dataKey="reports"
                  name="Reports Filed (सूचनाएं)"
                  stroke="#dc2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReports)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Missions Resolved (सफलतापूर्वक हल)"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Average Response Time Velocity */}
        <div className="rounded-md border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#003366]" />
              Dispatch Velocity Trend (Minutes to Field Arrival)
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              Velocity Improved 44%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: 6, color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  name="Average Dispatch Time (Minutes)"
                  stroke="#003366"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#003366' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
