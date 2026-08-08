import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Calendar, 
  Sparkles, 
  ArrowLeft,
  Clock,
  AlertCircle,
  Bookmark,
  CalendarDays,
  Target
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 14 } }
};

const Tasks = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [taskError, setTaskError] = useState('');
  const [aiLoadingId, setAiLoadingId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      setTaskError('Failed to load tasks.');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      await api.put(`/api/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setTaskError('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this study target!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1b4b4a',
      cancelButtonColor: '#ea580c',
      confirmButtonText: 'Yes, delete it!',
      background: '#faf7f2',
      color: '#1b1c1c'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/tasks/${id}`);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your study target has been deleted.',
          icon: 'success',
          confirmButtonColor: '#1b4b4a',
          background: '#faf7f2',
          color: '#1b1c1c'
        });
        fetchTasks();
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete task.',
          icon: 'error',
          confirmButtonColor: '#1b4b4a',
          background: '#faf7f2',
          color: '#1b1c1c'
        });
      }
    }
  };

  const handleGeneratePlan = async (id) => {
    setAiLoadingId(id);
    setTaskError('');
    try {
      const response = await api.post(`/api/tasks/${id}/generate-plan`);
      // Direct user straight to the newly created AI plan page!
      navigate(`/study-plan/${id}`);
    } catch (err) {
      console.error(err);
      setTaskError(err.response?.data?.message || 'Failed to generate AI study plan.');
    } finally {
      setAiLoadingId(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 relative overflow-hidden">
      
      {/* Background Shapes */}
      <div className="absolute top-[-5%] right-[-10%] w-[450px] h-[450px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      {/* Main Content Container */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 mt-10 space-y-8 relative z-10"
      >
        
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.button 
            whileHover={{ x: -3 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Dashboard Menu</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/add-task')}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Study Target</span>
          </motion.button>
        </div>

        {/* Title Block */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-[#F5E6D3]/60 px-3 py-1 rounded-lg border border-primary/5">
            <Bookmark size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Workspace</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Task Sanctuary</h1>
          <p className="text-text-muted text-sm max-w-lg">
            Track deadlines, complete topics, and review structured AI study blueprint roadmaps.
          </p>
        </motion.div>

        {/* Controls: Filter tabs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-3 rounded-2xl border border-primary/5 shadow-3xs">
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest px-2">Task Filters</span>
          
          <div className="flex bg-[#F5E6D3]/40 p-1 rounded-xl border border-primary/5">
            {['all', 'pending', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  filter === tab 
                    ? 'bg-white text-primary shadow-xs' 
                    : 'text-text-muted/70 hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error Panel */}
        {taskError && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{taskError}</span>
          </div>
        )}

        {/* Tasks List */}
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 text-center border border-primary/5 shadow-2xs"
              >
                <div className="inline-block bg-[#F5E6D3]/40 p-4 rounded-full text-text-muted/50 mb-3">
                  <Clock size={32} />
                </div>
                <h4 className="text-sm font-bold text-primary mb-1">No Study Targets Found</h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                  {filter === 'all' 
                    ? 'Add your first task using the top-right button to start learning!' 
                    : `You have no tasks marked as "${filter}".`}
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => {
                let priorityStyles = '';
                if (task.priority === 'High') priorityStyles = 'bg-rose-50 text-rose-700 border-rose-200/50';
                else if (task.priority === 'Medium') priorityStyles = 'bg-amber-50 text-amber-800 border-amber-200/50';
                else priorityStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200/50';

                const hasPlan = task.aiPlan && task.aiPlan.length > 0;

                return (
                  <motion.div 
                    key={task._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className={`bg-white rounded-2xl border border-primary/5 shadow-2xs hover:shadow-xs transition-all duration-300 overflow-hidden p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      task.status === 'completed' ? 'opacity-85' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Checkbox toggle */}
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleStatus(task)}
                        className="text-primary hover:scale-105 transition-transform mt-0.5 flex-shrink-0 cursor-pointer"
                      >
                        {task.status === 'completed' 
                          ? <CheckCircle size={22} className="text-primary fill-primary/5" /> 
                          : <Circle size={22} className="text-text-muted/30 hover:text-primary transition-colors" />
                        }
                      </motion.button>
                      
                      <div className="space-y-1.5">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {task.subject}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${priorityStyles}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className={`text-sm md:text-base font-extrabold text-primary leading-snug ${task.status === 'completed' ? 'line-through text-text-muted/50' : ''}`}>
                          {task.topic}
                        </h4>

                        {/* Due Date */}
                        <div className="flex items-center gap-1 text-[10px] text-text-muted/65">
                          <CalendarDays size={13} />
                          <span>Deadline: {formatDate(task.deadline)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      {task.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (hasPlan) {
                              navigate(`/study-plan/${task._id}`);
                            } else {
                              handleGeneratePlan(task._id);
                            }
                          }}
                          disabled={aiLoadingId === task._id}
                          className={`flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-2.5 rounded-xl transition-all duration-250 disabled:opacity-50 cursor-pointer shadow-2xs ${
                            hasPlan
                              ? 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10'
                              : 'bg-accent/15 hover:bg-accent/25 text-amber-950 border border-accent/20'
                          }`}
                        >
                          <Sparkles size={13} className={`${aiLoadingId === task._id ? 'animate-spin text-amber-700' : 'text-amber-600'}`} />
                          <span>
                            {aiLoadingId === task._id 
                              ? 'Analyzing...' 
                              : hasPlan 
                                ? 'View AI Plan' 
                                : 'Generate Plan'
                            }
                          </span>
                        </motion.button>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-2.5 text-text-muted/50 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default Tasks;
