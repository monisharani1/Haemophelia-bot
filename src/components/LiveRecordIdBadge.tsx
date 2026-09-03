import React from 'react';
import { Signal } from '../types';
import { ExternalLink, Database, BookOpen, FileText, Activity, ShieldAlert, AlertCircle } from 'lucide-react';

interface LiveRecordIdBadgeProps {
  signal: Signal;
  compact?: boolean;
}

export const LiveRecordIdBadge: React.FC<LiveRecordIdBadgeProps> = ({ signal, compact = false }) => {
  const getSourceTypeIcon = () => {
    switch (signal.sourceIdType) {
      case 'NCT':
        return <Activity size={12} color="#0F9B8E" />;
      case 'PMID':
        return <BookOpen size={12} color="#2E5FDB" />;
      case 'FAERS':
        return <Database size={12} color="#F59E0B" />;
      case 'EMA':
        return <FileText size={12} color="#7C4DFF" />;
      case 'VigiBase':
        return <ShieldAlert size={12} color="#DC2626" />;
      case 'DOI':
        return <FileText size={12} color="#0284C7" />;
      default:
        return <ExternalLink size={12} color="#38BDF8" />;
    }
  };

  const getFormattedLabel = (): string => {
    if (!signal.sourceId || signal.sourceId.includes('unverified')) {
      return 'unverified — pending source';
    }
    const id = signal.sourceId;
    switch (signal.sourceIdType) {
      case 'NCT':
        return id.startsWith('NCT') ? id : `NCT${id}`;
      case 'PMID':
        return id.startsWith('PMID') ? id : `PMID: ${id}`;
      case 'FAERS':
        return id.startsWith('Case ID') ? id : `Case ID: ${id}`;
      case 'EMA':
        return id.startsWith('EMA') ? id : `EMA: ${id}`;
      case 'VigiBase':
        return id.startsWith('VigiBase') ? id : `VigiBase: ${id}`;
      case 'DOI':
        return id.startsWith('DOI') ? id : `DOI: ${id}`;
      default:
        return id;
    }
  };

  const isPending = !signal.sourceId || signal.sourceId.includes('unverified');
  const label = getFormattedLabel();

  return (
    <a 
      href={signal.sourceUrl || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`live-record-badge ${isPending ? 'pending' : 'resolved'}`}
      title={isPending ? 'Source identifier pending live verification' : `Verified Source ID: ${label} — Click to inspect origin record`}
      onClick={(e) => {
        if (!signal.sourceUrl || signal.sourceUrl === '#') e.preventDefault();
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {isPending ? <AlertCircle size={12} color="#FBBF24" /> : getSourceTypeIcon()}
        <span className="live-record-text">
          <strong style={{ color: isPending ? '#FBBF24' : '#38BDF8' }}>
            {signal.sourceIdType ? `${signal.sourceIdType}: ` : ''}
          </strong>
          {label}
        </span>
      </div>
      {signal.sourceUrl && signal.sourceUrl !== '#' && (
        <ExternalLink size={11} color="#38BDF8" className="external-indicator" />
      )}
    </a>
  );
};
