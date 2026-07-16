import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Modal from '../../components/admin/Modal.jsx';

function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [viewing, setViewing] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter) params.status = filter;
      const res = await api.getContactMessages(params);
      setMessages(res.data || []);
      setPagination(res.pagination);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.getContactStats();
      setStats(res.data);
    } catch {
      // keep null
    }
  };

  useEffect(() => { loadMessages(); }, [page, filter]);
  useEffect(() => { loadStats(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateMessageStatus(id, status);
      loadMessages();
      loadStats();
      if (viewing?.id === id) {
        setViewing((prev) => ({ ...prev, status }));
      }
    } catch {
      // handle silently
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.deleteContactMessage(id);
      loadMessages();
      loadStats();
      if (viewing?.id === id) setViewing(null);
    } catch {
      // handle silently
    }
  };

  const statusColor = (status) => {
    if (status === 'unread') return 'admin-badge--yellow';
    if (status === 'replied') return 'admin-badge--green';
    return '';
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Messages</h1>
          <p>Contact form submissions</p>
        </div>
      </div>

      {stats && (
        <div className="admin-stats-grid admin-stats-grid--compact">
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.total}</span>
            <span className="admin-stat-card__label">Total</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.unread}</span>
            <span className="admin-stat-card__label">Unread</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.read}</span>
            <span className="admin-stat-card__label">Read</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.replied}</span>
            <span className="admin-stat-card__label">Replied</span>
          </div>
        </div>
      )}

      <div className="admin-filters">
        {['', 'unread', 'read', 'replied'].map((status) => (
          <button
            key={status}
            className={`admin-filter-btn ${filter === status ? 'admin-filter-btn--active' : ''}`}
            type="button"
            onClick={() => { setFilter(status); setPage(1); }}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loading__spinner" /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className={msg.status === 'unread' ? 'admin-table__row--unread' : ''}>
                  <td className="admin-table__title">{msg.name}</td>
                  <td>{msg.email}</td>
                  <td className="admin-table__message">{msg.message.substring(0, 80)}...</td>
                  <td><span className={`admin-badge ${statusColor(msg.status)}`}>{msg.status}</span></td>
                  <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn-sm" onClick={() => setViewing(msg)}>View</button>
                      <button type="button" className="admin-btn-sm admin-btn-sm--danger" onClick={() => handleDelete(msg.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.length === 0 && <p className="admin-empty">No messages found.</p>}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="admin-pagination">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page} of {pagination.pages}</span>
          <button type="button" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Message Details" wide>
        {viewing && (
          <div className="admin-message-detail">
            <div className="admin-message-detail__header">
              <div>
                <strong>{viewing.name}</strong>
                <span>{viewing.email}</span>
              </div>
              <span className={`admin-badge ${statusColor(viewing.status)}`}>{viewing.status}</span>
            </div>
            <p className="admin-message-detail__date">
              {new Date(viewing.createdAt).toLocaleString()}
            </p>
            <div className="admin-message-detail__body">
              {viewing.message}
            </div>
            <div className="admin-message-detail__actions">
              {viewing.status === 'unread' && (
                <button className="button button--secondary" type="button" onClick={() => handleStatusChange(viewing.id, 'read')}>
                  Mark as Read
                </button>
              )}
              {viewing.status !== 'replied' && (
                <button className="button button--primary" type="button" onClick={() => handleStatusChange(viewing.id, 'replied')}>
                  Mark as Replied
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MessagesAdmin;
