'use strict';

const vueApp = require('..');
const assert = require('assert').strict;

assert.strictEqual(vueApp(), 'Hello from vueApp');
console.info("vueApp tests passed");
