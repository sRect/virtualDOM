import * as types from './types.js';

let num = 0;
function isString(node) {
  return Object.prototype.toString.call(node) === '[object String]';
}

function diff(oldTree, newTree) {
  let patches = {};
  let index = 0;

  walk(oldTree, newTree, index, patches);
  return patches;
}

// 比较属性差异
function diffAttr(oldAttrs, newAttrs) {
  let patch = {};

  for(let key in oldAttrs) {
    if(oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key]; // 有可能是undefined, 因为被删除了
    }
  }

  // 新增加的属性
  for(let key in newAttrs) {
    if(!Object.prototype.hasOwnProperty.call(oldAttrs, key)) {
      patch[key] = newAttrs[key];
    }
  }

  return patch;
}

// 比较子节点差异
function diffChildren(oldChild, newChild, patches) {
  // 比较旧节点的第一个子节点和新节点的第一个子节点
  if(oldChild && oldChild instanceof Array && oldChild.length) {
    oldChild.forEach((node, i) => {
      if (newChild) {
        // 这里的索引不应该是 index
        // 每次传递给 walk 时，index 是递增的，所有的人都基于同一个 index 来实现
        // 得用一个全局的变量num
        walk(node, newChild[i], ++num, patches);
      }
    })
  }

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

  // console.log(patches)
} 

export default diff;