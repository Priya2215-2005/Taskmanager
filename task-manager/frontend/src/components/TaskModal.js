import React, { useState, useEffect } from 'react';

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    assignee: '',
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        assignee: task.assignee || '',
      });
    }
  }, [task]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal} role="dialog" aria-modal="true" aria-labelledby="modal-heading">
        <h2 id="modal-heading" style={s.heading}>{task ? 'Edit task' : 'New task'}</h2>

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Title *</label>
            <input style={s.input} name="title" value={form.title} onChange={handleChange} placeholder="What needs to be done?" required autoFocus />
          </div>
          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea style={{ ...s.input, resize: 'vertical' }} name="description" value={form.description} onChange={handleChange} placeholder="Add more details…" rows={3} />
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Priority</label>
              <select style={s.input} name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Status</label>
              <select style={s.input} name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Due date</label>
              <input style={s.input} type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Assignee</label>
              <input style={s.input} name="assignee" value={form.assignee} onChange={handleChange} placeholder="Name" />
            </div>
          </div>
          <div style={s.actions}>
            <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={s.saveBtn}>Save task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, padding: '1.75rem', width: 480, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' },
  heading: { fontSize: 18, fontWeight: 600, marginBottom: '1.25rem', color: '#111' },
  field: { marginBottom: '1rem', flex: 1 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 5 },
  input: { width: '100%', padding: '9px 11px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' },
  row: { display: 'flex', gap: 12 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '1rem' },
  cancelBtn: { border: '1px solid #ddd', background: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  saveBtn: { background: '#2563eb', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 },
};
