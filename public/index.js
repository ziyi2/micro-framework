// index.js

// 自定义模块 - add 函数
import { add } from 'custom_modules/add.js';
// 自定义模块 - 防冲撞测试
import 'custom_modules/conflict.js';
// 三方模块 - 按需引入
import isNull from 'lodash/isNull.js';

console.log(isNull);
console.log(add(1,2));

// 在 confilict.js 中声明的 const _ = 111; 不会作用在 index.js 中
// Uncaught ReferenceError: _ is not defined
console.log(_);