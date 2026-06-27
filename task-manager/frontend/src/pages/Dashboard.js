import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getTasks, createTask, updateTask, deleteTask, getTaskStats } from '../api';
import { useAuth } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import StatsBar from '../components/StatsBar';

let socket;

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all');
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (view !== 'all' && view !== 'overdue') params.status = view;
      if (priority !== 'all') params.priority = priority;
      if (search) params.search = search;

      const [tasksRes, statsRes] = await Promise.all([getTasks(params), getTaskStats()]);
      let list = tasksRes.data.tasks;

      if (view === 'overdue') {
        const today = new Date();
        list = list.filter((t) => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < today);
      }

      setTasks(list);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [view, priority, search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    socket = io('http://localhost:5000');
    socket.emit('join_room', user.id);

    socket.on('task_created', () => fetchTasks());
    socket.on('task_updated', () => fetchTasks());
    socket.on('task_deleted', () => fetchTasks());

    return () => socket.disconnect();
  }, [user.id, fetchTasks]);

  const handleSaveTask = async (data) => {
    try {
      if (editTask) {
        await updateTask(editTask._id, data);
      } else {
        await createTask(data);
      }
      setModalOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleToggleDone = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    await updateTask(task._id, { status: newStatus });
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/auth');
  };

  const views = ['all', 'todo', 'in-progress', 'done', 'overdue'];
  const viewLabels = { all: 'All tasks', todo: 'To do', 'in-progress': 'In progress', done: 'Done', overdue: 'Overdue' };

  return (
    <div style={s.app}>
      {/* Top bar */}
      <header style={s.topbar}>
        <div style={s.logo}>✓ TaskFlow</div>
        <div style={s.userArea}>
          <span style={{ fontSize: 14, color: '#555' }}>Hi, {user.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <div style={s.layout}>
        {/* Sidebar */}
        <nav style={s.sidebar}>
          {views.map((v) => (
            <button key={v} style={{ ...s.navItem, ...(view === v ? s.navActive : {}) }} onClick={() => setView(v)}>
              {viewLabels[v]}
              {v === 'all' && <span style={s.badge}>{stats.total}</span>}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={s.main}>
          <div style={s.toolbar}>
            <h1 style={s.pageTitle}>{viewLabels[view]}</h1>
            <button style={s.addBtn} onClick={() => { setEditTask(null); setModalOpen(true); }}>+ New task</button>
          </div>

          <StatsBar stats={stats} />

          {/* Filters */}
          <div style={s.filters}>
            <input style={s.search} placeholder="Search tasks…" value={search} onChange={(e) => setSearch(e.target.value)} />
            {['all', 'high', 'medium', 'low'].map((p) => (
              <button key={p} style={{ ...s.filterBtn, ...(priority === p ? s.filterActive : {}) }} onClick={() => setPriority(p)}>
                {p === 'all' ? 'All priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Task list */}
          {loading ? (
            <div style={s.empty}>Loading tasks…</div>
          ) : tasks.length === 0 ? (
            <div style={s.empty}>No tasks found. Create one to get started!</div>
          ) : (
            <div style={s.taskList}>
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onToggle={handleToggleDone} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <TaskModal task={editTask} onSave={handleSaveTask} onClose={() => { setModalOpen(false); setEditTask(null); }} />
      )}
    </div>
  );
}

const s = {
  app: { minHeight: '100vh', background: '#f5f7fa', fontFamily: 'system-ui, sans-serif' },
  topbar: { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 20, fontWeight: 700, color: '#2563eb' },
  userArea: { display: 'flex', alignItems: 'center', gap: 12 },
  logoutBtn: { border: '1px solid #ddd', background: 'transparent', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
  layout: { display: 'flex', minHeight: 'calc(100vh - 56px)' },
  sidebar: { width: 200, background: '#fff', borderRight: '1px solid #e5e7eb', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: 2 },
  navItem: { display: 'flex', alignItems: 'center', padding: '9px 1rem', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer', color: '#555', textAlign: 'left', width: '100%' },
  navActive: { background: '#eff6ff', color: '#2563eb', fontWeight: 500 },
  badge: { marginLeft: 'auto', background: '#2563eb', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 11 },
  main: { flex: 1, padding: '1.5rem', overflowY: 'auto' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  pageTitle: { fontSize: 20, fontWeight: 600, color: '#111' },
  addBtn: { background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer', fontWeight: 500 },
  filters: { display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' },
  search: { padding: '6px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13, width: 180, outline: 'none' },
  filterBtn: { padding: '5px 12px', border: '1px solid #ddd', borderRadius: 20, fontSize: 12, cursor: 'pointer', background: '#fff', color: '#555' },
  filterActive: { background: '#eff6ff', color: '#2563eb', borderColor: '#bfdbfe' },
  taskList: { display: 'flex', flexDirection: 'column', gap: 8 },
  empty: { textAlign: 'center', color: '#999', padding: '3rem', fontSize: 15 },
};
