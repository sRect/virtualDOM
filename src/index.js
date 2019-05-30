import { createElement, render, renderDOM } from './element.js';
import diff from './diff';
import patch from '@/patch';

let vertualDom1 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, [
    createElement('input', { class: 'input', value: 'vertualDOM' }, [])
  ]),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c']),
]);

let vertualDom2 = createElement('ul', { class: 'wrap' }, [
  createElement('li', { class: 'item'}, [
    createElement('input', { class: 'input', value: 'vertualDOM'}, [])
  ]),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item'}, ['xxxx']),
]);

let el = render(vertualDom1);
let patches = diff(vertualDom1, vertualDom2);
console.log(patches)

renderDOM(el, document.body);
console.log(vertualDom1);
console.log(el);

setTimeout(() => {
  patch(el, patches);
}, 5000)