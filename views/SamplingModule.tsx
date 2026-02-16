
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SamplingRecord, ProcessingLog } from '../types';
import Terminal from '../components/Terminal';

const SamplingModule: React.FC = () => {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [records, setRecords] = useState<SamplingRecord[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Privacy & Masking State
  const [privacyShieldActive, setPrivacyShieldActive] = useState(false);
  const [maskedColumns, setMaskedColumns] = useState<string[]>(['Vendor', 'TransactionID']);
  
  const [sampleSize, setSampleSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((message: string, type: ProcessingLog['type'] = 'info') => {
    setLogs(prev => [...prev, { 
      id: Math.random().toString(36).substr(2, 9), 
      timestamp: new Date().toLocaleTimeString(), 
      message, 
      type 
    }].slice(-50));
  }, []);

  const maskValue = (val: any) => {
    const str = String(val);
    if (str.length <= 4) return "****";
    return str.substring(0, 2) + "****" + str.substring(str.length - 2);
  };

  const executePrivacyScrub = useCallback(() => {
    if (!privacyShieldActive) return;
    
    addLog("Privacy Shield: Initiating Deep Entropy Scrub...", "thinking");
    setRecords(prev => prev.map(record => {
      const newData = { ...record.data };
      maskedColumns.forEach(col => {
        if (newData[col]) {
          newData[col] = maskValue(newData[col]);
        }
      });
      return { ...record, data: newData };
    }));
    addLog("PII Anonymization Complete. Data is now secured for AI processing.", "success");
  }, [privacyShieldActive, maskedColumns, addLog]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For demo purposes, we simulate parsing a PDF/Excel structure
    setUploadedFile(file);
    addLog(`Ingestion successful for "${file.name}".`, "success");
    addLog("Detecting data structures and identifying potential PII vectors...", "info");
    
    const demoCols = ['TransactionID', 'Date', 'Amount', 'Vendor', 'Status'];
    setColumns(demoCols);
    
    const demoData = Array.from({ length: 100 }, (_, i) => ({
      id: `row-${i}`,
      isSampled: false,
      isOutlier: false,
      data: {
        TransactionID: `TXN-${1000 + i}`,
        Date: '2023-10-12',
        Amount: Math.floor(Math.random() * 5000),
        Vendor: i % 3 === 0 ? 'Acme Global Corp' : (i % 2 === 0 ? 'John Smith Consulting' : 'CyberDyne Systems'),
        Status: 'Processed'
      }
    }));
    
    setRecords(demoData);
  };

  const runSampling = () => {
    setIsProcessing(true);
    
    if (privacyShieldActive) {
      executePrivacyScrub();
    }

    addLog("Executing selection algorithm with statistical confidence...", "thinking");
    setTimeout(() => {
      setSampleSize(15);
      setRecords(prev => prev.map((r, i) => ({ 
        ...r, 
        isSampled: i < 15,
        isOutlier: i === 7 // Mock outlier
      })));
      addLog("Sampling complete. Outlier 'TXN-1007' flagged for investigation.", "success");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden fade-slide-in bg-slate-50/30">
      <div className="w-[380px] glass-sidebar p-8 overflow-y-auto shrink-0 z-10 flex flex-col gap-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Sampling Engine</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Selection & Privacy Core</p>
        </div>

        {/* High-Security Privacy Shield */}
        <div className={`interactive-element rounded-3xl p-6 transition-all duration-500 border-2 ${
          privacyShieldActive 
            ? 'bg-blue-600/5 border-blue-500/30 shadow-lg shadow-blue-500/5' 
            : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${privacyShieldActive ? 'bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-300'}`}></div>
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Privacy Shield</span>
            </div>
            <button 
              onClick={() => setPrivacyShieldActive(!privacyShieldActive)}
              className={`w-10 h-5 rounded-full transition-all relative ${privacyShieldActive ? 'bg-blue-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${privacyShieldActive ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed opacity-70">
            {privacyShieldActive 
              ? "ANONYMIZATION ACTIVE: Scrambling PII patterns (Names, IDs, Emails) before analysis." 
              : "STANDBY: Data will be processed in its raw format. Enable for sensitive datasets."}
          </p>
          
          {privacyShieldActive && (
            <div className="mt-4 pt-4 border-t border-blue-500/10 space-y-3 animate-in fade-in duration-500">
               <label className="text-[9px] font-bold text-blue-600/60 uppercase tracking-widest">Target Vectors</label>
               <div className="flex flex-wrap gap-1.5">
                 {['Vendor', 'TransactionID'].map(col => (
                   <span key={col} className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-[9px] font-bold border border-blue-500/10">
                     {col}
                   </span>
                 ))}
               </div>
            </div>
          )}
        </div>

        <div className="interactive-element glass-card rounded-2xl p-6 shadow-sm border-blue-50">
          <div className="flex items-start gap-4">
            <input 
              type="checkbox" 
              id="auth"
              checked={isAuthorized}
              onChange={(e) => setIsAuthorized(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0052CC] focus:ring-blue-500/20 cursor-pointer" 
            />
            <label htmlFor="auth" className="text-[11px] text-slate-600 leading-relaxed font-semibold cursor-pointer select-none">
              I Confirmed that I am authorize to upload this document in accordance with the organization's data privacy and security guideline
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-60">Source Artifact</label>
          <div 
            onClick={() => isAuthorized && !isProcessing && fileInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${!isAuthorized ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 bg-white border-slate-200'}`}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={!isAuthorized} />
            <div className="flex flex-col items-center gap-2">
              <svg className={`w-5 h-5 ${uploadedFile ? 'text-blue-500' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-[11px] font-bold text-slate-600 truncate max-w-[200px]">
                {uploadedFile ? uploadedFile.name : "Select Document"}
              </span>
            </div>
          </div>
        </div>

        <button 
          onClick={runSampling}
          disabled={isProcessing || records.length === 0 || !isAuthorized}
          className={`w-full py-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white rounded-2xl transition-all shadow-xl ${
            isProcessing || records.length === 0 || !isAuthorized 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-slate-900 hover:bg-black active:scale-[0.98]'
          }`}
        >
          {isProcessing ? "Executing..." : "Initialize Analysis"}
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="h-[200px] shrink-0 border-b border-slate-100 p-8 bg-slate-50/20">
          <Terminal logs={logs} />
        </div>
        
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
           {records.length > 0 ? (
             <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
               <table className="w-full text-[11px] border-collapse">
                 <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                   <tr>
                     <th className="w-10 px-4 py-4 text-left font-bold text-slate-400">#</th>
                     {columns.map(c => (
                       <th key={c} className="text-left px-4 py-4 text-slate-400 uppercase font-extrabold tracking-widest text-[9px]">{c}</th>
                     ))}
                     <th className="px-4 py-4 text-left font-bold text-slate-400 uppercase tracking-widest text-[9px]">Protocol Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {records.map((r, i) => (
                     <tr key={r.id} className={`transition-colors ${r.isSampled ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}>
                       <td className="px-4 py-4 text-slate-300 font-mono">{i + 1}</td>
                       {columns.map(c => (
                         <td key={c} className={`px-4 py-4 ${maskedColumns.includes(c) && privacyShieldActive ? 'font-mono text-blue-500/60' : 'text-slate-600 font-medium'}`}>
                           {String(r.data[c])}
                         </td>
                       ))}
                       <td className="px-4 py-4">
                         <div className="flex items-center gap-2">
                           {r.isSampled && (
                             <span className="px-2 py-0.5 bg-blue-100 text-[#0052CC] rounded text-[9px] font-extrabold uppercase tracking-tighter">Sampled</span>
                           )}
                           {r.isOutlier && (
                             <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded text-[9px] font-extrabold uppercase tracking-tighter animate-pulse">Outlier</span>
                           )}
                           {!r.isSampled && !r.isOutlier && (
                             <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                           )}
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-40">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="text-sm font-bold tracking-tight">No Data Loaded</p>
              <p className="text-[10px] mt-1 font-bold uppercase tracking-[0.2em]">Awaiting Analysis Payload</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SamplingModule;
