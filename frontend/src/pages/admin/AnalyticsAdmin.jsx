import { useState, useEffect } from 'react';
import api from '../../services/api.js';

function AnalyticsAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.getAnalyticsDashboard(days);
        setData(res.data);
      } catch {
        // keep null
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [days]);

  if (loading) {
    return <div className="admin-loading"><div className="admin-loading__spinner" /><p>Loading analytics...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Analytics</h1>
          <p>Visitor tracking and insights</p>
        </div>
        <div className="admin-filters">
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              className={`admin-filter-btn ${days === d ? 'admin-filter-btn--active' : ''}`}
              type="button"
              onClick={() => setDays(d)}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {data && (
        <>
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-card__value">{data.totalVisitors}</span>
              <span className="admin-stat-card__label">Total Visitors</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__value">{data.newVisitors}</span>
              <span className="admin-stat-card__label">New Visitors</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__value">{data.returningVisitors}</span>
              <span className="admin-stat-card__label">Returning</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-card__value">{Math.round(data.avgSessionDuration)}s</span>
              <span className="admin-stat-card__label">Avg. Session</span>
            </div>
          </div>

          <div className="admin-analytics-grid">
            <div className="admin-analytics-card">
              <h3>Browsers</h3>
              {data.browserStats.length > 0 ? (
                <ul className="admin-analytics-list">
                  {data.browserStats.map((b) => (
                    <li key={b._id}>
                      <span>{b._id || 'Unknown'}</span>
                      <span className="admin-analytics-list__count">{b.count}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="admin-empty">No data yet</p>}
            </div>

            <div className="admin-analytics-card">
              <h3>Devices</h3>
              {data.deviceStats.length > 0 ? (
                <ul className="admin-analytics-list">
                  {data.deviceStats.map((d) => (
                    <li key={d._id}>
                      <span>{d._id || 'Unknown'}</span>
                      <span className="admin-analytics-list__count">{d.count}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="admin-empty">No data yet</p>}
            </div>

            <div className="admin-analytics-card">
              <h3>Top Pages</h3>
              {data.topPages.length > 0 ? (
                <ul className="admin-analytics-list">
                  {data.topPages.map((p) => (
                    <li key={p._id}>
                      <span>{p._id || 'Unknown'}</span>
                      <span className="admin-analytics-list__count">{p.count}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="admin-empty">No data yet</p>}
            </div>
          </div>

          {data.dailyVisits.length > 0 && (
            <div className="admin-analytics-card">
              <h3>Daily Visits</h3>
              <div className="admin-chart">
                {data.dailyVisits.map((d) => {
                  const maxVisitors = Math.max(...data.dailyVisits.map((v) => v.visitors));
                  const height = maxVisitors > 0 ? (d.visitors / maxVisitors) * 100 : 0;
                  return (
                    <div key={d._id} className="admin-chart__bar-wrapper" title={`${d._id}: ${d.visitors} visitors`}>
                      <div className="admin-chart__bar" style={{ height: `${height}%` }} />
                      <span className="admin-chart__label">{d._id.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AnalyticsAdmin;
