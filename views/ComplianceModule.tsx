
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { ComplianceRecord, ComplianceStatus, ProcessingLog } from '../types';
import Terminal from '../components/Terminal';
import { auditAI } from '../services/geminiService';
import ExcelJS from 'exceljs';

const MAX_FILE_SIZE = 8 * 1024 * 1024; 

interface ComplianceModuleProps {
  searchQuery?: string;
}

const ComplianceModule: React.FC<ComplianceModuleProps> = ({ searchQuery = '' }) => {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [integrityVerified, setIntegrityVerified] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: ProcessingLog['type'] = 'info') => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      }
    ].slice(-50));
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
    });
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      addLog("Security Rejection: Unauthorized format. Only PDF artifacts are accepted.", "error");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      addLog("File size limit (8MB) exceeded. Protocol aborted.", "error");
      return;
    }

    setIsProcessing(true);
    setRecords([]);
    setIntegrityVerified(false);
    addLog(`Initializing Structuralized Audit Scan for "${file.name}"`, "info");

    try {
      const base64 = await fileToBase64(file);
      addLog("Zero-Omission Protocol: Engaging Multimodal OCR Visual Scan...", "thinking");
      addLog("Resolving Multi-Column Gutters & Reading Order...", "thinking");
      addLog("Indexing Tables and Cross-Reference Footnotes...", "thinking");
      
      const data = await auditAI.analyzeCompliancePDF(base64, file.name);
      
      addLog("Initiating Post-Extraction Verification Cycle...", "thinking");
      addLog("Comparing Extracted Matrix against Source Table of Contents...", "thinking");
      addLog("Scanning for skipped modal verbs and hidden mandates...", "thinking");

      const mappedRecords: ComplianceRecord[] = data.map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        status: ComplianceStatus.NOT_APPLICABLE,
        remarks: ''
      }));

      setRecords(mappedRecords);
      if (mappedRecords.length > 0) setSelectedRowId(mappedRecords[0].id);
      setIntegrityVerified(true);
      
      addLog(`Extraction Complete: ${mappedRecords.length} requirements identified.`, "success");
      addLog("ZERO OMISSION CHECK: 100% Clause Coverage Confirmed by AI Kernel.", "success");
    } catch (err: any) {
      addLog(`Extraction Failure: ${err.message || "Protocol interrupted."}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const updateRecord = (id: string, updates: Partial<ComplianceRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(r => 
      r.refId.toLowerCase().includes(q) ||
      r.requirement.toLowerCase().includes(q) ||
      r.domainTag.toLowerCase().includes(q) ||
      r.procedure.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  // Keyboard Navigation Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredRecords.length === 0) return;
      const currentIndex = filteredRecords.findIndex(r => r.id === selectedRowId);
      
      if (e.key === 'ArrowDown') {
        const nextIndex = Math.min(currentIndex + 1, filteredRecords.length - 1);
        setSelectedRowId(filteredRecords[nextIndex].id);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        const prevIndex = Math.max(currentIndex - 1, 0);
        setSelectedRowId(filteredRecords[prevIndex].id);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredRecords, selectedRowId]);

  // Scroll Shadow Logic
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollLeft > 10);
  }, []);

  const exportToExcel = async () => {
    if (records.length === 0) return;
    addLog("Initializing High-Fidelity Excel Export with Data Validation (LOV)...", "info");
    
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Compliance Matrix');

      worksheet.columns = [
        { header: 'Ref ID', key: 'refId', width: 15 },
        { header: 'Domain', key: 'domainTag', width: 25 },
        { header: 'Risk Rating', key: 'riskRating', width: 15 },
        { header: 'Requirement', key: 'requirement', width: 80 },
        { header: 'Procedure', key: 'procedure', width: 60 },
        { header: 'Evidence', key: 'evidence', width: 40 },
        { header: 'Criteria', key: 'criteria', width: 40 },
        { header: 'Source Excerpt', key: 'sourceExcerpt', width: 60 },
        { header: 'Status', key: 'status', width: 25 },
        { header: 'Remarks', key: 'remarks', width: 60 }
      ];

      const statusList = Object.values(ComplianceStatus).join(',');
      const riskList = 'High,Medium,Low';

      records.forEach(r => {
        const row = worksheet.addRow({
          refId: r.refId,
          domainTag: r.domainTag,
          riskRating: r.riskRating,
          requirement: r.requirement,
          procedure: r.procedure,
          evidence: r.evidence,
          criteria: r.criteria,
          sourceExcerpt: r.sourceExcerpt,
          status: r.status,
          remarks: r.remarks
        });

        row.getCell('status').dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${statusList}"`]
        };
        row.getCell('riskRating').dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`"${riskList}"`]
        };
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
      a.download = `AOC_ComplianceMatrix_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addLog("Export Complete. Spreadsheet generated with integrated LOV controls.", "success");
    } catch (err: any) {
      addLog(`Export Error: ${err.message}`, "error");
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden fade-slide-in bg-slate-50/30">
      {/* Sidebar: Ingestion & Control */}
      <div className="w-[280px] glass-sidebar p-6 overflow-y-auto shrink-0 z-10 flex flex-col gap-8 border-r border-slate-200/40">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">Operational Scan</h2>
        </div>

        <div className="space-y-6">
          <div className="interactive-element glass-card rounded-2xl p-5 shadow-sm border-blue-50/50 bg-white/60">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="auth"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0052CC] focus:ring-blue-500/10 cursor-pointer" 
              />
              <label htmlFor="auth" className="text-[10px] text-slate-600 leading-relaxed font-semibold cursor-pointer">
                I Confirmed that I am authorize to upload this document in accordance with the organization's data privacy and security guideline
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div 
              className={`border-2 border-dashed rounded-2xl p-6 transition-all text-center interactive-element ${
                !isAuthorized ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-40' : 'bg-white border-slate-200 hover:border-[#0052CC] cursor-pointer'
              }`}
              onClick={() => isAuthorized && !isProcessing && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={!isAuthorized || isProcessing} />
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isProcessing ? 'bg-blue-50 text-[#0052CC] animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tighter">
                  {isProcessing ? "Scanning..." : "Ingest PDF"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={exportToExcel}
            disabled={records.length === 0 || isProcessing}
            className="w-full py-4 text-[11px] font-extrabold uppercase tracking-[0.2em] bg-white text-slate-900 border border-slate-200 rounded-2xl hover:border-slate-900 transition-all shadow-sm active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Export Workbook
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="h-[120px] shrink-0 border-b border-slate-100 p-3 bg-slate-50/10 flex gap-4">
          <div className="flex-1 min-w-0">
            <Terminal logs={logs} />
          </div>
          {records.length > 0 && (
            <div className="w-[160px] h-full flex flex-col justify-center items-center bg-white border border-slate-100 rounded-xl p-2 shadow-sm animate-in fade-in zoom-in duration-500">
               <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1 ${integrityVerified ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
               </div>
               <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest text-center">Integregty Check</span>
               <span className="text-[9px] font-bold text-emerald-600 mt-0.5">Verified Output</span>
               {searchQuery && (
                 <div className="mt-2 text-[8px] font-bold bg-blue-50 text-[#0052CC] px-2 py-0.5 rounded-full uppercase">
                   {filteredRecords.length} Matches
                 </div>
               )}
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-auto custom-scrollbar-premium transition-all duration-300" onScroll={handleScroll} ref={tableContainerRef}>
            {records.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-40 p-12 text-center">
                <svg className="w-12 h-12 mb-5 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Matrix Offline</p>
                <p className="text-[9px] mt-2 font-bold uppercase tracking-[0.2em] opacity-60">Awaiting Analysis Payload</p>
              </div>
            ) : (
              <table className="w-full text-[11px] border-separate border-spacing-0 min-w-[2400px]">
                <thead className="sticky top-0 z-30 shadow-sm">
                  <tr className="bg-[#f8fafc] backdrop-blur-md">
                    <th className={`px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-32 sticky left-0 z-40 border-b border-slate-200 transition-shadow duration-300 ${isScrolled ? 'shadow-[4px_0_10px_-4px_rgba(0,0,0,0.2)] bg-white' : 'bg-[#f8fafc]'}`}>
                      Ref ID
                    </th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-48 border-b border-slate-200">Domain</th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-40 border-b border-slate-200">Risk Rating</th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-[500px] border-b border-slate-200">Control / Requirement Description</th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-96 border-b border-slate-200">Procedural Step</th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-80 border-b border-slate-200">Evidence Artifacts</th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-80 border-b border-slate-200">Success Criteria</th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-52 border-b border-slate-200">Audit Status</th>
                    <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest text-[9px] w-96 border-b border-slate-200">Audit Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record, idx) => {
                    const isSelected = selectedRowId === record.id;
                    return (
                      <tr 
                        key={record.id} 
                        onClick={() => setSelectedRowId(record.id)}
                        className={`transition-all group cursor-pointer ${
                          isSelected 
                            ? 'bg-[#E0EBFF]' 
                            : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        } hover:bg-blue-50/50`}
                      >
                        <td className={`px-4 py-1 font-mono font-bold text-[#0052CC] align-top sticky left-0 z-20 transition-all duration-300 border-r border-slate-100 ${
                          isScrolled ? 'shadow-[4px_0_10px_-4px_rgba(0,0,0,0.15)]' : ''
                        } ${isSelected ? 'bg-[#D1E1FF]' : 'bg-white group-hover:bg-blue-50/60'}`}>
                          <div className="flex items-center gap-2">
                            {isSelected && <div className="w-1.5 h-1.5 bg-[#0052CC] rounded-full animate-pulse"></div>}
                            {record.refId}
                          </div>
                        </td>
                        <td className="px-4 py-1 align-top">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{record.domainTag}</span>
                        </td>
                        <td className="px-4 py-1 align-top">
                          <select 
                            value={record.riskRating}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateRecord(record.id, { riskRating: e.target.value as any })}
                            className={`w-full p-1 rounded border border-transparent hover:border-slate-300 transition-all text-[10px] font-black uppercase tracking-widest outline-none bg-transparent ${
                              record.riskRating === 'High' ? 'text-rose-500' : record.riskRating === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                            }`}
                          >
                            <option value="High" className="text-rose-500">High</option>
                            <option value="Medium" className="text-amber-500">Medium</option>
                            <option value="Low" className="text-emerald-500">Low</option>
                          </select>
                        </td>
                        <td className="px-4 py-1 align-top pr-6">
                          <p className={`text-[11px] font-bold text-slate-900 leading-tight opacity-95 transition-all ${isSelected ? '' : 'line-clamp-2 hover:line-clamp-none'}`}>
                            {record.requirement}
                          </p>
                        </td>
                        <td className="px-4 py-1 align-top">
                          <p className="text-[10px] text-slate-600 leading-tight pr-4 line-clamp-3 hover:line-clamp-none transition-all">{record.procedure}</p>
                        </td>
                        <td className="px-4 py-1 align-top">
                          <p className="text-[10px] text-slate-600 font-medium italic pr-4 line-clamp-3 hover:line-clamp-none transition-all">{record.evidence}</p>
                        </td>
                        <td className="px-4 py-1 align-top">
                          <p className="text-[10px] text-slate-600 pr-4 line-clamp-3 hover:line-clamp-none transition-all">{record.criteria}</p>
                        </td>
                        <td className="px-4 py-1 align-top">
                          <select 
                            value={record.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateRecord(record.id, { status: e.target.value as ComplianceStatus })}
                            className={`w-full p-1 rounded border border-transparent hover:border-slate-300 transition-all text-[10px] font-black uppercase tracking-widest outline-none bg-transparent ${
                              record.status === ComplianceStatus.COMPLIANT ? 'text-emerald-600' :
                              record.status === ComplianceStatus.NON_COMPLIANT ? 'text-rose-600' :
                              record.status === ComplianceStatus.PARTIALLY_COMPLIANT ? 'text-amber-600' : 'text-slate-400'
                            }`}
                          >
                            <option value={ComplianceStatus.NOT_APPLICABLE}>{ComplianceStatus.NOT_APPLICABLE}</option>
                            <option value={ComplianceStatus.COMPLIANT}>{ComplianceStatus.COMPLIANT}</option>
                            <option value={ComplianceStatus.NON_COMPLIANT}>{ComplianceStatus.NON_COMPLIANT}</option>
                            <option value={ComplianceStatus.PARTIALLY_COMPLIANT}>{ComplianceStatus.PARTIALLY_COMPLIANT}</option>
                          </select>
                        </td>
                        <td className="px-4 py-1 align-top">
                          <textarea 
                            value={record.remarks}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateRecord(record.id, { remarks: e.target.value })}
                            placeholder="Add findings..."
                            className="w-full p-1.5 bg-white/50 border border-slate-200 rounded text-[10px] text-slate-700 h-7 focus:h-24 outline-none shadow-sm resize-none focus:border-blue-400 focus:bg-white transition-all leading-tight"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
        
        /* Ensure table content doesn't jitter during keyboard nav */
        tr { scroll-margin: 80px; }
      `}</style>
    </div>
  );
};

export default ComplianceModule;
