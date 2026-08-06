import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import CategoryCard from './components/CategoryCard';
import CategoryModal from './components/CategoryModal';
import LinkModal from './components/LinkModal';
import { Plus } from 'lucide-react';
import './index.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null); // Which category the link belongs to

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch categories
    const { data: categoriesData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (catError) console.error("Error fetching categories:", catError);
    else setCategories(categoriesData || []);

    // Fetch links
    const { data: linksData, error: linkError } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: true });

    if (linkError) console.error("Error fetching links:", linkError);
    else setLinks(linksData || []);

    setLoading(false);
  };

  // --- Category Handlers ---
  const handleSaveCategory = async (categoryData) => {
    if (editingCategory) {
      // Update
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', editingCategory.id)
        .select();
      
      if (!error && data) {
        setCategories(categories.map(c => c.id === data[0].id ? data[0] : c));
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select();
        
      if (!error && data) {
        setCategories([...categories, data[0]]);
      }
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this title and all its links?')) return;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
      setLinks(links.filter(l => l.category_id !== id));
    }
  };

  // --- Link Handlers ---
  const handleSaveLink = async (linkData) => {
    if (editingLink) {
      // Update
      const { data, error } = await supabase
        .from('links')
        .update(linkData)
        .eq('id', editingLink.id)
        .select();
      
      if (!error && data) {
        setLinks(links.map(l => l.id === data[0].id ? data[0] : l));
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('links')
        .insert([{ ...linkData, category_id: activeCategoryId }])
        .select();
        
      if (!error && data) {
        setLinks([...links, data[0]]);
      }
    }
    setIsLinkModalOpen(false);
    setEditingLink(null);
    setActiveCategoryId(null);
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>My WebApps Directory</h1>
          <p>Organize and manage your web application links</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setIsCategoryModalOpen(true);
          }}
        >
          <Plus size={20} /> Add New Title
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading directories...</div>
      ) : (
        <main className="category-grid">
          {categories.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
              No titles added yet. Click "Add New Title" to get started!
            </div>
          )}
          {categories.map(category => (
            <CategoryCard 
              key={category.id}
              category={category}
              links={links.filter(l => l.category_id === category.id)}
              onEditCategory={(c) => {
                setEditingCategory(c);
                setIsCategoryModalOpen(true);
              }}
              onDeleteCategory={handleDeleteCategory}
              onAddLink={(catId) => {
                setActiveCategoryId(catId);
                setEditingLink(null);
                setIsLinkModalOpen(true);
              }}
              onEditLink={(l) => {
                setEditingLink(l);
                setIsLinkModalOpen(true);
              }}
              onDeleteLink={handleDeleteLink}
            />
          ))}
        </main>
      )}

      <CategoryModal 
        isOpen={isCategoryModalOpen}
        initialData={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      <LinkModal 
        isOpen={isLinkModalOpen}
        initialData={editingLink}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleSaveLink}
      />
    </div>
  );
}

export default App;
