// Bump when static assets change: the fetch handler is cache-first, so a stale
// name keeps serving the previous build (which silently broke new sound files).
const CACHE_NAME = 'medication-reminders-v3';
const STATIC_ASSETS = [
  '/',
  '/patient/reminders',
  '/icons/icon-512x512.svg',
  '/sounds/message-notification.wav',
  '/sounds/reminder-notification.wav',
  '/sounds/call-ring.wav',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Never intercept or cache WebSocket handshakes, SockJS info/polling, REST API endpoints, or _next assets
  if (
    url.pathname.startsWith('/ws') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.searchParams.has('token') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Fallback gracefully for offline or network blips
          return caches.match('/');
        });
    })
  );
});


self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-512x512.svg',
    badge: data.badge || '/icons/icon-512x512.svg',
    tag: data.tag,
    data: data.data,
    actions: data.actions || [
      { action: 'TAKEN', title: 'Taken' },
      { action: 'SNOOZE', title: 'Snooze 10 min' },
      { action: 'SKIPPED', title: 'Skip' },
    ],
    requireInteraction: data.requireInteraction ?? true,
    vibrate: data.vibrate || [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'TAKEN' || action === 'SKIPPED') {
    event.waitUntil(
      fetch(`/api/v1/medication-reminders/${data.reminderId}/adherence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduledDate: new Date().toISOString().split('T')[0],
          doseTime: data.doseTime,
          status: action,
        }),
        credentials: 'include',
      }).then((response) => {
        if (!response.ok) {
          console.error('Failed to log adherence');
        }
      })
    );
  } else if (action === 'SNOOZE') {
    event.waitUntil(
      new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000)).then(() => {
        if (self.registration) {
          self.registration.showNotification('Medication Reminder (Snoozed)', {
            body: `Time to take your medication`,
            icon: '/icons/icon-512x512.svg',
            badge: '/icons/icon-512x512.svg',
            tag: `medication-${data.reminderId}-${data.doseTime}-snoozed`,
            data: data,
            actions: [
              { action: 'TAKEN', title: 'Taken' },
              { action: 'SNOOZE', title: 'Snooze 10 min' },
              { action: 'SKIPPED', title: 'Skip' },
            ],
            requireInteraction: true,
            vibrate: [200, 100, 200],
          });
        }
      })
    );
  } else if (data?.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(data.url);
        }
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_REMINDER') {
    const { reminderId, medicineName, doseTimes, startDate } = event.data;

    doseTimes.forEach((doseTime) => {
      const [hours, minutes] = doseTime.split(':').map(Number);
      const scheduledDate = new Date(startDate);
      scheduledDate.setHours(hours, minutes, 0, 0);

      if (scheduledDate < new Date()) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      const delay = scheduledDate.getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          self.registration.showNotification('Medication Reminder', {
            body: `Time to take ${medicineName}`,
            icon: '/icons/icon-512x512.svg',
            badge: '/icons/icon-512x512.svg',
            tag: `medication-${reminderId}-${doseTime}`,
            data: { reminderId, doseTime },
            actions: [
              { action: 'TAKEN', title: 'Taken' },
              { action: 'SNOOZE', title: 'Snooze 10 min' },
              { action: 'SKIPPED', title: 'Skip' },
            ],
            requireInteraction: true,
            vibrate: [200, 100, 200],
          });
        }, delay);
      }
    });
  }
});