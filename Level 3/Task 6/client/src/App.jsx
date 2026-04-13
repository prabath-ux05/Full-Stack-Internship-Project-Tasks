import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Read: Fetch all items
  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Create: Add a new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/items', { title });
      setTitle(''); // Clear input
      fetchItems(); // Refresh list
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update: Toggle completion
  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/items/${id}`, {
        completed: !currentStatus
      });
      fetchItems(); // Refresh to ensure sync
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Delete: Remove an item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      fetchItems(); // Refresh items
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="container">
      <h1>Task Controller</h1>
      
      <form onSubmit={handleSubmit} className="form-group">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?" 
          className="input"
        />
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      <div className="list-group">
        {items.length === 0 ? (
          <p className="empty-text">No tasks yet. Create one!</p>
        ) : (
          items.map(item => (
            <div key={item.id} className={`list-item ${item.completed ? 'completed' : ''}`}>
              <span className="item-title" onClick={() => handleToggle(item.id, item.completed)}>
                {item.completed ? '✅ ' : '⏳ '} {item.title}
              </span>
              <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
