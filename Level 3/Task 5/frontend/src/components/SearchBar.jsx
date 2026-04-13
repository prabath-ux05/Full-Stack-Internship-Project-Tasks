import { FiSearch, FiFilter } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Other'];

export default function SearchBar({ search, setSearch, category, setCategory }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Search items by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>
      <div className="relative sm:w-52">
        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="input-field pl-10 appearance-none"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}
