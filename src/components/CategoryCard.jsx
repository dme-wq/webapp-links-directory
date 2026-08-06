import { Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function CategoryCard({ category, links, onEditCategory, onDeleteCategory, onAddLink, onEditLink, onDeleteLink }) {
  return (
    <div className="category-card">
      <div className="card-header" style={{ backgroundColor: category.color }}>
        <h3>
          {category.title}
          <span className="link-count">({links.length})</span>
        </h3>
        <div className="card-header-actions">
          <button className="icon-button" onClick={() => onEditCategory(category)} title="Edit Title">
            <Edit2 size={16} />
          </button>
          <button className="icon-button" onClick={() => onDeleteCategory(category.id)} title="Delete Title">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {category.description && (
        <div className="card-description">
          {category.description}
        </div>
      )}
      
      <ul className="link-list">
        {links.length === 0 && (
          <li className="link-item" style={{justifyContent: 'center', color: 'var(--text-muted)'}}>
            No links yet
          </li>
        )}
        {links.map(link => (
          <li key={link.id} className="link-item">
            <div className="link-title">
              {link.title}
            </div>
            <div className="link-actions">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="icon-button" title="Visit">
                <ExternalLink size={14} />
              </a>
              <button className="icon-button" onClick={() => onEditLink(link)} title="Edit Link">
                <Edit2 size={14} />
              </button>
              <button className="icon-button" onClick={() => onDeleteLink(link.id)} title="Delete Link">
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="card-footer">
        <button onClick={() => onAddLink(category.id)}>
          + Add Link
        </button>
      </div>
    </div>
  );
}
