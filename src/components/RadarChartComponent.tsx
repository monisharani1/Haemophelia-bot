import React, { useState } from 'react';
import { Info, RefreshCw } from 'lucide-react';

interface AxisData {
  axis: string;
  high: number;    // 0 - 100
  medium: number;  // 0 - 100
  low: number;     // 0 - 100
}

const radarAxes: AxisData[] = [
  { axis: 'Clinical Trials', high: 92, medium: 75, low: 40 },
  { axis: 'Regulatory', high: 85, medium: 68, low: 45 },
  { axis: 'Market Access', high: 78, medium: 82, low: 50 },
  { axis: 'Safety', high: 88, medium: 60, low: 35 },
  { axis: 'Publications', high: 70, medium: 85, low: 60 },
  { axis: 'Partnerships', high: 65, medium: 72, low: 40 }
];

export const RadarChartComponent: React.FC = () => {
  const [activeSeries, setActiveSeries] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [hoveredAxis, setHoveredAxis] = useState<AxisData | null>(null);

  const size = 340;
  const center = size / 2;
  const radius = 120;
  const totalAxes = radarAxes.length;

  // Calculate coordinates for a point given axis index and value (0-100)
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build SVG polygon points path for a dataset key ('high' | 'medium' | 'low')
  const getPolygonPoints = (key: 'high' | 'medium' | 'low') => {
    return radarAxes
      .map((item, i) => {
        const { x, y } = getCoordinates(i, item[key]);
        return `${x},${y}`;
      })
      .join(' ');
  };

  // Concentric background grid polygons (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Market Evolution Radar</span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#0F9B8E', background: 'rgba(15, 155, 142, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
            6 Core Axes
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="icon-btn" 
            style={{ width: '28px', height: '28px' }} 
            title="Refresh radar baseline"
            onClick={() => setActiveSeries('all')}
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px', marginTop: '-8px' }}>
        Signal density across strategic intelligence domains (0–100 Intensity Index)
      </p>

      {/* Radar SVG Container */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background Concentric Grid */}
          {gridLevels.map((lvl) => {
            const points = radarAxes
              .map((_, i) => {
                const { x, y } = getCoordinates(i, lvl);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={lvl}
                points={points}
                fill="none"
                stroke="#E2E8F0"
                strokeDasharray={lvl === 100 ? 'none' : '3 3'}
                strokeWidth={lvl === 100 ? 1.5 : 1}
              />
            );
          })}

          {/* Spokes / Axis Lines */}
          {radarAxes.map((item, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#CBD5E1"
                strokeWidth={1}
              />
            );
          })}

          {/* Axis Labels */}
          {radarAxes.map((item, i) => {
            const { x, y } = getCoordinates(i, 118);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="700"
                fill="#334155"
                onMouseEnter={() => setHoveredAxis(item)}
                onMouseLeave={() => setHoveredAxis(null)}
                style={{ cursor: 'pointer' }}
              >
                {item.axis}
              </text>
            );
          })}

          {/* 1. Low Density Series (Green) */}
          {(activeSeries === 'all' || activeSeries === 'low') && (
            <g>
              <polygon
                points={getPolygonPoints('low')}
                fill="rgba(22, 163, 74, 0.15)"
                stroke="#16A34A"
                strokeWidth={2}
              />
              {radarAxes.map((item, i) => {
                const { x, y } = getCoordinates(i, item.low);
                return <circle key={i} cx={x} cy={y} r={3.5} fill="#16A34A" stroke="#FFFFFF" strokeWidth={1} />;
              })}
            </g>
          )}

          {/* 2. Medium Density Series (Orange) */}
          {(activeSeries === 'all' || activeSeries === 'medium') && (
            <g>
              <polygon
                points={getPolygonPoints('medium')}
                fill="rgba(245, 158, 11, 0.2)"
                stroke="#F59E0B"
                strokeWidth={2}
              />
              {radarAxes.map((item, i) => {
                const { x, y } = getCoordinates(i, item.medium);
                return <circle key={i} cx={x} cy={y} r={4} fill="#F59E0B" stroke="#FFFFFF" strokeWidth={1} />;
              })}
            </g>
          )}

          {/* 3. High Density Series (Red) */}
          {(activeSeries === 'all' || activeSeries === 'high') && (
            <g>
              <polygon
                points={getPolygonPoints('high')}
                fill="rgba(220, 38, 38, 0.25)"
                stroke="#DC2626"
                strokeWidth={2.5}
              />
              {radarAxes.map((item, i) => {
                const { x, y } = getCoordinates(i, item.high);
                return <circle key={i} cx={x} cy={y} r={4.5} fill="#DC2626" stroke="#FFFFFF" strokeWidth={1.5} />;
              })}
            </g>
          )}
        </svg>

        {/* Hover Tooltip overlay */}
        {hoveredAxis && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0F172A',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 10
          }}>
            {hoveredAxis.axis}: High ({hoveredAxis.high}) • Med ({hoveredAxis.medium}) • Low ({hoveredAxis.low})
          </div>
        )}
      </div>

      {/* Legend & Filter Toggles */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
        <button
          onClick={() => setActiveSeries(activeSeries === 'high' ? 'all' : 'high')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            background: activeSeries === 'high' ? '#FEE2E2' : 'transparent',
            padding: '4px 8px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            color: '#DC2626'
          }}
        >
          <span style={{ width: '10px', height: '10px', backgroundColor: '#DC2626', borderRadius: '50%' }} />
          High Signal Density
        </button>

        <button
          onClick={() => setActiveSeries(activeSeries === 'medium' ? 'all' : 'medium')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            background: activeSeries === 'medium' ? '#FEF3C7' : 'transparent',
            padding: '4px 8px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            color: '#D97706'
          }}
        >
          <span style={{ width: '10px', height: '10px', backgroundColor: '#F59E0B', borderRadius: '50%' }} />
          Medium Density
        </button>

        <button
          onClick={() => setActiveSeries(activeSeries === 'low' ? 'all' : 'low')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            background: activeSeries === 'low' ? '#DCFCE7' : 'transparent',
            padding: '4px 8px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            color: '#16A34A'
          }}
        >
          <span style={{ width: '10px', height: '10px', backgroundColor: '#16A34A', borderRadius: '50%' }} />
          Low / Baseline
        </button>
      </div>
    </div>
  );
};
