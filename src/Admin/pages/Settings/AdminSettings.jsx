import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api, errorMessage, fieldErrors } from "../../../services/api";

/**
 * Singleton site settings editor backed by /api/admin/settings/
 * (GET retrieve / PUT update / PATCH partial_update).
 *
 * The serializer exposes every SiteSettings field, so the form is rendered
 * from the payload: text inputs for strings/numbers, checkboxes for
 * booleans and JSON textareas for structured values (lists/objects).
 * The server enforces write permission (super_admin only).
 */
const AdminSettings = () => {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .get("/admin/settings/")
      .then((res) => {
        setData(res.data);
        const next = {};
        Object.entries(res.data).forEach(([key, value]) => {
          next[key] =
            value !== null && typeof value === "object" ? JSON.stringify(value, null, 2) : value;
        });
        setForm(next);
      })
      .catch(() => setError("Failed to load settings."))
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
    setErrors({});
    try {
      const payload = {};
      Object.entries(data).forEach(([key, original]) => {
        if (key === "id") return;
        if (original !== null && typeof original === "object") {
          try {
            payload[key] = JSON.parse(form[key] || "null");
          } catch {
            payload[key] = original; // keep server value on invalid JSON
          }
        } else {
          payload[key] = form[key];
        }
      });
      await api.put("/admin/settings/", payload);
      toast.success("Settings saved.");
      load();
    } catch (err) {
      const server = fieldErrors(err);
      if (Object.keys(server).length > 0) setErrors(server);
      else toast.error(errorMessage(err, "Could not save settings."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading…</div>;

  if (error)
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
          <button onClick={load} className="ml-3 underline font-semibold">
            Retry
          </button>
        </div>
      </div>
    );

  const simpleFields = Object.keys(data).filter((key) => {
    if (key === "id") return false;
    const value = data[key];
    return value === null || typeof value !== "object";
  });
  const structuredFields = Object.keys(data).filter((key) => {
    const value = data[key];
    return key !== "id" && value !== null && typeof value === "object";
  });

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Site settings</h1>

      <form onSubmit={handleSave} className="space-y-5" noValidate>
        {simpleFields.map((key) => {
          const isBool = typeof data[key] === "boolean";
          const isNumber = typeof data[key] === "number";
          return (
            <div key={key}>
              {isBool ? (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(form[key])}
                    onChange={(e) => setField(key, e.target.checked)}
                  />
                  {key}
                </label>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{key}</label>
                  <input
                    type={isNumber ? "number" : "text"}
                    value={form[key] ?? ""}
                    onChange={(e) => setField(key, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </>
              )}
              {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
            </div>
          );
        })}

        {structuredFields.map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {key} <span className="text-gray-400 font-normal">(JSON)</span>
            </label>
            <textarea
              rows={Math.min(10, Math.max(3, (form[key] || "").split("\n").length))}
              value={form[key] ?? ""}
              onChange={(e) => setField(key, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
            />
            {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
