// 鏀逛簡椤甸潰灏辨妸鐗堟湰鍙峰姞 1锛屾墜鏈轰笂鎵嶄細鎹㈡柊鐨?
const CACHE = 'ayan-v11';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 鍙鑷繁鐨勯〉闈㈡枃浠讹紱鍙戠粰鏅鸿氨鐨勮姹備笉纰?
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    // no-cache锛氭瘡娆￠兘闂竴涓嬫湇鍔″櫒鏈夋病鏈夋柊鐨勶紝涓嶅悆 GitHub 缁欑殑 10 鍒嗛挓缂撳瓨
    // 锛堢敤缃戝潃閲嶆柊鍙戯紝鎵撳紑椤甸潰閭ｇ璇锋眰涓嶈兘鐩存帴甯﹂€夐」锛?
    fetch(e.request.url, { cache: 'no-cache' }).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
