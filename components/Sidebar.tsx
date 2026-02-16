import React from 'react';
import { MODULES } from '../constants';
import { ModuleID } from '../types';

interface SidebarProps {
  activeModule: ModuleID;
  onNavigate: (id: ModuleID) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onNavigate }) => {
  return (
    <aside className="w-64 glass-sidebar flex flex-col h-full sticky top-0 overflow-y-auto z-20">
      {/* Premium Branding */}
      <div className="p-7 pb-5 flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg border border-slate-800">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[15px] font-extrabold text-slate-900 tracking-tight leading-none">Internal Audit</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-70">Operations Center</p>
        </div>
      </div>

      <nav className="flex-1 p-3 pt-4 space-y-1">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all duration-200 group border ${
            activeModule === 'dashboard'
              ? 'bg-[#E0EBFF] text-[#0052CC] border-[#0052CC]/10 shadow-sm shadow-blue-500/5'
              : 'text-slate-500 border-transparent hover:bg-slate-200/40 hover:text-slate-900'
          }`}
        >
          {activeModule === 'dashboard' && (
            <div className="absolute left-[-3px] top-2 bottom-2 w-[4px] bg-[#0052CC] rounded-r-full shadow-[2px_0_8px_rgba(0,82,204,0.3)]" />
          )}
          <svg className={`w-4 h-4 transition-colors ${activeModule === 'dashboard' ? 'text-[#0052CC]' : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className={activeModule === 'dashboard' ? 'font-bold' : ''}>Dashboard</span>
        </button>

        {MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => onNavigate(module.id)}
            className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all duration-200 group border ${
              activeModule === module.id
                ? 'bg-[#E0EBFF] text-[#0052CC] border-[#0052CC]/10 shadow-sm shadow-blue-500/5'
                : 'text-slate-500 border-transparent hover:bg-slate-200/40 hover:text-slate-900'
            }`}
          >
            {activeModule === module.id && (
              <div className="absolute left-[-3px] top-2 bottom-2 w-[4px] bg-[#0052CC] rounded-r-full shadow-[2px_0_8px_rgba(0,82,204,0.3)]" />
            )}
            <div 
              dangerouslySetInnerHTML={{ __html: module.icon }} 
              className={`w-4 h-4 transition-colors scale-90 ${activeModule === module.id ? 'text-[#0052CC]' : 'text-slate-400 group-hover:text-slate-600'}`} 
            />
            <span className={`truncate ${activeModule === module.id ? 'font-bold' : ''}`}>{module.title}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 pt-4 border-t border-slate-200/40 bg-slate-100/30">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[12px] font-bold text-slate-400 hover:text-slate-700 transition-colors group">
          <svg className="w-4 h-4 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;