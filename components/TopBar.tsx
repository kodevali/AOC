import React from 'react';

interface TopBarProps {
  breadcrumb?: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ breadcrumb, searchQuery, onSearchChange }) => {
  return (
    <header className="h-14 glass-nav flex items-center justify-between px-10 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 text-[12px] font-bold text-slate-400">
        <span className="hover:text-slate-900 cursor-pointer transition-colors tracking-widest uppercase opacity-50">IA OPS</span>
        <svg className="w-3 h-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 tracking-tight font-bold">{breadcrumb || 'Dashboard'}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Intelligence Base..."
            className="w-80 pl-11 pr-4 py-2 bg-slate-100/40 border border-slate-200/50 rounded-xl text-[11px] font-semibold focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all placeholder:text-slate-400 outline-none"
          />
          <svg className="w-4 h-4 absolute left-4 top-2.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50/50 rounded-xl border border-slate-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center cursor-pointer hover:bg-black transition-all shadow-lg shadow-black/10">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default TopBar;