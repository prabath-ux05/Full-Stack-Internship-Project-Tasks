import { FiEdit2, FiTrash2, FiDollarSign } from 'react-icons/fi';

const CATEGORY_COLORS = {
  Electronics: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  Clothing:    'bg-pink-500/15 text-pink-400 border-pink-500/20',
  Books:       'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Home:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Other:       'bg-slate-500/15 text-slate-400 border-slate-500/20',
};

export default function ItemCard({ item, onEdit, onDelete }) {
  const catColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;

  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-slate-700 transition duration-200 animate-slide-up group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-100 text-sm leading-snug line-clamp-2">{item.name}</h3>
        <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${catColor}`}>
          {item.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-2">{item.description}</p>

      {/* Price & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1 text-emerald-400 font-bold text-lg">
          <span className="text-xl">₹</span>
          {Number(item.price).toFixed(2)}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition duration-150"
            title="Edit"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition duration-150"
            title="Delete"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
