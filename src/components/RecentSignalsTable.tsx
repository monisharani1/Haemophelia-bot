import React from 'react';
import { Signal, RelevantFunction } from '../types';
import { ExternalLink, Bookmark, CheckCircle, ChevronRight, Eye } from 'lucide-react';
import { LiveRecordIdBadge } from './LiveRecordIdBadge';

interface RecentSignalsTableProps {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  onSelectFunctionalUnit?: (signal: Signal, unit: RelevantFunction) => void;
  title?: string;
  limit?: number;
}

export const RecentSignalsTable: React.FC<RecentSignalsTableProps> = ({
  signals,
  onSelectSignal,
  onSelectFunctionalUnit,
  title = "Recent Signals Feed",
  limit
}) => {
  const displaySignals = limit ? signals.slice(0, limit) : signals;

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
    <div className="card">
      <div className="card-title">
        <span>{title}</span>
        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
          Showing {displaySignals.length} items
        </span>
      </div>

      <div className="signals-table-wrapper">
        <table className="signals-table">
          <thead>
            <tr>
              <th style={{ width: '32%' }}>Signal & Source</th>
              <th style={{ width: '12%' }}>Category</th>
              <th style={{ width: '32%' }}>Why It Matters</th>
              <th style={{ width: '12%' }}>Priority & Score</th>
              <th style={{ width: '12%' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {displaySignals.map((sig) => (
              <tr key={sig.id} onClick={() => onSelectSignal(sig)}>
                <td>
                  <div className="table-headline">{sig.headline}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600 }}>{sig.source}</span>
                    <LiveRecordIdBadge signal={sig} compact />
                  </div>
                </td>
                <td>
                  <span className={`cat-badge ${getCategoryClass(sig.category)}`}>
                    {sig.category}
                  </span>
                </td>
                <td>
                  <div className="table-why-it-matters">
                    {sig.whyItMatters}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {sig.relevantFunctions.slice(0, 3).map((fn, idx) => (
                      <span 
                        key={idx} 
                        className="function-chip" 
                        style={{ fontSize: '10px', padding: '1px 6px', cursor: onSelectFunctionalUnit ? 'pointer' : 'default' }}
                        onClick={(e) => {
                          if (onSelectFunctionalUnit) {
                            e.stopPropagation();
                            onSelectFunctionalUnit(sig, fn);
                          }
                        }}
                        title={`View ${fn} AI breakdown`}
                      >
                        {fn}
                      </span>
                    ))}
                    {sig.relevantFunctions.length > 3 && (
                      <span className="function-chip" style={{ fontSize: '10px', padding: '1px 6px' }}>
                        +{sig.relevantFunctions.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className={`badge ${getPriorityBadgeClass(sig.priority)}`}>
                      {sig.priority}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: sig.impactScore >= 90 ? '#DC2626' : sig.impactScore >= 80 ? '#F59E0B' : '#2E5FDB' }}>
                      {sig.impactScore}/100 Impact
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                    {sig.date}
                  </div>
                  <button 
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '2px 8px', marginTop: '6px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSignal(sig);
                    }}
                  >
                    View Detail <Eye size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
