// /*
//  * @Author: wwx
//  * @Date: 2023-11-10 14:52:52
//  * @Description: 
//  */
// // 在扩展的后台脚本中监听来自普通窗口的消息
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("Message from content window:---", message);
//     let { data, token } = message;
//     if (token == 'fgui-ext-get-user-data') {
//         console.log("Message from content window:--- fgui:", data);

//         setData(data);
//     }
//     // // 可以在这里处理消息，或者向普通窗口发送响应消息
//     //sendResponse({ response: "Hello from the background script!" });

//     return true; //异步处理 直接返回
// });
// //{ token: 'fgui-ext-get-user-data', data: keys }

// function setData(data) {
//     console.log("background setData 11", data);
//     //updateUI(data)

//     (async () => {
//         // 发送消息到扩展页面
//         chrome.runtime.sendMessage(
//             { data:data},
//         );
//     })();
// }


