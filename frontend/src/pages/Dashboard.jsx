import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Calendar, 
  Sparkles, 
  LogOut, 
  BookOpen, 
  Trophy, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Bookmark,
  CalendarDays,
  Target
} from 'lucide-react';

// Framer Motion staggered entrance variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 14 } 
  }
};

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [progressData, setProgressData] = useState({ totalTasks: 0, completedTasks: 0, progress: 0 });
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [expandedTask, setExpandedTask] = useState(null); // ID of task with visible AI plan
  
  const [taskError, setTaskError] = useState('');
  const [aiLoadingId, setAiLoadingId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchTasks(), fetchProgress()]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setTaskError('Failed to load tasks. Please try again.');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error(err);
      setTaskError('Failed to load tasks.');
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get('/api/tasks/progress');
      setProgressData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      await api.put(`/api/tasks/${task._id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
      setTaskError('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      if (expandedTask === id) setExpandedTask(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setTaskError('Failed to delete task.');
    }
  };

  const handleGeneratePlan = async (id) => {
    setAiLoadingId(id);
    setTaskError('');
    try {
      const response = await api.post(`/api/tasks/${id}/generate-plan`);
      // Update local task list
      setTasks(tasks.map(t => t._id === id ? response.data : t));
      setExpandedTask(id);
      fetchProgress();
    } catch (err) {
      console.error(err);
      setTaskError(err.response?.data?.message || 'Failed to generate AI study plan.');
    } finally {
      setAiLoadingId(null);
    }
  };

  // Filter tasks based on UI tab
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

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 relative overflow-x-hidden">
      
      {/* ================= BACKGROUND FLOATING SHAPES ================= */}
      {/* Glow Orbs */}
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[110px] pointer-events-none" />

      {/* Floating Rotating dashed circle */}
      <motion.div 
        animate={{ 
          rotate: 360,
          y: [0, -10, 0]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-[35%] left-[3%] w-20 h-20 rounded-full border-2 border-dashed border-primary/20 pointer-events-none hidden lg:block"
      />

      {/* Floating spinning square */}
      <motion.div 
        animate={{ 
          rotate: [0, 45, 0],
          scale: [1, 1.05, 1],
          y: [0, 8, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] right-[3%] w-12 h-12 bg-accent/15 border border-accent/25 rounded-xl pointer-events-none hidden lg:block"
      />

      {/* Mini floating circles */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-[18%] left-[25%] w-3 h-3 bg-primary/20 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-[25%] right-[22%] w-3 h-3 bg-accent/30 rounded-full pointer-events-none"
      />
      {/* ============================================================= */}

      {/* Top Navbar */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-primary/5 shadow-sm sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2.5 rounded-xl shadow-md shadow-primary/10">
              <BookOpen size={22} className="text-accent" />
            </div>
            <span className="text-2xl font-extrabold text-primary tracking-tight">StudyMate</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-extrabold text-primary">{user?.name || 'Student'}</p>
              <p className="text-[10px] font-medium text-text-muted/70">{user?.email}</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-red-600 border border-outline-variant/30 px-3.5 py-2 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 cursor-pointer"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Container with Entrance stagger variants */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 mt-8 relative z-10 space-y-8"
      >
        
        {/* Welcome Motivational Banner Card - Unboxed & Blended */}
        <motion.div variants={itemVariants} className="w-full relative z-10">
          <section className="py-8 md:py-12 flex flex-col md:flex-row gap-12 items-center justify-between">
            
            {/* Text Content */}
            <div className="flex-1 space-y-5 z-10">
              <div className="space-y-3">
                <p className="text-xs font-extrabold text-accent-dark uppercase tracking-widest">
                  Hi, {user?.name?.split(' ')[0] || 'there'}!
                </p>
                <h2 className="text-3xl md:text-5xl lg:text-5.5xl font-extrabold text-primary tracking-tight leading-[1.15] uppercase max-w-xl">
                  StudyMate is here to be <span className="bg-gradient-to-r from-accent-dark to-accent bg-clip-text text-transparent">your assistant</span>
                </h2>
                <p className="text-text-muted text-sm leading-relaxed max-w-md">
                  {pendingTasksCount > 0 
                    ? `I am here ready to help you with ${pendingTasksCount} pending tasks. Build structured 3-day study roadmaps with our AI core.`
                    : 'All caught up! Create a new study target and let our AI core build a customized 3-day plan.'
                  }
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/add-task')}
                className="bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-1.5 cursor-pointer mt-2"
              >
                <span>Let's Create Target</span>
                <Plus size={14} />
              </motion.button>
            </div>
            
            {/* Organic Floating Showcase Graphic */}
            <div className="w-full md:w-auto relative flex items-center justify-center p-8">
              
              {/* Dotted Grid - Top Right */}
              <div className="absolute -top-4 -right-2 text-primary/10 pointer-events-none hidden md:block">
                <svg width="100" height="80" fill="currentColor">
                  <pattern id="grid-dots-1" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="2" />
                  </pattern>
                  <rect width="100" height="80" fill="url(#grid-dots-1)" />
                </svg>
              </div>

              {/* Dotted Grid - Bottom Left */}
              <div className="absolute -bottom-4 -left-6 text-primary/10 pointer-events-none hidden md:block">
                <svg width="80" height="100" fill="currentColor">
                  <pattern id="grid-dots-2" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="2" />
                  </pattern>
                  <rect width="80" height="100" fill="url(#grid-dots-2)" />
                </svg>
              </div>

              {/* Ambient Blob Glows behind organic shape */}
              <div className="absolute inset-0 bg-[#FEB063]/30 rounded-[55%_45%_45%_55%_/_45%_55%_45%_55%] rotate-6 scale-102 pointer-events-none filter blur-xs" />
              <div className="absolute inset-0 bg-primary/20 rounded-[45%_55%_55%_45%_/_55%_45%_55%_45%] -rotate-3 scale-105 pointer-events-none filter blur-xs" />
              
              {/* Central Blob Container */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
                className="relative max-w-sm w-full md:w-[280px] lg:w-[320px] aspect-4/3 overflow-hidden rounded-[55%_45%_45%_55%_/_45%_55%_45%_55%] border-4 border-white shadow-xl pointer-events-auto"
              >
                <img 
                  src="/dashboard_banner.jpg" 
                  alt="Happy Student Workspace" 
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating Card 1: Progress */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -left-8 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-primary/5 shadow-lg flex items-center gap-2.5 z-20 pointer-events-none"
              >
                <div className="bg-[#FEB063]/25 p-1.5 rounded-lg text-accent-dark">
                  <Trophy size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-primary leading-tight">{progressData.progress}%</p>
                  <p className="text-[8px] text-text-muted leading-none">Completed</p>
                </div>
              </motion.div>

              {/* Floating Card 2: Targets */}
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute top-[40%] -right-10 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-primary/5 shadow-lg flex items-center gap-2.5 z-20 pointer-events-none"
              >
                <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                  <Bookmark size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-primary leading-tight">{progressData.totalTasks} Targets</p>
                  <p className="text-[8px] text-text-muted leading-none">Active</p>
                </div>
              </motion.div>

              {/* Floating Card 3: AI Status */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute -bottom-4 left-[15%] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-primary/5 shadow-lg flex items-center gap-2.5 z-20 pointer-events-none"
              >
                <div className="bg-[#FEB063]/25 p-1.5 rounded-lg text-accent-dark">
                  <Sparkles size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-primary leading-tight">AI Assistant</p>
                  <p className="text-[8px] text-text-muted leading-none">Companion Active</p>
                </div>
              </motion.div>

            </div>
          </section>
        </motion.div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Stats & Create Form CTA */}
          <motion.section variants={itemVariants} className="lg:col-span-4 space-y-8">
            
            {/* Progress Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-primary/5 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Trophy size={16} className="text-accent-dark" />
                  Your Study Progress
                </h3>
                <span className="text-xl font-extrabold text-primary">{progressData.progress}%</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-[#F5E6D3]/40 h-3 rounded-full overflow-hidden mb-6 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressData.progress}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.3 }}
                  className="bg-accent h-full rounded-full shadow-sm" 
                />
              </div>

              {/* Stat Counters */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-3 rounded-xl border border-primary/5 shadow-2xs hover:border-primary/10 transition-colors">
                  <span className="block text-xl font-extrabold text-primary">{progressData.totalTasks}</span>
                  <span className="text-[10px] font-bold text-text-muted/70 uppercase">Total Tasks</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-primary/5 shadow-2xs hover:border-primary/10 transition-colors">
                  <span className="block text-xl font-extrabold text-primary">{progressData.completedTasks}</span>
                  <span className="text-[10px] font-bold text-text-muted/70 uppercase">Completed</span>
                </div>
              </div>
            </div>

            {/* Create Task CTA Card */}
            <motion.div 
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              onClick={() => navigate('/add-task')}
              className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-6 border border-white/10 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer group"
            >
              {/* Internal decorative shape */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/15 transition-colors" />
              <div className="absolute top-[-20%] left-[-10%] w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-xl border border-white/10 inline-block">
                  <Sparkles size={20} className="text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold leading-snug">New Study Target</h4>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Set up a new subject and topic. Our AI core will build a customized 3-day plan.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-bold text-accent group-hover:text-white transition-colors pt-2">
                  <span>Create Target</span>
                  <Plus size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>

          </motion.section>

          {/* Right Column: Task Lists & AI Drawer */}
          <motion.section variants={itemVariants} className="lg:col-span-8 space-y-6">
            
            {/* Controls panel: Header + Filter Tab */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-3 rounded-2xl border border-primary/5">
              <h3 className="text-base font-extrabold text-primary tracking-tight px-2">Your Task Sanctuary</h3>
              
              {/* Filter Tabs */}
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
            </div>

            {/* Error alerts */}
            {taskError && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{taskError}</span>
              </div>
            )}

            {/* Task list container */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 text-center border border-primary/5 shadow-2xs">
                  <div className="inline-block bg-[#F5E6D3]/40 p-4 rounded-full text-text-muted/50 mb-3">
                    <Clock size={32} />
                  </div>
                  <h4 className="text-sm font-bold text-primary mb-1">No Study Tasks Found</h4>
                  <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                    {filter === 'all' 
                      ? 'Add your first task in the left pane to get started on your academic targets!' 
                      : `No tasks found matching "${filter}" status.`}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const isExpanded = expandedTask === task._id;
                  
                  // Setup priority color styles
                  let priorityStyles = '';
                  if (task.priority === 'High') priorityStyles = 'bg-rose-50 text-rose-700 border-rose-200/50';
                  else if (task.priority === 'Medium') priorityStyles = 'bg-amber-50 text-amber-800 border-amber-200/50';
                  else priorityStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200/50';

                  return (
                    <motion.div 
                      key={task._id}
                      layout
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 200, damping: 18 }}
                      className={`bg-white rounded-2xl border border-primary/5 shadow-2xs hover:shadow-xs transition-all duration-300 overflow-hidden ${
                        task.status === 'completed' ? 'opacity-80' : ''
                      }`}
                    >
                      {/* Task Info Row */}
                      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {/* Toggle Status Checkbox */}
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

                            {/* Topic Title */}
                            <h4 className={`text-sm md:text-base font-extrabold text-primary leading-snug ${task.status === 'completed' ? 'line-through text-text-muted/50' : ''}`}>
                              {task.topic}
                            </h4>

                            {/* Due Date Info */}
                            <div className="flex items-center gap-1 text-[10px] text-text-muted/65">
                              <CalendarDays size={13} />
                              <span>Deadline: {formatDate(task.deadline)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex items-center gap-2.5 self-end sm:self-center">
                          {/* AI Action button */}
                          {task.status === 'pending' && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                if (task.aiPlan && task.aiPlan.length > 0) {
                                  setExpandedTask(isExpanded ? null : task._id);
                                } else {
                                  handleGeneratePlan(task._id);
                                }
                              }}
                              disabled={aiLoadingId === task._id}
                              className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl transition-all duration-250 disabled:opacity-50 cursor-pointer shadow-2xs ${
                                task.aiPlan && task.aiPlan.length > 0
                                  ? 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10'
                                  : 'bg-accent/15 hover:bg-accent/25 text-amber-950 border border-accent/20'
                              }`}
                            >
                              <Sparkles size={13} className={`${aiLoadingId === task._id ? 'animate-spin text-amber-700' : 'text-amber-600'}`} />
                              <span>
                                {aiLoadingId === task._id 
                                  ? 'Generating...' 
                                  : task.aiPlan && task.aiPlan.length > 0 
                                    ? isExpanded ? 'Hide AI Plan' : 'View AI Plan' 
                                    : 'AI Study Plan'
                                }
                              </span>
                            </motion.button>
                          )}

                          {/* Delete Button */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-2 text-text-muted/50 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Collapsible Roadmap AI Drawer */}
                      <AnimatePresence>
                        {isExpanded && task.aiPlan && task.aiPlan.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden border-t border-primary/5 bg-[#F9F7F4]/60"
                          >
                            <div className="p-6 space-y-4">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                                <Sparkles size={14} className="text-amber-500" />
                                <span>3-Day Structured Roadmap</span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {task.aiPlan.map((planStep, idx) => (
                                  <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                                    className="bg-white p-4.5 rounded-xl border border-primary/5 shadow-3xs flex flex-col justify-between space-y-3"
                                  >
                                    <div>
                                      {/* Day Banner */}
                                      <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] font-extrabold text-accent-dark uppercase tracking-wider bg-accent/15 px-2 py-0.5 rounded">
                                          Day {planStep.day}
                                        </span>
                                      </div>
                                      
                                      {/* Step Title */}
                                      <h5 className="text-xs font-extrabold text-primary mb-3 leading-snug">{planStep.title}</h5>
                                      
                                      {/* Subtasks */}
                                      <ul className="space-y-2 text-[11px] text-text-muted/90 pl-3.5 list-disc">
                                        {planStep.tasks && planStep.tasks.map((stepItem, subIdx) => (
                                          <li key={subIdx} className="leading-relaxed">{stepItem}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  );
                })
              )}
            </div>

          </motion.section>

        </div>

      </motion.main>
    </div>
  );
};

export default Dashboard;
