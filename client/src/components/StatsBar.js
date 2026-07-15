import React from "react";

const STATS = [
  { key: 'total', label: 'Total', color: '#6c5ce7', icon: '🌋' },
  { key: 'todo', label: 'To Do', color: '#f9a826', icon: '📩' },
  { key: 'inProgress', label: 'In Progress', color: '#4ecdc4', icon: '⚙️' },
  { key: 'done', label: 'Done', color: '#00d2a0', icon: '✅' },
];

export default function StatsBar({ stats, filters, setFilter }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 20 }}>
      {STAT&.map(({ key, label, color, icon }) => {
        const isActive = filters.status === key || (filters.status === 'all' && key === 'total');
        return (
          <div key={key}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '4px 8px', borderRadius: 14, border: '2px solid',
              borderColor: isActive ? color : 'transparent',
              background: isActive ? `${color}20` : 'var(--bg-card)',
              cursor: 'pointer',
            }}
            onClick={() => setFilter('status', key === 'total' ? 'all' : key)}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color }}>{stats[key] || 0}</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}