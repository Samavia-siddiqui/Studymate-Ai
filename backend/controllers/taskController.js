import Task from '../models/Task.js';

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  const { subject, topic, deadline, priority } = req.body;

  try {
    if (!subject || !topic || !deadline) {
      return res.status(400).json({ message: 'Please provide subject, topic, and deadline' });
    }

    const task = await Task.create({
      userId: req.user.id,
      subject,
      topic,
      deadline,
      priority: priority || 'Medium',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks of user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  const { status } = req.query;

  try {
    const query = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task details or status
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { subject, topic, deadline, priority, status } = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this task' });
    }

    // Update fields if provided
    if (subject !== undefined) task.subject = subject;
    if (topic !== undefined) task.topic = topic;
    if (deadline !== undefined) task.deadline = deadline;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task belongs to user
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user task progress
// @route   GET /api/tasks/progress
// @access  Private
export const getTaskProgress = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ userId: req.user.id });
    const completedTasks = await Task.countDocuments({ userId: req.user.id, status: 'completed' });
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      totalTasks,
      completedTasks,
      progress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
