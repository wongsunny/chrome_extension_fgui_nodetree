let directoryElementMap = {}; //已经创建的目录元素
let directoryElementMap_lastFrame = {}; //上一帧数据

let directoryElementMap_three = {}; //已经创建的目录元素
let directoryElementMap_lastFrame_three = {}; //上一帧数据

let directoryContainer; //根目录容器
let directoryContainer_three; //根目录容器

let gridContainer; //网格容器
let gridContainer_three; //网格容器

let gridMsg; //网格容器日志
let gridMsg_three; //网格容器日志
let propetys = [
  'clsName', '_name', '_guid', 
  'x', 'y', 'height', 'width', 'rotation', 'scaleX', 'scaleY',
  'visible',
]; //显示的节点属性

let propetys_three = [
  'name', 'type', 'uuid', 'visible', 
  'position.x', 'position.y', 'position.z',
  'rotation.x', 'rotation.y', 'rotation.z',
  'scale.x', 'scale.y', 'scale.z',
]; //显示的节点属性


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
const propertyTips = {
  'name': '对象名称（Object3D.name）',
  'uuid': 'threejs 内部唯一标识',
  'type': '类名',

  'visible': '是否可见 / 是否参与渲染',

  'position.x': '局部坐标 X（右为正）',
  'position.y': '局部坐标 Y（上为正）',
  'position.z': '局部坐标 Z（前为正）',

  'rotation.x': '绕 X 轴旋转（角度）',
  'rotation.y': '绕 Y 轴旋转（角度）',
  'rotation.z': '绕 Z 轴旋转（角度）',

  'scale.x': 'X 轴缩放比例',
  'scale.y': 'Y 轴缩放比例',
  'scale.z': 'Z 轴缩放比例',
};

const propertyTips2D = {
  'clsName': '对象的类名（运行时类型）',
  '_name': '对象名称（用于调试与查找）',
  '_guid': '对象唯一标识（GUID）',

  'x': 'X 坐标（通常向右为正）',
  'y': 'Y 坐标（通常向下为正）',

  'width': '宽度',
  'height': '高度',

  'rotation': '旋转角度（角度制，顺时针为正）',

  'scaleX': 'X 轴缩放比例',
  'scaleY': 'Y 轴缩放比例',

  'visible': '是否可见 / 是否参与渲染',
};


let propety2type_three = {
  ['visible']: 'boolean',
  ['position.x']: 'number',
  ['position.y']: 'number',
  ['position.z']: 'number',
  ['rotation.x']: 'number',
  ['rotation.y']: 'number',
  ['rotation.z']: 'number',
  ['scale.x']: 'number',
  ['scale.y']: 'number',
  ['scale.z']: 'number',

}

// let threeObjectPropetyMap = {
//   ['Object3D']: [
//     'position.x', 'position.y', 'position.z',
//     'rotation.x', 'rotation.y', 'rotation.z',
//     'scale.x', 'scale.y', 'scale.z',
//   ],
// }

function rad2deg(r) {
  return r * 180 / Math.PI;
}
function deg2rad(d) {
  return d * Math.PI / 180;
}

let onlyReadPropetys = ['clsName', '_name', '_guid']; //仅可读的属性
let onlyReadPropetys_three = ['name', 'type', 'uuid',]; //仅可读的属性
let createPropetys = [];//已经被创建的key值
let createPropetys_three = [];//已经被创建的key值
let msgTxt; //调试信息显示元素
let loadBtn; //加载按钮
let pauseBtn; //暂停按钮
let refreshBtn; //刷新按钮
let selectedData; //选中数据
let selectedData_three;
let consoleBtn; //调试节点
let drawBtn; //标记节点
let isDraw = false;
let isDraw_three = false;


let session = 0;
function genSession() {
  return ++session;
}
let sessionCallbackMap = {};
let isPause = false;

directoryContainer = document.getElementById("directory");
msgTxt = document.getElementById('msgTxt');
loadBtn = document.getElementById('loadBtn');
refreshBtn = document.getElementById('refreshBtn');
pauseBtn = document.getElementById('pauseBtn');
gridMsg = document.getElementById('gridMsg');
consoleBtn = document.getElementById('consoleBtn');
drawBtn = document.getElementById('drawBtn');
gridMsg.style.display = 'none';

gridMsg_three = document.getElementById('gridMsg_three');

let msgTxt_three = document.getElementById('msgTxt_three');
let loadBtn_three = document.getElementById('loadBtn_three');
let refreshBtn_three = document.getElementById('refreshBtn_three');
let drawBtn_three = document.getElementById('drawBtn_three');
let consoleBtn_three = document.getElementById('consoleBtn_three');

directoryContainer_three = document.getElementById("directory_three");

createGridContailner();
createGridContailner_three();
isShowBtns(false);

// 单选按钮切换事件
const modeRadios = document.querySelectorAll('input[name="debugMode"]');
const fguiDiv = document.getElementById('fguiBtns');
const threeDiv = document.getElementById('threejsBtns');


const tooltip = document.getElementById('ext-tooltip');

function bindTooltip(el, text) {
  if (!text) return;

  el.addEventListener('mouseenter', (e) => {
    tooltip.innerText = text;
    tooltip.style.opacity = '1';
  });

  el.addEventListener('mousemove', (e) => {
    tooltip.style.left = e.clientX + 12 + 'px';
    tooltip.style.top = e.clientY + 12 + 'px';
  });

  el.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
  });
}

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'fgui') {
      fguiDiv.style.display = 'block';
      threeDiv.style.display = 'none';
      directoryContainer.style.display = 'block';
      directoryContainer_three.style.display = 'none';
      detailsPanel.style.display = 'block'
      detailsPanel_three.style.display = 'none'
    } else {
      fguiDiv.style.display = 'none';
      threeDiv.style.display = 'block';
      directoryContainer.style.display = 'none';
      directoryContainer_three.style.display = 'block';
      detailsPanel.style.display = 'none'
      detailsPanel_three.style.display = 'block'
    }
  });
});

//右侧属性网格元素
function createGridContailner() {
  gridContainer = document.createElement("div");
  gridContainer.classList.add("grid-container");
  detailsPanel.appendChild(gridContainer);
}

//右侧属性网格元素
function createGridContailner_three() {
  gridContainer_three = document.createElement("div");
  gridContainer_three.classList.add("grid-container");
  detailsPanel_three.appendChild(gridContainer_three);
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
  let label = gridItem.querySelector('p');

  bindTooltip(label, propertyTips2D[key]);
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
        break;
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
        break;
      default:
        break;
    }
    let session = genSession();
    checkNodeLive(session, selectid, (live) => {
      if (live) {
        let raw = `window._ext_NodeTable['${selectid}']&&(window._ext_NodeTable['${selectid}']['${key}']=${v})`;
        chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
          //console.log('节点赋值', raw, selectid, v, result, e);
          e || setMsg(`修改节点guid:\n${selectid}\m属性成功!`);
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

//右侧属性网格元素item
function createGridItem_three(key, value) {
  let gridItem = document.createElement("div");
  gridItem.id = `gridItem_${key}`;
  gridItem.classList.add("grid-item");

  if (onlyReadPropetys_three.indexOf(key) >= 0) {
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
  gridContainer_three.appendChild(gridItem);
  createPropetys_three.push(key);
  let input = gridItem.querySelector('input');
  let label = gridItem.querySelector('p');

  bindTooltip(label, propertyTips[key]);
  input.addEventListener("blur", function (event) {
    if (input.classList.contains('readonly')) return;
    let selectid = selectedData_three['uuid'];
    let value = event.target.value;
    //console.log(`选中的节点id: ${selectid} value:${value}`);

    //修改节点树数据
    let v;
    let t = propety2type_three[key];
    switch (t) {
      case "number":
        v = Number(value);
        if (key == 'rotation.x'
          || key == 'rotation.y'
          || key == 'rotation.z') {
          //角度转成弧度
          v = deg2rad(v)
          }
        break;
      case "string":
        v = String(value);
        break;
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
        break;
      default:
        break;
    }
    let session = genSession();
    checkNodeLive_three(session, selectid, (live) => {
      if (live) {
        let raw = `window._ext_sceneNodeMap['${selectid}']&&(window._ext_sceneNodeMap['${selectid}'].${key}=${v})`;
        chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
          //console.log('节点赋值', raw, selectid, v, result, e);
          e || setMsg(`修改节点uuid:\n${selectid}\n属性成功!`);
        })
      }
      else {
        gridContainer_three.style.display = 'none';
        gridMsg_three.style.display = 'block';
        gridMsg_three.textContent = `guid:${selectid}节点已经失效,可尝试刷新节点树`;
        selectedData_three = null;
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
      setMsg(`选中节点guid:\n${guid}`);
    }
    else {
      gridContainer.style.display = 'none';
      gridMsg.style.display = 'block';
      gridMsg.textContent = `guid:${guid}节点已经失效,可尝试刷新节点树`;
      selectedData = null;
    }
  })
}

//选中目录
function onSelectedItem_tree(ele) {
  let data = ele['_sourceData'];
  let session = genSession();
  let uuid = data.uuid;

  checkNodeLive_three(session, uuid, (live) => {
    if (live) {
      gridContainer_three.style.display = null;
      gridMsg_three.style.display = 'none';
      for (let i = 0; i < propetys_three.length; i++) {
        const key = propetys_three[i];
        let value = data[key];
        if (createPropetys_three.indexOf(key) >= 0) {
          updateGridItemValue(key, value)
        }
        else {
          createGridItem_three(key, value);
        }
      }
      selectedData_three = data;
      if (isDraw_three) {
        //绘制选中节点标记框
        let raw = `window._ext_draw_mesh_box&&window._ext_draw_mesh_box('${uuid}')`;
        chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
          //console.log('节点赋值', raw, selectid, v, result, e);
        })
      }
      setMsg(`选中节点uuid:\n${uuid}`);
    }
    else {
      gridContainer.style.display = 'none';
      gridMsg_three.style.display = 'block';
      gridMsg_three.textContent = `uuid:\n${uuid}\n节点已经失效,可尝试刷新节点树`;
      selectedData_three = null;
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

// 递归生成目录结构
function generateDirectory_three(parentElement, items) {
  if (parentElement['_added']) return;
  parentElement['_added'] = true;
  items.forEach(function (item) {
    let element;
    let id = item.uuid
    //console.log('递归生成目录结构', id, item);
    let name = `${item.name}-${item.type}`;
    let nestedContainer
    if (item.childs && item.childs.length) {
      //目录
      element = document.createElement("div");
      element.classList.add("folder");

      let parentOpen = false;
      if (directoryElementMap_lastFrame_three[id]) {
        parentOpen = directoryElementMap_lastFrame_three[id].open;
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
      directoryElementMap_three[id] = { element, open: parentOpen, selected: false };
      //console.log("创建目录:",id, element.textContent);
      parentOpen && generateDirectory_three(nestedContainer, item.childs);
    }
    else {
      //文件
      element = document.createElement("div");
      element.classList.add("file");
      element.innerHTML = `<span class="directoryName">${name}</span>`;

      element['_sourceData'] = item;
      directoryElementMap_three[id] = { element, open: false, selected: false };
      //console.log("创建文件:", id, element.textContent);
    }


    if (directoryElementMap_lastFrame_three[id]) {
      let selected = directoryElementMap_lastFrame_three[id].selected;
      if (selected) {
        onSelectedGridItem_three(element);
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
          directoryElementMap_three[id].open = true;
        } else {
          icon.classList.remove("icon-open");
          icon.classList.add("icon-closed");
          //关闭目录
          directoryElementMap_three[id].open = false;
        }

        if (item.childs && item.childs.length) {
          //console.log('点击创建子目录', element.textContent);
          generateDirectory_three(nestedContainer, item.childs);
        }
      }

      onSelectedGridItem_three(element);
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

function onSelectedGridItem_three(clickElement) {
  //点击目录元素
  for (const key in directoryElementMap_three) {
    const ele = directoryElementMap_three[key].element;
    let sp = ele.querySelector('span')
    if (ele == clickElement) {
      //console.log('点击目录元素', ele, clickElement);
      if (ele.classList.contains("selected") == false) {
        //点击的元素
        //console.log('点击目录元素', '点击的元素', ele);
        sp.classList.remove("directoryName");
        sp.classList.add("directoryName-selected");
        directoryElementMap_three[key].selected = true;
        onSelectedItem_tree(ele);
      }
    }
    else {
      //其他元素
      sp.classList.remove("directoryName-selected");
      sp.classList.add("directoryName");
      directoryElementMap_three[key].selected = false;
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
  let id = transmitData[0]._guid;
  let open = false;
  if (directoryElementMap_lastFrame[id]) {
    open = directoryElementMap_lastFrame[id].open;
  }
  directoryContainer['_added'] = null;
  generateDirectory(directoryContainer, transmitData, open);
}


//刷新节点树
function refreshNodeTree_three(transmitData) {
  //console.log('刷新节点树', transmitData);
  selectedData_three = null;
  directoryElementMap_lastFrame_three = {};
  for (const key in directoryElementMap_three) {
    const data = directoryElementMap_three[key];
    let { open, selected } = data;
    directoryElementMap_lastFrame_three[key] = { open, selected };
    //if (element) element.remove();
  }
  while (directoryContainer_three.firstChild) {
    directoryContainer_three.removeChild(directoryContainer_three.firstChild);
  }

  directoryElementMap_three = {};
  if (transmitData && transmitData.length) {
    let id = transmitData[0].uuid;
    let open = false;
    if (directoryElementMap_lastFrame_three[id]) {
      open = directoryElementMap_lastFrame_three[id].open;
    }
  }
  directoryContainer_three['_added'] = null;
  generateDirectory_three(directoryContainer_three, transmitData, open);
}

function setMsg(msg) {
  if (directoryContainer.style.display != 'none') {
    msgTxt.textContent = `${msg}`;
  }
  if (directoryContainer_three.style.display != 'none') { 
    msgTxt_three.textContent = `${msg}`
  }
}


//更新节点树数据
function updateNodeTree(transmitData) {
  //console.log('节点数据变化推送', transmitData)
  refreshNodeTree(transmitData);
}

//更新节点树数据
function updateNodeTree_three(transmitData) {
  //console.log('节点数据变化推送', transmitData)
  refreshNodeTree_three(transmitData);
}

// popup.js 或 content.js
// 在扩展的后台脚本中监听来自普通窗口的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //console.log('在扩展的后台脚本中监听来自普通窗口的消息', message);
  let { data, token } = message;

  switch (token) {
    case 'fgui-ext-get-user-data':
      updateNodeTree(data);
      break;
    case 'fgui-ext-check':
      {
        console.log('是否是fgui游戏', data);
        if (data.isFgui == false) {
          isShowBtns(false, '不是fgui!!');
          refreshNodeTree([]);
          gridMsg.textContent = '不是fgui!!';
          if (data.isThree == false) {
            document.getElementById('radio_three').style.display = 'none'
          }
        }
        else {
          isShowBtns(true);
          let str = `isFgui:${data.isFgui}\n isThreejs:${data.isThree}`
          setMsg(str);
        }
      }
      break;
    case 'fgui-ext-check-node':
    case 'three-ext-check-node':
      {
        let { session, live } = data;
        if (sessionCallbackMap[session]) {
          sessionCallbackMap[session](live);
          delete sessionCallbackMap[session];
        }
      }
      break;
    case 'three-ext-get-user-data':
      updateNodeTree_three(data)
      break;

    default:
      console.error('未定义的token', token)
      break;
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

//检查节点是否还是节点树
function checkNodeLive_three(session, uuid, callback) {
  sessionCallbackMap[session] = callback;
  let raw = `window._ext_checkThreeNode(${session},'${uuid}');`;
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
loadBtn.onclick = loadExt

//加载扩展程序
loadBtn_three.onclick = loadExt

function loadExt() {
  let raw = getInjectFunctionRaw(injectGameLoop);
  chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
    console.log("加载扩展程序", result, e);
  })
}

function onPasue() {
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

//暂停调用
pauseBtn.onclick = onPasue

//刷新节点树
refreshBtn.onclick = () => {
  checkInjectGame(() => {
    let raw = `window._ext_loop&&window._ext_loop();`;
    chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
      if (e == null) {
        setMsg('刷新fgui节点树成功!');
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

consoleBtn_three.onclick = () => {
  checkInjectGame(() => {
    if (selectedData_three) {
      let uuid = selectedData_three.uuid;

      const input = document.createElement('input');
      document.body.appendChild(input);
      input.setAttribute('value', `window._ext_sceneNodeMap['${uuid}']`);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
      }
      document.body.removeChild(input);
      let raw = `window.console.log('FairyguiNodeTree - uuid:${uuid}的节点成功,Ctrl+V控制台输出节点信息');`
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        e || setMsg(`uuid:${uuid}的节点成功,Ctrl+V控制台输出节点信息`)
      })
    } else {
      let raw = `window.console.log('FairyguiNodeTree - 请选中一个节点!');`
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        e || setMsg(`请选中一个节点!`)
      })
    }
  })
}

refreshBtn_three.onclick = () => {
  checkInjectGame(() => {
    let raw = `window._ext_refreshThreeNodeTree&&window._ext_refreshThreeNodeTree();`;
    chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
      if (e == null) {
        setMsg('刷新three节点树成功!');
      }
    })
  })
}

pauseBtn_three.onclick = onPasue



drawBtn_three.onclick = () => {
  checkInjectGame(() => {
    if (isDraw_three == false) {
      if (selectedData_three) {
        let uuid = selectedData_three.uuid;
        let raw = `window._ext_draw_mesh_box&&window._ext_draw_mesh_box('${uuid}')`;
        chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
          if (e == null) {
            setMsg('设置选中标记节点成功!');
            drawBtn_three.textContent = '取消标记选中节点'
            isDraw_three = true;
          }
        })
      }
      else {
        setMsg('设置选中标记节点成功!');
        isDraw_three = true;
        drawBtn_three.textContent = '取消标记选中节点'
      }
    }
    else {
      let raw = `window._ext_hide_mesh_box&&window._ext_hide_mesh_box();`;
      chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
        if (e == null) {
          setMsg('取消选中标记节点成功!');
          isDraw_three = false;
          drawBtn_three.textContent = '标记选中节点'
        }
      })
    }

  })
}

//检查是否已经注入脚本到游戏主循环
function checkInjectGame(callback) {
  let raw = `window._ext_test();`
  chrome.devtools.inspectedWindow.eval(raw, function (result, e) {
    //console.log('检查是否已经注入脚本到游戏主循环', result, e);
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

    refreshBtn_three,
    pauseBtn_three,
    drawBtn_three,
    consoleBtn_three,
  ];


  btns.forEach(btn => {
    btn.style.display = boo ? 'block' : 'none';
  })

  if (boo == false) {
    pauseBtn_three.textContent = pauseBtn.textContent = '暂停游戏';
    isPause = false;
    drawBtn_three.textContent =  drawBtn.textContent = '标记选中节点';
    isDraw_three = isDraw = false;
    if (msg) {
      setMsg(msg);
    }
    else {
      setMsg('请先加载扩展程序');
    }
  
  }
  else {
    if (selectedData == null) {
      drawBtn.textContent = '标记选中节点';
    }
    if (selectedData_three == null) {
      drawBtn_three.textContent = '标记选中节点';
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
  window.ext_isThree = true;
  try {
    var _fugi = fgui;
  } catch (e) {
    window.ext_isFgui = false;
  }

  try {
    var _three = THREE
  }
  catch (e) {
    window.ext_isThree = false;
  }
  console.log('FairyguiNodeTree - 是否是fgui游戏', window.ext_isFgui);
  console.log('FairyguiNodeTree - 是否是threejs游戏', window.ext_isThree); 
  window.postMessage({ token: 'fgui-ext-check', data: { isFgui: window.ext_isFgui, isThree: window.ext_isThree } });
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
        _ext_update_mesh_box()
        //console.log('requestAnimationFrame ... 正常状态', frames, frame);
      }
    };


    window._ext_NodeTable = {} //节点树列表
    window._ext_guid = 0;
    function _traversalTree(node) {
      if (node == null) return;
      if (node._name != '_ext_draw_graph') {
        let id = node['_guid'] || ++window._ext_guid;
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
        let w = node.width;
        let h = node.height;

        let rect = node.parent.localToGlobalRect(x, y, w, h);
        //console.log('rect', rect);
 
        if (window._ext_graph == null) {
          window._ext_graph = new fgui.GGraph();
          window._ext_graph._name = '_ext_draw_graph'
          window._ext_graph.touchable = false;
        }
        window._ext_graph.visible = true;
        let graph = window._ext_graph;
        //graph.setPosition(rx, ry);
        graph.setSize(rect.width, rect.height);
        let color = new fgui.Color4();
        color.a = 0;
        graph.shape.drawRect(3, new fgui.Color4(0xFF0000), color);
        if (graph.parent) {
          graph.removeFromParent()
        }

        //适配xm4的合批, fgui.GRoot.inst.addChild(graph);渲染不出来
        if ((fgui.GRoot.inst &&
          fgui.GRoot.inst._children &&
          fgui.GRoot.inst._children[1] &&
          fgui.GRoot.inst._children[1]._children &&
          fgui.GRoot.inst._children[1]._children[fgui.GRoot.inst._children[1]._children.length - 1] &&
          fgui.GRoot.inst._children[1]._children[fgui.GRoot.inst._children[1]._children.length - 1]._name.includes('layer_'))
          || (fgui.GRoot.inst &&
            fgui.GRoot.inst._children &&
            fgui.GRoot.inst._children[0] &&
            fgui.GRoot.inst._children[0]._children &&
            fgui.GRoot.inst._children[0]._children[fgui.GRoot.inst._children[0]._children.length - 1] &&
            fgui.GRoot.inst._children[0]._children[fgui.GRoot.inst._children[0]._children.length - 1]._name.includes('layer_'))
        ) {
          fgui.GRoot.inst._children[0]._children[fgui.GRoot.inst._children[0]._children.length - 1].addChild(graph);

        }
        else {
          //通用项目
          fgui.GRoot.inst.addChild(graph);
        }
     

        let rect2 = graph.parent.globalToLocalRect(rect.x, rect.y, rect.width, rect.height);
        graph.setPosition(rect2.x, rect2.y);
        graph.setSize(rect2.width, rect2.height);
      }
      
    }
    // setInterval(() => {
    //   loop();
    // }, 1000);

    /**
     * 检查threejs环境
     */
    function _ext_isThree() {
      if (window._ext_is_three === undefined) {
        window._ext_is_three = true
        try {
          var _three = THREE
        }
        catch (e) {
          window._ext_is_three = false
        }
      }
      window.postMessage({ token: 'three-ext-check', data: window._ext_is_three });
    }

    function _ext_walkSceneNode() {
      window._ext_sceneNodeMap = {}

      let walk = (node) => {
        if (node.name == '_ext_draw_cube') return;
        let uuid = node.uuid
        window._ext_sceneNodeMap[uuid] = node
        let children = node.children
        if (children) {
          for (const c of children) {
            walk(c)
          }
        }
      }
      let scenes = window.__THREE_SCENCE__ || []
      for (const scene of scenes) {
        walk(scene)
      }
    }

    function _ext_checkThreeNode(session, uuid) {
     
      let live = false
      let checkFunc = (node) => {
        if (node == null) {
          live = false;
          return;
        }
        if (node.type == 'Scene') { //场景节点
          live = true;
          return;
        }
        if (node.parent == null) {
          live = false;
          return;
        }
        checkFunc(node.parent); //递归查找父节点是否还在节点树
      }

      let node = window._ext_sceneNodeMap[uuid];
      checkFunc(node);
      
      let data = {
        session,
        live,
      }
      //console.log('检查节点是否还在节点树', guid, data);
      window.postMessage({ token: 'three-ext-check-node', data: data });
    }


    function _extMeshKind(mesh) {
      if (mesh.isSkinnedMesh === true) return 'SkinnedMesh';
      if (mesh.isInstancedMesh === true) return 'InstancedMesh';
      if (mesh.isMesh === true) return 'Mesh';

      return 'Mesh'
    }


    function _ext_walkSceneNodePropety() {

      window._ext_sceneNodePropety = []
      let propetys = [
        'name', 'uuid', 'type', 'visible'
      ];
      let propetys_three_v3 = [
        'position', 'rotation', 'scale'
      ]
      let v3 = ['x', 'y', 'z'];

      propetys = propetys.concat(propetys_three_v3)

      let walk = (node, parent) => {
        if (node == null) return;

        let propety = {};
        for (const p of propetys) {
          if (p == 'type' && node[p] == 'Mesh') {
             let t = _extMeshKind(node)
            propety[p] = t;
          }
          else {
            if (propetys_three_v3.indexOf(p) != -1) {
              for (const v of v3) {
                propety[`${p}.${v}`] = node[p][v];
               }
            }
            else {
              propety[p] = node[p];
            }
          }
        }

        propety['childs'] = [];

        if (parent) {
          if (node._name != '_ext_draw_cube') {
            parent['childs'].push(propety);
          }
        }
        else {
          
          window._ext_sceneNodePropety.push(propety)
        }
        if (node.children && node.children.length) {
          for (let i = 0; i < node.children.length; i++) {
            const c = node.children[i];
            walk(c, propety)
          }
        }
      }
      let scenes = window.__THREE_SCENCE__ || []
      for (const scene of scenes) {
        walk(scene)
      }
    }


    /**
     * 绘制 Mesh 包围盒
     */
    function _ext_draw_mesh_box(uuid) {
      const mesh = window._ext_sceneNodeMap[uuid];
      if (!mesh) return;

      // 只处理 Mesh
      if (!mesh.isMesh) {
        _ext_hide_mesh_box();
        return;
      }

      // 清理旧的
      _ext_hide_mesh_box();
      // 计算 world space AABB
      let box 

      let type = _extMeshKind(mesh)
      if (type == 'Mesh') {
        box = new THREE.Box3();
        box.setFromObject(mesh);
      }
      else if (type == 'InstancedMesh') {
        box = _ext_box_from_instancedMesh(mesh);
      }
      else if (type == 'SkinnedMesh') {
        box = mesh.computeBoundingBox
            ? _ext_box_from_skinnedMesh(mesh)
            : _ext_box_from_skinnedMesh_manual(mesh);
      }

    
     

      // 生成 helper（线框 cube）
      const helper = new THREE.Box3Helper(
        box,
        0xff0fff 
      );

      helper.name = '_ext_draw_cube';
      helper.renderOrder = 9999;     // 确保在最上层
      helper.depthTest = false;      // 不被遮挡（关键）
      helper.material.depthTest = false;

      // 添加到 scene（而不是 node）
      let scene = mesh.parent;
      while (scene && !scene.isScene) {
        scene = scene.parent;
      }
      scene && scene.add(helper);

      window._ext_meshBoxHelper = {
        helper,
        target: mesh,
        type
      }
    }

    /**
     * 隐藏包围盒
     */
    function _ext_hide_mesh_box() {
      if (window._ext_meshBoxHelper) {
        let { helper, target, type } = window._ext_meshBoxHelper;
        helper.parent?.remove(helper);
        helper.geometry.dispose();
        helper.material.dispose();
        helper = null;
        window._ext_meshBoxHelper = null
      }
    }

    function _ext_box_from_skinnedMesh(mesh) {
      if (!mesh.boundingBox) {
        mesh.computeBoundingBox();
      }
      return mesh.boundingBox.clone();
    }


    function _ext_box_from_skinnedMesh_manual(skinnedMesh) {
      const geometry = skinnedMesh.geometry;
      const posAttr = geometry.attributes.position;
      const skinIndex = geometry.attributes.skinIndex;
      const skinWeight = geometry.attributes.skinWeight;

      const skeleton = skinnedMesh.skeleton;
      const bindMatrix = skinnedMesh.bindMatrix;
      const bindMatrixInverse = skinnedMesh.bindMatrixInverse;

      const vertex = new THREE.Vector3();
      const skinned = new THREE.Vector3();
      const temp = new THREE.Vector3();
      const boneMatrix = new THREE.Matrix4();

      let box = new THREE.Box3()
      //box.makeEmpty();

      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        skinned.set(0, 0, 0);

        const i0 = skinIndex.getX(i);
        const i1 = skinIndex.getY(i);
        const i2 = skinIndex.getZ(i);
        const i3 = skinIndex.getW(i);

        const w0 = skinWeight.getX(i);
        const w1 = skinWeight.getY(i);
        const w2 = skinWeight.getZ(i);
        const w3 = skinWeight.getW(i);

        // bone 0
        if (w0 > 0) {
          boneMatrix.multiplyMatrices(
            skeleton.bones[i0].matrixWorld,
            skeleton.boneInverses[i0]
          );
          temp.copy(vertex)
            .applyMatrix4(bindMatrix)
            .applyMatrix4(boneMatrix)
            .applyMatrix4(bindMatrixInverse)
            .multiplyScalar(w0);
          skinned.add(temp);
        }

        // bone 1
        if (w1 > 0) {
          boneMatrix.multiplyMatrices(
            skeleton.bones[i1].matrixWorld,
            skeleton.boneInverses[i1]
          );
          temp.copy(vertex)
            .applyMatrix4(bindMatrix)
            .applyMatrix4(boneMatrix)
            .applyMatrix4(bindMatrixInverse)
            .multiplyScalar(w1);
          skinned.add(temp);
        }

        // bone 2
        if (w2 > 0) {
          boneMatrix.multiplyMatrices(
            skeleton.bones[i2].matrixWorld,
            skeleton.boneInverses[i2]
          );
          temp.copy(vertex)
            .applyMatrix4(bindMatrix)
            .applyMatrix4(boneMatrix)
            .applyMatrix4(bindMatrixInverse)
            .multiplyScalar(w2);
          skinned.add(temp);
        }

        // bone 3
        if (w3 > 0) {
          boneMatrix.multiplyMatrices(
            skeleton.bones[i3].matrixWorld,
            skeleton.boneInverses[i3]
          );
          temp.copy(vertex)
            .applyMatrix4(bindMatrix)
            .applyMatrix4(boneMatrix)
            .applyMatrix4(bindMatrixInverse)
            .multiplyScalar(w3);
          skinned.add(temp);
        }

        skinned.applyMatrix4(skinnedMesh.matrixWorld);
        box.expandByPoint(skinned);
      }

      return box;
    }


    function _ext_box_from_instancedMesh(mesh) {
      const geom = mesh.geometry;
      if (!geom.boundingBox) {
        geom.computeBoundingBox();
      }

      const localBox = geom.boundingBox;
      const box = new THREE.Box3();

      const mat = new THREE.Matrix4();
      const tempBox = new THREE.Box3();

      for (let i = 0; i < mesh.count; i++) {
        mesh.getMatrixAt(i, mat);

        // instance local -> world
        mat.multiply(mesh.matrixWorld);

        tempBox.copy(localBox).applyMatrix4(mat);
        box.union(tempBox);
      }

      return box;
    }

    function _ext_update_mesh_box() {
      const state = window._ext_meshBoxHelper;
      if (!state) return;
      let { helper, target, type } = state;
      let box 
      if (type == 'Mesh') {
        // 普通 Mesh
        box = new THREE.Box3().setFromObject(target);

      }
      else if (type == 'InstancedMesh') {
        box = _ext_box_from_instancedMesh(target)
      }
      else if (type == 'SkinnedMesh') {
        box = target.computeBoundingBox
          ? _ext_box_from_skinnedMesh(target)
          : _ext_box_from_skinnedMesh_manual(target);
      }
      if (box) {
        helper.box.copy(box)
        helper.updateMatrixWorld(true);
      }
    }



    function _ext_refreshThreeNodeTree() {
      //console.log('刷新three scene tree')
      _ext_walkSceneNode();
      _ext_walkSceneNodePropety();

      let data = JSON.parse(JSON.stringify(window._ext_sceneNodePropety))
      window.postMessage({ token: 'three-ext-get-user-data', data: data });
    }

    if (window._ext_meshBoxHelper !== undefined) {
      _ext_hide_mesh_box()
    }
    else {
      // 当前高亮包围盒（全局唯一）
      window._ext_meshBoxHelper = null;
    }


    _ext_loop();
    _ext_refreshThreeNodeTree();
    
  }
}
