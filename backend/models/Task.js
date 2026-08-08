import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    aiPlan: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
