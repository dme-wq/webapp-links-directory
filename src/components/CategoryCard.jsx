import { useState } from 'react';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoryCard({ category, links, onEditCategory, onDeleteCategory, onAddLink, onEditLink, onDeleteLink }) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const frontendLinks = links.filter(l => l.section === 'Frontend');
  const backendLinks = links.filter(l => l.section === 'Backend');
  const dbLinks = links.filter(l => l.section === 'Database');
  
  // Backward compatibility for old links
  const otherLinks = links.filter(l => !['Frontend', 'Backend', 'Database'].includes(l.section));

  const renderSection = (title, sectionLinks) => {
    if (sectionLinks.length === 0) return null;
    return (
      <div className="link-section">
        <h4 className="section-title">{title}</h4>
        <ul className="link-list">
          {sectionLinks.map(link => {
            // Determine class suffix, default to 'other' if not match
            const sec = (link.section || 'other').toLowerCase();
            const validSec = ['frontend', 'backend', 'database'].includes(sec) ? sec : 'other';
            return (
              <li key={link.id} className={`link-item rainbow-bg-${validSec}`}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="link-title" 
                  style={{ flex: 1, textAlign: 'center', justifyContent: 'center', color: 'var(--text-main)', textDecoration: 'none' }}
                  title="Click to visit"
                >
                  {link.title}
                </a>
                <div className="link-actions">
                  <button className="icon-button" onClick={() => onEditLink(link)} title="Edit Link">
                    <Edit2 size={14} />
                  </button>
                  <button className="icon-button" onClick={() => onDeleteLink(link.id)} title="Delete Link">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="category-card">
      <div className="card-header" style={{ backgroundColor: category.color || 'var(--color-blue)', position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h3 className="fancy-card-title" style={{ textAlign: 'center' }}>{category.title}</h3>
        </div>
        <div className="card-header-actions" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
          <button className="icon-button" onClick={() => onEditCategory(category)} title="Edit Title">
            <Edit2 size={16} />
          </button>
          <button className="icon-button" onClick={() => onDeleteCategory(category.id)} title="Delete Title">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="sections-container">
        {links.length === 0 ? (
          <div style={{padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)'}}>
            No links yet
          </div>
        ) : (
          <>
            {renderSection('Frontend', frontendLinks)}
            {renderSection('Backend', backendLinks)}
            {renderSection('Database', dbLinks)}
            {renderSection('Other', otherLinks)}
          </>
        )}
      </div>
      
      <div className="card-footer">
        <button onClick={() => onAddLink(category.id)}>
          + Add Link
        </button>
      </div>
    </div>
  );
}
