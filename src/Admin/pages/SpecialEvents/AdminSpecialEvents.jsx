import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api, errorMessage, fieldErrors, toList } from "../../../services/api";

const EMPTY = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  coverImage: "",
  images: "",
  includedServices: "",
  featured: false,
  isPublished: true,
  order: 0,
};

const toForm = (entry) => ({
  title: entry.title || "",
  category: entry.category || "",
  excerpt: entry.excerpt || "",
  content: entry.content || "",
  coverImage: entry.coverImage || "",
  images: (entry.images || []).join(", "),
  includedServices: (entry.includedServices || []).join(", "),
  featured: Boolean(entry.featured),
  isPublished: entry.isPublished !== false,
  order: entry.order ?? 0,
});

const toPayload = (form) => ({
  title: form.title,
  category: form.category,
  excerpt: form.excerpt,
  content: form.content,
  cover_image: form.coverImage,
  images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
  included_services: form.includedServices.split(",").map((s) => s.trim()).filter(Boolean),
  featured: form.featured,
  is_published: form.isPublished,
  order: Number(form.order) || 0,
});

/**
 * Admin CRUD for the service entries that power the public special-events
 * (and photography) pages — /api/admin/service-entries/?entry_type=…
 */
const AdminSpecialEvents = ({ photography = false, type = null }) => {
  const entryType = type || (photography ? "photography_service" : "special_event");
  const heading = photography ? "Photography services" : "Special events";

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = closed, "new" = create
  const [form, setForm] = useState(EMPTY);
  const [formErrors, setFormErrors] = useState({});

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get("/admin/service-entries/", { params: { entry_type: entryType, page_size: 100 } })
      .then((res) => setEntries(toList(res.data)))
      .catch(() => setError("Failed to load entries."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryType]);

  const openCreate = () => {
    setForm(EMPTY);
    setFormErrors({});
    setEditingId("new");
  };

  const openEdit = (entry) => {
    setForm(toForm(entry));
    setFormErrors({});
    setEditingId(entry.id);
  };

  const closeModal = () => setEditingId(null);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormErrors({});
    try {
      const payload = toPayload(form);
      if (editingId === "new") {
        await api.post("/admin/service-entries/", { ...payload, entry_type: entryType });
        toast.success("Entry created.");
      } else {
        await api.patch(`/admin/service-entries/${editingId}/`, payload);
        toast.success("Entry updated.");
      }
      closeModal();
      load();
    } catch (err) {
      const server = fieldErrors(err);
      if (Object.keys(server).length > 0) {
        setFormErrors(server);
      } else {
        toast.error(errorMessage(err, "Could not save the entry."));
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (entry) => {
    try {
      await api.patch(`/admin/service-entries/${entry.id}/`, {
        is_published: !entry.isPublished,
      });
      setEntries((list) =>
        list.map((e) => (e.id === entry.id ? { ...e, isPublished: !entry.isPublished } : e))
      );
      toast.success(entry.isPublished ? "Unpublished." : "Published.");
    } catch (err) {
      toast.error(errorMessage(err, "Could not update the entry."));
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm(`Delete "${entry.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/service-entries/${entry.id}/`);
      toast.success("Entry deleted.");
      load();
    } catch (err) {
      toast.error(errorMessage(err, "Could not delete the entry."));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{heading}</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          + New entry
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
          <button onClick={load} className="ml-3 underline font-semibold">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-gray-500">No entries yet. Create the first one.</p>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{entry.title}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.slug}</td>
                  <td className="px-4 py-3">{entry.featured ? "★" : "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(entry)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        entry.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {entry.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => openEdit(entry)} className="text-primary hover:underline font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(entry)} className="text-red-600 hover:underline font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4"
            noValidate
          >
            <h2 className="text-xl font-bold text-gray-800">
              {editingId === "new" ? "New entry" : "Edit entry"}
            </h2>

            {["title", "category", "coverImage"].map((name) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {name === "coverImage" ? "Cover image URL" : name}
                </label>
                <input
                  type="text"
                  value={form[name]}
                  onChange={(e) => setField(name, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {formErrors[name] && <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              {formErrors.excerpt && <p className="mt-1 text-sm text-red-600">{formErrors.excerpt}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                rows={4}
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              {formErrors.content && <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Included services (comma separated)
              </label>
              <input
                type="text"
                value={form.includedServices}
                onChange={(e) => setField("includedServices", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gallery images (comma separated URLs)
              </label>
              <input
                type="text"
                value={form.images}
                onChange={(e) => setField("images", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setField("isPublished", e.target.checked)}
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                Order
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setField("order", e.target.value)}
                  className="w-20 rounded-lg border border-gray-300 px-2 py-1"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminSpecialEvents;
