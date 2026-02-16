
import React from 'react';
import { MODULES } from '../constants';
import { ModuleID } from '../types';

interface HomeViewProps {
  onOpenModule: (id: ModuleID) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onOpenModule }) => {
  return (
    <div className="p-10 space-y-12 fade-slide-in">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Intelligence Launchpad</h1>
        <p className="text-slate-500 mt-3 text-[13px] font-medium opacity-70">Initiate specialized AI protocols</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MODULES.map((module) => (
          <div
            key={module.id}
            className="interactive-element glass-card rounded-3xl p-8 flex flex-col group cursor-pointer"
            onClick={() => onOpenModule(module.id)}
          >
            <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#0052CC] transition-all duration-300 shadow-lg">
              <div dangerouslySetInnerHTML={{ __html: module.icon }} className="scale-90" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0052CC] transition-colors">{module.title}</h3>
            <p className="text-[12px] text-slate-500 flex-1 leading-relaxed font-medium opacity-60">
              {module.description}
            </p>
            <div className="mt-8 pt-4 border-t border-slate-100/30 flex items-center justify-between text-[#0052CC] group-hover:opacity-100 opacity-40 transition-opacity">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Launch Sequence</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        ))}
        
        {/* Future Expansion Placeholder */}
        <div className="bg-white/5 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-300 transition-all hover:border-slate-300">
          <div className="w-10 h-10 border-2 border-slate-200 border-dashed rounded-full flex items-center justify-center mb-4">
             <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Protocol Expansion</span>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
