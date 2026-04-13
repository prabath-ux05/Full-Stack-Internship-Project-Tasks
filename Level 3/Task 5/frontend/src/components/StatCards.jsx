import { FiPackage, FiDollarSign, FiTag, FiTrendingUp } from 'react-icons/fi';

const stats = [
  { label: 'Total Items',    icon: FiPackage,    color: 'text-brand-400', bg: 'bg-brand-500/10', valueKey: 'total' },
  { label: 'Avg. Price (₹)', icon: FiDollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10', valueKey: 'avgPrice' },
  { label: 'Categories',     icon: FiTag,        color: 'text-purple-400', bg: 'bg-purple-500/10',  valueKey: 'categories' },
  { label: 'Newest Item',    icon: FiTrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10',    valueKey: 'newest' },
];

export default function StatCards({ items, total }) {
  const avgPrice = items.length
    ? '₹' + (items.reduce((s, i) => s + Number(i.price), 0) / items.length).toFixed(2)
    : '₹0.00';
  const categories = [...new Set(items.map(i => i.category))].length;
  const newest = items[0]?.name ?? '—';

  const values = { total, avgPrice, categories, newest };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, icon: Icon, color, bg, valueKey }) => (
        <div key={label} className="card p-5 flex items-center gap-4 animate-slide-up hover:border-slate-700 transition duration-200">
          <div className={`${bg} ${color} p-3 rounded-xl shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
            <p className="text-xl font-bold text-slate-100 truncate">{values[valueKey]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
