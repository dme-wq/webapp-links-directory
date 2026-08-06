import { useState, useEffect } from 'react';

const COLORS = [
  'var(--color-pink)',
  'var(--color-yellow)',
  'var(--color-purple)',
  'var(--color-red)',
  'var(--color-blue)',
  'var(--color-dark)',
  'var(--color-green)',
  'var(--color-orange)',
];

export default function CategoryModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[4]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setColor(initialData.color || COLORS[4]);
    } else {
      setTitle('');
      setDescription('');
      setColor(COLORS[4]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description, color });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Title' : 'New Title'}</h2>
          <button className="icon-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              placeholder="e.g. Real Estate, Education..."
            />
          </div>
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows="3"
              placeholder="Brief description about these web apps..."
            ></textarea>
          </div>
          <div className="form-group">
            <label>Header Color</label>
            <div className="color-picker">
              {COLORS.map(c => (
                <div 
                  key={c}
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                ></div>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
