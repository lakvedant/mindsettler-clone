import { useState, useEffect } from "react";
import { Plus, Trash2, Check, X, Loader2, Image as ImageIcon } from "lucide-react";
import API from "../api/axios";

const ManageBlogsView = () => {
  const [activeSubTab, setActiveSubTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const [newCat, setNewCat] = useState({ name: "", icon: "BookOpen" });
  const [newBlog, setNewBlog] = useState({
    title: "", subtitle: "", body: "", pictureUrl: "", category: "", 
    tags: "", readTime: "5 min read", isMainHighlight: false, isSideHighlight: false, isPaid: false, price: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const catRes = await API.get("/blog/categories");
      setCategories(catRes.data.data);
      const blogRes = await API.get("/blog");
      setBlogs(blogRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name) return;
    try {
      await API.post("/blog/category", newCat, { withCredentials: true });
      setNewCat({ name: "", icon: "BookOpen" });
      fetchData();
    } catch (err) {
      alert("Error adding category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await API.delete(`/blog/category/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert("Error deleting category");
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.body || !newBlog.category) return;
    try {
      const payload = {
        ...newBlog,
        tags: newBlog.tags.split(",").map(t => t.trim()).filter(Boolean)
      };
      await API.post("/blog", payload, { withCredentials: true });
      setNewBlog({
        title: "", subtitle: "", body: "", pictureUrl: "", category: "", 
        tags: "", readTime: "5 min read", isMainHighlight: false, isSideHighlight: false, isPaid: false, price: 0
      });
      fetchData();
    } catch (err) {
      alert("Error adding blog");
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.body || !newBlog.category) return;
    try {
      const payload = {
        ...newBlog,
        tags: typeof newBlog.tags === "string" ? newBlog.tags.split(",").map(t => t.trim()).filter(Boolean) : newBlog.tags
      };
      await API.put(`/blog/${editingBlogId}`, payload, { withCredentials: true });
      setEditingBlogId(null);
      setNewBlog({
        title: "", subtitle: "", body: "", pictureUrl: "", category: "", 
        tags: "", readTime: "5 min read", isMainHighlight: false, isSideHighlight: false, isPaid: false, price: 0
      });
      fetchData();
    } catch (err) {
      alert("Error updating blog");
    }
  };

  const handleEditClick = (b) => {
    setEditingBlogId(b._id);
    setNewBlog({
      title: b.title || "",
      subtitle: b.subtitle || "",
      body: b.body || "",
      pictureUrl: b.pictureUrl || "",
      category: b.category?._id || b.category || "",
      tags: Array.isArray(b.tags) ? b.tags.join(", ") : b.tags || "",
      readTime: b.readTime || "5 min read",
      isMainHighlight: b.isMainHighlight || false,
      isSideHighlight: b.isSideHighlight || false,
      isPaid: b.isPaid || false,
      price: b.price || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setNewBlog({
      title: "", subtitle: "", body: "", pictureUrl: "", category: "", 
      tags: "", readTime: "5 min read", isMainHighlight: false, isSideHighlight: false, isPaid: false, price: 0
    });
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete blog?")) return;
    try {
      await API.delete(`/blog/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert("Error deleting blog");
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-[#DD1764]" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab("categories")}
          className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSubTab === "categories" ? "bg-white text-[#3F2965] shadow" : "text-slate-500"}`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveSubTab("blogs")}
          className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSubTab === "blogs" ? "bg-white text-[#3F2965] shadow" : "text-slate-500"}`}
        >
          Articles
        </button>
      </div>

      {activeSubTab === "categories" && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-6">
          <h3 className="text-xl font-bold text-[#3F2965]">Add Category</h3>
          <form onSubmit={handleAddCategory} className="flex gap-4">
            <input type="text" placeholder="Category Name (e.g. Research)" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} className="flex-1 p-3 border rounded-xl" />
            <input type="text" placeholder="Icon string" value={newCat.icon} onChange={e => setNewCat({...newCat, icon: e.target.value})} className="flex-1 p-3 border rounded-xl" />
            <button className="bg-[#3F2965] text-white px-6 rounded-xl font-bold">Add</button>
          </form>

          <div className="space-y-3">
            {categories.map(c => (
              <div key={c._id} className="flex justify-between p-4 bg-slate-50 rounded-xl">
                <span className="font-bold">{c.name}</span>
                <button onClick={() => handleDeleteCategory(c._id)} className="text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "blogs" && (
        <>
          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#3F2965]">{editingBlogId ? "Edit Article" : "Publish New Article"}</h3>
              {editingBlogId && (
                <button onClick={handleCancelEdit} className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100">Cancel Edit</button>
              )}
            </div>
            <form onSubmit={editingBlogId ? handleUpdateBlog : handleAddBlog} className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Title" required value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="col-span-2 p-3 border rounded-xl" />
              <input type="text" placeholder="Subtitle" value={newBlog.subtitle} onChange={e => setNewBlog({...newBlog, subtitle: e.target.value})} className="col-span-2 p-3 border rounded-xl" />
              <textarea placeholder="Article Content (Supports markdown/HTML)" required value={newBlog.body} onChange={e => setNewBlog({...newBlog, body: e.target.value})} className="col-span-2 p-3 border rounded-xl min-h-[200px]" />
              
              <input type="text" placeholder="Image URL" value={newBlog.pictureUrl} onChange={e => setNewBlog({...newBlog, pictureUrl: e.target.value})} className="col-span-1 p-3 border rounded-xl" />
              <select required value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})} className="col-span-1 p-3 border rounded-xl">
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <input type="text" placeholder="Tags (comma separated)" value={newBlog.tags} onChange={e => setNewBlog({...newBlog, tags: e.target.value})} className="col-span-1 p-3 border rounded-xl" />
              <input type="text" placeholder="Read Time (e.g. 8 min read)" value={newBlog.readTime} onChange={e => setNewBlog({...newBlog, readTime: e.target.value})} className="col-span-1 p-3 border rounded-xl" />

              <div className="col-span-2 flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                <label className="flex items-center gap-2"><input type="checkbox" checked={newBlog.isMainHighlight} onChange={e => setNewBlog({...newBlog, isMainHighlight: e.target.checked})} /> Main Highlight</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={newBlog.isSideHighlight} onChange={e => setNewBlog({...newBlog, isSideHighlight: e.target.checked})} /> Side Highlight</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={newBlog.isPaid} onChange={e => setNewBlog({...newBlog, isPaid: e.target.checked})} /> Premium/Paid</label>
                {newBlog.isPaid && <input type="number" placeholder="Price (₹)" value={newBlog.price} onChange={e => setNewBlog({...newBlog, price: e.target.value})} className="p-2 border rounded-lg w-24" />}
              </div>

              <button className="col-span-2 bg-[#Dd1764] text-white py-3 rounded-xl font-bold shadow-md hover:bg-pink-700">
                {editingBlogId ? "Update Article" : "Publish Article"}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
            <h3 className="text-xl font-bold text-[#3F2965]">Published Articles</h3>
            <div className="space-y-3">
              {blogs.map(b => (
                <div key={b._id} className="flex justify-between items-center p-4 bg-slate-50 border rounded-xl">
                  <div>
                    <h4 className="font-bold text-[#3F2965]">{b.title}</h4>
                    <div className="flex gap-3 text-xs text-slate-500 mt-1">
                      <span>{b.category?.name}</span>
                      {b.isMainHighlight && <span className="text-green-600 font-bold">Main Highlight</span>}
                      {b.isPaid && <span className="text-red-500 font-bold">₹{b.price}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEditClick(b)} className="text-[#3F2965] hover:text-[#Dd1764] text-sm font-bold bg-white px-3 py-1 rounded-lg border shadow-sm">Edit</button>
                    <button onClick={() => handleDeleteBlog(b._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageBlogsView;
