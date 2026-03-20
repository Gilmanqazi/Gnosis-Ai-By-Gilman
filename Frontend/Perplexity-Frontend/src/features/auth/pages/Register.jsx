import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../Hook/useAuth';
import { FiChevronRight, FiShield, FiUser, FiZap } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const payload = { username, email, password };
      const res = await handleRegister(payload);

      setUsername("")
        setEmail("")
        setPassword("")

      if(res?.success) {
        
        toast.success("Identity Created");
        navigate("/");
      }else{
        setError(res?.message,"Message")
      }
    } catch (err) {
      toast.error("Registration failed");
      
      console.log(err)
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020202] text-gray-200 font-sans relative overflow-hidden">
      
      {/* Background Image (Same as Login for consistency) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="background"
        />
        <div className="absolute inset-0 bg-[#020202]/60"></div>
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-white mb-4">
            <FiUser size={24}/>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">JOIN Gnosis</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mt-2">Initialize your neural profile</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem]">
          <form onSubmit={handleSubmit} className="space-y-4">

             {error && (
                          <div className="flex items-center gap-2 text-blue-400 text-[11px] bg-blue-400/10 p-3 rounded-xl border border-blue-400/20">
                            <FiShield className="shrink-0" />
                            <p>{error}</p>
                          </div>
                        )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Explorer Name</label>
              <input 
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder="Gilman_01"
                className="w-full bg-white/[0.05] border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 text-white placeholder-gray-700 text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Communication Link</label>
              <input 
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="name@nexus.ai"
                className="w-full bg-white/[0.05] border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 text-white placeholder-gray-700 text-sm"
                required
              />
            </div>

            <div className="space-y-1 border-b border-white/5 pb-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Security Key</label>
              <input 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/[0.05] border border-white/5 px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/30 text-white placeholder-gray-700 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-gray-200 to-white text-black font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isProcessing ? "Processing..." : "Create Identity"}
              {!isProcessing && <FiChevronRight />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs tracking-tight">
              Already have a node? <Link to="/login" className="text-white font-bold hover:underline ml-1">Authorize</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;