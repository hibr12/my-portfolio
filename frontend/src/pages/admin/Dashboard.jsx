import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projects, skills, certificates, messages] = await Promise.all([
          api.getProjects(),
          api.getSkillGroups(),
          api.getCertificates(),
          api.getContactStats(),
        ]);

        setStats({
          projects: projects.data?.length || 0,
          skills: skills.data?.reduce((sum, g) => sum + g.skills.length, 0) || 0,
          skillGroups: skills.data?.length || 0,
          certificates: certificates.data?.length || 0,
          messages: messages.data || { total: 0, unread: 0 },
        });
      } catch {
        // Stats will remain null
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Dashboard</h1>
        <p>Overview of your portfolio</p>
      </div>

      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.projects}</span>
            <span className="admin-stat-card__label">Projects</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.skillGroups}</span>
            <span className="admin-stat-card__label">Skill Groups</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.certificates}</span>
            <span className="admin-stat-card__label">Certificates</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-card__value">{stats.messages.total}</span>
            <span className="admin-stat-card__label">Messages</span>
            {stats.messages.unread > 0 && (
              <span className="admin-stat-card__badge">{stats.messages.unread} unread</span>
            )}
          </div>
        </div>
      )}

      <div className="admin-welcome">
        <h2>Welcome to your Admin Dashboard</h2>
        <p>Use the sidebar to manage all aspects of your portfolio.</p>
        <div className="admin-welcome__links">
          <Link to="/admin/projects" className="button button--primary">Manage Projects</Link>
          <Link to="/admin/settings" className="button button--secondary">Site Settings</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
