
import React, { useMemo } from 'react';
import { Activity, Goal } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
  activities: Activity[];
  goals: Goal[];
}

const Dashboard: React.FC<Props> = ({ activities, goals }) => {
  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayActivities = activities.filter(a => a.startTime >= today);
    return {
      steps: todayActivities.reduce((sum, a) => sum + a.steps, 0),
      calories: todayActivities.reduce((sum, a) => sum + a.calories, 0),
      distance: todayActivities.reduce((sum, a) => sum + a.distance, 0) / 1000,
    };
  }, [activities]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        timestamp: d.setHours(0,0,0,0),
        steps: 0
      };
    }).reverse();

    last7Days.forEach(day => {
      activities.forEach(act => {
        const actDate = new Date(act.startTime).setHours(0,0,0,0);
        if (actDate === day.timestamp) {
          day.steps += act.steps;
        }
      });
    });

    return last7Days;
  }, [activities]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-50 tracking-tight">Daily Progress</h2>
          <p className="text-slate-400">Your vitals for today</p>
        </div>
        <div className="hidden md:flex gap-2 text-sm font-medium">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Active Session</span>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full">{new Date().toLocaleDateString()}</span>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Steps" 
          value={stats.steps.toLocaleString()} 
          target={goals.find(g => g.category === 'steps')?.targetValue || 10000}
          unit="steps"
          icon={<StepsIcon />}
          color="emerald"
        />
        <StatCard 
          label="Calories" 
          value={stats.calories.toFixed(0)} 
          target={goals.find(g => g.category === 'calories')?.targetValue || 500}
          unit="kcal"
          icon={<BurnIcon />}
          color="orange"
        />
        <StatCard 
          label="Distance" 
          value={stats.distance.toFixed(2)} 
          target={goals.find(g => g.category === 'distance')?.targetValue || 5}
          unit="km"
          icon={<DistanceIcon />}
          color="blue"
        />
      </div>

      {/* Full Width Activity Chart */}
      <div className="bg-slate-900/40 backdrop-blur border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Weekly Activity
        </h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSteps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; target: number; unit: string; icon: React.ReactNode; color: string }> = ({ label, value, target, unit, icon, color }) => {
  const numericValue = parseFloat(value.replace(/,/g, ''));
  const progress = Math.min((numericValue / target) * 100, 100);
  
  const colorClasses = {
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    orange: "text-orange-400 border-orange-500/20 bg-orange-500/5",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  }[color] || "";

  return (
    <div className="bg-slate-900/40 backdrop-blur border border-slate-800 rounded-3xl p-6 transition-all hover:bg-slate-800/60 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorClasses}`}>
          <div className="w-6 h-6">{icon}</div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-slate-50">{value}<span className="text-xs font-medium text-slate-500 ml-1">{unit}</span></p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
          <span>{progress.toFixed(0)}% Complete</span>
          <span>{target.toLocaleString()} {unit} Goal</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${color === 'emerald' ? 'bg-emerald-500' : color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const StepsIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
);
const BurnIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z" /></svg>
);
const DistanceIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

export default Dashboard;
