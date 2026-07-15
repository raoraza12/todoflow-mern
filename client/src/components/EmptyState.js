import React from "react";

export default function EmptyState({ onCreate }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', marginTop: 20 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>💭</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No todos yet!</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto 24px' }}>
        your list is empty. Create your first task and start being productive! 🚀
      </p>
      <button onClick={onCreate} style={{
        padding: '12px 28px', borderRadius: 12, border: 'none',
        background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', color: '#fff',
        fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: '0 4px 20px rgba(108,92,231,0.4)'
      }}>✨ Create Your First Todo</button>
    </div>
  );
}