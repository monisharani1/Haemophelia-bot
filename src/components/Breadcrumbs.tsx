import React from 'react';
import { NavPage, Signal, RelevantFunction } from '../types';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  selectedSignal?: Signal | null;
  onClearSelectedSignal?: () => void;
  breakdownUnit?: RelevantFunction | null;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  activePage,
  setActivePage,
  selectedSignal,
  onClearSelectedSignal,
  breakdownUnit
}) => {
  const getPageName = (page: NavPage): string => {
    switch (page) {
      case 'home': return 'Dashboard';
      case 'feed': return 'Signal Feed';
      case 'radar': return 'Market Radar';
      case 'clinical': return 'Clinical Trials';
      case 'regulatory': return 'Regulatory Filings';
      case 'safety': return 'Safety Alerts';
      case 'publications': return 'Publications';
      case 'access': return 'Market Access';
      case 'companies': return 'Competitive Landscape';
      case 'reports': return 'Executive Briefings';
      case 'settings': return 'System Settings';
      case 'functional-breakdown': return 'Team Strategic Breakdown';
      default: return 'Intelligence';
    }
  };

  return (
    <nav className="breadcrumbs-container" aria-label="Breadcrumb">
      {/* Root segment */}
      <button 
        className="breadcrumb-segment root-segment"
        onClick={() => {
          if (onClearSelectedSignal) onClearSelectedSignal();
          setActivePage('home');
        }}
        title="Go to Nova Orbit Dashboard"
      >
        <Home size={13} className="breadcrumb-home-icon" />
        <span>Nova Orbit</span>
      </button>

      {/* Page segment */}
      {activePage !== 'home' && (
        <>
          <ChevronRight size={13} className="breadcrumb-separator" />
          <button 
            className={`breadcrumb-segment ${!selectedSignal && activePage !== 'functional-breakdown' ? 'active' : ''}`}
            onClick={() => {
              if (onClearSelectedSignal) onClearSelectedSignal();
              if (activePage === 'functional-breakdown') setActivePage('home');
            }}
          >
            {getPageName(activePage)}
          </button>
        </>
      )}

      {/* Team Breakdown sub-segment */}
      {activePage === 'functional-breakdown' && breakdownUnit && (
        <>
          <ChevronRight size={13} className="breadcrumb-separator" />
          <span className="breadcrumb-segment active">
            {breakdownUnit} Team
          </span>
        </>
      )}

      {/* Active Signal modal / sub-view drilldown */}
      {selectedSignal && (
        <>
          <ChevronRight size={13} className="breadcrumb-separator" />
          <span className="breadcrumb-segment active truncate-breadcrumb" title={selectedSignal.headline}>
            {selectedSignal.sourceIdType ? `${selectedSignal.sourceIdType} ` : ''}Signal: {selectedSignal.headline.slice(0, 42)}...
          </span>
        </>
      )}
    </nav>
  );
};
