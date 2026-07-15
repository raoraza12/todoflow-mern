import React from "react";

export default function Header({ subscribed, togglePush }) {
  return (
    <header style={{ paddingTop: 24, paddingBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 32 }}>⚡️</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TodoFlow</h1>
        </div>
        {togglePush && (
          <button onClick={togglePush} style={{
            padding: '6px 12px', borderRadius: 20, border: '1px solid var(--border)',
            background: subscribed ? 'var(--accent)' : 'var(--bg-card)',
            color: subscribed ? '#fff' : 'var(--text-secondary)',
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>{subscribed ? '🔤 Notify' : '❌ ӏun"}</button>
        ))}
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>Stay organized. Stay productive.</p>
    </header>
  );
}