import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const emptyProject = {
  title: '',
  description: '',
  technologies: '',
  github: '',
  demo: '',
  image: '',
  featured: false,
  order: 0,
};

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      const res = await api.getProjects();
      setProjects(res.data || []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyProject);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      github: project.github || '',
      demo: project.demo || '',
      image: project.image || '',
      featured: project.featured || false,
      order: project.order || 0,
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
      description: form.description,
      technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      github: form.github,
      demo: form.demo,
      image: form.image,
      featured: form.featured,
      order: Number(form.order),
    };

    try {
      if (editing) {
        await api.updateProject(editing.id, payload);
      } else {
        await api.createProject(payload);
      }
      setModalOpen(false);
      loadProjects();
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    try {
        await api.deleteProject(project.id);
      loadProjects();
    } catch {
      // handle silently
    }
  };

  if (loading) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Loading projects...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Projects</h1>
          <p>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="button button--primary" type="button" onClick={openCreate}>
          + Add Project
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Technologies</th>
              <th>Featured</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="admin-table__title">{project.title}</td>
                <td>
                  <div className="admin-table__tags">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span key={t} className="admin-tag">{t}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="admin-tag">+{project.technologies.length - 3}</span>
                    )}
                  </div>
                </td>
                <td>{project.featured ? <span className="admin-badge admin-badge--green">Yes</span> : <span className="admin-badge">No</span>}</td>
                <td>{project.order}</td>
                <td>
                  <div className="admin-table__actions">
                    <button type="button" className="admin-btn-sm" onClick={() => openEdit(project)}>Edit</button>
                    <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => handleDelete(project)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <p className="admin-empty">No projects yet. Add your first project.</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'} wide>
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
            Description *
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </label>

          <label>
            Technologies (comma-separated) *
            <input
              type="text"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="React, Node.js, MongoDB"
              required
            />
          </label>

          <div className="admin-form__row">
            <label>
              GitHub URL
              <input
                type="url"
                value={form.github}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
              />
            </label>
            <label>
              Demo URL
              <input
                type="url"
                value={form.demo}
                onChange={(e) => setForm({ ...form, demo: e.target.value })}
              />
            </label>
          </div>

          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            label="Project Image"
          />

          <div className="admin-form__row admin-form__row--small">
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
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
          </div>

          <div className="admin-form__footer">
            <button className="button button--secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="button button--primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectsAdmin;
