const VISITOR_ID_KEY = 'portfolio_visitor_id';
const SESSION_START_KEY = 'portfolio_session_start';

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

function getIsReturning() {
  return sessionStorage.getItem(SESSION_START_KEY) === 'true';
}

function detectBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
}

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

function detectDevice() {
  const ua = navigator.userAgent;
  if (ua.includes('Mobile') || ua.includes('Android')) return 'Mobile';
  if (ua.includes('iPad') || ua.includes('Tablet')) return 'Tablet';
  return 'Desktop';
}

class AnalyticsTracker {
  constructor() {
    this.buffer = [];
    this.flushInterval = null;
    this.sessionStart = Date.now();
    this.maxScrollDepth = 0;
    this.initialized = false;
  }

  init() {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    sessionStorage.setItem(SESSION_START_KEY, 'true');

    this.trackEvent('session_start', { page: window.location.hash || '#home' });

    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent;
      }
    }, { passive: true });

    this.flushInterval = setInterval(() => {
      this.flush();
    }, 30000);
  }

  trackEvent(type, data = {}) {
    const event = {
      type,
      page: window.location.hash || '#home',
      target: data.target || '',
      value: data.value || null,
      timestamp: new Date().toISOString(),
    };

    this.buffer.push(event);

    if (type === 'session_start' || type === 'click' || type === 'download') {
      this.flush();
    }
  }

  async flush(sync = false) {
    if (this.buffer.length === 0) return;

    const events = [...this.buffer];
    this.buffer = [];

    const payload = {
      visitorId: getVisitorId(),
      browser: detectBrowser(),
      os: detectOS(),
      device: detectDevice(),
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      referrer: document.referrer || '',
      landingPage: window.location.hash || '#home',
      sessionDuration: Math.round((Date.now() - this.sessionStart) / 1000),
      scrollDepth: this.maxScrollDepth,
      isReturning: getIsReturning(),
      events,
    };

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      if (sync && navigator.sendBeacon) {
        navigator.sendBeacon(`${API_BASE}/analytics`, JSON.stringify(payload));
      } else {
        await fetch(`${API_BASE}/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch {
      // Analytics should never break the app
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush(true);
  }
}

const analytics = new AnalyticsTracker();
export default analytics;
