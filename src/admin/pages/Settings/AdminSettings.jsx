import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Seo from '../../../components/Seo';
import { ErrorState, LoadingScreen } from '../../../components/ui/States';
import { extractError } from '../../../services/api';
import { adminApi } from '../../../services/admin.js';
import { useApiResource } from '../../../hooks/useApiResource';

const FIELDS = [
  { name: 'company_name', label: 'Company name' },
  { name: 'tagline', label: 'Tagline' },
  { name: 'phone', label: 'Phone' },
  { name: 'phone_alt', label: 'Alternate phone' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'address', label: 'Address', type: 'textarea' },
  { name: 'map_embed_url', label: 'Google Maps embed URL', type: 'textarea' },
  { name: 'facebook', label: 'Facebook URL' },
  { name: 'instagram', label: 'Instagram URL' },
  { name: 'youtube', label: 'YouTube URL' },
  { name: 'linkedin', label: 'LinkedIn URL' },
  { name: 'twitter', label: 'Twitter/X URL' },
  { name: 'tiktok', label: 'TikTok URL' },
  { name: 'whatsapp', label: 'WhatsApp number' },
  { name: 'about_short', label: 'Short about text', type: 'textarea' },
  { name: 'footer_text', label: 'Footer text', type: 'textarea' },
  { name: 'default_seo_title', label: 'Default SEO title' },
  { name: 'default_seo_description', label: 'Default SEO description', type: 'textarea' },
];

/** Singleton site settings (contact details, socials, SEO defaults). */
const AdminSettings = () => {
  const { data, loading, error, refetch } = useApiResource(() => adminApi.settings(), []);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (loading) return <LoadingScreen message="Loading settings…" />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      FIELDS.forEach((field) => {
        payload[field.name] = form[field.name] ?? '';
      });
      await adminApi.updateSettings(payload);
      toast.success('Settings saved.');
    } catch (err) {
      toast.error(extractError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <Seo title="Site settings" noIndex />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Site settings</h1>
      <p className="text-sm text-gray-500 mb-6">
        These values feed the header, footer, contact page and the default SEO tags on every public page.
      </p>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor={`settings-${field.name}`}>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={`settings-${field.name}`}
                rows={3}
                value={form[field.name] ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            ) : (
              <input
                id={`settings-${field.name}`}
                type={field.type || 'text'}
                value={form[field.name] ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
