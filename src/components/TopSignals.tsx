import React from 'react';
import { Signal, NavPage } from '../types';
import { ChevronRight, ArrowUpRight, Zap } from 'lucide-react';

interface TopSignalsProps {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onNavigateFeed: () => void;
}

export const TopSignals: React.FC<TopSignalsProps> = ({
  signals,
  onSelectSignal,
  onNavigateFeed
}) => {
  // Sort by impact score descending & take top 4
  const topList = [...signals].sort((a, b) => b.impactScore - a.impactScore).slice(0, 4);

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'Clinical': return 'cat-clinical';
      case 'Regulatory': return 'cat-regulatory';
      case 'Safety': return 'cat-safety';
      case 'Market': return 'cat-market';
      default: return 'cat-clinical';
    }
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#DC2626" />
          <span>Top Prioritized Signals</span>
        </div>
        <button 
          className="btn-secondary" 
          style={{ fontSize: '12px', padding: '4px 10px' }}
          onClick={onNavigateFeed}
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div className="top-signals-list" style={{ flex: 1 }}>
        {topList.map((sig, index) => (
          <div 
            key={sig.id} 
            className="top-signal-item"
            onClick={() => onSelectSignal(sig)}
          >
            <div className="signal-num">{index + 1}</div>
            <div style={{ flex: 1 }}>
              <div className="signal-headline">{sig.headline}</div>
              <div className="signal-meta">
                <span className={`cat-badge ${getCategoryClass(sig.category)}`}>
                  {sig.category}
                </span>
                <span className={`badge ${getPriorityBadgeClass(sig.priority)}`}>
                  {sig.priority}
                </span>
                <span style={{ fontWeight: 700, color: sig.impactScore >= 90 ? '#DC2626' : '#2E5FDB' }}>
                  Impact: {sig.impactScore}/100
                </span>
                <span>• {sig.source}</span>
              </div>
            </div>
            <ArrowUpRight size={16} color="#94A3B8" style={{ marginTop: '2px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};
