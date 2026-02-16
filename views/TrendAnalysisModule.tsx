
import React, { useState, useCallback, useRef } from 'react';
import { TrendFinding, ProcessingLog } from '../types';
import Terminal from '../components/Terminal';
import { auditAI } from '../services/geminiService';

interface StagedFile {
  file: File;
  id: string;
  cycle: string;
}

const TrendAnalysisModule: React.FC = () => {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [findings, setFindings] = useState<TrendFinding[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((message: string, type: ProcessingLog['type'] = 'info') => {
    setLogs(prev => [...prev, { 
      id: Math.random().toString(36).substr(2, 9), 
      timestamp: new Date().toLocaleTimeString(), 
      message, 
      type 
    }].slice(-50));
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      const pdfOnly = newFiles.filter(f => f.type === 'application/pdf');
      
      if (pdfOnly.length < newFiles.length) {
        addLog(`Security Rejection: Only PDF artifacts are accepted.`, "error");
      }

      const newStaged = pdfOnly.map(f => ({
        file: f,
        id: Math.random().toString(36).substr(2, 9),
        cycle: new Date().getFullYear().toString()
      }));

      setStagedFiles(prev => [...prev, ...newStaged]);
      addLog(`Bulk Ingest: Staged ${newStaged.length} reports for longitudinal correlation.`, "info");
    }
  };

  const removeFile = (id: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
    addLog("Artifact removed from staging repository.", "info");
  };

  const updateCycle = (id: string, cycle: string) => {
    setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, cycle } : f));
  };

  const runAnalysis = async () => {
    if (stagedFiles.length < 2) {
      addLog("Analysis Requirement: Minimum of two reports required for longitudinal mining.", "error");
      return;
    }

    setIsProcessing(true);
    addLog(`Initializing Bulk Correlation Engine across ${stagedFiles.length} cycles...`, "info");
    
    try {
      addLog("Extracting high-density vectors from historical artifacts...", "thinking");
      
      // Simulation of bulk parsing progress
      for (const staged of stagedFiles) {
        addLog(`Parsing ${staged.file.name} [Cycle: ${staged.cycle}]...`, "thinking");
        await new Promise(r => setTimeout(r, 400));
      }

      const fileData = await Promise.all(stagedFiles.map(async f => ({ 
        data: await fileToBase64(f.file), 
        name: `${f.cycle}_${f.file.name}` 
      })));
      
      const results = await auditAI.analyzeAuditTrends(fileData);
      setFindings(results.map((f: any, i: number) => ({ ...f, id: `trend-${i}` })));
      addLog("Cross-cycle Correlation Scan Complete.", "success");
    } catch (err: any) {
      addLog(`Kernel Analysis Error: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const availableYears = ['2020', '2021', '2022', '2023', '2024', '2025'];

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden fade-slide-in bg-slate-50/30">
      <div className="w-[380px] glass-sidebar p-8 overflow-y-auto shrink-0 z-10 flex flex-col gap-8 custom-scrollbar">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Trend Analysis</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Longitudinal Intelligence</p>
        </div>

        {/* Authorization Protocol */}
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
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-60">Historical Repository</label>
          <div 
            onClick={() => isAuthorized && !isProcessing && fileInputRef.current?.click()}
            className={`p-10 border-2 border-dashed rounded-3xl text-center transition-all ${!isAuthorized ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 bg-white border-slate-200'}`}
          >
            <input type="file" multiple ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileChange} disabled={!isAuthorized || isProcessing} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest">Bulk Ingest PDF</span>
              <p className="text-[9px] text-slate-400 font-medium">Select up to 3 years of reports</p>
            </div>
          </div>

          <div className="space-y-2 mt-6">
            {stagedFiles.map((staged) => (
              <div key={staged.id} className="group relative bg-white border border-slate-100 p-4 rounded-2xl shadow-sm animate-in fade-in slide-in-from-left-4 transition-all hover:border-slate-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">{staged.file.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1">Artifact: PDF</p>
                  </div>
                  <button 
                    onClick={() => removeFile(staged.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 rounded-lg group-hover:opacity-100 opacity-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Cycle:</label>
                  <select 
                    value={staged.cycle}
                    onChange={(e) => updateCycle(staged.id, e.target.value)}
                    className="bg-slate-50 border-none text-[10px] font-extrabold text-slate-900 py-1 px-2 rounded-lg outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button 
            onClick={runAnalysis}
            disabled={isProcessing || stagedFiles.length < 2 || !isAuthorized}
            className={`w-full py-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white rounded-2xl transition-all shadow-xl ${
              isProcessing || stagedFiles.length < 2 || !isAuthorized 
                ? 'bg-slate-200 cursor-not-allowed shadow-none' 
                : 'bg-slate-900 hover:bg-black active:scale-[0.98]'
            }`}
          >
            {isProcessing ? "Processing Bulk Data..." : "Run Correlation Engine"}
          </button>
          <p className="text-center text-[9px] text-slate-400 mt-4 font-medium opacity-60">Longitudinal patterns require at least 2 historical cycles.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="h-[200px] shrink-0 border-b border-slate-100 p-8 bg-slate-50/20">
          <Terminal logs={logs} />
        </div>
        <div className="flex-1 overflow-auto p-8 space-y-8 custom-scrollbar">
           {findings.length > 0 ? (
             <div className="max-w-4xl mx-auto space-y-6">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Intelligence Synthesis</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-Cycle Findings Summary</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="text-center">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase mb-1">Total Themes</p>
                        <p className="text-xl font-black text-slate-900">{findings.length}</p>
                     </div>
                  </div>
               </div>
               
               {findings.map(f => (
                 <div key={f.id} className="group p-8 border border-slate-100 bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300">
                   <div className="flex justify-between items-start mb-6">
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Recurring Theme</span>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{f.theme}</h3>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${
                       f.severityTrend === 'Degrading' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                       f.severityTrend === 'Improving' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                       'bg-slate-50 text-slate-600 border border-slate-100'
                     }`}>
                       {f.severityTrend} Trend
                     </span>
                   </div>

                   <p className="text-[13px] text-slate-600 leading-relaxed mb-8 font-medium italic opacity-80">
                     {f.aiSynthesis}
                   </p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                      <div className="space-y-4">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Historical Frequency</p>
                        <div className="flex items-end gap-2 h-16">
                          {f.historicalContext.map((hc, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                               <div className="w-full bg-slate-100 rounded-t-lg transition-all group-hover/bar:bg-blue-100 relative" style={{ height: `${(hc.count / 10) * 100}%` }}>
                                  <div className="absolute -top-6 left-0 right-0 text-center text-[9px] font-black text-slate-900 opacity-0 group-hover/bar:opacity-100 transition-opacity">{hc.count}</div>
                               </div>
                               <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{hc.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 self-start">
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Long-term Remediation</p>
                        <p className="text-[12px] text-slate-900 font-bold leading-snug">{f.recommendedAction}</p>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-40">
              <div className="w-24 h-24 mb-6 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <p className="text-sm font-bold tracking-tight">Intelligence Repository Empty</p>
              <p className="text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">Stage artifacts to begin correlation</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysisModule;
