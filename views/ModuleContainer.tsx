import React, { useState, useEffect, useCallback } from 'react';
import { ModuleID, AuditRating, ProcessingLog } from '../types';
import { MODULES } from '../constants';
import Terminal from '../components/Terminal';
import ConclusionPanel from '../components/ConclusionPanel';
import ComplianceModule from './ComplianceModule';
import GapAnalysisModule from './GapAnalysisModule';
import SamplingModule from './SamplingModule';
import TrendAnalysisModule from './TrendAnalysisModule';
import RCMModule from './RCMModule';

interface ModuleContainerProps {
  moduleID: ModuleID;
  searchQuery?: string;
}

const ModuleContainer: React.FC<ModuleContainerProps> = ({ moduleID, searchQuery = '' }) => {
  const [logs, setLogs] = useState<ProcessingLog[]>([]);
  const [rating, setRating] = useState<AuditRating>(AuditRating.PENDING);
  const [evidence, setEvidence] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Module Redirection
  if (moduleID === 'compliance') return <ComplianceModule searchQuery={searchQuery} />;
  if (moduleID === 'gap-analysis') return <GapAnalysisModule />;
  if (moduleID === 'sampling') return <SamplingModule />;
  if (moduleID === 'trend') return <TrendAnalysisModule />;
  if (moduleID === 'rcm') return <RCMModule />;

  const activeModule = MODULES.find(m => m.id === moduleID);

  const addLog = useCallback((message: string, type: ProcessingLog['type'] = 'info') => {
    setLogs(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      }
    ]);
  }, []);

  // Clear state when module changes
  useEffect(() => {
    setLogs([]);
    setRating(AuditRating.PENDING);
    setEvidence('');
    setUploadedFile(null);
    setIsProcessing(false);
  }, [moduleID]);

  const simulateProcessing = async (file: File) => {
    setIsProcessing(true);
    addLog(`System initialized for ${activeModule?.title}`, 'info');
    addLog(`File received: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'success');
    
    const steps = [
      "Extracting raw data from artifacts...",
      "Mapping variables to control framework...",
      "Executing statistical sampling algorithms...",
      "Identifying population outliers...",
      "Comparing findings with historical audit trends...",
      "Finalizing risk-weighted confidence scoring..."
    ];

    for (const step of steps) {
      addLog(step, 'thinking');
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    }

    addLog("Analysis complete. AI model suggests: 'EFFECTIVE' with 94.2% confidence.", 'success');
    setRating(AuditRating.EFFECTIVE);
    setEvidence(`AI analysis of ${file.name} suggests that the controls are operating within acceptable parameters. No critical outliers detected in the provided dataset.`);
    setIsProcessing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      simulateProcessing(file);
    }
  };

  return (
    <div className="h-[calc(100vh-56px)] flex overflow-hidden">
      {/* Fallback view for unimplemented modules */}
      <div className="w-[30%] border-r border-gray-200 bg-white p-6 overflow-y-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900">{activeModule?.title}</h2>
          <p className="text-xs text-gray-500 leading-relaxed">{activeModule?.description}</p>
        </div>

        <div className="space-y-4">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Asset Input</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 transition-colors hover:border-[#0052CC] bg-gray-50 group">
            <input 
              type="file" 
              className="hidden" 
              id="file-upload" 
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Drop files here</span>
              <span className="text-xs text-gray-400 mt-1">Supported: .xlsx, .pdf, .docx</span>
            </label>
          </div>
        </div>
      </div>

      <div className="w-[45%] bg-[#F9FAFB] p-6">
        <Terminal logs={logs} />
      </div>

      <div className="w-[25%] bg-[#F9FAFB] p-6">
        <ConclusionPanel 
          rating={rating}
          onRatingChange={setRating}
          evidence={evidence}
          onEvidenceChange={setEvidence}
          onSignOff={() => alert('Assessment Signed Off Successfully!')}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default ModuleContainer;