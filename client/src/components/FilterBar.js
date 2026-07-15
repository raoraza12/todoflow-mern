import React from "react";

export default function FilterBar({ filters, setFilter }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a5a8a" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit' }} placeholder="Search todos..." value={filters.search} onChange={e => setFilter('search', e.target.value)} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'low', 'medium', 'high'].map(p => {
            const colors = { low: '#4ecdc4', medium: '#f9a826', high: '#ff6b6b' };
            const isActive = filters.priority === p;
            return (
              <button key={p} onClick={() => setFilter('priority', p)}
                style={{
                  padding: '6px 12px', borderRadius: 20, border: '1px solid',
                  borderColor: isActive ? colors[p] || 'var(--border)' : 'var(--border)',
                  background: isActive ? `${colors[p]}20` : 'var(--bg-secondary)',
                  color: isActive ? colors[p] || 'var(--text-secondary)' : 'var(--text-secondary)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                {p !== 'all' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors[p], display: 'inline-block', marginRight: 4 }} />}
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            );
          })}
        </div>
        <select value={filters.sort} onChange={e => setFilter('sort', e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', outline: 'none' }}>
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="-priority">Priority</option>
        </select>
      </div>
    </div>
  );
}