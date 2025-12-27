
import React, { useState } from 'react';
import { Goal } from '../types';

interface Props {
  goals: Goal[];
  onRemove: (id: string) => void;
  onAdd: (goal: Goal) => void;
}

const GoalsList: React.FC<Props> = ({ goals, onRemove, onAdd }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    targetValue: 0,
    category: 'steps',
    unit: 'steps'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.targetValue) return;
    
    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoal.title!,
      targetValue: Number(newGoal.targetValue),
      currentValue: 0,
      unit: newGoal.category === 'steps' ? 'steps' : newGoal.category === 'calories' ? 'kcal' : newGoal.category === 'distance' ? 'km' : 'min',
      category: newGoal.category as any,
      deadline: 'Custom'
    };
    onAdd(goal);
    setShowAdd(false);
    setNewGoal({ title: '', targetValue: 0, category: 'steps' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-50">Fitness Goals</h2>
          <p className="text-slate-400">Personalized milestones</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2 rounded-xl transition-all"
        >
          {showAdd ? 'Cancel' : '+ New Goal'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Goal Name</label>
              <input 
                type="text" 
                placeholder="Morning Walk Challenge" 
                className="w-full bg-slate-800 border-none rounded-xl p-3 text-slate-50 focus:ring-2 focus:ring-emerald-500"
                value={newGoal.title}
                onChange={e => setNewGoal({...newGoal, title: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Target Value</label>
              <input 
                type="number" 
                className="w-full bg-slate-800 border-none rounded-xl p-3 text-slate-50 focus:ring-2 focus:ring-emerald-500"
                value={newGoal.targetValue}
                onChange={e => setNewGoal({...newGoal, targetValue: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase px-1">Category</label>
              <select 
                className="w-full bg-slate-800 border-none rounded-xl p-3 text-slate-50 focus:ring-2 focus:ring-emerald-500"
                value={newGoal.category}
                onChange={e => setNewGoal({...newGoal, category: e.target.value as any})}
              >
                <option value="steps">Steps</option>
                <option value="calories">Calories</option>
                <option value="distance">Distance</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400 transition-colors">
            CREATE GOAL
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl relative group">
            <button 
              onClick={() => onRemove(goal.id)}
              className="absolute top-4 right-4 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md uppercase">{goal.category}</span>
                <h3 className="text-xl font-bold text-slate-50 mt-2">{goal.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-50">{goal.currentValue.toLocaleString()}</span>
                <span className="text-slate-500 text-sm ml-1">/ {goal.targetValue.toLocaleString()} {goal.unit}</span>
              </div>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsList;
