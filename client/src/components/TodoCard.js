import React { useState, useEffect } from "react";
const PRIORITY = { high: { color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', label: '⚡ High' }, medium: { color: '#f9a826', background: 'rgba(249,168,38,0.1)', label: '🔦 Medium' }, low: { color: '#4ecdc4', background: 'rgba(78,205,196,0.1)', label: '🔹 Low' } };
const STATUS_ICON = { 'todo': '● todo', 'in-progress': '┪ in-progress', 'done': '✅ done' };
const STATUS_COLOR = { 'todo': '#f9a826', 'in-progress': '#4ecdc4', 'done': '#00d2a0' };

export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const [delConfirm, setDelConfirm] = useState(false);
  const p = PRIORITY[todo.priority] || PRIORITY.medium;
  const sc = STATUS_COLOR[todo.status];
  const isDone = todo.status === 'done';

  useEffect(() => { if (delConfirm) { const t = setTimeout(() => setDelConfirm(false), 3000); return () => clearTimeout(t); } }, [delConfirm]);

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14, padding: '14px 16px',
      border: '1px solid var(--border)', borderLeft: `3px solid ${sc}`,
      opacity: isDone ? 0.55 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button onClick={() => onToggle(todo)} style={{
          width: 28, height: 28, borderRadius: 14, border: `2px solid ${sc}`,
          background: 'transparent', cursor: 'pointer', color: sc, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{isDone ? '✅' : '●'}</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}>{todo.title}</div>
          {todo.description && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{todo.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => onEdit(todo)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)' }}>✘️</button>
          <button onClick={() => delConfirm ? onDelete(todo._id || todo.id) : setDelConfirm(true)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: delConfirm ? '#ff6b6b' : 'var(--text-muted)' }}>🥶����</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: p.background, color: p.color }}>{p.label}</span>
        {todo.dueDate && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(136,146,176,0.08)', color: 'var(--text-secondary)' }}>📉 <{new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', })}</span>}
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(136,146,176,0.08)', color: 'var(--text-secondary)' }}>🏯 {todo.category || 'General'}</span>
      </div>
    </div>
  );
}