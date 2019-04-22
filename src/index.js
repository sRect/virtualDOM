import { createElement, render, renderDOM } from './element.js';

let vertualDom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, [
    createElement('input', { class: 'input', value: 'vertualDOM' }, [])
  ]),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c']),
]);

let el = render(vertualDom);

renderDOM(el, document.body);
console.log(vertualDom);
console.log(el);