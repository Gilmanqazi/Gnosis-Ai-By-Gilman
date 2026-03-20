import React, { useState } from 'react';
import { useAuth } from '../Hook/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiShield, FiZap } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = { email, password };
      let data = await handleLogin(payload);

      if (data?.success) {
        toast.success("Identity Verified");
        navigate("/");
      } else {
        setError(data?.message || "Invalid credentials");
        toast.error("Access Denied");
      }
    } catch (err) {
      setError("Intelligence Engine unreachable");
    } finally {
      setIsSubmitting(false);
    }
  };

  if(!loading && user){
return <Navigate to="/" replace/>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020202] text-gray-200 font-sans relative overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-30 grayscale"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/80 via-[#020202]/40 to-[#020202]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white text-black mb-6 shadow-[0_0_40px_rgba(255,255,255,0.2)] transform -rotate-12">
            <FiZap className="text-3xl" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">Gnosis</h1>
          <p className="text-gray-400 text-xs uppercase tracking-[0.3em]">Neural Interface v1.0</p>
        </div>

        {/* Glass Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Access Portal</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="neural-id@Gnosis.ai"
                className="w-full bg-white/[0.05] border border-white/5 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-white placeholder-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security Key</label>
              </div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.05] border border-white/5 px-4 py-3.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-white placeholder-gray-600"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-[11px] bg-red-400/10 p-3 rounded-xl border border-red-400/20">
                <FiShield className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              {isSubmitting ? "Syncing..." : "Authorize"}
              {!isSubmitting && <FiArrowRight />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs">
              No access? <Link to="/register" className="text-white font-bold hover:underline">Request Node</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;