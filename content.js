/*
 * @Author: wwx
 * @Date: 2023-11-10 15:40:36
 * @Description: 
 */
//转发普通窗口的消息给DevTools
let rules = [
    'fgui-ext-get-user-data',
    'fgui-ext-check',
    'fgui-ext-check-node'
];
window.addEventListener('message', function (event) {
    //console.log('转发普通窗口的消息给DevTools', event);
    let { data, token } = event.data;
    if (rules.includes(token)) {
        chrome.runtime.sendMessage({ data, token }).catch(e => { });
    }
}, false);

//window.postMessage({ token: 'fgui-ext-get-user-data', data: keys });