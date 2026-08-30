import React, { useState } from 'react';
import { Signal, Category, Priority } from '../types';
import { RecentSignalsTable } from './RecentSignalsTable';
import { Search, Filter, RefreshCw, Download, SlidersHorizontal } from 'lucide-react';

interface CategoryViewProps {
  title: string;
  categoryFilter?: Category;
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  title,
  categoryFilter,
  signals,
  onSelectSignal
}) => {
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || 'All');

  // Filter signals
  const filtered = signals.filter(sig => {
    // Category match
    if (categoryFilter && sig.category !== categoryFilter) return false;
    if (!categoryFilter && selectedCategory !== 'All' && sig.category !== selectedCategory) return false;
    
    // Priority match
    if (selectedPriority !== 'All' && sig.priority !== selectedPriority) return false;

    // Type match
    if (selectedType !== 'All' && sig.haemophiliaType !== selectedType) return false;

    // Search query match
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchHeadline = sig.headline.toLowerCase().includes(q);
      const matchSummary = sig.summary.toLowerCase().includes(q);
      const matchSource = sig.source.toLowerCase().includes(q);
      if (!matchHeadline && !matchSummary && !matchSource) return false;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Filter Toolbar */}
      <div className="filter-bar">
        <div className="search-input-box">
          <Search size={16} color="#64748B" />
          <input
            type="text"
            className="search-input"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {!categoryFilter && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontWeight: 600, color: '#64748B' }}>Category:</span>
              <select 
                className="filter-select"
                style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Clinical">Clinical Trials</option>
                <option value="Regulatory">Regulatory</option>
                <option value="Safety">Safety</option>
                <option value="Market">Market Access</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <span style={{ fontWeight: 600, color: '#64748B' }}>Priority:</span>
            <select 
              className="filter-select"
              style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <span style={{ fontWeight: 600, color: '#64748B' }}>Type:</span>
            <select 
              className="filter-select"
              style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="A">Haemophilia A</option>
              <option value="B">Haemophilia B</option>
              <option value="Other">Other / General</option>
            </select>
          </div>

          <button 
            className="btn-secondary" 
            style={{ fontSize: '12px' }}
            onClick={() => {
              setSearch('');
              setSelectedPriority('All');
              setSelectedType('All');
              if (!categoryFilter) setSelectedCategory('All');
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main Signal Feed Table */}
      <RecentSignalsTable 
        signals={filtered}
        onSelectSignal={onSelectSignal}
        title={`${title} (${filtered.length} Signals)`}
      />
    </div>
  );
};
