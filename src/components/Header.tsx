import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Search, 
  Sun, 
  Moon, 
  Bookmark, 
  Settings, 
  Sliders, 
  HelpCircle, 
  LogOut, 
  User, 
  Check,
  ChevronDown
} from 'lucide-react';
import { SystemNotification, UserSession, NavPage } from '../types';
import { LiveClock } from './LiveClock';

interface HeaderProps {
  pageTitle: string;
  timeRange: string;
  setTimeRange: (range: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: SystemNotification[];
  onNotificationClick: (signalId?: string) => void;
  userSession?: UserSession | null;
  onLogout: () => void;
  onNavigateSettings: () => void;
  onFilterBookmarks?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  timeRange,
  setTimeRange,
  searchQuery,
  setSearchQuery,
  notifications,
  onNotificationClick,
  userSession,
  onLogout,
  onNavigateSettings,
  onFilterBookmarks,
  isDarkMode,
  onToggleTheme
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifPrefModal, setShowNotifPrefModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = userSession?.name || 'Dr. Aris Thorne';
  const userEmail = userSession?.email || 'aris.thorne@biopharm.global';
  const userInitials = userSession?.avatarInitials || 'AT';

  return (
    <div className="header-container-wrapper">
      {/* 1. Main Top Header Bar */}
      <header className="header">
        <div className="header-left">
          <h1 className="header-page-title">{pageTitle}</h1>
        </div>

        <div className="header-right">
          {/* Working Time Range Dropdown */}
          <div className="filter-dropdown-group" title="Filter signals by surveillance timeframe">
            <Calendar size={14} color="#2E5FDB" />
            <select 
              className="filter-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="All">All Timeframes</option>
            </select>
          </div>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              className="icon-btn" 
              title="Notifications"
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowProfileMenu(false);
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notification-badge" />}
            </button>

            {showNotifMenu && (
              <div className="dropdown-panel notif-dropdown">
                <div className="dropdown-header">
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>Signal Notifications</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{unreadCount} unread</span>
                </div>
                <div className="notif-list">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setShowNotifMenu(false);
                        if (n.signalId) onNotificationClick(n.signalId);
                      }}
                      className={`notif-item ${n.read ? 'read' : 'unread'}`}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: n.priority === 'Critical' ? '#F87171' : '#FBBF24' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94A3B8' }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#CBD5E1', margin: 0, lineHeight: 1.3 }}>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Clock Component (Positioned immediately to the left of the avatar) */}
          <LiveClock />

          {/* Small Round Avatar Button with Profile Menu */}
          <div style={{ position: 'relative' }}>
            <button 
              className="avatar-btn"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifMenu(false);
              }}
              title={`Account Menu (${userName})`}
            >
              <span className="avatar-btn-text">{userInitials}</span>
            </button>

            {showProfileMenu && (
              <div className="dropdown-panel profile-dropdown-menu">
                {/* User Details Header */}
                <div className="profile-menu-header">
                  <div className="profile-menu-avatar">{userInitials}</div>
                  <div className="profile-menu-meta">
                    <span className="profile-menu-name">{userName}</span>
                    <span className="profile-menu-email">{userEmail}</span>
                    <span className="profile-menu-role">{userSession?.role || 'Head of Medical Affairs'}</span>
                  </div>
                </div>

                <div className="profile-menu-divider" />

                {/* Dark / Light Mode Toggle */}
                <button 
                  className="profile-menu-item"
                  onClick={() => {
                    onToggleTheme();
                  }}
                >
                  {isDarkMode ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#2E5FDB" />}
                  <span>Theme: <strong>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</strong></span>
                </button>

                {/* Saved Papers / Bookmarks */}
                <button 
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onFilterBookmarks) onFilterBookmarks();
                  }}
                >
                  <Bookmark size={15} color="#7C4DFF" />
                  <span>Saved Papers & Bookmarks</span>
                </button>

                {/* Account Settings */}
                <button 
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateSettings();
                  }}
                >
                  <Settings size={15} color="#0F9B8E" />
                  <span>Account & Platform Settings</span>
                </button>

                {/* Notification Preferences */}
                <button 
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowNotifPrefModal(true);
                  }}
                >
                  <Sliders size={15} color="#38BDF8" />
                  <span>Notification Preferences</span>
                </button>

                {/* Help & Support */}
                <button 
                  className="profile-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowHelpModal(true);
                  }}
                >
                  <HelpCircle size={15} color="#A855F7" />
                  <span>Help & Surveillance Support</span>
                </button>

                <div className="profile-menu-divider" />

                {/* Log Out */}
                <button 
                  className="profile-menu-item logout-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                >
                  <LogOut size={15} color="#F87171" />
                  <span>Sign Out of Nova Orbit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Dedicated Second Row: Full Width / Left-Aligned Search Bar */}
      <div className="header-search-row">
        <div className="header-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-row-input"
            placeholder="Search signals by keyword, drug, NCT identifier, PMID, FDA/EMA filing, or mechanism..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search filter"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Notification Preferences Modal */}
      {showNotifPrefModal && (
        <div className="modal-backdrop" onClick={() => setShowNotifPrefModal(false)}>
          <div className="modal-card small-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-card-header">
              <h3>Notification Preferences</h3>
              <button className="close-btn" onClick={() => setShowNotifPrefModal(false)}>×</button>
            </div>
            <div className="pref-list">
              <label className="pref-toggle-row">
                <span>Critical Priority Alerts (Immediate Push)</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="pref-toggle-row">
                <span>FDA & EMA Regulatory Filings Digest</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="pref-toggle-row">
                <span>Safety & TMA Pharmacovigilance Warnings</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="pref-toggle-row">
                <span>Weekly Executive Portfolio Briefing</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
            <button className="btn-primary-gradient full-btn" onClick={() => setShowNotifPrefModal(false)}>
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="modal-card small-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-card-header">
              <h3>Nova Orbit Support</h3>
              <button className="close-btn" onClick={() => setShowHelpModal(false)}>×</button>
            </div>
            <div style={{ padding: '16px 0', fontSize: '13px', color: '#CBD5E1', lineHeight: 1.6 }}>
              <p><strong>Nova Orbit Version:</strong> 2.4.0 (Biopharma Strategic Tier)</p>
              <p><strong>Support Channel:</strong> support@nova-orbit.biopharm</p>
              <p><strong>Real-time Surveillance:</strong> ClinicalTrials.gov API v2, PubMed E-utilities, OpenFDA FAERS, EMA Records.</p>
            </div>
            <button className="btn-primary-gradient full-btn" onClick={() => setShowHelpModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

