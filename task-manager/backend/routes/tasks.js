const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes are protected
router.use(protect);

// Helper: emit real-time event to the user's socket room
const emitToUser = (req, event, data) => {
  const io = req.app.get('io');
  io.to(req.user._id.toString()).emit(event, data);
};

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user (with filtering & sorting)
// @access  Private
router.get('/', async (req, res) => {
  const { status, priority, sort = '-createdAt', search } = req.query;

  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: 'i' };

  try {
    const tasks = await Task.find(filter).sort(sort);
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });

    // Notify all connected clients of this user in real-time
    emitToUser(req, 'task_created', task);

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    emitToUser(req, 'task_updated', task);

    res.json({ success: true, task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    emitToUser(req, 'task_deleted', { id: req.params.id });

    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/tasks/stats/summary
// @desc    Get task summary counts
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, todo, inProgress, done] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'todo' }),
      Task.countDocuments({ user: userId, status: 'in-progress' }),
      Task.countDocuments({ user: userId, status: 'done' }),
    ]);
    res.json({ success: true, stats: { total, todo, inProgress, done } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
