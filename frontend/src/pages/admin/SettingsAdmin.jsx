import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const sections = ['hero', 'about', 'footer', 'seo', 'contact', 'social'];

function SettingsAdmin() {
  const [activeSection, setActiveSection] = useState('hero');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.getSettings();
        setSettings(res.data || {});
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateField = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const updateNestedField = (section, parent, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [parent]: {
          ...((prev[section] || {})[parent] || {}),
          [field]: value,
        },
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.updateSettings(activeSection, settings[activeSection]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handle silently
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Loading settings...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Site Settings</h1>
          <p>Manage all website content from here</p>
        </div>
      </div>

      <div className="admin-settings-layout">
        <nav className="admin-settings-nav">
          {sections.map((section) => (
            <button
              key={section}
              className={`admin-settings-nav__link ${activeSection === section ? 'admin-settings-nav__link--active' : ''}`}
              type="button"
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>

        <div className="admin-settings-content">
          {activeSection === 'hero' && (
            <div className="admin-form">
              <h3>Hero Section</h3>
              <label>
                Name
                <input
                  type="text"
                  value={settings.hero?.name || ''}
                  onChange={(e) => updateField('hero', 'name', e.target.value)}
                />
              </label>
              <label>
                Title
                <input
                  type="text"
                  value={settings.hero?.title || ''}
                  onChange={(e) => updateField('hero', 'title', e.target.value)}
                />
              </label>
              <label>
                Bio
                <textarea
                  value={settings.hero?.bio || ''}
                  onChange={(e) => updateField('hero', 'bio', e.target.value)}
                  rows={3}
                />
              </label>
              <ImageUpload
                value={settings.hero?.avatar || ''}
                onChange={(url) => updateField('hero', 'avatar', url)}
                label="Avatar"
              />
            </div>
          )}

          {activeSection === 'about' && (
            <div className="admin-form">
              <h3>About Section</h3>
              <label>
                Eyebrow Text
                <input
                  type="text"
                  value={settings.about?.eyebrow || ''}
                  onChange={(e) => updateField('about', 'eyebrow', e.target.value)}
                />
              </label>
              <label>
                Heading
                <input
                  type="text"
                  value={settings.about?.heading || ''}
                  onChange={(e) => updateField('about', 'heading', e.target.value)}
                />
              </label>
              <label>
                Description
                <textarea
                  value={settings.about?.description || ''}
                  onChange={(e) => updateField('about', 'description', e.target.value)}
                  rows={3}
                />
              </label>
            </div>
          )}

          {activeSection === 'footer' && (
            <div className="admin-form">
              <h3>Footer</h3>
              <label>
                Name
                <input
                  type="text"
                  value={settings.footer?.name || ''}
                  onChange={(e) => updateField('footer', 'name', e.target.value)}
                />
              </label>
              <label>
                Title
                <input
                  type="text"
                  value={settings.footer?.title || ''}
                  onChange={(e) => updateField('footer', 'title', e.target.value)}
                />
              </label>
              <label>
                Subtitle
                <input
                  type="text"
                  value={settings.footer?.subtitle || ''}
                  onChange={(e) => updateField('footer', 'subtitle', e.target.value)}
                />
              </label>
            </div>
          )}

          {activeSection === 'seo' && (
            <div className="admin-form">
              <h3>SEO Settings</h3>
              <label>
                Page Title
                <input
                  type="text"
                  value={settings.seo?.title || ''}
                  onChange={(e) => updateField('seo', 'title', e.target.value)}
                />
              </label>
              <label>
                Meta Description
                <textarea
                  value={settings.seo?.description || ''}
                  onChange={(e) => updateField('seo', 'description', e.target.value)}
                  rows={2}
                />
              </label>
              <label>
                Keywords (comma-separated)
                <input
                  type="text"
                  value={(settings.seo?.keywords || []).join(', ')}
                  onChange={(e) => updateField('seo', 'keywords', e.target.value.split(',').map((k) => k.trim()).filter(Boolean))}
                />
              </label>
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="admin-form">
              <h3>Contact Information</h3>
              <label>
                Email
                <input
                  type="email"
                  value={settings.contact?.email || ''}
                  onChange={(e) => updateField('contact', 'email', e.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={settings.contact?.phone || ''}
                  onChange={(e) => updateField('contact', 'phone', e.target.value)}
                />
              </label>
            </div>
          )}

          {activeSection === 'social' && (
            <div className="admin-form">
              <h3>Social Links</h3>
              <label>
                GitHub URL
                <input
                  type="url"
                  value={settings.social?.github || ''}
                  onChange={(e) => updateField('social', 'github', e.target.value)}
                />
              </label>
              <label>
                LinkedIn URL
                <input
                  type="url"
                  value={settings.social?.linkedin || ''}
                  onChange={(e) => updateField('social', 'linkedin', e.target.value)}
                />
              </label>
              <label>
                Twitter URL
                <input
                  type="url"
                  value={settings.social?.twitter || ''}
                  onChange={(e) => updateField('social', 'twitter', e.target.value)}
                />
              </label>
            </div>
          )}

          <div className="admin-settings-actions">
            {saved && <span className="admin-settings-saved">Saved successfully!</span>}
            <button className="button button--primary" type="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsAdmin;
