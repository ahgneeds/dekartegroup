import {
  bootstrapEnterAnalytics,
  replaceEventDefinitions,
  type EventDefinition,
} from '@enter-pro/analytics-sdk';

type EventDefinitionsPayload =
  | EventDefinition[]
  | {
      definitions?: EventDefinition[];
      events?: EventDefinition[];
      data?: {
        definitions?: EventDefinition[];
        events?: EventDefinition[];
      };
    };

declare global {
  interface Window {
    __ENTER_ANALYTICS_DEFINITIONS__?: EventDefinition[];
  }
}

function normalizeEventDefinitions(payload: EventDefinitionsPayload): EventDefinition[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.definitions ?? payload.events ?? payload.data?.definitions ?? payload.data?.events ?? [];
}

async function loadEventDefinitions(): Promise<EventDefinition[]> {
  if (typeof window !== 'undefined' && Array.isArray(window.__ENTER_ANALYTICS_DEFINITIONS__)) {
    return window.__ENTER_ANALYTICS_DEFINITIONS__;
  }

  const endpoint = import.meta.env.VITE_ENTER_ANALYTICS_DEFINITIONS_ENDPOINT;
  if (!endpoint) {
    return [];
  }

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      return [];
    }

    return normalizeEventDefinitions((await response.json()) as EventDefinitionsPayload);
  } catch {
    return [];
  }
}

/**
 * Owner opt-out: when the "dekarte_no_track" cookie is set (toggled from the
 * back office), the owner's own device/browser is never counted in analytics.
 */
function isInternalVisitor(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some((entry) => entry.trim().startsWith('dekarte_no_track=1'));
}

export function bootstrapGeneratedSiteAnalytics(): void {
  if (isInternalVisitor()) {
    return;
  }

  bootstrapEnterAnalytics();

  void loadEventDefinitions().then((definitions) => {
    if (definitions.length > 0) {
      replaceEventDefinitions(definitions);
    }
  });
}
