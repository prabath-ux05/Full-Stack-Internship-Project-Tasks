import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button onClick={onPrev} disabled={page === 1} className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed">
        <FiChevronLeft className="w-4 h-4" />
        Prev
      </button>
      <span className="text-sm text-slate-400">
        Page <span className="font-semibold text-slate-200">{page}</span> of <span className="font-semibold text-slate-200">{totalPages}</span>
      </span>
      <button onClick={onNext} disabled={page === totalPages} className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed">
        Next
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
