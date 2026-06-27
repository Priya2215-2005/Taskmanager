import React from 'react';

export default function StatsBar({ stats }) {
  const items = [
    { label: 'Total', value: stats.total, color: '#2563eb' },
    { label: 'To do', value: stats.todo, color: '#374151' },
    { label: 'In progress', value: stats.inProgress, color: '#d97706' },
    { label: 'Done', value: stats.done, color: '#16a34a' },
  ];

  return (
    <div style={s.grid} aria-label="Task summary">
      {items.map((item) => (
        <div key={item.label} style={s.card}>
          <div style={s.label}>{item.label}</div>
          <div style={{ ...s.value, color: item.color }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '1.25rem' },
  card: { background: '#fff', borderRadius: 10, padding: '1rem', border: '1px solid #e5e7eb' },
  label: { fontSize: 12, color: '#999', marginBottom: 4 },
  value: { fontSize: 26, fontWeight: 600 },
};
