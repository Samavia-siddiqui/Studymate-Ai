import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  LogOut, 
  BookOpen, 
  Trophy, 
  Clock,
  TrendingUp,
  Bookmark,
  Target,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

// Framer Motion staggered entrance variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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
  const [taskError, setTaskError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      // Fetch both tasks and progress
      const [tasksRes, progressRes] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/tasks/progress')
      ]);
      setTasks(tasksRes.data);
      setProgressData(progressRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setTaskError('Failed to load portal metrics.');
    }
  };

  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 relative overflow-x-hidden">
      
      {/* ================= BACKGROUND FLOATING SHAPES ================= */}
      {/* Glow Orbs */}
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none animate-pulse" />
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

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#1b4b4a_1px,transparent_1px),linear-gradient(to_bottom,#1b4b4a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
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

      {/* Main Container */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 mt-8 relative z-10 space-y-12"
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

        {/* Feature Navigation Cards - Explains what the App does & links to pages */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xl font-extrabold text-primary uppercase tracking-wider">Explore Sanctuary Spaces</h3>
            <p className="text-text-muted text-xs font-semibold">Navigate to specialized study compartments engineered to maximize focus.</p>
          </div>

          {taskError && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert size={16} />
              <span>{taskError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Task Sanctuary */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              onClick={() => navigate('/tasks')}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-primary/5 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group h-64"
            >
              <div className="space-y-4">
                <div className="bg-primary/10 text-primary p-3.5 rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Bookmark size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-primary">Task Sanctuary</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Organize your academic syllabus. Create specific study items, schedule deadlines, and categorize topics by priority.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                <span className="text-[10px] font-extrabold bg-[#F5E6D3] text-primary px-2.5 py-1 rounded-md uppercase">
                  {progressData.totalTasks} Active Targets
                </span>
                <span className="text-xs font-bold text-primary group-hover:text-accent-dark flex items-center gap-1 transition-colors">
                  Open Sanctuary <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>

            {/* Card 2: AI Study Blueprints */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              onClick={() => navigate('/tasks')}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-primary/5 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group h-64"
            >
              <div className="space-y-4">
                <div className="bg-accent/15 text-accent-dark p-3.5 rounded-2xl w-fit group-hover:bg-accent group-hover:text-primary-dark transition-all duration-300">
                  <Sparkles size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-primary">AI Study Plans</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Unlock customized 3-day learning roadmaps generated for your topics using Gemini AI. Break down complex subjects into daily steps.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                <span className="text-[10px] font-extrabold bg-[#F5E6D3] text-primary px-2.5 py-1 rounded-md uppercase">
                  Gemini Core 3.5
                </span>
                <span className="text-xs font-bold text-primary group-hover:text-accent-dark flex items-center gap-1 transition-colors">
                  Generate Plans <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>

            {/* Card 3: Academic Progress Tracker */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              onClick={() => navigate('/progress')}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-primary/5 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group h-64"
            >
              <div className="space-y-4">
                <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-2xl w-fit group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Trophy size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-primary">Progress Tracker</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Check complete ratio parameters, study success charts, and review academic statistics for subjects and priority distributions.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md uppercase">
                  {progressData.progress}% Completed
                </span>
                <span className="text-xs font-bold text-primary group-hover:text-accent-dark flex items-center gap-1 transition-colors">
                  View Analytics <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>

            {/* Card 4: Pomodoro Focus clock */}
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
              onClick={() => navigate('/focus')}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border border-primary/5 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group h-64"
            >
              <div className="space-y-4">
                <div className="bg-[#FEB063]/20 text-accent-dark p-3.5 rounded-2xl w-fit group-hover:bg-accent group-hover:text-primary-dark transition-all duration-300">
                  <Clock size={22} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-extrabold text-primary">Focus Sanctuary</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Access our custom study timer. Features standard study/break intervals and a deep focus interface with visual auditory waves.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-primary/5">
                <span className="text-[10px] font-extrabold bg-[#F5E6D3] text-primary px-2.5 py-1 rounded-md uppercase">
                  Pomodoro 25/5 min
                </span>
                <span className="text-xs font-bold text-primary group-hover:text-accent-dark flex items-center gap-1 transition-colors">
                  Start Session <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default Dashboard;
