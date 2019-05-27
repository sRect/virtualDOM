import * as types from './types.js';

function diff(oldTree, newTree) {
  let patches = {};
  let index = 0;

  walk(oldTree, newTree, index, patches);
  return patches;
}

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

// 遍历树 找出差异 放入补丁包中
function walk(oldNode, newNode, index, patches) {
  let currentPatch = [];

  if(oldNode.type === newNode.type) {
    // 比较属性差异
    let attrs = diffAttr(oldNode.props, newNode.props);
    if(Object.keys(attrs).length) { // 判断是否为一个空对象
      currentPatch.push({type: types.ATTRS, attrs})
    }

    if (currentPatch.length) {
      // 将当前元素补丁放入到大补丁中
      patches[index] = currentPatch;
    }

    console.log(patches)
  }
} 

export default diff;