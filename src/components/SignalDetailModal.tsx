import React from 'react';
import { Signal } from '../types';
import { 
  X, 
  ExternalLink, 
  ArrowDown, 
  Sparkles, 
  ShieldCheck, 
  FileDown, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  Tag, 
  Building, 
  Users, 
  Activity
} from 'lucide-react';

interface SignalDetailModalProps {
  signal: Signal | null;
  onClose: () => void;
  onToggleBookmark?: (id: string) => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({
  signal,
  onClose,
  onToggleBookmark
}) => {
  if (!signal) return null;

  const {
    headline,
    category,
    source,
    sourceUrl,
    date,
    summary,
    whyItMatters,
    priority,
    impactScore,
    scoreBreakdown,
    relevantFunctions,
    haemophiliaType,
    isBookmarked,
    tags
  } = signal;

  const getPriorityBadgeClass = (p: string) => {
    switch (p) {
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

  // Score breakdown configuration items with max weights and colors
  const breakdownItems = [
    { label: 'Source Reliability', value: scoreBreakdown.sourceReliability, max: 20, color: '#0F9B8E' },
    { label: 'Clinical Significance', value: scoreBreakdown.clinicalSignificance, max: 20, color: '#2E5FDB' },
    { label: 'Competitive Relevance', value: scoreBreakdown.competitiveRelevance, max: 20, color: '#7C4DFF' },
    { label: 'Market Relevance', value: scoreBreakdown.marketRelevance, max: 20, color: '#F59E0B' },
    { label: 'Regulatory Significance', value: scoreBreakdown.regulatorySignificance, max: 10, color: '#DC2626' },
    { label: 'Novelty & Innovation', value: scoreBreakdown.novelty, max: 10, color: '#16A34A' },
  ];

  const calculatedSum = breakdownItems.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="signal-detail-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Dark Navy Header Section */}
        <div className="detail-modal-header">
          <button className="close-btn" onClick={onClose} title="Close signal detail">
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className={`cat-badge ${getCategoryClass(category)}`} style={{ padding: '4px 10px', fontSize: '12px' }}>
              {category} Signal
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
              Haemophilia Type {haemophiliaType}
            </span>
          </div>

          <h2 className="detail-headline">{headline}</h2>

          <div className="detail-raw-signal">
            <span>Raw Source: <strong style={{ color: '#F8FAFC' }}>{source}</strong></span>
            <span>•</span>
            <span>Date: {date}</span>
            <span>•</span>
            <a 
              href={sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}
            >
              Verify Source URL <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Down Arrow Transition Element */}
        <div className="transition-arrow-container">
          <div className="transition-arrow-badge" title="AI Extraction & Scoring Pipeline Applied">
            <ArrowDown size={20} />
          </div>
        </div>

        {/* Highlighted Insight Panel (The core "Aha" section) */}
        <div className="insight-panel">
          <div className="insight-panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color="#2E5FDB" />
              <span className={`badge ${getPriorityBadgeClass(priority)}`} style={{ fontSize: '13px', padding: '4px 12px' }}>
                {priority} — Strategic Impact
              </span>
            </div>

            {/* Big Impact Score badge */}
            <div className="impact-score-box">
              <div className="big-score-number" style={{ color: impactScore >= 90 ? '#DC2626' : '#2E5FDB' }}>
                {impactScore}
              </div>
              <div className="score-badge-text">
                <span className="score-badge-label">AI Impact Score</span>
                <span className="score-badge-val" style={{ color: impactScore >= 90 ? '#DC2626' : '#2E5FDB' }}>
                  {impactScore}/100 — {impactScore >= 90 ? 'CRITICAL HIGH IMPACT' : 'HIGH IMPACT'}
                </span>
              </div>
            </div>
          </div>

          {/* Why It Matters Box */}
          <div className="why-it-matters-box">
            <div className="why-it-matters-title">
              <ShieldCheck size={16} color="#0F9B8E" />
              Why It Matters (Executive Signal Summary)
            </div>
            <p className="why-it-matters-text">
              {whyItMatters}
            </p>
          </div>

          {/* Clinical & Structural Summary Detail */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>
              AI Structured Summary
            </div>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.45 }}>
              {summary}
            </p>
          </div>

          {/* Relevant Functions Tag Chips */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} color="#7C4DFF" />
              Relevant Functional Units
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {relevantFunctions.map((fn, idx) => (
                <span key={idx} className="function-chip" style={{ fontSize: '12px', padding: '4px 12px' }}>
                  {fn}
                </span>
              ))}
            </div>
          </div>

          {/* Associated Keyword Tags */}
          {tags && tags.length > 0 && (
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <Tag size={13} color="#94A3B8" />
              {tags.map((t, i) => (
                <span key={i} style={{ fontSize: '11px', color: '#64748B', background: '#E2E8F0', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Score Breakdown Section with Animated Progress Bars */}
        <div className="score-breakdown-section">
          <div className="breakdown-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} color="#0F9B8E" />
              <span>Multi-Factor AI Score Breakdown</span>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              Summed Score: {calculatedSum}/100 Points
            </span>
          </div>

          <div className="breakdown-grid">
            {breakdownItems.map((item, idx) => {
              const percentage = (item.value / item.max) * 100;
              return (
                <div key={idx} className="breakdown-row">
                  <div className="breakdown-label-bar">
                    <span>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700 }}>
                      {item.value} <span style={{ color: '#94A3B8', fontWeight: 400 }}>/ {item.max} pts</span>
                    </span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: item.color
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls Footer */}
        <div style={{
          padding: '16px 28px 24px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC',
          borderBottomLeftRadius: '14px',
          borderBottomRightRadius: '14px'
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-secondary"
              onClick={() => onToggleBookmark && onToggleBookmark(signal.id)}
            >
              <Bookmark size={15} color={isBookmarked ? '#F59E0B' : '#64748B'} fill={isBookmarked ? '#F59E0B' : 'none'} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark Signal'}
            </button>
            <button className="btn-secondary">
              <Share2 size={15} />
              Share Brief
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-primary" onClick={onClose}>
              <CheckCircle2 size={16} />
              Acknowledge & Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
