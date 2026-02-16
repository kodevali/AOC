
import React, { useEffect, useRef } from 'react';
import { ProcessingLog } from '../types';

interface TerminalProps {
  logs: ProcessingLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0F172A] rounded-xl shadow-2xl overflow-hidden border border-slate-800/50">
      <div className="bg-[#1E293B] px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80 shadow-sm shadow-red-500/10"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80 shadow-sm shadow-amber-500/10"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80 shadow-sm shadow-green-500/10"></div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 ml-2 font-bold tracking-widest uppercase">AI Core Process</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono font-bold tracking-tight">
          <span>THINK_MAX: 32K</span>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-sm shadow-blue-500"></div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 p-5 font-mono text-[11px] overflow-y-auto space-y-2 leading-relaxed custom-scrollbar"
      >
        {logs.length === 0 ? (
          <div className="text-[#38BDF8] opacity-30 flex items-center gap-2">
            <span className="animate-pulse">_</span>
            <span className="italic">Kernel idle. Awaiting operational input...</span>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-4 animate-in fade-in duration-300">
              <span className="text-slate-600 shrink-0 font-medium">[{log.timestamp}]</span>
              <span className={`
                ${log.type === 'info' ? 'text-slate-400' : ''}
                ${log.type === 'success' ? 'text-emerald-400 font-medium' : ''}
                ${log.type === 'warning' ? 'text-amber-400' : ''}
                ${log.type === 'error' ? 'text-rose-400' : ''}
                ${log.type === 'thinking' ? 'text-blue-400 italic' : ''}
              `}>
                <span className="mr-2 opacity-30">{log.type === 'thinking' ? '◈' : '◇'}</span>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default Terminal;
