vertualDOM
---

### createElement 创建虚拟DOM
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
```

### render 将虚拟DOM转为真实DOM
```javascript
// 将虚拟DOM转为真实DOM
// 设置属性
function setAttr(node, key, value) {
  switch (key) {
    case 'value':
      if (node.tagName.toLowerCase() === 'input' || node.tagName.toLowerCase() === 'textarea') {
        node.value = value;
      } else {
        node.setAttribute(key, value);
      }
      break;
    case 'style': // 设置行内样式
      node.style.cssText = value;
      break;
    default:
      node.setAttribute(key, value);
      break;
  }
}

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
```

### renderDOM 将DOM插入到页面中
```javascript
function renderDOM(el, target) {
  target.appendChild(el);
}

let el = render(vertualDom);

renderDOM(el, document.body);
```

