const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  getToken() {
    return localStorage.getItem('portfolio_token');
  }

  setToken(token) {
    localStorage.setItem('portfolio_token', token);
  }

  clearToken() {
    localStorage.removeItem('portfolio_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Request failed');
      error.status = response.status;
      error.errors = data.errors || [];
      throw error;
    }

    return data;
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  async uploadFile(file) {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    return data;
  }

  login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  getProfile() {
    return this.get('/auth/profile');
  }

  getSettings() {
    return this.get('/settings');
  }

  updateSettings(key, value) {
    return this.put(`/settings/${key}`, { value });
  }

  getProjects() {
    return this.get('/projects');
  }

  createProject(data) {
    return this.post('/projects', data);
  }

  updateProject(id, data) {
    return this.put(`/projects/${id}`, data);
  }

  deleteProject(id) {
    return this.delete(`/projects/${id}`);
  }

  getSkillGroups() {
    return this.get('/skills');
  }

  createSkillGroup(data) {
    return this.post('/skills', data);
  }

  updateSkillGroup(id, data) {
    return this.put(`/skills/${id}`, data);
  }

  deleteSkillGroup(id) {
    return this.delete(`/skills/${id}`);
  }

  getCertificates() {
    return this.get('/certificates');
  }

  createCertificate(data) {
    return this.post('/certificates', data);
  }

  updateCertificate(id, data) {
    return this.put(`/certificates/${id}`, data);
  }

  deleteCertificate(id) {
    return this.delete(`/certificates/${id}`);
  }

  getContactMessages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.get(`/contact${query ? `?${query}` : ''}`);
  }

  getContactStats() {
    return this.get('/contact/stats');
  }

  updateMessageStatus(id, status) {
    return this.patch(`/contact/${id}/status`, { status });
  }

  deleteContactMessage(id) {
    return this.delete(`/contact/${id}`);
  }

  getAnalyticsDashboard(days = 30) {
    return this.get(`/analytics/dashboard?days=${days}`);
  }

  trackEvent(data) {
    return this.post('/analytics', data);
  }

  updateSession(data) {
    return this.put('/analytics/session', data);
  }
}

const api = new ApiService();
export default api;
