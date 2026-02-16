
import React from 'react';
import { AuditRating } from '../types';

interface ConclusionPanelProps {
  rating: AuditRating;
  onRatingChange: (val: AuditRating) => void;
  evidence: string;
  onEvidenceChange: (val: string) => void;
  onSignOff: () => void;
  disabled?: boolean;
}

const ConclusionPanel: React.FC<ConclusionPanelProps> = ({
  rating,
  onRatingChange,
  evidence,
  onEvidenceChange,
  onSignOff,
  disabled
}) => {
  const getRatingStyle = (r: AuditRating) => {
    switch (r) {
      case AuditRating.EFFECTIVE: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case AuditRating.GAP_IDENTIFIED: return 'bg-rose-50 text-rose-700 border-rose-100';
      case AuditRating.INCONCLUSIVE: return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 flex flex-col h-full space-y-10 shadow-lg">
      <div className="space-y-1">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Final Verdict</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Sign-off Authority</p>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-60">Rating Classification</label>
        <select
          value={rating}
          onChange={(e) => onRatingChange(e.target.value as AuditRating)}
          className={`w-full p-4 text-xs font-extrabold rounded-2xl border transition-all cursor-pointer focus:ring-4 outline-none shadow-sm ${getRatingStyle(rating)}`}
        >
          <option value={AuditRating.PENDING}>Awaiting Sequence</option>
          <option value={AuditRating.EFFECTIVE}>Effective Control</option>
          <option value={AuditRating.GAP_IDENTIFIED}>Material Gap Identified</option>
          <option value={AuditRating.INCONCLUSIVE}>Inconclusive Data</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col space-y-3">
        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-60">Synthesis Notes</label>
        <textarea
          value={evidence}
          onChange={(e) => onEvidenceChange(e.target.value)}
          placeholder="Synthesize artifacts and final findings..."
          className="flex-1 w-full p-5 text-[12px] text-slate-800 bg-white/40 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none resize-none leading-relaxed shadow-inner transition-all"
        />
      </div>

      <div className="pt-8 border-t border-slate-100/30 space-y-6">
        <div className="flex items-start gap-3 text-[11px] text-slate-500 font-medium">
          <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-[#0052CC] focus:ring-blue-500/20" />
          <p className="leading-snug opacity-70 italic">Attest findings integrity and protocol compliance for this lifecycle segment.</p>
        </div>
        <button
          onClick={onSignOff}
          disabled={disabled || rating === AuditRating.PENDING}
          className={`w-full py-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white rounded-2xl transition-all shadow-xl ${
            disabled || rating === AuditRating.PENDING
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-[#0052CC] hover:bg-blue-700 active:scale-[0.98] shadow-blue-500/20'
          }`}
        >
          Initialize Sign-off
        </button>
      </div>
    </div>
  );
};

export default ConclusionPanel;