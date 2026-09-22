import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api, errorMessage, fieldErrors, toList } from "../../../services/api";

const EMPTY = {
  name: "",
  category: "",
  image: "",
  rating: "",
  experience: "",
  bio: "",
  fullBio: "",
  videoUrl: "",
  audioUrl: "",
  instagram: "",
  achievements: "[]",
  rates: "[]",
  portfolio: "[]",
  order: 0,
  isPublished: true,
};

const LIST_FIELDS = ["achievements", "rates", "portfolio"];

const toForm = (item) => {
  const form = { ...EMPTY };
  Object.keys(EMPTY).forEach((key) => {
    const value = item[key];
    if (LIST_FIELDS.includes(key)) {
      form[key] = JSON.stringify(value ?? [], null, 0);
    } else if (value !== undefined && value !== null) {
      form[key] = value;
    }
  });
  return form;
};

const toPayload = (form) => {
  const payload = {};
  Object.keys(form).forEach((key) => {
    if (LIST_FIELDS.includes(key)) {
      try {
        payload[key] = JSON.parse(form[key] || "[]");
      } catch {
        payload[key] = [];
      }
    } else {
      payload[key] = form[key];
    }
  });
  return payload;
};

/** Admin CRUD for the public "talent profiles" section — /api/admin/talent-profiles/. */
const AdminTalentProfiles = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [formErrors, setFormErrors] = useState({});

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get("/admin/talent-profiles/", { params: { page_size: 100 } })
      .then((res) => setItems(toList(res.data)))
      .catch(() => setError("Failed to load talent profiles."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormErrors({});
    try {
      const payload = toPayload(form);
      if (editingId === "new") {
        await api.post("/admin/talent-profiles/", payload);
        toast.success("Talent profile created.");
      } else {
        await api.patch(`/admin/talent-profiles/${editingId}/`, payload);
        toast.success("Talent profile updated.");
      }
      setEditingId(null);
      load();
    } catch (err) {
      const server = fieldErrors(err);
      if (Object.keys(server).length > 0) setFormErrors(server);
      else toast.error(errorMessage(err, "Could not save the profile."));
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (item) => {
    try {
      await api.patch(`/admin/talent-profiles/${item.id}/`, { is_published: !item.isPublished });
      setItems((list) =>
        list.map((t) => (t.id === item.id ? { ...t, isPublished: !item.isPublished } : t))
      );
    } catch (err) {
      toast.error(errorMessage(err, "Could not update the profile."));
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/talent-profiles/${item.id}/`);
      toast.success("Talent profile deleted.");
      load();
    } catch (err) {
      toast.error(errorMessage(err, "Could not delete the profile."));
    }
  };

  const text = (name, label, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setField(name, e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
      {formErrors[name] && <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Talent profiles</h1>
        <button
          onClick={() => {
            setForm(EMPTY);
            setFormErrors({});
            setEditingId("new");
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          + New profile
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

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">No talent profiles yet.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.category}</td>
                  <td className="px-4 py-3">{item.rating || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(item)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setForm(toForm(item));
                        setFormErrors({});
                        setEditingId(item.id);
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:underline font-medium"
                    >
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
              {editingId === "new" ? "New profile" : "Edit profile"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {text("name", "Name")}
              {text("category", "Category")}
              {text("image", "Image URL")}
              {text("rating", "Rating")}
              {text("experience", "Experience")}
              {text("instagram", "Instagram URL")}
              {text("videoUrl", "Video URL")}
              {text("audioUrl", "Audio URL")}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                rows={2}
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full bio</label>
              <textarea
                rows={4}
                value={form.fullBio}
                onChange={(e) => setField("fullBio", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            {LIST_FIELDS.map((name) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {name} (JSON)
                </label>
                <textarea
                  rows={2}
                  value={form[name]}
                  onChange={(e) => setField(name, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
                />
                {formErrors[name] && (
                  <p className="mt-1 text-sm text-red-600">{formErrors[name]}</p>
                )}
              </div>
            ))}

            <div className="flex gap-6 items-center">
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
                onClick={() => setEditingId(null)}
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

export default AdminTalentProfiles;
