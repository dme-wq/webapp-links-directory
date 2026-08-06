import { useState, useEffect } from 'react';

export default function LinkModal({ isOpen, onClose, onSave, initialData }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setUrl(initialData.url || '');
    } else {
      setTitle('');
      setUrl('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'http://' + finalUrl;
    }
    onSave({ title, url: finalUrl });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Link' : 'Add Link'}</h2>
          <button className="icon-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Link Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              placeholder="e.g. My Nextjs Dashboard"
            />
          </div>
          <div className="form-group">
            <label>URL</label>
            <input 
              type="text" 
              className="form-control" 
              value={url} 
              onChange={e => setUrl(e.target.value)} 
              required
              placeholder="e.g. google.com or https://..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Link</button>
          </div>
        </form>
      </div>
    </div>
  );
}
