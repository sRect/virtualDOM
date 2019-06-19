virtualDOM
---

### 第一步：用JS创建虚拟DOM
```javascript
class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

// 创建虚拟DOM
function createElement(type, props, children) {
  return new Element(type, props, children)
}

let vertualDom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, [
    createElement('input', { class: 'input', value: 'vertualDOM' }, [])
  ]),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c']),
]);

// 将虚拟DOM转为真实DOM
function render(eleObj) {
  let el = document.createElement(eleObj.type);

  for (let key in eleObj.props) {
    // 设置属性的方法
    setAttr(el, key, eleObj.props[key]);
  }

  eleObj.children.forEach(child => {
    // 判断child是否是一个元素
    child = (child instanceof Element) ? render(child) : document.createTextNode(child);
    el.appendChild(child);
  })
  return el;
}

function renderDOM(el, target) {
  target.appendChild(el);
}

// 将真实DOM插入到页面中
let el = render(vertualDom);
renderDOM(el, document.body);
```

### 第二步：比较两棵虚拟DOM树的差异(深度先序)
```javascript
// 定义差异类型
const ATTRS = 'ATTRS'; // 属性变化
const TEXT = 'TEXT'; // 文本变化
const REMOVE = 'REMOVE'; // 节点删除
const REPLACE = 'REPLACE'; // 节点覆盖

function diff(oldTree, newTree) {
  let patches = {};
  let index = 0;

  walk(oldTree, newTree, index, patches);
  return patches;
}

// 遍历树 找出差异 放入补丁包中
function walk(oldNode, newNode, index, patches) {
  let currentPatch = [];

  if(!newNode) { // 节点删除
    currentPatch.push({type: types.REMOVE, index});
  } else if (isString(oldNode) && isString(newNode)) { // 判断文本变化
    oldNode !== newNode ? currentPatch.push({
      type: types.TEXT,
      text: newNode
    }) : undefined;
  }else if(oldNode.type === newNode.type) {
    // 比较属性差异
    let attrs = diffAttr(oldNode.props, newNode.props);
    if(Object.keys(attrs).length) { // 判断是否为一个空对象
      currentPatch.push({type: types.ATTRS, attrs})
    }

    // 如果有子节点应该遍历子节点
    diffChildren(oldNode.children, newNode.children, patches);
  } else {
    // 节点被替换
    currentPatch.push({ type: REPLACE, index, newNode });
  }

  if (currentPatch.length) {
    // 将当前元素补丁放入到大补丁中
    patches[index] = currentPatch;
  }
} 
```

### 第三步：把patches应用到真正的DOM树上
```javascript
function patch(node, patches) {
  allPatches = patches;
  // 给元素打补丁
  // 此时的node是真实的DOM
  walk(node);
}

function walk(node) {
  let key = index++;
  let currentPatch = null;
  currentPatch = allPatches[key];
  let childNodes = node.childNodes;
  console.log(childNodes);
  [...childNodes].forEach(child => walk(child)); // 深度先序

  if (currentPatch && currentPatch.length) {
    doPatch(node, currentPatch); // 打补丁是后序的
  }  
}

// 进行打补丁
function doPatch(node, patches) {
  patches.forEach(patch => {
    switch(patch.type) {
      case types.ATTRS:
        for(let key in patch.attrs) {
          let value = patch.attrs[key];
          if(value) {
            setAttr(node, key, value);
          } else {
            node.removeAttribute(key);
          }
        }
        break;
      case types.TEXT:
        node.textContent = patch.text;
        break;
      case types.REPLACE:
        let newNode = (patch.newNode instanceof Element) ? render(patch.newNode) : document.createTextNode(patch.newNode);
        node.parentNode.replaceChild(newNode, node);
        break;
      case types.REMOVE:
        node.parentNode.removeChild(node);
        break;
      default:
        break;
    }
  })
}
```

