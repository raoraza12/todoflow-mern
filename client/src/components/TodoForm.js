import React { useState } from "react";

export default function TodoForm({ todo, onClose, onSave }) {
  const [form, setForm] = useState({ title: todo?.title || '', description: todo?.description || '', priority: todo?.priority || 'medium', category: todo?.category || 'General', status: todo?.status || 'todo', dueDate: todo?.dueDate||todo?.due_date|| '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setErrors(p => ({ ...p, [e.target.name]: '' })); };
  const validate = () => { const errs = {}; if (!form.title.trim()) errs.title = 'Title is required'; setErrors(errs); return Object.keys(errs).length === 0; };
  const handleSubmit = e => { e.preventDefault(); if (!validate()) return; setSubmitting(true); setTimeout(() => { onSave({ ...form, createdAt: todo?.createdAt || new Date().toISOString() }); setSubmitting(false); onClose(); }, 200); };

  return (
    React.createElement(React.Fragment, null,
      React.createElement('div', { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200 }, onClick: onClose }),
      React.createElement('div', { style: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 'calc(100% - 32px)', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', zIndex: 201, padding: 24 }, className: 'slide-up' },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }},
          React.createElement('h2', { style: { fontSize: 20, fontWeight: 700 }}, todo ? '✘️ Edit Todo' : '✨ New Todo'),
          React.createElement('button', { onClick: onClose, style: { width: 32, height: 32, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }}, '╏')
        ),
        React.createElement('form', { className: 'form', onSubmit: handleSubmit },
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Title *'),
            React.createElement('input', { name: 'title', value: form.title, onChange: handleChange, placeholder: 'What do you need to do?', autoFocus: true, style: { borderColor: errors.title ? 'var(--red)' : 'var(--border)' } }),
            errors.title && React.createElement('span', { className: 'error-msg' }, errors.title)
          ),
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Description'),
            React.createElement('textarea', { name: 'description', value: form.description, onChange: handleChange, placeholder: 'Add some details...' })
          ),
          React.createElement('div', { style: { display: 'flex', gap: 12 } },
            React.createElement('div', { className: 'field', style: { flex: 1 } },
              React.createElement('label', null, 'Priority'),
              React.createElement('select', { name: 'priority', value: form.priority, onChange: handleChange },
                React.createElement('option', { value: 'low' }, '🔹 Low'),
                React.createElement('option', { value: 'medium' }, '🔦 Medium'),
                React.createElement('option', { value: 'high' }, '⚡ High')
              )
            ),
            React.createElement('div', { className: 'field', style: { flex: 1 } },
              React.createElement('label', null, 'Category'),
              React.createElement('input', { name: 'category', value: form.category, onChange: handleChange, placeholder: 'e.g. Work, Personal' })
            )
          ),
          React.createElement('div', { style: { display: 'flex', gap: 12 } },
            React.createElement('div', { className: 'field', style: { flex: 1 } },
              React.createElement('label', null, 'Status'),
              React.createElement('select', { name: 'status', value: form.status, onChange: handleChange },
                React.createElement('option', { value: 'todo' }, '💙 To Do'),
                React.createElement('option', { value: 'in-progress' }, '⚘️ In Progress'),
                React.createElement('option', { value: 'done' }, '✅ Done')
              )
            ),
            React.createElement('div', { className: 'field', style: { flex: 1 } },
              React.createElement('label', null, 'Due Date'),
              React.createElement('input', { type: 'date', name: 'dueDate', value: (form.dueDate||'').slice(0, 10), onChange: handleChange })
            )
          ),
          React.createElement('button', { type: 'submit', className: 'submit-btn', disabled: submitting }, 
            submitting ? 'Saving...' : (todo ? '📊 Update Todo' : '🚀 Create Todo')
          )
        )
      )
    )
  );
}