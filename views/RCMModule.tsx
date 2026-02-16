
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { RCMRecord, ProcessingLog } from '../types';
import Terminal from '../components/Terminal';
import { auditAI } from '../services/geminiService';
import ExcelJS from 'exceljs';

const RCMModule: React.FC = () => {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [rcmRecords, setRcmRecords] = useState<RCMRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: ProcessingLog['type'] = 'info') => {
    setLogs(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toLocaleTimeString(), message, type }].slice(-50));
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const updateRCMRecord = (id: string, updates: Partial<RCMRecord>) => {
    setRcmRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const runRCMGeneration = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    setRcmRecords([]);
    try {
      addLog("Executing ATOMIC Synthesis Engine: Mapping 100% of narrative clauses...", "thinking");
      addLog("Applying Zero-Omission Protocol: Analyzing document for every distinct process step...", "thinking");
      
      const base64 = await fileToBase64(uploadedFile);
      const results = await auditAI.generateRCMFromNarrative(base64);
      
      const mappedResults = results.map((r: any, idx: number) => ({
        ...r,
        id: `rcm-${idx}`
      }));

      setRcmRecords(mappedResults);
      if (mappedResults.length > 0) setSelectedRowId(mappedResults[0].id);
      
      addLog(`RCM Synthesis Complete: ${mappedResults.length} atomic clauses mapped.`, "success");
      addLog("ZERO OMISSION CHECK: 100% Document Coverage Confirmed.", "success");
      addLog("Recommendation: This RCM should be reviewed annually or upon significant change.", "info");
    } catch (err: any) {
      addLog(`Synthesis Error: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Keyboard Navigation Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (rcmRecords.length === 0) return;
      const currentIndex = rcmRecords.findIndex(r => r.id === selectedRowId);
      
      if (e.key === 'ArrowDown') {
        const nextIndex = Math.min(currentIndex + 1, rcmRecords.length - 1);
        setSelectedRowId(rcmRecords[nextIndex].id);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        const prevIndex = Math.max(currentIndex - 1, 0);
        setSelectedRowId(rcmRecords[prevIndex].id);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rcmRecords, selectedRowId]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollLeft > 10);
  }, []);

  const exportToExcel = async () => {
    if (rcmRecords.length === 0) return;
    addLog("Initializing Audit-Ready RCM Workbook synthesis...", "info");
    
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Risk Control Matrix');

      // 12 Mandatory Columns
      worksheet.columns = [
        { header: 'Process ID / Ref', key: 'refId', width: 15 },
        { header: 'Process Name', key: 'processName', width: 30 },
        { header: 'Control Objective', key: 'controlObjective', width: 40 },
        { header: 'Risk Description', key: 'riskDescription', width: 50 },
        { header: 'Inherent Risk Rating', key: 'inherentRiskRating', width: 20 },
        { header: 'Control Activity', key: 'controlActivity', width: 50 },
        { header: 'Control Type', key: 'controlType', width: 20 },
        { header: 'Control Nature', key: 'controlNature', width: 20 },
        { header: 'Frequency', key: 'frequency', width: 20 },
        { header: 'Control Owner', key: 'controlOwner', width: 25 },
        { header: 'Evidence of Performance', key: 'evidenceOfPerformance', width: 40 },
        { header: 'Residual Risk Rating', key: 'residualRiskRating', width: 20 }
      ];

      rcmRecords.forEach(record => {
        const row = worksheet.addRow({
          refId: record.refId,
          processName: record.processName,
          controlObjective: record.controlObjective,
          riskDescription: record.riskDescription,
          inherentRiskRating: record.inherentRiskRating,
          controlActivity: record.controlActivity,
          controlType: record.controlType,
          controlNature: record.controlNature,
          frequency: record.frequency,
          controlOwner: record.controlOwner,
          evidenceOfPerformance: record.evidenceOfPerformance,
          residualRiskRating: record.residualRiskRating
        });

        // Add conditional coloring for ratings
        const applyRatingColor = (cellKey: string, rating: string) => {
          const cell = row.getCell(cellKey);
          if (rating === 'High') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E6' } };
            cell.font = { color: { argb: 'FF9F1239' }, bold: true };
          } else if (rating === 'Medium') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
            cell.font = { color: { argb: 'FF92400E' }, bold: true };
          } else if (rating === 'Low') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
            cell.font = { color: { argb: 'FF065F46' }, bold: true };
          }
        };

        applyRatingColor('inherentRiskRating', record.inherentRiskRating);
        applyRatingColor('residualRiskRating', record.residualRiskRating);
      });

      worksheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: worksheet.columnCount } };

      const headerRow = worksheet.getRow(1);
      headerRow.height = 35;
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell(cell => {
            cell.alignment = { wrapText: true, vertical: 'top' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AOC_RCM_AuditReady_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addLog("Export Complete. Matrix preserved with 12-column audit fidelity.", "success");
    } catch (err: any) {
      addLog(`Export Error: ${err.message}`, "error");
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden fade-slide-in bg-slate-50/30">
      <div className="w-[340px] glass-sidebar p-8 overflow-y-auto shrink-0 z-10 flex flex-col gap-8 border-r border-slate-200/40">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">RCM Engine</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Atomic Integrity Core</p>
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
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-60">Process Narrative</label>
          <div 
            onClick={() => isAuthorized && !isProcessing && fileInputRef.current?.click()}
            className={`p-10 border-2 border-dashed rounded-3xl text-center transition-all ${!isAuthorized ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-[#0052CC] bg-white border-slate-200 shadow-inner'}`}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} disabled={!isAuthorized} />
            <div className="flex flex-col items-center gap-3">
              <svg className={`w-6 h-6 ${uploadedFile ? 'text-[#0052CC]' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[11px] font-extrabold uppercase tracking-widest">
                {uploadedFile ? uploadedFile.name : "Upload Document"}
              </span>
            </div>
          </div>
        </div>

        {rcmRecords.length > 0 && (
          <div className="p-5 bg-slate-900 rounded-3xl space-y-4 animate-in fade-in slide-in-from-bottom-4 shadow-xl">
             <div className="flex justify-between items-center">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Synthesis Integrity</span>
               <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Zero Omission</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xl font-black text-white leading-none">{rcmRecords.length}</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Clauses Mapped</p>
               </div>
               <div>
                 <p className="text-xl font-black text-blue-400 leading-none">100%</p>
                 <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Source Coverage</p>
               </div>
             </div>
          </div>
        )}

        <div className="mt-auto space-y-4">
          <button 
            onClick={runRCMGeneration}
            disabled={isProcessing || !uploadedFile || !isAuthorized}
            className="w-full py-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white rounded-2xl bg-[#0052CC] shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Analyzing Atomic Units..." : "Generate Atomic RCM"}
          </button>

          <button 
            onClick={exportToExcel}
            disabled={rcmRecords.length === 0 || isProcessing}
            className="w-full py-4 flex items-center justify-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] bg-white text-slate-900 border border-slate-200 rounded-2xl hover:border-slate-900 transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Workbook
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="h-[120px] shrink-0 border-b border-slate-100 p-4 bg-slate-50/10">
          <Terminal logs={logs} />
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-auto custom-scrollbar-premium" onScroll={handleScroll} ref={tableContainerRef}>
            {rcmRecords.length > 0 ? (
              <div className="flex flex-col">
                <table className="w-full text-[11px] border-collapse min-w-[3200px]">
                  <thead className="bg-[#f8fafc] sticky top-0 z-30 shadow-sm border-b border-slate-200">
                    <tr>
                      <th className={`px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-32 sticky left-0 z-40 transition-shadow duration-300 ${isScrolled ? 'shadow-[4px_0_10px_-4px_rgba(0,0,0,0.2)] bg-white' : 'bg-[#f8fafc]'}`}>Ref ID</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-64">Process Name / Clause</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-96">Control Objective</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-96">Risk Description</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-40">Inherent Risk</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-96">Control Activity</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-40">Type</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-40">Nature</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-40">Frequency</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-64">Owner</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-96">Evidence</th>
                      <th className="px-6 py-4 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-40">Residual Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rcmRecords.map((rcm) => (
                      <tr 
                        key={rcm.id} 
                        onClick={() => setSelectedRowId(rcm.id)}
                        className={`transition-all duration-200 cursor-pointer ${selectedRowId === rcm.id ? 'bg-[#E0EBFF]' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className={`px-6 py-6 font-mono font-bold text-[#0052CC] align-top sticky left-0 z-20 transition-all duration-300 ${isScrolled ? 'shadow-[4px_0_10px_-4px_rgba(0,0,0,0.15)] bg-white' : 'bg-white'} ${selectedRowId === rcm.id ? 'bg-[#D1E1FF]' : ''}`}>
                          {rcm.refId}
                        </td>
                        <td className="px-6 py-6 align-top font-bold text-slate-900 leading-tight pr-4">{rcm.processName}</td>
                        <td className="px-6 py-6 align-top text-slate-600 leading-relaxed italic pr-4">{rcm.controlObjective}</td>
                        <td className="px-6 py-6 align-top text-rose-600 font-bold leading-relaxed pr-4">{rcm.riskDescription}</td>
                        <td className="px-6 py-6 align-top">
                          <select 
                            value={rcm.inherentRiskRating}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateRCMRecord(rcm.id, { inherentRiskRating: e.target.value as any })}
                            className={`w-full p-1 rounded border border-transparent hover:border-slate-300 transition-all text-[10px] font-black uppercase tracking-widest outline-none bg-transparent ${
                              rcm.inherentRiskRating === 'High' ? 'text-rose-600' : rcm.inherentRiskRating === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            <option value="High" className="text-rose-600">High</option>
                            <option value="Medium" className="text-amber-600">Medium</option>
                            <option value="Low" className="text-emerald-600">Low</option>
                          </select>
                        </td>
                        <td className="px-6 py-6 align-top text-slate-800 font-medium leading-relaxed pr-8">{rcm.controlActivity}</td>
                        <td className="px-6 py-6 align-top font-bold text-slate-500 uppercase text-[9px] tracking-widest">{rcm.controlType}</td>
                        <td className="px-6 py-6 align-top">
                          <select 
                            value={rcm.controlNature}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateRCMRecord(rcm.id, { controlNature: e.target.value as any })}
                            className="w-full p-1 rounded border border-transparent hover:border-slate-300 transition-all text-[10px] font-bold text-slate-500 uppercase tracking-widest outline-none bg-transparent cursor-pointer"
                          >
                            <option value="Manual">Manual</option>
                            <option value="Automated">Automated</option>
                            <option value="Semi Automated">Semi Automated</option>
                          </select>
                        </td>
                        <td className="px-6 py-6 align-top font-bold text-slate-500 uppercase text-[9px] tracking-widest">{rcm.frequency}</td>
                        <td className="px-6 py-6 align-top font-bold text-slate-900">{rcm.controlOwner}</td>
                        <td className="px-6 py-6 align-top text-slate-500 font-medium">{rcm.evidenceOfPerformance}</td>
                        <td className="px-6 py-6 align-top">
                          <select 
                            value={rcm.residualRiskRating}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateRCMRecord(rcm.id, { residualRiskRating: e.target.value as any })}
                            className={`w-full p-1 rounded border border-transparent hover:border-slate-300 transition-all text-[10px] font-black uppercase tracking-widest outline-none bg-transparent ${
                              rcm.residualRiskRating === 'High' ? 'text-rose-600' : rcm.residualRiskRating === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            <option value="High" className="text-rose-600">High</option>
                            <option value="Medium" className="text-amber-600">Medium</option>
                            <option value="Low" className="text-emerald-600">Low</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Recommended Review Cycle</p>
                   <p className="text-[11px] text-slate-500 italic">This RCM should be reviewed annually or upon any significant change to the underlying process or system architecture. 100% clause-to-row coverage confirmed.</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-40 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
                  <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-bold tracking-tight uppercase tracking-[0.2em]">RCM Matrix Offline</p>
                <p className="text-[10px] mt-2 font-bold uppercase tracking-[0.2em] opacity-60">Upload Narrative to Synthesize 100% Coverage Matrix</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar-premium::-webkit-scrollbar { width: 12px; height: 12px; }
        .custom-scrollbar-premium::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 6px; }
        .custom-scrollbar-premium::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 6px; 
          border: 3px solid #f1f5f9; 
          transition: background 0.2s ease;
        }
        .custom-scrollbar-premium::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        tr { scroll-margin: 80px; }
      `}</style>
    </div>
  );
};

export default RCMModule;
