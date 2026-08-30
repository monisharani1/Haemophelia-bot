import React from 'react';
import { AlertTriangle, AlertCircle, Eye, CheckCircle2 } from 'lucide-react';
import { Signal } from '../types';

interface KPICardsProps {
  signals: Signal[];
  onFilterClick?: (priority?: string, status?: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ signals, onFilterClick }) => {
  const criticalCount = signals.filter(s => s.priority === 'Critical').length;
  const highCount = signals.filter(s => s.priority === 'High').length;
  const underReviewCount = signals.filter(s => s.status === 'Under Review').length;
  const actionSuggestedCount = signals.filter(s => s.relevantFunctions.includes('Medical Affairs') || s.relevantFunctions.includes('Regulatory')).length;

  return (
    <div className="kpi-grid">
      {/* 1. New Critical Signals */}
      <div 
        className="kpi-card red" 
        onClick={() => onFilterClick && onFilterClick('Critical')}
        style={{ cursor: 'pointer' }}
      >
        <div className="kpi-header">
          <span className="kpi-label">New Critical Signals</span>
          <div className="kpi-icon-wrapper">
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="kpi-number">{criticalCount}</div>
        <div className="kpi-footer">
          <span className="trend-up" style={{ color: '#DC2626' }}>↑ +2</span>
          <span>vs previous 7 days</span>
        </div>
      </div>

      {/* 2. High Priority Signals */}
      <div 
        className="kpi-card orange"
        onClick={() => onFilterClick && onFilterClick('High')}
        style={{ cursor: 'pointer' }}
      >
        <div className="kpi-header">
          <span className="kpi-label">High Priority Signals</span>
          <div className="kpi-icon-wrapper">
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="kpi-number">{highCount}</div>
        <div className="kpi-footer">
          <span className="trend-up" style={{ color: '#F59E0B' }}>↑ +4</span>
          <span>requires evaluation</span>
        </div>
      </div>

      {/* 3. Under Review */}
      <div 
        className="kpi-card blue"
        onClick={() => onFilterClick && onFilterClick(undefined, 'Under Review')}
        style={{ cursor: 'pointer' }}
      >
        <div className="kpi-header">
          <span className="kpi-label">Under Review</span>
          <div className="kpi-icon-wrapper">
            <Eye size={18} />
          </div>
        </div>
        <div className="kpi-number">{underReviewCount}</div>
        <div className="kpi-footer">
          <span className="trend-up" style={{ color: '#2E5FDB' }}>Active</span>
          <span>assigned to functional leads</span>
        </div>
      </div>

      {/* 4. Actions Suggested */}
      <div 
        className="kpi-card green"
        onClick={() => onFilterClick && onFilterClick()}
        style={{ cursor: 'pointer' }}
      >
        <div className="kpi-header">
          <span className="kpi-label">Actions Suggested</span>
          <div className="kpi-icon-wrapper">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="kpi-number">{actionSuggestedCount}</div>
        <div className="kpi-footer">
          <span className="trend-up" style={{ color: '#16A34A' }}>Recommended</span>
          <span>cross-functional briefs ready</span>
        </div>
      </div>
    </div>
  );
};
