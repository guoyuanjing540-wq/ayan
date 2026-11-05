// 改了页面就把版本号加 1，手机上才会换新的
const CACHE = 'ayan-v31';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// 只管自己的页面文件；发给智谱的请求不碰
// 先问网络（不吃缓存），3 秒没回就先拿存着的那份——国内不开梯子 GitHub 常常很慢，干等就是白屏
// 网络那份后台照样下完存起来，下次打开就是新的
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const net = fetch(e.request.url, { cache: 'no-cache' }).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  });
  e.waitUntil(net.then(() => {}, () => {}));
  e.respondWith(Promise.race([net.catch(() => null), new Promise(r => setTimeout(r, 3000, null))])
    .then(r => r || caches.match(e.request).then(hit => hit || (e.request.mode === 'navigate' ? caches.match('index.html') : null)).then(hit => hit || net)));
});
