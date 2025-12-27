
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Goal, UserStats } from './types';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';
import GoalsList from './components/GoalsList';
import History from './components/History';

const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('kinetix_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('kinetix_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Daily Steps', targetValue: 10000, currentValue: 0, unit: 'steps', category: 'steps', deadline: 'Daily' },
      { id: '2', title: 'Calorie Burn', targetValue: 500, currentValue: 0, unit: 'kcal', category: 'calories', deadline: 'Daily' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kinetix_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('kinetix_goals', JSON.stringify(goals));
  }, [goals]);

  const addActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
    // Update goal progress based on the new activity
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.category === 'steps') return { ...goal, currentValue: goal.currentValue + activity.steps };
      if (goal.category === 'calories') return { ...goal, currentValue: goal.currentValue + activity.calories };
      if (goal.category === 'distance') return { ...goal, currentValue: goal.currentValue + (activity.distance / 1000) };
      return goal;
    }));
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, goal]);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:pl-64 bg-slate-950">
        
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">KINETIX</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
          </div>
        </header>

        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-6 z-50">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">KINETIX</h1>
          </div>
          
          <nav className="flex-1 space-y-2">
            <NavLink to="/" icon={<DashboardIcon />} label="Dashboard" />
            <NavLink to="/tracker" icon={<TrackerIcon />} label="Start Workout" />
            <NavLink to="/goals" icon={<GoalsIcon />} label="Goals" />
            <NavLink to="/history" icon={<HistoryIcon />} label="History" />
          </nav>

          <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1 font-medium">SYSTEM STATUS</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Sensors Active</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard activities={activities} goals={goals} />} />
            <Route path="/tracker" element={<Tracker onSave={addActivity} />} />
            <Route path="/goals" element={<GoalsList goals={goals} onRemove={removeGoal} onAdd={addGoal} />} />
            <Route path="/history" element={<History activities={activities} />} />
          </Routes>
        </main>

        {/* Bottom Nav for Mobile */}
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl flex justify-around items-center p-2 z-50 shadow-2xl">
          <MobileNavLink to="/" icon={<DashboardIcon />} label="Home" />
          <MobileNavLink to="/tracker" icon={<TrackerIcon />} label="Track" />
          <MobileNavLink to="/goals" icon={<GoalsIcon />} label="Goals" />
          <MobileNavLink to="/history" icon={<HistoryIcon />} label="Log" />
        </nav>
      </div>
    </HashRouter>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
      <span className="w-6 h-6">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 p-3 px-5 rounded-2xl transition-all ${isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'}`}>
      <div className="w-6 h-6">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </Link>
  );
};

// Icons
const DashboardIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const TrackerIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const GoalsIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
);
const HistoryIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export default App;
