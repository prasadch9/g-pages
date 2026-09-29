import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const EMPTY_SETTINGS = {
  instagramUrl: '',
  facebookUrl: '',
  whatsappNumber: '',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api
      .get('/admin/settings')
      .then(({ data }) => setSettings({ ...EMPTY_SETTINGS, ...data.data }))
      .catch((error) => setMessage({ type: 'error', text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (event) => {
    setSettings((current) => ({ ...current, [field]: event.target.value }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/admin/settings', settings);
      setSettings({ ...EMPTY_SETTINGS, ...data.data });
      window.dispatchEvent(new CustomEvent('google-pages:site-settings-updated', { detail: data.data }));
      setMessage({ type: 'success', text: data.message || 'Settings saved.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Could not save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/50';

  if (loading) return <p className="text-sm text-ink/50">Loading settings...</p>;

  return (
    <div className="max-w-2xl">
      <div className="border-b border-line pb-5">
        <h2 className="font-display text-xl font-semibold text-ink">Social links</h2>
        <p className="mt-1 text-sm text-ink/55">Update the links shown in the site footer and the WhatsApp contact button.</p>
      </div>

      <form onSubmit={save} className="mt-5 grid gap-5">
        <label className="text-sm font-medium text-ink">
          Instagram profile URL
          <input type="url" value={settings.instagramUrl} onChange={update('instagramUrl')} placeholder="https://www.instagram.com/your-account/" className={inputClass} />
        </label>
        <label className="text-sm font-medium text-ink">
          Facebook page URL
          <input type="url" value={settings.facebookUrl} onChange={update('facebookUrl')} placeholder="https://www.facebook.com/your-page/" className={inputClass} />
        </label>
        <label className="text-sm font-medium text-ink">
          WhatsApp number
          <input type="tel" inputMode="tel" value={settings.whatsappNumber} onChange={update('whatsappNumber')} placeholder="919876543210" className={inputClass} />
          <span className="mt-1 block text-xs font-normal text-ink/45">Include country code. Spaces and symbols are removed when saved.</span>
        </label>

        {message.text && (
          <p role="status" className={`rounded-md px-3 py-2.5 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </p>
        )}
        <button type="submit" disabled={saving} className="w-fit rounded-md bg-vermilion px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-vermilion/90 disabled:cursor-wait disabled:opacity-60">
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}