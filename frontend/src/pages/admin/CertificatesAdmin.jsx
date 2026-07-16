import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const emptyCert = { title: '', issuer: '', year: '', image: '', order: 0 };

function CertificatesAdmin() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCert);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCerts = async () => {
    try {
      const res = await api.getCertificates();
      setCerts(res.data || []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCerts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCert);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (cert) => {
    setEditing(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      image: cert.image || '',
      order: cert.order || 0,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title,
      issuer: form.issuer,
      year: form.year,
      image: form.image,
      order: Number(form.order),
    };

    try {
      if (editing) {
        await api.updateCertificate(editing.id, payload);
      } else {
        await api.createCertificate(payload);
      }
      setModalOpen(false);
      loadCerts();
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete "${cert.title}"?`)) return;
    try {
        await api.deleteCertificate(cert.id);
      loadCerts();
    } catch {
      // handle silently
    }
  };

  if (loading) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Loading certificates...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Certificates</h1>
          <p>{certs.length} certificate{certs.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="button button--primary" type="button" onClick={openCreate}>
          + Add Certificate
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Issuer</th>
              <th>Year</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((cert) => (
              <tr key={cert.id}>
                <td className="admin-table__title">{cert.title}</td>
                <td>{cert.issuer}</td>
                <td>{cert.year}</td>
                <td>{cert.order}</td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-btn-sm" onClick={() => openEdit(cert)}>Edit</button>
                    <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => handleDelete(cert)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {certs.length === 0 && <p className="admin-empty">No certificates yet.</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certificate' : 'Add Certificate'}>
        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <div className="admin-form__error">{error}</div>}

          <label>
            Title *
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label>
            Issuer *
            <input
              type="text"
              value={form.issuer}
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              required
            />
          </label>

          <label>
            Year *
            <input
              type="text"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="2025"
              required
            />
          </label>

          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            label="Certificate Image"
          />

          <label>
            Order
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              style={{ width: 80 }}
            />
          </label>

          <div className="admin-form__footer">
            <button className="button button--secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="button button--primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CertificatesAdmin;
