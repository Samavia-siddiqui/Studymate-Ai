import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, GraduationCap, Sparkles, BookOpen } from 'lucide-react';

const Login = ({ initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);

  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, confirmPassword } = formData;

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !name) {
      setError('Please provide your name.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      {/* Floating Geometric shapes */}
      <motion.div 
        animate={{ 
          rotate: 360,
          y: [0, -12, 0]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-[10%] right-[5%] w-24 h-24 rounded-full border-2 border-dashed border-primary/20 pointer-events-none hidden md:block"
      />
      <motion.div 
        animate={{ 
          rotate: [45, 90, 45],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[12%] left-[4%] w-14 h-14 bg-accent/15 border border-accent/20 rounded-lg pointer-events-none hidden md:block"
      />
      
      {/* Floating abstract lines grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#1b4b4a_1px,transparent_1px),linear-gradient(to_bottom,#1b4b4a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main card container */}
      <div className="z-10 w-full max-w-5xl bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* Left column: Visual display (hidden on mobile) */}
        <div className="hidden md:flex md:col-span-6 bg-gradient-to-br from-primary via-primary/95 to-primary-dark p-12 flex-col justify-between relative overflow-hidden text-white">
          {/* Subtle pattern background overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Top Info */}
          <div className="z-10 flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20">
              <BookOpen size={24} className="text-accent" />
            </div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              StudyMate AI
            </span>
          </div>

          {/* Central graphic showcasing the generated image */}
          <div className="z-10 my-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-accent/10 rounded-2xl filter blur-xl scale-105" />
            <img 
              src="/login_illustration.jpg" 
              alt="Cozy Study Haven" 
              className="w-full max-w-[340px] aspect-square object-cover rounded-2xl shadow-2xl border border-white/15 transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Bottom text */}
          <div className="z-10 space-y-3">
            <h2 className="text-2xl font-bold leading-tight">Your Academic Sanctuary</h2>
            <p className="text-white/75 text-sm leading-relaxed max-w-sm">
              Organize your tasks, generate structured 3-day study plans powered by AI, and track your metrics effortlessly.
            </p>
          </div>
        </div>

        {/* Right column: Login / Signup Form */}
        <div className="col-span-12 md:col-span-6 p-8 md:p-12 flex flex-col justify-center bg-white/40">
          
          {/* Brand header for mobile */}
          <div className="flex md:hidden items-center gap-2 mb-6 justify-center">
            <BookOpen size={24} className="text-primary" />
            <span className="text-2xl font-extrabold text-primary">StudyMate</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight mb-2">
              {isLogin ? 'Welcome Back!' : 'Get Started'}
            </h1>
            <p className="text-text-muted text-sm">
              {isLogin ? 'Enter your credentials to access your study portal.' : 'Create a free account to structure your learning.'}
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="relative flex bg-[#F5E6D3]/40 p-1.5 rounded-xl mb-6 border border-primary/5">
            <div
              className={`absolute top-1.5 left-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] bg-white rounded-lg shadow-sm transition-transform duration-300 ${
                isLogin ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
            <button
              type="button"
              onClick={() => { navigate('/login'); setError(''); }}
              className={`relative z-10 w-1/2 py-2.5 text-xs font-bold tracking-wide transition-colors duration-300 cursor-pointer ${
                isLogin ? 'text-primary' : 'text-text-muted/70'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { navigate('/signup'); setError(''); }}
              className={`relative z-10 w-1/2 py-2.5 text-xs font-bold tracking-wide transition-colors duration-300 cursor-pointer ${
                !isLogin ? 'text-primary' : 'text-text-muted/70'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 animate-ping" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field (Signup only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block px-0.5" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/65">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-sm text-text-main placeholder:text-text-muted/40 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary block px-0.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/65">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-sm text-text-main placeholder:text-text-muted/40 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <label className="text-xs font-bold text-primary" htmlFor="password">
                  Password
                </label>
                {isLogin && (
                  <span className="text-[10px] font-bold text-accent-dark hover:underline cursor-pointer transition-all">
                    Forgot Password?
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/65">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-white border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-sm text-text-main placeholder:text-text-muted/40 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-text-muted/60 hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password field (Signup only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary block px-0.5" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted/65">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-white border border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-xl text-sm text-text-main placeholder:text-text-muted/40 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-6"
            >
              <span>{loading ? 'Processing...' : isLogin ? 'Login to Sanctuary' : 'Create My Account'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Policy footnotes */}
          <p className="mt-8 text-center text-[10px] text-text-muted/70 leading-relaxed">
            By continuing, you agree to our{' '}
            <span className="text-primary font-bold hover:underline cursor-pointer">Privacy Policy</span> and{' '}
            <span className="text-primary font-bold hover:underline cursor-pointer">Terms of Service</span>.
          </p>
        </div>
      </div>
      
      {/* Decorative footer */}
      <footer className="fixed bottom-4 left-0 w-full text-center text-[10px] text-text-muted/40 pointer-events-none">
        © 2026 StudyMate AI. All rights reserved.
      </footer>
    </main>
  );
};

export default Login;
