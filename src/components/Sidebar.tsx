import React from 'react';
import { NavPage } from '../types';
import { 
  Home, 
  Rss, 
  Radar, 
  FlaskConical, 
  FileText, 
  ShieldAlert, 
  BookOpen, 
  TrendingUp, 
  Building2, 
  FileBarChart, 
  Settings, 
  Activity
} from 'lucide-react';

interface SidebarProps {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  newCriticalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activePage, 
  setActivePage,
  newCriticalCount 
}) => {
  const navItems: { id: NavPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'feed', label: 'Signal Feed', icon: <Rss size={18} />, badge: newCriticalCount },
    { id: 'radar', label: 'Market Radar', icon: <Radar size={18} /> },
    { id: 'clinical', label: 'Clinical Trials', icon: <FlaskConical size={18} /> },
    { id: 'regulatory', label: 'Regulatory', icon: <FileText size={18} /> },
    { id: 'safety', label: 'Safety', icon: <ShieldAlert size={18} /> },
    { id: 'publications', label: 'Publications', icon: <BookOpen size={18} /> },
    { id: 'access', label: 'Market Access', icon: <TrendingUp size={18} /> },
    { id: 'companies', label: 'Companies', icon: <Building2 size={18} /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Activity size={22} />
        </div>
        <div className="sidebar-brand">
          <span className="sidebar-title">Haemophilia Radar</span>
          <span className="sidebar-tagline">Intelligence & Strategy</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Core Navigation</div>
        {navItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge ? <span className="nav-item-badge">{item.badge}</span> : null}
          </button>
        ))}

        <div className="nav-section-title">Therapeutic Domains</div>
        {navItems.slice(3, 9).map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <div className="nav-section-title">Executive Tools</div>
        {navItems.slice(9).map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
