import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Trophy, 
  TrendingUp, 
  Bookmark, 
  CheckCircle, 
  Clock, 
  Sparkles,
  AlertTriangle,
  Target
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 14 } }
};

const Progress = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [progressData, setProgressData] = useState({ totalTasks: 0, completedTasks: 0, progress: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    try {
      const [tasksRes, progressRes] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/tasks/progress')
      ]);
      setTasks(tasksRes.data);
      setProgressData(progressRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load progress analytics.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityCounts = () => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach(task => {
      if (counts[task.priority] !== undefined) {
        counts[task.priority]++;
      }
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[350px] h-[350px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="text-center space-y-4 z-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block text-primary"
          >
            <Trophy size={36} className="text-accent-dark" />
          </motion.div>
          <p className="text-sm font-bold text-primary tracking-wide">Compiling statistics...</p>
        </div>
      </div>
    );
  }

  const priorityCounts = getPriorityCounts();
  const pendingCount = progressData.totalTasks - progressData.completedTasks;

  // Circular progress calculations
  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressData.progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 relative overflow-hidden">
      
      {/* Background Shapes */}
      <div className="absolute top-[-5%] right-[-10%] w-[450px] h-[450px] rounded-full bg-primary/10 blur-[125px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[105px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#1b4b4a_1px,transparent_1px),linear-gradient(to_bottom,#1b4b4a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Content */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto px-6 mt-10 space-y-8 relative z-10"
      >
        
        {/* Back navigation */}
        <motion.button 
          whileHover={{ x: -3 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Dashboard Menu</span>
        </motion.button>

        {/* Title Block */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="inline-flex items-center gap-1 bg-[#F5E6D3]/60 px-3 py-1 rounded-lg border border-primary/5">
            <TrendingUp size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Progress Tracker</h1>
          <p className="text-text-muted text-sm max-w-lg">
            Track completion rates, active targets, and view subject distribution statistics.
          </p>
        </motion.div>

        {/* Analytics Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Circular Progress Ring Card */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-5 bg-white/70 backdrop-blur-2xl rounded-3xl p-8 border border-white/50 shadow-2xs flex flex-col items-center justify-center text-center space-y-5"
          >
            <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider">Completion Rate</h4>
            
            <div className="relative flex items-center justify-center">
              <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                <circle
                  stroke="#F5E6D3"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <motion.circle
                  stroke="#feb063"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute text-2xl font-extrabold text-primary">
                {progressData.progress}%
              </div>
            </div>
            
            <p className="text-[11px] text-text-muted leading-relaxed max-w-xs font-medium">
              {progressData.progress === 100 
                ? 'Incredible! You have completed all study targets. Outstanding performance!'
                : progressData.progress > 50 
                  ? 'Great progress! You are more than halfway through your active study targets.'
                  : 'Start learning by completing subtasks on your AI blueprints.'
              }
            </p>
          </motion.div>

          {/* Quick Stats list */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-7 grid grid-cols-2 gap-4"
          >
            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-3xs flex flex-col justify-between">
              <div className="bg-primary/10 text-primary p-2 rounded-xl w-fit">
                <Bookmark size={18} />
              </div>
              <div className="space-y-1 mt-6">
                <span className="block text-2xl font-extrabold text-primary">{progressData.totalTasks}</span>
                <span className="text-[9px] font-extrabold text-text-muted/70 uppercase">Total targets</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-3xs flex flex-col justify-between">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl w-fit">
                <CheckCircle size={18} />
              </div>
              <div className="space-y-1 mt-6">
                <span className="block text-2xl font-extrabold text-emerald-800">{progressData.completedTasks}</span>
                <span className="text-[9px] font-extrabold text-text-muted/70 uppercase">Completed targets</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-3xs flex flex-col justify-between">
              <div className="bg-amber-50 text-amber-700 p-2 rounded-xl w-fit">
                <Clock size={18} />
              </div>
              <div className="space-y-1 mt-6">
                <span className="block text-2xl font-extrabold text-amber-900">{pendingCount}</span>
                <span className="text-[9px] font-extrabold text-text-muted/70 uppercase">Pending targets</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-primary/5 shadow-3xs flex flex-col justify-between">
              <div className="bg-[#FEB063]/20 text-accent-dark p-2 rounded-xl w-fit">
                <Sparkles size={18} />
              </div>
              <div className="space-y-1 mt-6">
                <span className="block text-2xl font-extrabold text-primary">
                  {tasks.filter(t => t.aiPlan && t.aiPlan.length > 0).length}
                </span>
                <span className="text-[9px] font-extrabold text-text-muted/70 uppercase">Roadmaps generated</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Priority breakdown card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 border border-primary/5 shadow-3xs space-y-4"
        >
          <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Target size={15} />
            Target Priority Distribution
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
              <span className="block text-xl font-extrabold text-rose-700">{priorityCounts.High}</span>
              <span className="text-[9px] font-bold text-rose-800/70 uppercase">🔴 High</span>
            </div>
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <span className="block text-xl font-extrabold text-amber-800">{priorityCounts.Medium}</span>
              <span className="text-[9px] font-bold text-amber-900/70 uppercase">🟡 Medium</span>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <span className="block text-xl font-extrabold text-emerald-800">{priorityCounts.Low}</span>
              <span className="text-[9px] font-bold text-emerald-800/70 uppercase">🟢 Low</span>
            </div>
          </div>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default Progress;
