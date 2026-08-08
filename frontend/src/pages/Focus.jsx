import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Coffee, 
  Sparkles,
  Volume2,
  VolumeX
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

const quotes = [
  "Focus is a muscle, and you are building it right now.",
  "Your study sanctuary is a place of progress, not perfection.",
  "Small, consistent steps build massive academic results.",
  "Deep work yields deep understanding. Stay in the zone.",
  "Make today count. One Pomodoro session at a time."
];

const Focus = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const topic = searchParams.get('topic') || '';
  const subject = searchParams.get('subject') || '';

  // Timer Configuration (25 mins standard Pomodoro, 5 mins break)
  const STUDY_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [mode, setMode] = useState('study'); // study, break
  const [timeLeft, setTimeLeft] = useState(STUDY_TIME);
  const [isActive, setIsActive] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Timer Tick Core Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    // Play alert sound if active
    if (soundActive) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.8);
      } catch (e) {
        console.error(e);
      }
    }

    if (mode === 'study') {
      Swal.fire({
        title: 'Session Complete! 🎉',
        text: 'Time for a well-deserved short break.',
        icon: 'success',
        confirmButtonColor: '#1b4b4a',
        background: '#faf7f2',
        color: '#1b1c1c'
      }).then(() => {
        setMode('break');
        setTimeLeft(BREAK_TIME);
      });
    } else {
      Swal.fire({
        title: 'Break Complete! ⚡',
        text: 'Ready to start another study session?',
        icon: 'info',
        confirmButtonColor: '#1b4b4a',
        background: '#faf7f2',
        color: '#1b1c1c'
      }).then(() => {
        setMode('study');
        setTimeLeft(STUDY_TIME);
      });
    }
    
    // Switch to a new quote
    setQuoteIdx((prev) => (prev + 1) % quotes.length);
  };

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? STUDY_TIME : BREAK_TIME);
  };

  const handleModeChange = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'study' ? STUDY_TIME : BREAK_TIME);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressFraction = timeLeft / (mode === 'study' ? STUDY_TIME : BREAK_TIME);
  const strokeDashoffset = progressFraction * 282.6; // Circumference calculation (diameter 90 * pi)

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
        className="max-w-xl mx-auto px-6 mt-10 space-y-8 relative z-10"
      >
        
        {/* Back navigation */}
        <div className="flex justify-between items-center">
          <motion.button 
            whileHover={{ x: -3 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Dashboard Menu</span>
          </motion.button>

          {/* Sound alert toggler */}
          <button 
            onClick={() => setSoundActive(!soundActive)}
            className="p-2 rounded-xl bg-white border border-primary/5 hover:border-primary/10 text-primary transition-colors shadow-3xs cursor-pointer"
          >
            {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Title block */}
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 bg-[#F5E6D3]/60 px-3 py-1 rounded-lg border border-primary/5 mx-auto">
            <Clock size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Deep Work</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Focus Sanctuary</h1>
          
          {topic && (
            <div className="bg-primary/5 text-primary text-xs font-bold py-1.5 px-3 rounded-lg w-fit mx-auto mt-2 border border-primary/10">
              {subject ? `${subject} : ` : ''}{topic}
            </div>
          )}
        </motion.div>

        {/* Pomodoro Timer Face Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 border border-white/50 shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden"
        >
          {/* Mode Tabs */}
          <div className="flex bg-[#F5E6D3]/40 p-1.5 rounded-xl border border-primary/5 w-64 justify-center">
            <button
              onClick={() => handleModeChange('study')}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                mode === 'study' 
                  ? 'bg-white text-primary shadow-xs' 
                  : 'text-text-muted/70 hover:text-primary'
              }`}
            >
              <Sparkles size={11} />
              <span>Study Session</span>
            </button>
            <button
              onClick={() => handleModeChange('break')}
              className={`flex-1 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                mode === 'break' 
                  ? 'bg-white text-primary shadow-xs' 
                  : 'text-text-muted/70 hover:text-primary'
              }`}
            >
              <Coffee size={11} />
              <span>Short Break</span>
            </button>
          </div>

          {/* Glowing Timer Circle */}
          <div className="relative flex items-center justify-center w-60 h-60">
            {/* Ambient pulse glow behind clock when timer is active */}
            <AnimatePresence>
              {isActive && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1.05, opacity: 0.3 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className="absolute inset-2 bg-accent/20 rounded-full filter blur-xl"
                />
              )}
            </AnimatePresence>

            {/* SVG Ring Progress */}
            <svg height="200" width="200" className="transform -rotate-90">
              <circle
                stroke="#F5E6D3/40"
                fill="transparent"
                strokeWidth="8"
                r="90"
                cx="100"
                cy="100"
              />
              <motion.circle
                stroke={mode === 'study' ? '#feb063' : '#1b4b4a'}
                fill="transparent"
                strokeWidth="8"
                strokeDasharray="565.2" // 2 * pi * 90
                strokeDashoffset={strokeDashoffset * 2} // multiplier for circle radius adjustment
                r="90"
                cx="100"
                cy="100"
                animate={{ strokeDashoffset: progressFraction * 565.2 }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            
            {/* Time numbers inside circle */}
            <div className="absolute text-center space-y-1">
              <div className="text-4xl font-black text-primary tracking-tight font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-text-muted/70">
                {mode === 'study' ? 'focus study' : 'relax break'}
              </div>
            </div>
          </div>

          {/* Controls button row */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleTimer}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer ${
                isActive ? 'bg-primary hover:bg-primary-dark' : 'bg-accent hover:bg-accent-dark text-primary-dark'
              }`}
            >
              {isActive ? <Pause size={20} /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetTimer}
              className="w-14 h-14 rounded-full bg-white border border-primary/5 hover:border-primary/10 text-primary-dark flex items-center justify-center shadow-3xs cursor-pointer"
            >
              <RotateCcw size={20} />
            </motion.button>
          </div>

        </motion.div>

        {/* Quotes card banner */}
        <motion.div 
          variants={itemVariants}
          className="text-center p-6 bg-white/40 border border-primary/5 rounded-2xl"
        >
          <p className="text-xs italic text-text-muted font-medium">
            "{quotes[quoteIdx]}"
          </p>
        </motion.div>

      </motion.main>
    </div>
  );
};

export default Focus;
