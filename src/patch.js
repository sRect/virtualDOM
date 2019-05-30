import * as types from './types.js';
import {
  Element,
  render,
  setAttr
} from "@/element";

let index = 0; // 全局index
let allPatches = null;

function patch(node, patches) {
  allPatches = patches;
  // 给元素打补丁
  // 此时的node是真实的DOM
  walk(node);
}

function walk(node) {
  let key = index++;
  let currentPatch = null;
  if (Object.prototype.hasOwnProperty.call(allPatches, key)) {
    currentPatch = allPatches[key];

    let childNodes = node.childNodes;
    [...childNodes].forEach(child => walk(child)); // 深度先序

    if (currentPatch && currentPatch.length) {
      doPatch(node, currentPatch); // 打补丁是后序的
    }
  };
  
}

function doPatch(node, patches) {
  console.log("=====")
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

export default patch;