export type AnalyticsEvent = 
  | 'PAGE_VIEW'
  | 'CTA_CLICK'
  | 'FORM_START'
  | 'FORM_SUBMIT'
  | 'QUOTE_REQUEST'
  | 'REPAIR_REQUEST'
  | 'CONTACT_CLICK'
  | 'PHONE_CLICK'
  | 'EMAIL_CLICK';

interface AnalyticsPayload {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export class Analytics {
  /**
   * Tracks standard analytics events.
   * This is a provider-independent abstraction layer.
   */
  static trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload) {
    if (typeof window !== 'undefined') {
      // In a real implementation, this would map to GTM, PostHog, Mixpanel, etc.
      console.log(`[Analytics Track]: ${event}`, payload);
      
      // Store locally for audit or debugging (if needed)
      // localStorage.setItem('last_event', event);
    }
  }

  static trackPageView(url: string) {
    this.trackEvent('PAGE_VIEW', { url });
  }
}
