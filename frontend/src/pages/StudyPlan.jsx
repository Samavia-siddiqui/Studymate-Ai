import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trophy, 
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 14 } }
};

const StudyPlan = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Checklist local states
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTaskDetails();
  }, [token, id, navigate]);

  const fetchTaskDetails = async () => {
    try {
      const response = await api.get(`/api/tasks/${id}`);
      setTask(response.data);
      
      // Load checked items from localStorage
      const localKey = `plan_subtasks_${id}`;
      const saved = localStorage.getItem(localKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load study plan. Please make sure the task exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCheck = (dayIdx, taskIdx) => {
    const itemKey = `${dayIdx}_${taskIdx}`;
    const newChecked = {
      ...checkedItems,
      [itemKey]: !checkedItems[itemKey]
    };
    setCheckedItems(newChecked);
    
    // Save to localStorage
    const localKey = `plan_subtasks_${id}`;
    localStorage.setItem(localKey, JSON.stringify(newChecked));
  };

  // Calculations for overall blueprint progress
  const getProgressStats = () => {
    if (!task || !task.aiPlan) return { total: 0, completed: 0, pct: 0 };
    
    let total = 0;
    let completed = 0;
    
    task.aiPlan.forEach((dayPlan, dayIdx) => {
      if (dayPlan.tasks) {
        dayPlan.tasks.forEach((_, taskIdx) => {
          total++;
          const itemKey = `${dayIdx}_${taskIdx}`;
          if (checkedItems[itemKey]) {
            completed++;
          }
        });
      }
    });
    
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct };
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
            <Sparkles size={36} className="text-accent-dark" />
          </motion.div>
          <p className="text-sm font-bold text-primary tracking-wide">Loading AI study blueprint...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-primary/5 shadow-xl text-center max-w-md space-y-4">
          <div className="inline-block text-red-500 bg-red-50 p-4 rounded-full">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-primary">Error Loading Blueprint</h3>
          <p className="text-xs text-text-muted">{error || 'Task details could not be found.'}</p>
          <button 
            onClick={() => navigate('/tasks')}
            className="w-full bg-primary text-white py-3 rounded-xl text-xs font-bold cursor-pointer"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const { total, completed, pct } = getProgressStats();

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 relative overflow-hidden">
      
      {/* Background Shapes */}
      <div className="absolute top-[-5%] right-[-10%] w-[450px] h-[450px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[115px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#1b4b4a_1px,transparent_1px),linear-gradient(to_bottom,#1b4b4a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-6 mt-10 space-y-8 relative z-10"
      >
        
        {/* Nav Header */}
        <div className="flex justify-between items-center">
          <motion.button 
            whileHover={{ x: -3 }}
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Tasks</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/focus?topic=${encodeURIComponent(task.topic)}&subject=${encodeURIComponent(task.subject)}`)}
            className="bg-accent hover:bg-accent-dark text-primary font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Play size={13} fill="currentColor" />
            <span>Start Study Session</span>
          </motion.button>
        </div>

        {/* Blueprint Main Header */}
        <motion.div variants={itemVariants} className="bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-primary/5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="bg-primary/10 text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                {task.subject}
              </span>
              <span className="bg-accent/15 text-accent-dark text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                AI Roadmap
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight leading-snug">
              {task.topic}
            </h1>
            <p className="text-text-muted text-xs md:text-sm">
              Your personalized 3-day master guide prepared by StudyMate AI.
            </p>
          </div>

          {/* Blueprint Progress */}
          <div className="w-full md:w-60 bg-white p-4.5 rounded-2xl border border-primary/5 shadow-3xs space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-primary">
              <span className="flex items-center gap-1">
                <Trophy size={14} className="text-accent-dark" />
                Plan Progress
              </span>
              <span>{pct}%</span>
            </div>
            <div className="w-full bg-[#F5E6D3]/40 h-2.5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${pct}%` }}
                className="bg-accent h-full rounded-full shadow-sm" 
              />
            </div>
            <p className="text-[10px] text-text-muted/70 font-semibold text-center">
              {completed}/{total} subtasks completed
            </p>
          </div>
        </motion.div>

        {/* Success celebration card */}
        <AnimatePresence>
          {pct === 100 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="bg-gradient-to-r from-accent to-[#FEB063]/75 border border-accent/10 rounded-2xl p-6 text-primary-dark shadow-md flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="bg-white/20 p-3 rounded-full text-accent-dark">
                <Trophy size={28} />
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <h4 className="text-base font-extrabold">Roadmap Fully Completed! 🎉</h4>
                <p className="text-xs text-primary-dark/80 font-medium">
                  Outstanding job! You have conquered all 3 days of your learning plan. Keep up the amazing academic momentum.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3-Day Column Layout */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {task.aiPlan && task.aiPlan.map((planStep, dayIdx) => (
            <motion.div 
              key={dayIdx} 
              variants={itemVariants}
              className="bg-white rounded-2xl border border-primary/5 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-4.5 space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent">Day {planStep.day}</span>
                  <h4 className="text-xs font-bold leading-normal">{planStep.title}</h4>
                </div>

                {/* Subtask list */}
                <div className="p-5 space-y-4">
                  {planStep.tasks && planStep.tasks.map((stepItem, taskIdx) => {
                    const itemKey = `${dayIdx}_${taskIdx}`;
                    const isChecked = !!checkedItems[itemKey];

                    return (
                      <motion.div 
                        key={taskIdx}
                        onClick={() => handleToggleCheck(dayIdx, taskIdx)}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <button className="text-primary mt-0.5 flex-shrink-0 cursor-pointer">
                          {isChecked 
                            ? <CheckCircle2 size={18} className="text-accent-dark" />
                            : <Circle size={18} className="text-text-muted/30 group-hover:text-primary transition-colors" />
                          }
                        </button>
                        <span className={`text-[11px] leading-relaxed select-none ${isChecked ? 'line-through text-text-muted/40 font-medium' : 'text-text-muted'}`}>
                          {stepItem}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Day footer indicator */}
              <div className="border-t border-primary/5 p-4 bg-[#F9F7F4]/30 text-center">
                <span className="text-[10px] text-text-muted/60 font-extrabold uppercase tracking-widest">
                  Day {planStep.day} Blueprint Complete
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </motion.main>
    </div>
  );
};

export default StudyPlan;
