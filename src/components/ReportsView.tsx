import React, { useState } from 'react';
import { Signal } from '../types';
import { FileBarChart, Download, Check, Printer, Share2, Sparkles } from 'lucide-react';

interface ReportsViewProps {
  signals: Signal[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ signals }) => {
  const [downloaded, setDownloaded] = useState(false);

  const criticalSignals = signals.filter(s => s.priority === 'Critical');
  const highSignals = signals.filter(s => s.priority === 'High');

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1E293B 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileBarChart size={22} color="#0F9B8E" />
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Executive Intelligence Briefing & Reports</h2>
            </div>
            <p style={{ fontSize: '13.5px', color: '#CBD5E1', maxWidth: '600px' }}>
              Automated multi-source synthesis compiled for Medical Affairs, Regulatory, & Leadership decision-makers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-primary"
              onClick={handleDownload}
              style={{ backgroundColor: '#0F9B8E' }}
            >
              {downloaded ? <Check size={16} /> : <Download size={16} />}
              {downloaded ? 'Briefing Downloaded!' : 'Export PDF Briefing'}
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Overview */}
      <div className="card">
        <h3 className="card-title">Weekly Intelligence Summary (Period Ending Aug 2026)</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', backgroundColor: '#FEF2F2', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>CRITICAL DEVELOPMENTS</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#DC2626', margin: '4px 0' }}>{criticalSignals.length}</div>
            <div style={{ fontSize: '12px', color: '#7F1D1D' }}>ISTH 2026 Bispecific Data & FDA Priority Review</div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #FCD34D' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>HIGH STRATEGIC IMPACT</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', margin: '4px 0' }}>{highSignals.length}</div>
            <div style={{ fontSize: '12px', color: '#78350F' }}>Safety Signals & HTA Reimbursement Coverage</div>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#F0F9FF', borderRadius: '8px', border: '1px solid #7DD3FC' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#075985' }}>SOURCES MONITORING</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0284C7', margin: '4px 0' }}>15+</div>
            <div style={{ fontSize: '12px', color: '#0C4A6E' }}>FDA, EMA, WHO VigiBase, ClinicalTrials.gov, PubMed</div>
          </div>
        </div>

        {/* Executive Summary Preview */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={18} color="#2E5FDB" />
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Key Takeaways for Medical Affairs & Leadership</h4>
          </div>

          <ol style={{ paddingLeft: '20px', fontSize: '13.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <strong>ISTH 2026 Bispecific Breakthrough:</strong> Long-acting subcutaneously administered bispecific antibody Phase 3 data showed 88% zero bleed rates, creating urgent competitive positioning needs.
            </li>
            <li>
              <strong>AAV5 Gene Therapy Label Expansion:</strong> FDA granted Priority Review for antibody-positive Haemophilia B patients, potentially expanding market addressability by 35%.
            </li>
            <li>
              <strong>EMA Safety Signal Monitor:</strong> Safety bulletin issued regarding transient TMA during high-dose aPCC co-administration; updated clinical guidance required.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
