function getApiBase() {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isVercel = hostname.endsWith('.vercel.app');

    if (isLocalhost) {
      return '/api';
    }

    if (isVercel) {
      if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
      }
      console.warn('VITE_API_URL not set. API calls will fail on Vercel. Set VITE_API_URL to your Render backend URL (e.g., https://portfolio-backend.onrender.com/api)');
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
}

const API_BASE = getApiBase();
const API_TIMEOUT = 5000; // 5 second timeout

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 204) {
        return { success: true };
      }

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      let data;
      if (isJson) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response received:', {
          status: response.status,
          contentType,
          url,
          preview: text.slice(0, 200),
        });
        const error = new Error(
          response.ok
            ? 'Server returned an invalid response format'
            : `Request failed with status ${response.status}: ${text.slice(0, 100) || 'Unknown error'}`
        );
        error.status = response.status;
        error.isNonJsonResponse = true;
        throw error;
      }

      if (!response.ok) {
        const error = new Error(data.message || 'Request failed');
        error.status = response.status;
        error.errors = data.errors || [];
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.status = 408;
        throw timeoutError;
      }
      throw error;
    }
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

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data;
    if (isJson) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON upload response:', {
        status: response.status,
        contentType,
        preview: text.slice(0, 200),
      });
      throw new Error(`Upload failed with status ${response.status}: ${text.slice(0, 100) || 'Unknown error'}`);
    }

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
