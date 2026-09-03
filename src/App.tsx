import React, { useState, useEffect } from 'react';
import { NavPage, Signal, SystemNotification, RelevantFunction, UserSession } from './types';
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
import { FunctionalUnitBreakdownView } from './components/FunctionalUnitBreakdownView';
import { ChatbotWidget } from './components/ChatbotWidget';
import { LandingPage } from './components/LandingPage';
import { Breadcrumbs } from './components/Breadcrumbs';

export const App: React.FC = () => {
  // Authentication session state
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('nova_orbit_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI & Navigation State
  const [activePage, setActivePage] = useState<NavPage>('home');
  const [timeRange, setTimeRange] = useState<string>('Last 7 Days');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);
  
  const [signals, setSignals] = useState<Signal[]>(mockSignals);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>(mockNotifications);

  // Dedicated Functional Unit Full-Page Route State
  const [breakdownSignal, setBreakdownSignal] = useState<Signal | null>(null);
  const [breakdownUnit, setBreakdownUnit] = useState<RelevantFunction>('R&D');

  // Handle Login & Session Persistence
  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('nova_orbit_session', JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save session to localStorage:', e);
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      localStorage.removeItem('nova_orbit_session');
    } catch (e) {
      console.warn('Failed to remove session:', e);
    }
  };

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

  // Navigate to Dedicated Full-Page Functional Unit Breakdown
  const handleSelectFunctionalUnit = (signal: Signal, unit: RelevantFunction) => {
    setBreakdownSignal(signal);
    setBreakdownUnit(unit);
    setSelectedSignal(null);
    setActivePage('functional-breakdown');
  };

  // Filter signals dynamically by Time Range and Search Query
  const getFilteredSignals = () => {
    const now = new Date().getTime();

    return signals.filter(s => {
      // 1. Time Range Filter (Last 24 Hours / Last 7 Days / All)
      if (timeRange === 'Last 24 Hours') {
        const signalTime = new Date(s.date).getTime();
        const diffHours = (now - signalTime) / (1000 * 60 * 60);
        if (diffHours > 24) return false;
      } else if (timeRange === 'Last 7 Days') {
        const signalTime = new Date(s.date).getTime();
        const diffDays = (now - signalTime) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) return false;
      }

      // 2. Bookmarks filter
      if (onlyBookmarks && !s.isBookmarked) {
        return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const headlineMatch = s.headline.toLowerCase().includes(q);
        const summaryMatch = s.summary.toLowerCase().includes(q);
        const whyMatch = s.whyItMatters.toLowerCase().includes(q);
        const sourceMatch = s.source.toLowerCase().includes(q);
        const idMatch = s.sourceId ? s.sourceId.toLowerCase().includes(q) : false;
        const tagMatch = s.tags ? s.tags.some(t => t.toLowerCase().includes(q)) : false;
        if (!headlineMatch && !summaryMatch && !whyMatch && !sourceMatch && !idMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  };

  const currentFilteredSignals = getFilteredSignals();
  const criticalCount = currentFilteredSignals.filter(s => s.priority === 'Critical').length;

  // Title for Header based on active page
  const getPageTitle = () => {
    switch (activePage) {
      case 'home': return 'Nova Orbit Intelligence Dashboard';
      case 'feed': return onlyBookmarks ? 'Saved Papers & Bookmarked Signals' : 'Signal Feed';
      case 'radar': return 'Market Evolution Radar';
      case 'clinical': return 'Clinical Trials Intelligence (NCT)';
      case 'regulatory': return 'Regulatory Actions & Approvals (FDA/EMA)';
      case 'safety': return 'Safety & Pharmacovigilance Alerts';
      case 'publications': return 'Scientific Publications (PubMed & NEJM)';
      case 'access': return 'Market Access & Reimbursement Data';
      case 'companies': return 'Competitive Industry Intelligence';
      case 'reports': return 'Executive Briefings & Reports';
      case 'settings': return 'System Settings & Data Sources';
      case 'functional-breakdown': return `Team Strategic Breakdown: ${breakdownUnit}`;
      default: return 'Nova Orbit Intelligence Platform';
    }
  };

  // If user is not authenticated, render public SaaS landing page with login modal
  if (!userSession) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className={`app-container ${isDarkMode ? 'theme-dark' : 'theme-light'}`} data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Left Sidebar (Collapsible with Nova Orbit Branding) */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={(p) => {
          setOnlyBookmarks(false);
          setActivePage(p);
        }}
        newCriticalCount={criticalCount}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`main-wrapper ${sidebarCollapsed ? 'expanded-wrapper' : ''}`}>
        {/* Top Header Bar & Search Row */}
        <Header 
          pageTitle={getPageTitle()}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          userSession={userSession}
          onLogout={handleLogout}
          onNavigateSettings={() => {
            setOnlyBookmarks(false);
            setActivePage('settings');
          }}
          onFilterBookmarks={() => {
            setOnlyBookmarks(true);
            setActivePage('feed');
          }}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Dynamic Page Views */}
        <main className="content-area">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs 
            activePage={activePage}
            setActivePage={(p) => {
              setOnlyBookmarks(false);
              setActivePage(p);
            }}
            selectedSignal={selectedSignal}
            onClearSelectedSignal={() => setSelectedSignal(null)}
            breakdownUnit={activePage === 'functional-breakdown' ? breakdownUnit : null}
          />

          {/* Active Bookmark Filter Banner */}
          {onlyBookmarks && activePage === 'feed' && (
            <div className="filter-active-banner">
              <span>Showing only <strong>Saved Papers & Bookmarked Signals</strong></span>
              <button className="clear-filter-btn" onClick={() => setOnlyBookmarks(false)}>
                Show All Signals
              </button>
            </div>
          )}

          {/* 1. Dedicated Full-Page Functional Unit AI Breakdown */}
          {activePage === 'functional-breakdown' && (
            <FunctionalUnitBreakdownView
              signal={breakdownSignal || signals[0]}
              selectedUnit={breakdownUnit}
              onNavigateBack={() => setActivePage('home')}
              onSelectUnit={(u) => setBreakdownUnit(u)}
            />
          )}

          {/* 2. Home Dashboard Page */}
          {activePage === 'home' && (
            <div>
              {/* 4 KPI Cards (Dynamically driven by time-range filter) */}
              <KPICards 
                signals={currentFilteredSignals}
                onFilterClick={(p, s) => {
                  setActivePage('feed');
                }}
              />

              {/* Two Column Row: Market Radar Chart + Top Prioritized Signals */}
              <div className="dashboard-grid">
                <RadarChartComponent signals={currentFilteredSignals} />
                <TopSignals 
                  signals={currentFilteredSignals}
                  onSelectSignal={(sig) => setSelectedSignal(sig)}
                  onNavigateFeed={() => setActivePage('feed')}
                />
              </div>

              {/* Recent Signals Table (Dynamically driven by time-range filter) */}
              <RecentSignalsTable 
                signals={currentFilteredSignals}
                onSelectSignal={(sig) => setSelectedSignal(sig)}
                onSelectFunctionalUnit={handleSelectFunctionalUnit}
                limit={5}
              />

              {/* 6-Step AI Workflow Diagram */}
              <AIWorkflowDiagram />
            </div>
          )}

          {/* 3. Signal Feed Page */}
          {activePage === 'feed' && (
            <CategoryView 
              title={onlyBookmarks ? "Saved Papers & Bookmarked Signals" : "Full Signal Feed"}
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onSelectFunctionalUnit={handleSelectFunctionalUnit}
            />
          )}

          {/* 4. Category Filtered Views */}
          {activePage === 'radar' && (
            <div>
              <div className="card" style={{ marginBottom: '20px' }}>
                <RadarChartComponent signals={currentFilteredSignals} />
              </div>
              <CategoryView 
                title="Market Radar Signals"
                signals={currentFilteredSignals}
                onSelectSignal={(sig) => setSelectedSignal(sig)}
                onSelectFunctionalUnit={handleSelectFunctionalUnit}
              />
            </div>
          )}

          {activePage === 'clinical' && (
            <CategoryView 
              title="Clinical Trials Intelligence (NCT Registry)"
              categoryFilter="Clinical"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onSelectFunctionalUnit={handleSelectFunctionalUnit}
            />
          )}

          {activePage === 'regulatory' && (
            <CategoryView 
              title="Regulatory Records & Filings (FDA / EMA)"
              categoryFilter="Regulatory"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onSelectFunctionalUnit={handleSelectFunctionalUnit}
            />
          )}

          {activePage === 'safety' && (
            <CategoryView 
              title="Safety & Pharmacovigilance Data (FAERS / PRAC)"
              categoryFilter="Safety"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onSelectFunctionalUnit={handleSelectFunctionalUnit}
            />
          )}

          {activePage === 'publications' && (
            <CategoryView 
              title="Publications & Congress Abstracts (PubMed & NEJM)"
              categoryFilter="Clinical"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onSelectFunctionalUnit={handleSelectFunctionalUnit}
            />
          )}

          {activePage === 'access' && (
            <CategoryView 
              title="Market Access & Reimbursement (HTA / PBM)"
              categoryFilter="Market"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onSelectFunctionalUnit={handleSelectFunctionalUnit}
            />
          )}

          {activePage === 'companies' && (
            <CategoryView 
              title="Competitive & Company Pipeline Moves"
              categoryFilter="Market"
              signals={currentFilteredSignals}
              onSelectSignal={(sig) => setSelectedSignal(sig)}
              onSelectFunctionalUnit={handleSelectFunctionalUnit}
            />
          )}

          {/* 5. Reports Page */}
          {activePage === 'reports' && (
            <ReportsView signals={currentFilteredSignals} />
          )}

          {/* 6. Settings Page */}
          {activePage === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Signal Detail Modal Overlay */}
      <SignalDetailModal 
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
        onToggleBookmark={handleToggleBookmark}
        onSelectFunctionalUnit={handleSelectFunctionalUnit}
      />

      {/* Floating Pill Chatbot Widget */}
      <ChatbotWidget signals={currentFilteredSignals} />
    </div>
  );
};

export default App;
