/*
 * @Author: wwx
 * @Date: 2026-01-07 10:29:50
 * @Description: 
 */
(function inject() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.type = 'text/javascript';
    (document.documentElement || document.head).appendChild(script);
    console.log('inject document...')
})();
