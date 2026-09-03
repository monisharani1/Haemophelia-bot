import React, { useState, useEffect } from 'react';
import { Signal, RelevantFunction, FunctionalUnitAnalysis } from '../types';
import { generateFunctionalUnitBreakdown } from '../services/aiService';
import { LiveRecordIdBadge } from './LiveRecordIdBadge';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  Users, 
  Zap, 
  Briefcase, 
  FileCheck, 
  DollarSign, 
  FlaskConical, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface FunctionalUnitBreakdownViewProps {
  signal: Signal;
  selectedUnit: RelevantFunction;
  onNavigateBack: () => void;
  onSelectUnit: (unit: RelevantFunction) => void;
}

export const FunctionalUnitBreakdownView: React.FC<FunctionalUnitBreakdownViewProps> = ({
  signal,
  selectedUnit,
  onNavigateBack,
  onSelectUnit
}) => {
  const [analysis, setAnalysis] = useState<FunctionalUnitAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const allUnits: RelevantFunction[] = [
    'R&D',
    'Medical Affairs',
    'Commercial',
    'Market Access',
    'Regulatory',
    'Safety',
    'Leadership'
  ];

  const fetchAnalysis = async (unit: RelevantFunction) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateFunctionalUnitBreakdown(signal, unit);
      setAnalysis(data);
    } catch (err: any) {
      console.error('Failed to generate functional unit breakdown:', err);
      setError("Couldn't generate insights — please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(selectedUnit);
    setCompletedActions({});
  }, [signal.id, selectedUnit]);

  const toggleActionItem = (idx: number) => {
    setCompletedActions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const getUnitIcon = (u: RelevantFunction) => {
    switch (u) {
      case 'R&D': return <FlaskConical size={16} />;
      case 'Medical Affairs': return <Users size={16} />;
      case 'Commercial': return <Briefcase size={16} />;
      case 'Market Access': return <DollarSign size={16} />;
      case 'Regulatory': return <FileCheck size={16} />;
      case 'Safety': return <ShieldCheck size={16} />;
      case 'Leadership': return <Target size={16} />;
      default: return <Layers size={16} />;
    }
  };

  return (
    <div className="functional-breakdown-container">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="breakdown-nav-bar">
        <button className="back-button" onClick={onNavigateBack}>
          <ArrowLeft size={16} />
          <span>Back to Signals & Intelligence</span>
        </button>

        <div className="breakdown-breadcrumb">
          <span>Signal #{signal.id}</span>
          <ChevronRight size={13} color="#94A3B8" />
          <span>Dedicated Strategic Breakdown</span>
          <ChevronRight size={13} color="#94A3B8" />
          <strong style={{ color: '#2E5FDB' }}>{selectedUnit}</strong>
        </div>
      </div>

      {/* Signal Summary Anchor Card */}
      <div className="card breakdown-signal-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className={`cat-badge cat-${signal.category.toLowerCase()}`}>
                {signal.category} Signal
              </span>
              <span className={`badge badge-${signal.priority.toLowerCase()}`}>
                {signal.priority} Priority
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                Haemophilia Type {signal.haemophiliaType}
              </span>
            </div>
            <h1 className="breakdown-article-title">{signal.headline}</h1>
          </div>

          {/* Impact Score Box */}
          <div className="breakdown-score-badge">
            <div className="score-num">{signal.impactScore}</div>
            <div className="score-label">Impact Score</div>
          </div>
        </div>

        {/* Metadata & Live Record Badge */}
        <div className="breakdown-signal-meta">
          <span><strong>Source:</strong> {signal.source}</span>
          <span>•</span>
          <span><strong>Date:</strong> {signal.date}</span>
          <span>•</span>
          <LiveRecordIdBadge signal={signal} />
        </div>

        {/* Executive Summary */}
        <div className="breakdown-summary-box">
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
            Clinical & Intelligence Summary
          </div>
          <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
            {signal.summary}
          </p>
        </div>
      </div>

      {/* Functional Unit Selector Bar */}
      <div className="functional-unit-tabs-wrapper">
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users size={14} color="#2E5FDB" />
          <span>Switch Functional Team:</span>
        </div>
        <div className="functional-unit-tabs">
          {allUnits.map(unit => {
            const isActive = unit === selectedUnit;
            const isRelevant = signal.relevantFunctions.includes(unit);
            return (
              <button
                key={unit}
                className={`unit-tab-btn ${isActive ? 'active' : ''} ${isRelevant ? 'highlighted' : ''}`}
                onClick={() => onSelectUnit(unit)}
              >
                {getUnitIcon(unit)}
                <span>{unit}</span>
                {isRelevant && <span className="relevant-dot" title="Flagged as Primary Stakeholder" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main AI Insights Breakdown Area */}
      <div className="breakdown-content-panel">
        
        {/* Banner Header */}
        <div className="ai-breakdown-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ai-sparkle-icon">
              <Sparkles size={18} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Live Strategic AI Assessment for {selectedUnit}
              </h2>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                Generated via Anthropic Claude AI • Tailored to Haemophilia A therapeutic landscape
              </span>
            </div>
          </div>

          <button 
            className="btn-secondary" 
            onClick={() => fetchAnalysis(selectedUnit)}
            disabled={loading}
            style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} className={loading ? 'spin-animation' : ''} />
            <span>Regenerate Insights</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="breakdown-loading-state">
            <div className="pulse-loader">
              <Sparkles size={32} className="spin-animation" color="#2E5FDB" />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '12px' }}>
              Synthesizing Strategic Actions for {selectedUnit}...
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '460px', textAlign: 'center' }}>
              Analyzing clinical endpoints, competitive dynamics, regulatory precedent, and team-specific workflows.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="breakdown-error-card">
            <AlertTriangle size={24} color="#DC2626" />
            <div>
              <h4 style={{ color: '#DC2626', fontWeight: 700, margin: '0 0 4px' }}>AI Generation Error</h4>
              <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 10px' }}>{error}</p>
              <button className="btn-primary" onClick={() => fetchAnalysis(selectedUnit)}>
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Successfully Loaded Analysis */}
        {!loading && !error && analysis && (
          <div className="breakdown-sections-grid">
            
            {/* 1. Why this matters to {Unit} */}
            <div className="breakdown-card relevance-card">
              <div className="breakdown-card-title">
                <Target size={18} color="#2E5FDB" />
                <span>1. Strategic Rationale & Relevance for {selectedUnit}</span>
              </div>
              <p className="relevance-text">
                {analysis.relevance}
              </p>
            </div>

            {/* 2. Concrete Actionable Steps (Interactive Checklist) */}
            <div className="breakdown-card actions-card">
              <div className="breakdown-card-title">
                <Zap size={18} color="#0F9B8E" />
                <span>2. Concrete Tactical Actions ({analysis.concreteActions.length} Key Initiatives)</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
                Specific, non-generic steps ready for immediate execution by the {selectedUnit} team:
              </p>
              <div className="actions-checklist">
                {analysis.concreteActions.map((action, idx) => {
                  const isDone = completedActions[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`action-item ${isDone ? 'completed' : ''}`}
                      onClick={() => toggleActionItem(idx)}
                    >
                      <div className={`action-checkbox ${isDone ? 'checked' : ''}`}>
                        {isDone ? <CheckCircle2 size={16} color="#16A34A" /> : <div className="checkbox-empty" />}
                      </div>
                      <span className="action-text">{action}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Strategic Translation & Cross-Functional Vectors */}
            <div className="breakdown-card translation-card">
              <div className="breakdown-card-title">
                <TrendingUp size={18} color="#7C4DFF" />
                <span>3. Strategic Translation & Next Steps</span>
              </div>
              
              <div className="translation-grid">
                {analysis.strategicTranslation.pipelineDecisions && (
                  <div className="translation-item">
                    <div className="translation-header">
                      <FlaskConical size={14} color="#2E5FDB" />
                      <span>Pipeline & Portfolio Decisions</span>
                    </div>
                    <p>{analysis.strategicTranslation.pipelineDecisions}</p>
                  </div>
                )}

                {analysis.strategicTranslation.researchDirections && (
                  <div className="translation-item">
                    <div className="translation-header">
                      <Layers size={14} color="#0F9B8E" />
                      <span>Recommended Research Directions & RWE</span>
                    </div>
                    <p>{analysis.strategicTranslation.researchDirections}</p>
                  </div>
                )}

                {analysis.strategicTranslation.regulatoryImplications && (
                  <div className="translation-item">
                    <div className="translation-header">
                      <FileCheck size={14} color="#DC2626" />
                      <span>Regulatory Interactions & Labeling</span>
                    </div>
                    <p>{analysis.strategicTranslation.regulatoryImplications}</p>
                  </div>
                )}

                {analysis.strategicTranslation.marketPositioning && (
                  <div className="translation-item">
                    <div className="translation-header">
                      <Briefcase size={14} color="#F59E0B" />
                      <span>Market Positioning & Competitive Defense</span>
                    </div>
                    <p>{analysis.strategicTranslation.marketPositioning}</p>
                  </div>
                )}

                {analysis.strategicTranslation.investmentVectors && (
                  <div className="translation-item">
                    <div className="translation-header">
                      <DollarSign size={14} color="#16A34A" />
                      <span>Resource Allocation & Investment Vectors</span>
                    </div>
                    <p>{analysis.strategicTranslation.investmentVectors}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Executive Key Takeaways */}
            {analysis.keyTakeaways && analysis.keyTakeaways.length > 0 && (
              <div className="breakdown-card takeaways-card">
                <div className="breakdown-card-title">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Executive Key Takeaways</span>
                </div>
                <ul className="takeaways-list">
                  {analysis.keyTakeaways.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
