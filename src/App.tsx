import React, { useState } from 'react';
import { NavPage, Signal, SystemNotification } from './types';
import { mockSignals, mockNotifications } from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { RadarChartComponent } from './components/RadarChartComponent';
import { TopSignals } from './components/TopSignals';
import { RecentSignalsTable } from './components/RecentSignalsTable';
import { SignalDetailModal } from './components/SignalDetailModal';
import { AIWorkflowDiagram } from './components/AIWorkflowDiagram';
import { CategoryView } from './components/CategoryView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<NavPage>('home');
  const [therapeuticArea, setTherapeuticArea] = useState('Haemophilia A & B');
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [signals, setSignals] = useState<Signal[]>(mockSignals);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>(mockNotifications);

  // Toggle bookmark for a signal
  const handleToggleBookmark = (id: string) => {
    setSignals(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, isBookmarked: !s.isBookmarked };
      }
      return s;
    }));
    if (selectedSignal && selectedSignal.id === id) {
      setSelectedSignal(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
    }
  };

  // Handle notification click -> open modal
  const handleNotificationClick = (signalId?: string) => {
    if (signalId) {
      const sig = signals.find(s => s.id === signalId);
      if (sig) setSelectedSignal(sig);
    }
    // Mark as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Filter signals by search query or therapeutic area
  const getFilteredSignals = () => {
    return signals.filter(s => {
      // Therapeutic Area filter
      if (therapeuticArea === 'Haemophilia A' && s.haemophiliaType !== 'A') return false;
      if (therapeuticArea === 'Haemophilia B' && s.haemophiliaType !== 'B') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const headlineMatch = s.headline.toLowerCase().includes(q);
        const summaryMatch = s.summary.toLowerCase().includes(q);
        const sourceMatch = s.source.toLowerCase().includes(q);
        if (!headlineMatch && !summaryMatch && !sourceMatch) return false;
      }

      return true;
    });
  };

  const currentFilteredSignals = getFilteredSignals();
  const criticalCount = signals.filter(s => s.priority === 'Critical').length;

  // Title for Header based on active page
  const getPageTitle = () => {
    switch (activePage) {
      case 'home': return 'Intelligence Dashboard';
      case 'feed': return 'Signal Feed';
      case 'radar': return 'Market Evolution Radar';
      case 'clinical': return 'Clinical Trials Intelligence';
      case 'regulatory': return 'Regulatory Actions & Approvals';
      case 'safety': return 'Safety & Pharmacovigilance Alerts';
      case 'publications': return 'Scientific Publications & Congresses';
      case 'access': return 'Market Access & Pricing Data';
      case 'companies': return 'Competitive Industry Intelligence';
      case 'reports': return 'Executive Briefings & Reports';
      case 'settings': return 'System Settings & Data Sources';
      default: return 'Haemophilia Intelligence Radar';
    }
  };

  return (
    <div className="app-container">
      {/* Left Sidebar (Dark Navy, always visible) */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        newCriticalCount={criticalCount}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header Bar */}
        <Header 
          pageTitle={getPageTitle()}
          therapeuticArea={therapeuticArea}
          setTherapeuticArea={setTherapeuticArea}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />

        {/* Dynamic Page Views */}
        <main className="content-area">
          {/* 1. Home Dashboard Page */}
          {activePage === 'home' && (
            <div>
              {/* 4 KPI Cards */}
              <KPICards 
                signals={currentFilteredSignals}
                onFilterClick={(p, s) => {
                  setActivePage('feed');
                }}
              />

              {/* Two Column Row: Radar Chart + Top Prioritized Signals */}
              <div className="dashboard-grid">
                <RadarChartComponent />
                <TopSignals 
                  signals={currentFilteredSignals}
                  onSelectSignal={(sig) => setSelectedSignal(sig)}
                  onNavigateFeed={() => setActivePage('feed')}
                />
              </div>

              {/* Recent Signals Table */}
              <RecentSignalsTable 
                signals={currentFilteredSignals}
                onSelectSignal={(sig) => setSelectedSignal(sig)}
                limit={5}
              />

              {/* 6-Step AI Workflow Diagram */}
              <AIWorkflowDiagram />
            </div>
          )}

          {/* 2. Signal Feed Page */}
          {activePage === 'feed' && (
            <CategoryView 
              title="Full Signal Feed"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
            />
          )}

          {/* 3. Category Filtered Views */}
          {activePage === 'radar' && (
            <div>
              <div className="card" style={{ marginBottom: '20px' }}>
                <RadarChartComponent />
              </div>
              <CategoryView 
                title="Market Radar Signals"
                signals={currentFilteredSignals}
                onSelectSignal={(sig) => setSelectedSignal(sig)}
              />
            </div>
          )}

          {activePage === 'clinical' && (
            <CategoryView 
              title="Clinical Trials Intelligence"
              categoryFilter="Clinical"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
            />
          )}

          {activePage === 'regulatory' && (
            <CategoryView 
              title="Regulatory Records & Filings"
              categoryFilter="Regulatory"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
            />
          )}

          {activePage === 'safety' && (
            <CategoryView 
              title="Safety & Pharmacovigilance Data"
              categoryFilter="Safety"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
            />
          )}

          {activePage === 'publications' && (
            <CategoryView 
              title="Publications & Congress Abstracts"
              categoryFilter="Clinical"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
            />
          )}

          {activePage === 'access' && (
            <CategoryView 
              title="Market Access & Reimbursement"
              categoryFilter="Market"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
            />
          )}

          {activePage === 'companies' && (
            <CategoryView 
              title="Competitive & Company Pipeline Moves"
              categoryFilter="Market"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
            />
          )}

          {/* 4. Reports Page */}
          {activePage === 'reports' && (
            <ReportsView signals={currentFilteredSignals} />
          )}

          {/* 5. Settings Page */}
          {activePage === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Signal Detail Modal Overlay (Opens when signal is clicked from anywhere) */}
      <SignalDetailModal 
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
};

export default App;
