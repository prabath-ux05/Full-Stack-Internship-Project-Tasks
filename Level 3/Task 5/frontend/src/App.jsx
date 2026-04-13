import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiBox, FiAlertCircle, FiInbox } from 'react-icons/fi';

import StatCards from './components/StatCards';
import ItemForm   from './components/ItemForm';
import ItemCard   from './components/ItemCard';
import SearchBar  from './components/SearchBar';
import Pagination from './components/Pagination';

const API = 'http://127.0.0.1:5010/api/items';

export default function App() {
  const [items, setItems]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [editItem, setEditItem]     = useState(null);

  /* ── Fetch ── */
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API, {
        params: { page, limit: 9, search, category },
      });
      setItems(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setError(null);
    } catch {
      setError('Could not reach the server. Make sure the backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(fetchItems, 300);
    return () => clearTimeout(t);
  }, [fetchItems]);

  /* reset to page 1 on filter changes */
  const handleSearch = (val) => { setSearch(val);   setPage(1); };
  const handleCat    = (val) => { setCategory(val); setPage(1); };

  /* ── CRUD handlers ── */
  const handleSubmit = async (form) => {
    try {
      if (editItem) {
        await axios.put(`${API}/${editItem._id}`, form);
        setEditItem(null);
      } else {
        await axios.post(API, form);
      }
      fetchItems();
    } catch {
      alert('Failed to save item.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchItems();
    } catch {
      alert('Failed to delete item.');
    }
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-slate-950">
      {/* ── Sidebar (decorative gradient strip) ── */}
      <div className="fixed top-0 left-0 h-full w-1 bg-gradient-to-b from-brand-500 via-purple-500 to-pink-500 z-50" />

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500/10 text-brand-400 p-2 rounded-lg">
              <FiBox className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-100 tracking-tight">Nexus <span className="text-brand-400">Inventory</span></span>
          </div>
          <div className="text-xs text-slate-500">
            {total} item{total !== 1 ? 's' : ''} in database
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Stat cards ── */}
        <StatCards items={items} total={total} />

        {/* ── Two-column layout: form (left) | list (right) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-8 items-start">

          {/* Form panel */}
          <div className="sticky top-20">
            <ItemForm
              onSubmit={handleSubmit}
              editItem={editItem}
              onCancel={() => setEditItem(null)}
            />
          </div>

          {/* Items panel */}
          <div className="space-y-5">

            {/* Search + filter */}
            <SearchBar
              search={search}   setSearch={handleSearch}
              category={category} setCategory={handleCat}
            />

            {/* States */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading items…</span>
              </div>
            )}

            {!loading && error && (
              <div className="card p-6 flex items-center gap-4 border-red-500/20 bg-red-500/5 animate-fade-in">
                <FiAlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && items.length === 0 && (
              <div className="card flex flex-col items-center justify-center py-20 gap-4 border-dashed animate-fade-in">
                <FiInbox className="w-10 h-10 text-slate-600" />
                <p className="text-slate-500 text-sm">No items match your filters.</p>
              </div>
            )}

            {/* Grid of cards */}
            {!loading && !error && items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onEdit={i => { setEditItem(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage(p => p - 1)}
              onNext={() => setPage(p => p + 1)}
            />
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 mt-16 py-6 text-center text-xs text-slate-600">
        Nexus Inventory · Level 3 Task 1 · Full Stack React + Express
      </footer>
    </div>
  );
}
