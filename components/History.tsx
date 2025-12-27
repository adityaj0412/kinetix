
import React from 'react';
import { Activity } from '../types';

interface Props {
  activities: Activity[];
}

const History: React.FC<Props> = ({ activities }) => {
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-50">Workout History</h2>
        <p className="text-slate-400">Your journey so far</p>
      </header>

      {activities.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-slate-400 font-medium">No recorded activities yet. Start a session!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  act.type === 'running' ? 'bg-rose-500/10 text-rose-400' :
                  act.type === 'walking' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-indigo-500/10 text-indigo-400'
                }`}>
                  <ActivityIcon type={act.type} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-50 capitalize">{act.type} Session</h4>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{formatDate(act.startTime)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Steps</p>
                  <p className="text-lg font-black text-slate-100">{act.steps.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Distance</p>
                  <p className="text-lg font-black text-slate-100">{(act.distance / 1000).toFixed(2)}km</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Cals</p>
                  <p className="text-lg font-black text-slate-100">{act.calories.toFixed(0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-lg font-black text-slate-100">
                    {Math.floor((act.endTime - act.startTime) / 60000)}m
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ActivityIcon = ({ type }: { type: string }) => {
  if (type === 'running') return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  if (type === 'walking') return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.122a5 5 0 010-7.072m7.072 0a5 5 0 010 7.072M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>;
  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
};

export default History;
