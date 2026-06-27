import React from 'react';

const statusColors = {
  todo: { bg: '#eff6ff', color: '#2563eb' },
  'in-progress': { bg: '#fffbeb', color: '#d97706' },
  done: { bg: '#f0fdf4', color: '#16a34a' },
};
const priorityColors = {
  high: { bg: '#fef2f2', color: '#dc2626' },
  medium: { bg: '#fffbeb', color: '#d97706' },
  low: { bg: '#f0fdf4', color: '#16a34a' },
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const today = new Date().toISOString().split('T')[0];
  const dueStr = task.dueDate ? task.dueDate.split('T')[0] : null;
  const isOverdue = task.status !== 'done' && dueStr && dueStr < today;
  const isDone = task.status === 'done';

  return (
    <div style={{ ...s.card, opacity: isDone ? 0.7 : 1 }}>
      {/* Checkbox */}
      <button
        style={{ ...s.check, background: isDone ? '#16a34a' : 'transparent', borderColor: isDone ? '#16a34a' : '#ccc' }}
        onClick={() => onToggle(task)}
        title="Toggle complete"
        aria-label="Toggle task complete"
      >
        {isDone && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
      </button>

      {/* Body */}
      <div style={s.body}>
        <div style={{ ...s.title, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? '#999' : '#111' }}>
          {task.title}
        </div>
        {task.description && <div style={s.desc}>{task.description}</div>}
        <div style={s.meta}>
          <span style={{ ...s.tag, ...statusColors[task.status] }}>
            {task.status === 'in-progress' ? 'In progress' : task.status === 'todo' ? 'To do' : 'Done'}
          </span>
          <span style={{ ...s.tag, ...priorityColors[task.priority] }}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          {dueStr && (
            <span style={{ fontSize: 12, color: isOverdue ? '#dc2626' : '#999' }}>
              📅 {isOverdue ? 'Overdue · ' : ''}{dueStr}
            </span>
          )}
          {task.assignee && <span style={{ fontSize: 12, color: '#999' }}>👤 {task.assignee}</span>}
        </div>
      </div>

      {/* Actions */}
      <div style={s.actions}>
        <button style={s.iconBtn} onClick={() => onEdit(task)} title="Edit task">✏️</button>
        <button style={{ ...s.iconBtn, ...s.delBtn }} onClick={() => onDelete(task._id)} title="Delete task">🗑</button>
      </div>
    </div>
  );
}

const s = {
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'box-shadow 0.15s' },
  check: { width: 20, height: 20, borderRadius: '50%', border: '2px solid', cursor: 'pointer', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: 500, marginBottom: 4 },
  desc: { fontSize: 12, color: '#999', marginBottom: 6 },
  meta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  tag: { fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 500 },
  actions: { display: 'flex', gap: 4, flexShrink: 0 },
  iconBtn: { width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 6, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  delBtn: {},
};
