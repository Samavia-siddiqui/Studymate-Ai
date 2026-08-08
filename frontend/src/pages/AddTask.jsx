import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus, Calendar, Bookmark, Target, AlertCircle } from 'lucide-react';

const AddTask = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subject: '',
    topic: '',
    deadline: '',
    priority: 'Medium',
  });
  
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    const { subject, topic, deadline, priority } = form;
    if (!subject || !topic || !deadline) {
      setFormError('Please fill in subject, topic, and deadline.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/tasks', { subject, topic, deadline, priority });
      // Redirect back to dashboard after success
      navigate('/');
    } catch (err) {
      console.error(err);
      setFormError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-text-main flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* ================= BACKGROUND FLOATING SHAPES ================= */}
      {/* Shape 1: Large Glowing Orb */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[110px] pointer-events-none" />

      {/* Shape 2: Floating Rotating Ring/Torus */}
      <motion.div 
        animate={{ 
          rotate: 360,
          y: [0, -15, 0]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full border-4 border-dashed border-primary/20 pointer-events-none hidden md:block"
      />

      {/* Shape 3: Floating Pulsing Glassmorphic Hexagon/Cube */}
      <motion.div 
        animate={{ 
          rotate: [45, 90, 45],
          scale: [1, 1.1, 1],
          x: [0, 10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[20%] right-[12%] w-16 h-16 bg-accent/15 border border-accent/20 rounded-xl pointer-events-none hidden md:block"
      />

      {/* Shape 4: Mini floating dot shapes */}
      <motion.div
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-[25%] right-[25%] w-3 h-3 bg-primary/30 rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 10, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[30%] left-[20%] w-4 h-4 bg-accent/40 rounded-full pointer-events-none"
      />

      {/* Shape 5: Floating abstract lines grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#1b4b4a_1px,transparent_1px),linear-gradient(to_bottom,#1b4b4a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      {/* ============================================================= */}

      <div className="z-10 w-full max-w-xl">
        
        {/* Back Button */}
        <motion.button 
          whileHover={{ x: -3 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </motion.button>

        {/* Create Task Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-white/50 shadow-2xl relative"
        >
          {/* Card Accent Shape */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/20 to-transparent rounded-tr-3xl rounded-bl-full pointer-events-none" />

          {/* Form Header */}
          <div className="mb-8 space-y-2">
            <div className="inline-flex items-center gap-1 bg-[#F5E6D3]/60 px-3 py-1 rounded-lg border border-primary/5">
              <Sparkles size={14} className="text-accent-dark" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">New Target</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Create Study Target</h1>
            <p className="text-text-muted text-xs md:text-sm">
              Define your subject and topic. AI will compile a specialized 3-day roadmap just for you.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateTask} className="space-y-5">
            {formError && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{formError}</span>
              </motion.div>
            )}

            {/* Subject Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary block px-0.5" htmlFor="subject">Subject</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/60">
                  <Bookmark size={16} />
                </div>
                <input 
                  type="text" 
                  name="subject" 
                  id="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  placeholder="e.g. Physics, Chemistry, Mathematics"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-xs text-text-main placeholder:text-text-muted/40 transition-all duration-200"
                />
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary block px-0.5" htmlFor="topic">Topic / Chapter</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/60">
                  <Target size={16} />
                </div>
                <input 
                  type="text" 
                  name="topic" 
                  id="topic"
                  value={form.topic}
                  onChange={handleInputChange}
                  placeholder="e.g. Thermodynamics, Linear Algebra"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-xs text-text-main placeholder:text-text-muted/40 transition-all duration-200"
                />
              </div>
            </div>

            {/* Double Row: Date and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block px-0.5" htmlFor="deadline">Deadline</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/60">
                    <Calendar size={16} />
                  </div>
                  <input 
                    type="date" 
                    name="deadline" 
                    id="deadline"
                    value={form.deadline}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-xs text-text-main placeholder:text-text-muted/40 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block px-0.5" htmlFor="priority">Task Priority</label>
                <select 
                  name="priority" 
                  id="priority"
                  value={form.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/80 border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-xs text-text-main transition-all duration-200 cursor-pointer"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 mt-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} />
              <span>{loading ? 'Creating target...' : 'Create Study Target'}</span>
            </motion.button>
          </form>

        </motion.div>
      </div>
    </main>
  );
};

export default AddTask;
