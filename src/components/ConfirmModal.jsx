export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content glass-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 style={{ color: 'var(--color-dark)' }}>{title}</h2>
        </div>
        <div style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          {message}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={() => { onConfirm(); onCancel(); }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
