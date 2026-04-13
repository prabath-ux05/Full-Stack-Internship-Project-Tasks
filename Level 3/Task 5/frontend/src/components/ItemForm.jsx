import { useState, useEffect } from 'react';
import { FiEdit2, FiX, FiCheck } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Other'];
const EMPTY = { name: '', description: '', category: '', price: '' };

export default function ItemForm({ onSubmit, editItem, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editItem ? { name: editItem.name, description: editItem.description, category: editItem.category, price: editItem.price } : EMPTY);
    setErrors({});
  }, [editItem]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category)           e.category = 'Please select a category';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Enter a valid price';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
    setForm(EMPTY);
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500/10 text-brand-400 p-2 rounded-lg">
            <FiEdit2 className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-slate-100">
            {editItem ? 'Update Item' : 'Add New Item'}
          </h2>
        </div>
        {editItem && (
          <button onClick={onCancel} className="btn-secondary text-xs py-1.5 px-3">
            <FiX className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Item Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Price (₹)</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange}
              placeholder="0.00"
              className={`input-field ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`} />
            {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className={`input-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}>
              <option value="" disabled>Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <input name="description" value={form.description} onChange={handleChange}
              placeholder="Brief description..."
              className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`} />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="mt-5">
          <button type="submit" className="btn-primary">
            <FiCheck className="w-4 h-4" />
            {editItem ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
