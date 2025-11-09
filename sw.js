

const CACHE_NAME = 'attendance-tracker-cache-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // Scripts
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/hooks/useLocalStorage.ts',
  '/components/AddSubject.tsx',
  '/components/BottomNav.tsx',
  '/components/CalendarView.tsx',
  '/components/Dashboard.tsx',
  '/components/icons/AddIcon.tsx',
  '/components/icons/CalendarIcon.tsx',
  '/components/icons/CheckIcon.tsx',
  '/components/icons/CrossIcon.tsx',
  '/components/icons/DashboardIcon.tsx',
  '/components/icons/DeleteIcon.tsx',
  '/components/icons/EditIcon.tsx',

  // Icons and assets
  '/vite.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',

  // External resources
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/'
];

// Install event: cache the application shell and static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching assets');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Cache addAll failed:', err);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve with a robust cache-then-network strategy
self.addEventListener('fetch', (event) => {
    // For navigation requests, use a network-first strategy to get the latest HTML.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/index.html');
            })
        );
        return;
    }
  
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // Not in cache - fetch from network, and cache it for next time
            return fetch(event.request).then(
                (networkResponse) => {
                    if(!networkResponse || networkResponse.status !== 200) {
                        return networkResponse;
                    }

                    // Clone the response because it's a stream that can only be consumed once.
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Only cache GET requests.
                            if (event.request.method === 'GET') {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return networkResponse;
                }
            ).catch(err => {
                console.error("Fetch failed; returning offline page instead.", err);
                // Return a fallback if fetch fails (e.g., you're offline)
                // You can create an offline.html page for a better experience
                return caches.match('/'); 
            });
        })
    );
});