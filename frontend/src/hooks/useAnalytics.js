import analytics from '../services/analytics.js';

export function trackClick(target) {
  analytics.trackEvent('click', { target });
}

export function trackDownload(target) {
  analytics.trackEvent('download', { target });
}

export function initAnalytics() {
  analytics.init();
}
