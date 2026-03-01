// اسم النسخة المخبأة (قم بتغيير الرقم عند تحديث ملفات الموقع لكي يتم تحديثها عند المستخدمين)
const CACHE_NAME = 'restaurant-cache-v1';

// الملفات التي نريد حفظها في ذاكرة الهاتف لكي يفتح الموقع بسرعة وبدون إنترنت
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  'https://i.ibb.co/bRzWVmPC/logo.jpg'
];

// عند تثبيت مشغل الخدمات، قم بحفظ الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم حفظ الملفات في الذاكرة المخبأة');
        return cache.addAll(urlsToCache);
      })
  );
});

// عند طلب أي ملف من الموقع (Fetch)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف موجوداً في الذاكرة، قم بإرجاعه
        if (response) {
          return response;
        }
        
        // إذا لم يكن موجوداً، قم بطلبه من الإنترنت
        return fetch(event.request).catch(() => {
            // إذا فشل الطلب (لا يوجد إنترنت)، اعرض صفحة "لا يوجد اتصال"
            if (event.request.mode === 'navigate') {
                return caches.match('/offline.html');
            }
        });
      }
    )
  );
});

// تنظيف الملفات القديمة عند تحديث مشغل الخدمات
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
