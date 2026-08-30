import React, { useState } from 'react';
import { Bell, Filter, Calendar, User, Search, Check, ExternalLink } from 'lucide-react';
import { SystemNotification } from '../types';

interface HeaderProps {
  pageTitle: string;
  therapeuticArea: string;
  setTherapeuticArea: (area: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: SystemNotification[];
  onNotificationClick: (signalId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  therapeuticArea,
  setTherapeuticArea,
  timeRange,
  setTimeRange,
  searchQuery,
  setSearchQuery,
  notifications,
  onNotificationClick
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-page-title">{pageTitle}</h1>
        <span className="header-sub-badge">Live AI Surveillance</span>
      </div>

      <div className="header-right">
        {/* Global Search */}
        <div style={{ position: 'relative', width: '220px' }}>
          <div className="search-input-box" style={{ background: '#1E293B', borderColor: '#334155', height: '36px' }}>
            <Search size={15} color="#94A3B8" />
            <input
              type="text"
              className="search-input"
              style={{ color: '#F8FAFC' }}
              placeholder="Search signals, trials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Therapeutic Area Dropdown */}
        <div className="filter-dropdown-group">
          <Filter size={14} color="#0F9B8E" />
          <select 
            className="filter-select"
            value={therapeuticArea}
            onChange={(e) => setTherapeuticArea(e.target.value)}
          >
            <option value="Haemophilia A & B">Haemophilia A & B</option>
            <option value="Haemophilia A">Haemophilia A</option>
            <option value="Haemophilia B">Haemophilia B</option>
            <option value="Rare Bleeding Disorders">Rare Bleeding Disorders</option>
          </select>
        </div>

        {/* Time Range Dropdown */}
        <div className="filter-dropdown-group">
          <Calendar size={14} color="#2E5FDB" />
          <select 
            className="filter-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Quarter to Date">Quarter to Date</option>
          </select>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            title="Notifications"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge" />}
          </button>

          {showNotifMenu && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '320px',
              backgroundColor: '#0F172A',
              border: '1px solid #334155',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              zIndex: 100,
              padding: '14px',
              color: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #1E293B' }}>
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Signal Notifications</span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{unreadCount} unread</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => {
                      setShowNotifMenu(false);
                      if (n.signalId) onNotificationClick(n.signalId);
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: n.read ? '#1E293B' : 'rgba(46, 95, 219, 0.25)',
                      border: '1px solid #334155',
                      cursor: 'pointer'
                    }}
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

        {/* User Profile */}
        <div className="user-profile" title="Signed in as Dr. Aris Thorne">
          <div className="user-avatar">AT</div>
          <div className="user-info">
            <span className="user-name">Dr. Aris Thorne</span>
            <span className="user-role">Head of Medical Affairs</span>
          </div>
        </div>
      </div>
    </header>
  );
};
