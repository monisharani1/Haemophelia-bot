import React, { useState } from 'react';
import { mockDataSources } from '../mockData';
import { DataSourceItem } from '../types';
import { getAnthropicApiKey, setAnthropicApiKey } from '../services/aiService';
import { Shield, Bell, Database, Info, Check, ToggleLeft, ToggleRight, ExternalLink, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [sources, setSources] = useState<DataSourceItem[]>(mockDataSources);
  const [scopes, setScopes] = useState({
    haemophiliaA: true,
    haemophiliaB: true,
    vwd: true,
    geneTherapy: true,
    nonFactorMimetics: true
  });
  const [notifCriticalOnly, setNotifCriticalOnly] = useState(false);
  const [emailDigest, setEmailDigest] = useState('Daily');
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const [apiKeyInput, setApiKeyInput] = useState(() => getAnthropicApiKey());
  const [apiKeySaved, setApiKeySaved] = useState(false);

  const handleSaveApiKey = () => {

    setAnthropicApiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 3000);
  };

  const toggleSourceStatus = (id: string) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        const newStatus = s.status === 'Active' ? 'Paused' : 'Active';
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Therapeutic-Area Scope Toggle */}
      <div className="card">
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#2E5FDB" />
            <span>Therapeutic Area Surveillance Scope</span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
          Select therapeutic indications and modalities monitored by the AI engine:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { key: 'haemophiliaA', label: 'Haemophilia A (Factor VIII Deficiency)' },
            { key: 'haemophiliaB', label: 'Haemophilia B (Factor IX Deficiency)' },
            { key: 'vwd', label: 'von Willebrand Disease (VWD)' },
            { key: 'geneTherapy', label: 'AAV Gene Therapies & In-Vivo Editing' },
            { key: 'nonFactorMimetics', label: 'Non-Factor Mimetics & Rebalancing' },
          ].map((item) => {
            const isChecked = (scopes as any)[item.key];
            return (
              <div 
                key={item.key}
                onClick={() => setScopes(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: isChecked ? '1px solid #2E5FDB' : '1px solid #E2E8F0',
                  backgroundColor: isChecked ? '#F0F9FF' : '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{item.label}</span>
                {isChecked ? <ToggleRight size={26} color="#2E5FDB" /> : <ToggleLeft size={26} color="#94A3B8" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Source Management List */}
      <div className="card">
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="#0F9B8E" />
            <span>Data Sources & Registry Ingestion Pipeline</span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
            {sources.filter(s => s.status === 'Active').length} / {sources.length} Active Feeds
          </span>
        </div>

        <div className="signals-table-wrapper">
          <table className="signals-table">
            <thead>
              <tr>
                <th>Data Source Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Reliability Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((src) => (
                <tr key={src.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{src.name}</div>
                    <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#2E5FDB', textDecoration: 'none' }}>
                      {src.url} <ExternalLink size={10} />
                    </a>
                  </td>
                  <td>
                    <span className="function-chip" style={{ fontSize: '11px' }}>{src.category}</span>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: src.status === 'Active' ? '#DCFCE7' : src.status === 'Syncing' ? '#FEF3C7' : '#F1F5F9',
                      color: src.status === 'Active' ? '#16A34A' : src.status === 'Syncing' ? '#D97706' : '#64748B'
                    }}>
                      ● {src.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748B' }}>{src.lastSync}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0F9B8E' }}>{src.reliabilityRating}%</span>
                  </td>
                  <td>
                    <button 
                      className="btn-secondary" 
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                      onClick={() => toggleSourceStatus(src.id)}
                    >
                      {src.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. AI Engine & API Configuration */}
      <div className="card">
        <div className="card-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#2E5FDB" />
            <span>AI Engine & Anthropic Claude API Configuration</span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
          Configure your Anthropic API credentials to power live strategic functional unit breakdowns and copilot conversations:
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <input 
              type="password"
              className="search-input"
              style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', width: '100%', padding: '8px 12px', borderRadius: '6px' }}
              placeholder="Enter Anthropic API Key (sk-ant-api03-...)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleSaveApiKey}>
            {apiKeySaved ? <Check size={15} /> : null}
            {apiKeySaved ? 'API Key Stored' : 'Save API Key'}
          </button>
        </div>
        <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', display: 'block' }}>
          Keys are stored locally in browser storage and directly used for browser requests. If no key is set, the system uses built-in high-precision intelligence synthesis.
        </span>
      </div>

      {/* 4. Notification Preferences & About Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="#7C4DFF" />
              <span>Notification Preferences</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', cursor: 'pointer' }}>
              <span>Notify only for Critical priority (Score &gt;= 90)</span>
              <input 
                type="checkbox" 
                checked={notifCriticalOnly} 
                onChange={(e) => setNotifCriticalOnly(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Email Intelligence Digest Frequency</span>
              <select 
                className="filter-select" 
                style={{ background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', padding: '4px 8px', borderRadius: '6px' }}
                value={emailDigest}
                onChange={(e) => setEmailDigest(e.target.value)}
              >
                <option value="Realtime">Real-time (Instant)</option>
                <option value="Daily">Daily Summary</option>
                <option value="Weekly">Weekly Digest</option>
              </select>
            </div>

            <button className="btn-primary" style={{ marginTop: '10px' }} onClick={handleSave}>
              {savedSuccess ? <Check size={16} /> : null}
              {savedSuccess ? 'Settings Saved!' : 'Save Preferences'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} color="#2E5FDB" />
              <span>System & Version Information</span>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Application:</strong> Nova Orbit Biopharma Strategic Intelligence Platform</div>
            <div><strong>Version:</strong> v2.5.0 (AI Engine Live Build)</div>
            <div><strong>Tagline:</strong> <em>"From inbox noise to strategic signal."</em></div>
            <div><strong>Target Users:</strong> Medical Affairs, Regulatory, Safety, R&D, Market Access, Leadership</div>
          </div>
        </div>
      </div>


    </div>
  );
};
