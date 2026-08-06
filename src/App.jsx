import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import CategoryCard from './components/CategoryCard';
import CategoryModal from './components/CategoryModal';
import LinkModal from './components/LinkModal';
import ConfirmModal from './components/ConfirmModal';
import { Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
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

  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

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

    if (linkError) {
      console.error("Error fetching links:", linkError);
      toast.error("Failed to load links");
    }
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
        toast.success("Title updated successfully!");
      } else if (error) {
        toast.error("Failed to update title");
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select();
        
      if (!error && data) {
        setCategories([...categories, data[0]]);
        toast.success("Title created successfully!");
      } else if (error) {
        toast.error("Failed to create title");
      }
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Title',
      message: 'Are you sure you want to delete this title and all its links? This action cannot be undone.',
      onConfirm: async () => {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
          
        if (!error) {
          setCategories(categories.filter(c => c.id !== id));
          setLinks(links.filter(l => l.category_id !== id));
          toast.success("Title deleted successfully");
        } else {
          toast.error("Failed to delete title");
        }
      }
    });
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
        toast.success("Link updated successfully!");
      } else if (error) {
        toast.error("Failed to update link");
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('links')
        .insert([{ ...linkData, category_id: activeCategoryId }])
        .select();
        
      if (!error && data) {
        setLinks([...links, data[0]]);
        toast.success("Link added successfully!");
      } else if (error) {
        console.error("Link Insert Error:", error);
        toast.error(`Error saving link: ${error.message}`);
      }
    }
    setIsLinkModalOpen(false);
    setEditingLink(null);
    setActiveCategoryId(null);
  };

  const handleDeleteLink = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Link',
      message: 'Are you sure you want to delete this link? This action cannot be undone.',
      onConfirm: async () => {
        const { error } = await supabase
          .from('links')
          .delete()
          .eq('id', id);
          
        if (!error) {
          setLinks(links.filter(l => l.id !== id));
          toast.success("Link deleted successfully");
        } else {
          toast.error("Failed to delete link");
        }
      }
    });
  };

  return (
    <div className="container">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '8px' } }} />
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
          <img src="https://static.wixstatic.com/media/68b92a_d71e34133826499983234774dea1945b~mv2.png/v1/fill/w_186,h_156,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/RKD-Logo.png" alt="Logo" style={{ height: '60px' }} />
          <div>
            <h1 className="fancy-header-title">WebApps Directory</h1>
          </div>
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

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  );
}

export default App;
