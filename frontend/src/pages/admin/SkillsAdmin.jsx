import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../../components/admin/Modal.jsx';

const emptyGroup = { title: '', skills: '', order: 0 };

function SkillsAdmin() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyGroup);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadGroups = async () => {
    try {
      const res = await api.getSkillGroups();
      setGroups(res.data || []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGroups(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyGroup);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (group) => {
    setEditing(group);
    setForm({
      title: group.title,
      skills: group.skills.join(', '),
      order: group.order || 0,
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
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      order: Number(form.order),
    };

    try {
      if (editing) {
        await api.updateSkillGroup(editing.id, payload);
      } else {
        await api.createSkillGroup(payload);
      }
      setModalOpen(false);
      loadGroups();
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (group) => {
    if (!window.confirm(`Delete "${group.title}"?`)) return;
    try {
        await api.deleteSkillGroup(group.id);
      loadGroups();
    } catch {
      // handle silently
    }
  };

  if (loading) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Loading skills...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Skills</h1>
          <p>{groups.length} group{groups.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="button button--primary" type="button" onClick={openCreate}>
          + Add Group
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Skills</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="admin-table__title">{group.title}</td>
                <td>
                  <div className="admin-table__tags">
                    {group.skills.map((s) => (
                      <span key={s} className="admin-tag">{s}</span>
                    ))}
                  </div>
                </td>
                <td>{group.order}</td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-btn-sm" onClick={() => openEdit(group)}>Edit</button>
                    <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => handleDelete(group)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groups.length === 0 && <p className="admin-empty">No skill groups yet.</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill Group' : 'Add Skill Group'}>
        <form className="admin-form" onSubmit={handleSubmit}>
          {error && <div className="admin-form__error">{error}</div>}

          <label>
            Group Title *
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>

          <label>
            Skills (comma-separated) *
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Node.js, MongoDB"
              required
            />
          </label>

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

export default SkillsAdmin;
