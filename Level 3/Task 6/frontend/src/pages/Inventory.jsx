import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiBox, FiPackage, FiTruck, FiAlertCircle, FiPlus, FiArrowLeft, FiTrash2, FiSearch, FiLayers, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AssetModal from '../components/AssetModal';

export default function Inventory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch Assets instead of Items for Task 2's specific asset registry
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:5004/api/assets');
      setItems(res.data.data);
      setError(null);
    } catch (err) {
      setError('Could not sync with the inventory database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (successMsg) {
       const timer = setTimeout(() => setSuccessMsg(''), 3000);
       return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleCreateAsset = async (formData) => {
     try {
        const res = await axios.post('http://127.0.0.1:5004/api/assets', formData);
        setItems([res.data.data, ...items]);
        setSuccessMsg('Asset registered successfully!');
     } catch (err) {
        alert('Failed to register asset. Please check required fields.');
     }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] font-sans antialiased text-slate-100 p-6 sm:p-10">
      
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-400 hover:text-white"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Inventory <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Dashboard</span></h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track your business assets in real-time</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 active:scale-95"
          >
            <FiPlus /> Create Asset
          </button>
        </div>
      </div>

      {/* ── Success Message ── */}
      {successMsg && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 animate-slide-up">
           <FiCheckCircle />
           <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {/* ── Stats Overview ── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-slide-up">
        {[
          { label: 'Total Stock', val: items.length, icon: FiLayers, color: 'text-violet-400', bg: 'bg-violet-400/10' },
          { label: 'Categories', val: [...new Set(items.map(i => i.category))].length, icon: FiPackage, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Low Stock', val: 0, icon: FiAlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Shipments', val: 0, icon: FiTruck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
             <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-xl`}>
               <stat.icon />
             </div>
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
               <p className="text-2xl font-bold mt-0.5">{stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      {/* ── Main List ── */}
      <div className="max-w-7xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-500 gap-4">
               <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
               <p className="text-sm font-medium">Syncing with cloud database...</p>
            </div>
          ) : error ? (
             <div className="py-24 flex flex-col items-center justify-center text-rose-400 gap-4 px-6 text-center">
                <FiAlertCircle className="text-4xl" />
                <p className="text-sm border border-rose-400/20 bg-rose-400/5 px-6 py-3 rounded-2xl">{error}</p>
             </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-600 gap-4">
               <FiBox className="text-5xl opacity-40" />
               <p className="text-sm">No inventory items found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] border-b border-white/5">
                    <th className="px-8 py-5">Asset Details</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5 text-center">Batch (Qty)</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredItems.map(item => (
                    <tr key={item._id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/20 group-hover:from-violet-500 group-hover:to-indigo-500 transition-all duration-300">
                             <FiBox className="text-violet-400 group-hover:text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-200 group-hover:text-white truncate max-w-[150px] sm:max-w-xs">{item.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px] sm:max-w-xs">{item.description || 'Cloud-synced registry'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center font-mono font-bold text-violet-400">
                        {item.quantity}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-slate-400 hover:text-white transition-colors">
                             <FiTrash2 className="w-4 h-4 text-rose-500/70" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="bg-white/[0.02] px-8 py-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-600 font-bold uppercase tracking-widest">
             <span>Last Synced: Just now</span>
             <span>Ref: {items.length} Records</span>
          </div>
        </div>
      </div>

      <AssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateAsset} 
      />
    </div>
  );
}
