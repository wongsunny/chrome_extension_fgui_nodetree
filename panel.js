let directoryElementMap = {}; //已经创建的目录元素
let directoryElementMap_lastFrame = {}; //上一帧数据
let directoryContainer; //根目录容器
let gridContainer; //网格容器
let gridMsg; //网格容器日志
let propetys = [
  'clsName', '_name', '_guid', 
  'x', 'y', 'height', 'width', 'rotation', 'scaleX', 'scaleY',
  'visible',
];; //显示的节点属性
let propety2type = {
  ['x']: 'number',
  ['y']: 'number',
  ['height']: 'number',
  ['width']: 'number',
  ['rotation']: 'number',
  ['scaleX']: 'number',
  ['scaleY']: 'number',

  ['visible']: 'boolean',
}
let onlyReadPropetys = ['clsName', '_name', '_guid']; //仅可读的属性
let createPropetys = [];//已经被创建的key值
let msgEle; //调试信息显示元素
let loadBtn; //加载按钮
let pauseBtn; //暂停按钮
let refreshBtn; //刷新按钮
let selectedData; //选中数据
let consoleBtn; //调试节点
let drawBtn; //标记节点
let isDraw = false;

let session = 0;
function genSession() {
  return ++session;
}
let sessionCallbackMap = {};
let isPause = false;

directoryContainer = document.getElementById("directory");
msgEle = document.getElementById('msgTxt');
loadBtn = document.getElementById('loadBtn');
refreshBtn = document.getElementById('refreshBtn');
pauseBtn = document.getElementById('pauseBtn');
gridMsg = document.getElementById('gridMsg');
consoleBtn = document.getElementById('consoleBtn');
drawBtn = document.getElementById('drawBtn');
gridMsg.style.display = 'none';
createGridContailner();
isShowBtns(false);

//右侧属性网格元素
function createGridContailner() {
  gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  detailsPanel.appendChild(gridContainer);
}

//右侧属性网格元素item
function createGridItem(key, value) {
  let gridItem = document.createElement("div");
  gridItem.id = `gridItem_${key}`;
  gridItem.classList.add("grid-item");

  if (onlyReadPropetys.indexOf(key) >= 0) {
    //只读的属性
    gridItem.innerHTML = `
                    <div class="flex-container"">
                        <p>${key}:</p>
                        <input type="text" id="input_${key}" value="${value}" readonly class="readonly">
                    </div>
                `;
  }
  else {
    gridItem.innerHTML = `
                    <div class="flex-container"">
                        <p>${key}:</p>
                        <input type="text" id="input_${key}" value="${value}">
                    </div>
                `;
  }
  gridContainer.appendChild(gridItem);
  createPropetys.push(key);
  let input = gridItem.querySelector('input');
  input.addEventListener("blur", function (event) {
    if (input.classList.contains('readonly')) return;
    let selectid = selectedData['_guid'];
    let value = event.target.value;
    //console.log(`选中的节点id: ${selectid} value:${value}`);

    //修改节点树数据
    let v;
    let t = propety2type[key];
    switch (t) {
      case "number":
        v = Number(value);
        break;
      case "string":
        v = String(value);
      case "boolean":
        {
          let vv = Number(value);
          if (isNaN(vv)) {
            //字符串
            v = value != 'false'
          }
          else {
            v = Number(value)
            if (v == 0) {
              v = false;
            }
            else {
              v = true;
            }
          }
        }
      default:
        break;
    }
    let session = genSession();
    checkNodeLive(session, selectid, (live) => {
      if (live) {
        let raw = `window._ext_NodeTable['${selectid}']&&(window._ext_NodeTable['${selectid}']['${key}']=${v})`;
        chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
          //console.log('节点赋值', raw, selectid, v, result, e);
          e || setMsg(`修改节点guid:${selectid}属性成功!`);
        })
      }
      else {
        gridContainer.style.display = 'none';
        gridMsg.style.display = 'block';
        gridMsg.textContent = `guid:${selectid}节点已经失效,可尝试刷新节点树`;
        selectedData = null;
      }
    })
    
  });
}

//获取属性网格元素
function getGridItem(key) {
  let id = `gridItem_${key}`
  return document.getElementById(id);
}

//更新网格元素值
function updateGridItemValue(key, value) {
  let ele = getGridItem(key);
  if (ele) {
    let input = ele.querySelector('input');
    input.value = `${value}`;
  }
}

//获取输入框元素
function getInputElement(key) {
  let id = `input_${key}`
  return document.getElementById(id);
}

//删除网格元素属性
function clearGridItem(key) {
  let id = `gridItem_${key}`
  let ele = document.getElementById(id);
  gridContainer.removeChild(ele);
  let tList = [];
  for (let i = 0; i < createPropetys.length; i++) {
    const k = createPropetys[i];
    if (k != key) {
      tList.push(k);
    }
  }
  createPropetys = tList;
}

//删除所有网格元素属性
function clearAllGridItems() {
  for (let i = 0; i < createPropetys.length; i++) {
    const k = createPropetys[i];
    clearGridItem(k)
  }
}

//选中目录
function onSelectedItem(ele) {
  let data = ele['_sourceData'];
  let session = genSession();
  let guid = data._guid;

  checkNodeLive(session, guid, (live) => {
    if (live) {
      gridContainer.style.display = null;
      gridMsg.style.display = 'none';
      for (let i = 0; i < propetys.length; i++) {
        const key = propetys[i];
        let value = data[key];
        if (createPropetys.indexOf(key) >= 0) {
          updateGridItemValue(key, value)
        }
        else {
          createGridItem(key, value);
        }
      }
      selectedData = data;
      if (isDraw) {
        //绘制选中节点标记框
        let raw = `window._ext_draw_graph&&window._ext_draw_graph(${guid})`;
        chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
          //console.log('节点赋值', raw, selectid, v, result, e);
        })
      }
      setMsg(`选中节点guid:${guid}`);
    }
    else {
      gridContainer.style.display = 'none';
      gridMsg.style.display = 'block';
      gridMsg.textContent = `guid:${guid}节点已经失效,可尝试刷新节点树`;
      selectedData = null;
    }
  })
}

// 递归生成目录结构
function generateDirectory(parentElement, items) {
  if (parentElement['_added']) return;
  parentElement['_added'] = true;
  items.forEach(function (item) {
    let element;
    let id = item._guid
    //console.log('递归生成目录结构', id, item);
    let name = `${item._name}-${item.clsName}`;
    let nestedContainer
    if (item.childs && item.childs.length) {
      //目录
      element = document.createElement("div");
      element.classList.add("folder");

      let parentOpen = false;
      if (directoryElementMap_lastFrame[id]) {
        parentOpen = directoryElementMap_lastFrame[id].open;
      }
      // 判断父级是否是打开状态，如果是，则当前目录默认是打开状态，否则默认是关闭状态
      if (parentOpen) {
        element.classList.add("open");
        element.innerHTML = '<div class="icon icon-open"></div>' + `<span class="directoryName">${name}</span>`;
      }
      else {
        element.innerHTML = '<div class="icon icon-closed"></div>' + `<span class="directoryName">${name}</span>`;
      }


      nestedContainer = document.createElement("div");
      nestedContainer.classList.add("nested");
      element.appendChild(nestedContainer);

      element['_sourceData'] = item;
      directoryElementMap[id] = { element, open: parentOpen, selected: false };
      //console.log("创建目录:",id, element.textContent);
      parentOpen && generateDirectory(nestedContainer, item.childs);
    }
    else {
      //文件
      element = document.createElement("div");
      element.classList.add("file");
      element.innerHTML = `<span class="directoryName">${name}</span>`;

      element['_sourceData'] = item;
      directoryElementMap[id] = { element, open: false, selected: false };
      //console.log("创建文件:", id, element.textContent);
    }


    if (directoryElementMap_lastFrame[id]) {
      let selected = directoryElementMap_lastFrame[id].selected;
      if (selected) {
        onSelectedGridItem(element);
      }
    }

    element.addEventListener("click", function (event) {
      event.stopPropagation(); // 防止事件冒泡触发父级的点击事件
      //console.log("点击的元素:", element.textContent);

      if (this.classList.contains("folder")) {
        this.classList.toggle("open");
        let nestedContent = this.querySelector(".nested");
        if (element.classList.contains("open")) {
          nestedContent.style.display = "block";
        }
        else {
          nestedContent.style.display = "none";
        }

        //点击目录目录切换目录图标样式
        let icon = this.querySelector(".icon");
        if (element.classList.contains("open")) {
          icon.classList.remove("icon-closed");
          icon.classList.add("icon-open");
          //打开目录
          directoryElementMap[id].open = true;
        } else {
          icon.classList.remove("icon-open");
          icon.classList.add("icon-closed");
          //关闭目录
          directoryElementMap[id].open = false;
        }

        if (item.childs && item.childs.length) {
          //console.log('点击创建子目录', element.textContent);
          generateDirectory(nestedContainer, item.childs);
        }
      }

      onSelectedGridItem(element);
    });


    parentElement.appendChild(element);
  });
}

function onSelectedGridItem(clickElement) {
  //点击目录元素
  for (const key in directoryElementMap) {
    const ele = directoryElementMap[key].element;
    let sp = ele.querySelector('span')
    if (ele == clickElement) {
      //console.log('点击目录元素', ele, clickElement);
      if (ele.classList.contains("selected") == false) {
        //点击的元素
        //console.log('点击目录元素', '点击的元素', ele);
        sp.classList.remove("directoryName");
        sp.classList.add("directoryName-selected");
        directoryElementMap[key].selected = true;
        onSelectedItem(ele);
      }
    }
    else {
      //其他元素
      sp.classList.remove("directoryName-selected");
      sp.classList.add("directoryName");
      directoryElementMap[key].selected = false;
    }
  }
}


//刷新节点树
function refreshNodeTree(transmitData) {
  //console.log('刷新节点树', transmitData);
  selectedData = null;
  directoryElementMap_lastFrame = {};
  for (const key in directoryElementMap) {
    const data = directoryElementMap[key];
    let { open, selected } = data;
    directoryElementMap_lastFrame[key] = { open, selected };
    //if (element) element.remove();
  }
  while (directoryContainer.firstChild) {
    directoryContainer.removeChild(directoryContainer.firstChild);
  }
 
  directoryElementMap = {};
  let id = transmitData._guid;
  let open = false;
  if (directoryElementMap_lastFrame[id]) {
    open = directoryElementMap_lastFrame[id].open;
  }
  directoryContainer['_added'] = null;
  generateDirectory(directoryContainer, transmitData, open);
}

function setMsg(msg) {
  msgEle.textContent = `${msg}`;
}

//更新节点树数据
function updateNodeTree(transmitData) {
  //console.log('节点数据变化推送', transmitData)
  refreshNodeTree(transmitData);
}


// popup.js 或 content.js
// 在扩展的后台脚本中监听来自普通窗口的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //console.log('在扩展的后台脚本中监听来自普通窗口的消息', message);
  let { data, token } = message;
  if ('fgui-ext-get-user-data' == token) {
    updateNodeTree(data);
  }
  else if ('fgui-ext-check' == token) {
    console.log('是否是fgui游戏', data);
    if (data.isFgui == false) {
      isShowBtns(false, '不是fgui!!');
      refreshNodeTree([]);
      gridMsg.textContent = '不是fgui!!';
    }
    else {
      isShowBtns(true);
      setMsg('是否是fgui:' + data.isFgui);
    }
  }
  else if ('fgui-ext-check-node' == token) {
    let { session, live } = data;
    if (sessionCallbackMap[session]) {
      sessionCallbackMap[session](live);
      delete sessionCallbackMap[session];
    }
  }
  return true;
});

//检查节点是否还是节点树
function checkNodeLive(session, guid, callback) {
  sessionCallbackMap[session] = callback;
  let raw = `window._ext_checkNode(${session},${guid});`;
  chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
    //console.log('检查节点是否还是节点树', result, e);
    if (e) {
      //调用出错了 直接返回
      if (sessionCallbackMap[session]) {
        sessionCallbackMap[session](false);
        delete sessionCallbackMap[session];
      }
    }
  })
}

//加载扩展程序
loadBtn.onclick = () => {
  let raw = getInjectFunctionRaw(injectGameLoop);
  chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
    console.log("加载扩展程序", result, e);
  })
};

//暂停调用
pauseBtn.onclick = () => {
  checkInjectGame(() => {
    if (isPause == false) {
      //暂停
      isPause = true;
      let raw = `window.aopPause=true`;
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        e || setMsg('暂停游戏成功!');
      })
      pauseBtn.textContent = '取消暂停'
    }
    else {
      //取消暂停
      isPause = false;
      let raw = `window.aopPause=false`;
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        e || setMsg('取消暂停成功!');
      })
      pauseBtn.textContent = '暂停游戏'
    }
  })
}

//刷新节点树
refreshBtn.onclick = () => {
  checkInjectGame(() => {
    let raw = `window._ext_loop&&window._ext_loop();`;
    chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
      if (e == null) {
        setMsg('刷新节点树成功!');
      }
    })
  })
}

drawBtn.onclick = () => {
  checkInjectGame(() => {
    if (isDraw == false) {
      if (selectedData) {
        let guid = selectedData._guid;
        let raw = `window._ext_draw_graph&&window._ext_draw_graph(${guid})`;
        chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
          if (e == null) {
            setMsg('设置选中标记节点成功!');
            drawBtn.textContent = '取消标记选中节点'
            isDraw = true;
          }
        })
      }
      else {
        setMsg('设置选中标记节点成功!');
        isDraw = true;
        drawBtn.textContent = '取消标记选中节点'
      }
    }
    else {
      let raw = `window._ext_hide_graph&&_ext_hide_graph();`;
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        if (e == null) {
          setMsg('取消选中标记节点成功!'); 
          isDraw = false;
          drawBtn.textContent = '标记选中节点'
        } 
      })
    }
   
  })
}

//调试节点
consoleBtn.onclick = () => {
  checkInjectGame(() => { 
    if (selectedData) {
      let guid = selectedData._guid;
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.setAttribute('value', `window._ext_NodeTable[${guid}]`);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      document.body.removeChild(input);
      let raw = `window.console.log('FairyguiNodeTree - 获取guid:${guid}的节点成功,Ctrl+V控制台输出节点信息');`
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        e || setMsg(`获取guid:${guid}的节点成功,Ctrl+V控制台输出节点信息`)
      })
    } else {
      let raw = `window.console.log('FairyguiNodeTree - 请选中一个节点!');`
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        e || setMsg(`请选中一个节点!`)
      })
    }
  })
}
//检查是否已经注入脚本到游戏主循环
function checkInjectGame(callback) {
  let raw = `window._ext_test();`
  chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
    console.log('检查是否已经注入脚本到游戏主循环', result, e);
    if (e) {
      //没有注入游戏主循环
      isShowBtns(false);
    }
    else {
      //侵入了游戏主循环
      isShowBtns(true);
      callback();
    }
  })
}

function isShowBtns(boo,msg) {
  let btns = [
    pauseBtn,
    refreshBtn,
    consoleBtn,
    drawBtn,
  ];

  btns.forEach(btn => {
    btn.style.display = boo ? 'block' : 'none';
  })

  if (boo == false) {
    pauseBtn.textContent = '暂停游戏';
    isPause = false;
    drawBtn.textContent = '标记选中节点'
    isDraw = false;
    if (msg) {
      setMsg(msg);
    }
    else {
      setMsg('请先加载扩展程序');
    }
  
  }
 
}


/**
 * 获取函数的字符串源码
 * @param {*} func 
 * @returns 
 */
function getInjectFunctionRaw(func) {
  let code = func.toString();
  let array = code.split('\n');
  array.splice(0, 1); // 删除开头
  array.splice(-1, 1); // 删除结尾
  let evalCode = "";
  for (let i = 0; i < array.length; i++) {
    evalCode += array[i] + '\n';
  }
  return evalCode;
}


/**
 * 侵入游戏主循环
 */
function injectGameLoop() {

  window.ext_isFgui = true;
  try {
    var _fugi = fgui;
  } catch (e) {
    window.ext_isFgui = false;
  }
  console.log('FairyguiNodeTree - 是否是fgui游戏', window.ext_isFgui);
  window.postMessage({ token: 'fgui-ext-check', data: { isFgui: window.ext_isFgui } });
  if (window.ext_isFgui) {
    console.log('FairyguiNodeTree - 侵入游戏主循环')
    //暂停状态
    window.aopPause = false;

    let rawRequestAnimationFrame = window.requestAnimationFrame;

    function _checkPause() {
      window.requestAnimationFrame(_checkPause);
    }

    let flag = false;
    let frames = []; // window.requestAnimationFrame 可能被多次调用
    window.requestAnimationFrame = function (frame) {

      if (window.aopPause) {
        flag = true;
        //console.log('requestAnimationFrame ... 暂停状态');
        //报存暂停期间的调用
        if (!frames.includes(frame) && frame != _checkPause) frames.push(frame);
        rawRequestAnimationFrame(_checkPause);
      }
      else {
        if (flag) {
          //结束暂停
          flag = false;
          console.log('FairyguiNodeTree - 结束暂停', frames.length);
          for (let i = 0; i < frames.length; i++) {
            const f = frames[i];
            rawRequestAnimationFrame(f);
          }
          frames = [];
        }
        else {
          rawRequestAnimationFrame(frame);
        }
        //console.log('requestAnimationFrame ... 正常状态', frames, frame);
      }
    };


    window._ext_NodeTable = {} //节点树列表
    window._ext_guid = 0;
    function _traversalTree(node) {
      if (node == null) return;
      if (node._name != '_ext_draw_graph') {
        let id = node['_guid'] || window._ext_guid++;
        node['_guid'] = id;
        window._ext_NodeTable[id] = node;
      }

      if (node._children && node._children.length) {
        for (let i = 0; i < node._children.length; i++) {
          const c = node._children[i];
          _traversalTree(c);
        }
      }
    }

    window._ext_transmitData = []; //与扩展程序通信的数据
    let propetys = [
      '_name', '_guid',
      'x', 'y', 'height', 'width', 'rotation', 'scaleX', 'scaleY',
      'visible',
    ];
    function _traversalTree2(node, parent) {
      if (node == null) return;

      let propety = {};
      for (const p of propetys) {
        propety[p] = node[p];
      }
      if (node == fgui.GRoot.inst && !node['_name']) {
        propety['_name'] = 'root'
      }
      propety['childs'] = [];
      let clsName = _ext_obj2class(node);
      propety['clsName'] = clsName;
      if (parent) {
        if (node._name != '_ext_draw_graph') {
          parent['childs'].push(propety);
        }
      }
      else {
        window._ext_transmitData = [propety];
      }
      if (node._children && node._children.length) {
        for (let i = 0; i < node._children.length; i++) {
          const c = node._children[i];
          _traversalTree2(c, propety)
        }
      }
    }

    function _ext_loop() {
      let root = fgui.GRoot.inst;
      window._ext_NodeTable = {}; //节点数据
      _traversalTree(root);

      window._ext_transmitData = [];//应用程序和扩展程序通信数据(普通JSON)
      _traversalTree2(root);
      //console.log('更新节点树信息', window._ext_NodeTable)
      let transmitData = JSON.parse(JSON.stringify(window._ext_transmitData)); //深拷贝
      window.postMessage({ token: 'fgui-ext-get-user-data', data: transmitData });
    }

    //console.log('更新节点树信息 ...');


    //插件程序调用 检查节点是否还在节点树
    function _ext_checkNode(session, guid) {

      let live = false
      let checkFunc = (node) => {
        if (node == null) {
          live = false;
          return;
        }
        if (node == fgui.GRoot.inst) { //根节点没有父节点了
          live = true;
          return;
        }
        if (node.parent == null) {
          live = false;
          return;
        }
        checkFunc(node.parent); //递归查找父节点是否还在节点树
      }
 
      let node = window._ext_NodeTable[guid];
      checkFunc(node);
     
      let data = {
        session,
        live,
      }
      //console.log('检查节点是否还在节点树', guid, data);
      window.postMessage({ token: 'fgui-ext-check-node', data: data });
    }

    //插件调用测试函数
    function _ext_test() {
      return true;
    }

    function _ext_obj2class(node) {
      let clsList = [
        fgui.GRoot,
        fgui.GComponent,
        fgui.GButton,
        fgui.GImage,
        fgui.GLabel,
        fgui.GList,
        fgui.GLoader,
        fgui.GTextField,
        fgui.GTextInput,
        fgui.GGraph,
      ]
      let clsNames = [
        'GRoot',
        'GComponent',
        'GButton',
        'GImage',
        'GLabel',
        'GList',
        'GLoader',
        'GTextField',
        'GTextInput',
        'GGraph',
      ]

      for (let i = 0; i < clsList.length; i++) {
        let cls = clsList[i];
        if (node.constructor == cls) {
          return clsNames[i];
        }
      }
      return 'GObject';
    }

    function _ext_hide_graph() {
      if (window._ext_graph) {
        window._ext_graph.visible = false;
      }
    }

    window._ext_graph;
    function _ext_draw_graph(guid) {
      if (window._ext_NodeTable[guid] && window._ext_NodeTable[guid].parent) {
        let node = window._ext_NodeTable[guid];
        let x = node.x;
        let y = node.y;
        let v2 = node.parent.localToRoot(x, y);
        let rx = v2.x;
        let ry = v2.y;
        let w = node.width;
        let h = node.height;
        if (window._ext_graph == null) {
          window._ext_graph = new fgui.GGraph();
          window._ext_graph._name = '_ext_draw_graph'
          window._ext_graph.touchable = false;
        }
        window._ext_graph.visible = true;
        let graph = window._ext_graph;
        //graph.setPosition(rx, ry);
        graph.setSize(w, h);
        let color = new fgui.Color4();
        color.a = 0;
        graph.shape.drawRect(3, new fgui.Color4(0xFF0000), color);
        if (graph.parent) {
          graph.removeFromParent()
        }

        //适配xm4的合批, fgui.GRoot.inst.addChild(graph);渲染不出来
        if (fgui.GRoot.inst && 
          fgui.GRoot.inst._children &&
          fgui.GRoot.inst._children[0] &&
          fgui.GRoot.inst._children[0]._children &&
          fgui.GRoot.inst._children[0]._children[fgui.GRoot.inst._children[0]._children.length - 1] && 
          fgui.GRoot.inst._children[0]._children[fgui.GRoot.inst._children[0]._children.length - 1]._name.includes('layer_')
        ) {
          fgui.GRoot.inst._children[0]._children[fgui.GRoot.inst._children[0]._children.length - 1].addChild(graph);
          let v22 = graph.parent.rootToLocal(rx, ry);
          graph.setPosition(v22.x, v22.y);
          //console.log('_ext_draw_graph', graph, graph.parent._name, v22.x, v22.y);
        }
        else {
          //通用项目
          graph.setPosition(rx, ry);
          fgui.GRoot.inst.addChild(graph);
        }
     
      }
      
    }
    // setInterval(() => {
    //   loop();
    // }, 1000);

    _ext_loop();
  }
}
