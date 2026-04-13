import React, { useState } from 'react';
import { FiX, FiCheck, FiLayers, FiTag, FiHash, FiActivity } from 'react-icons/fi';

export default function AssetModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    quantity: 1,
    status: 'Available'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
    setForm({ name: '', category: '', quantity: 1, status: 'Available' });
    onClose();
  };

  const CATEGORIES = ['Hardware', 'Software', 'Furniture', 'Mobile', 'Other'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60 animate-fade-in">
      <div className="bg-[#0b0e1a] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl animate-slide-up overflow-hidden">
        
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div>
              <h2 className="text-xl font-bold text-white">New Asset</h2>
              <p className="text-xs text-slate-500 mt-1">Add a new record to your inventory</p>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors">
              <FiX className="text-xl" />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           
           <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Asset Name</label>
              <div className="relative">
                 <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                 <input 
                    type="text" name="name" required value={form.name} onChange={handleChange}
                    placeholder="e.g. MacBook Pro M3"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                 <div className="relative">
                    <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                    <select 
                       name="category" required value={form.category} onChange={handleChange}
                       className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 appearance-none transition-colors"
                    >
                       <option value="" disabled className="bg-[#0b0e1a]">Select</option>
                       {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0b0e1a]">{c}</option>)}
                    </select>
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Quantity</label>
                 <div className="relative">
                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm" />
                    <input 
                       type="number" name="quantity" min="1" required value={form.quantity} onChange={handleChange}
                       className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                 </div>
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
              <div className="grid grid-cols-2 gap-3">
                 {['Available', 'In Use'].map(st => (
                    <button 
                       key={st} type="button" 
                       onClick={() => setForm({...form, status: st})}
                       className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${form.status === st ? 'bg-violet-600/10 border-violet-500/50 text-violet-400' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}
                    >
                       <FiActivity className={form.status === st ? 'text-violet-400' : 'text-slate-600'} />
                       {st}
                    </button>
                 ))}
              </div>
           </div>

           <div className="pt-4">
              <button 
                 type="submit" disabled={loading}
                 className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl text-sm font-bold shadow-xl shadow-violet-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                 {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiCheck /> Register Asset</>}
              </button>
           </div>
        </form>

      </div>
    </div>
  );
}
