let root;
root = document.createElement("h1");
root.textContent = "微应用1";
document.body.appendChild(root);


// 打开以下注释测试隔离
// this.a = 'a';
// console.log('微应用1 a: ', a);

// var b = 'b';
// console.log('微应用1 b: ', window.b);

// window.c = 'c';
// console.log('微应用1 c: ', window.c);

// let root = document.createElement("button");
// root.textContent = "微应用 1 更改 history 为 micro1";
// document.body.appendChild(root);

// root.onclick = () => {
//   history.pushState({}, '', '/micro1');
// }



// 打开以下注释，执行 Vue 应用
// (function webpackUniversalModuleDefinition(root, factory) {
// 	if(typeof exports === 'object' && typeof module === 'object')
// 		module.exports = factory();
// 	else if(typeof define === 'function' && define.amd)
// 		define([], factory);
// 	else if(typeof exports === 'object')
// 		exports["vue-app"] = factory();
// 	else
// 		root["vue-app"] = factory();
// })((typeof self !== 'undefined' ? self : this), function() {
// return /******/ (function() { // webpackBootstrap
// /******/ 	var __webpack_modules__ = ({

// /***/ 7111:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var isCallable = __webpack_require__(6733);
// var tryToString = __webpack_require__(9821);

// var $TypeError = TypeError;

// // `Assert: IsCallable(argument) is true`
// module.exports = function (argument) {
//   if (isCallable(argument)) return argument;
//   throw $TypeError(tryToString(argument) + ' is not a function');
// };


// /***/ }),

// /***/ 1176:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var isObject = __webpack_require__(5052);

// var $String = String;
// var $TypeError = TypeError;

// // `Assert: Type(argument) is Object`
// module.exports = function (argument) {
//   if (isObject(argument)) return argument;
//   throw $TypeError($String(argument) + ' is not an object');
// };


// /***/ }),

// /***/ 9540:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var toIndexedObject = __webpack_require__(905);
// var toAbsoluteIndex = __webpack_require__(3231);
// var lengthOfArrayLike = __webpack_require__(9646);

// // `Array.prototype.{ indexOf, includes }` methods implementation
// var createMethod = function (IS_INCLUDES) {
//   return function ($this, el, fromIndex) {
//     var O = toIndexedObject($this);
//     var length = lengthOfArrayLike(O);
//     var index = toAbsoluteIndex(fromIndex, length);
//     var value;
//     // Array#includes uses SameValueZero equality algorithm
//     // eslint-disable-next-line no-self-compare -- NaN check
//     if (IS_INCLUDES && el != el) while (length > index) {
//       value = O[index++];
//       // eslint-disable-next-line no-self-compare -- NaN check
//       if (value != value) return true;
//     // Array#indexOf ignores holes, Array#includes - not
//     } else for (;length > index; index++) {
//       if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
//     } return !IS_INCLUDES && -1;
//   };
// };

// module.exports = {
//   // `Array.prototype.includes` method
//   // https://tc39.es/ecma262/#sec-array.prototype.includes
//   includes: createMethod(true),
//   // `Array.prototype.indexOf` method
//   // https://tc39.es/ecma262/#sec-array.prototype.indexof
//   indexOf: createMethod(false)
// };


// /***/ }),

// /***/ 6554:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// "use strict";

// var DESCRIPTORS = __webpack_require__(7400);
// var isArray = __webpack_require__(3718);

// var $TypeError = TypeError;
// // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
// var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// // Safari < 13 does not throw an error in this case
// var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
//   // makes no sense without proper strict mode support
//   if (this !== undefined) return true;
//   try {
//     // eslint-disable-next-line es/no-object-defineproperty -- safe
//     Object.defineProperty([], 'length', { writable: false }).length = 1;
//   } catch (error) {
//     return error instanceof TypeError;
//   }
// }();

// module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
//   if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
//     throw $TypeError('Cannot set read only .length');
//   } return O.length = length;
// } : function (O, length) {
//   return O.length = length;
// };


// /***/ }),

// /***/ 7079:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var uncurryThis = __webpack_require__(5968);

// var toString = uncurryThis({}.toString);
// var stringSlice = uncurryThis(''.slice);

// module.exports = function (it) {
//   return stringSlice(toString(it), 8, -1);
// };


// /***/ }),

// /***/ 7081:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var hasOwn = __webpack_require__(8270);
// var ownKeys = __webpack_require__(4826);
// var getOwnPropertyDescriptorModule = __webpack_require__(7933);
// var definePropertyModule = __webpack_require__(1787);

// module.exports = function (target, source, exceptions) {
//   var keys = ownKeys(source);
//   var defineProperty = definePropertyModule.f;
//   var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
//   for (var i = 0; i < keys.length; i++) {
//     var key = keys[i];
//     if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
//       defineProperty(target, key, getOwnPropertyDescriptor(source, key));
//     }
//   }
// };


// /***/ }),

// /***/ 5762:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var DESCRIPTORS = __webpack_require__(7400);
// var definePropertyModule = __webpack_require__(1787);
// var createPropertyDescriptor = __webpack_require__(5358);

// module.exports = DESCRIPTORS ? function (object, key, value) {
//   return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
// } : function (object, key, value) {
//   object[key] = value;
//   return object;
// };


// /***/ }),

// /***/ 5358:
// /***/ (function(module) {

// module.exports = function (bitmap, value) {
//   return {
//     enumerable: !(bitmap & 1),
//     configurable: !(bitmap & 2),
//     writable: !(bitmap & 4),
//     value: value
//   };
// };


// /***/ }),

// /***/ 4768:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var isCallable = __webpack_require__(6733);
// var definePropertyModule = __webpack_require__(1787);
// var makeBuiltIn = __webpack_require__(6039);
// var defineGlobalProperty = __webpack_require__(8400);

// module.exports = function (O, key, value, options) {
//   if (!options) options = {};
//   var simple = options.enumerable;
//   var name = options.name !== undefined ? options.name : key;
//   if (isCallable(value)) makeBuiltIn(value, name, options);
//   if (options.global) {
//     if (simple) O[key] = value;
//     else defineGlobalProperty(key, value);
//   } else {
//     try {
//       if (!options.unsafe) delete O[key];
//       else if (O[key]) simple = true;
//     } catch (error) { /* empty */ }
//     if (simple) O[key] = value;
//     else definePropertyModule.f(O, key, {
//       value: value,
//       enumerable: false,
//       configurable: !options.nonConfigurable,
//       writable: !options.nonWritable
//     });
//   } return O;
// };


// /***/ }),

// /***/ 8400:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);

// // eslint-disable-next-line es/no-object-defineproperty -- safe
// var defineProperty = Object.defineProperty;

// module.exports = function (key, value) {
//   try {
//     defineProperty(global, key, { value: value, configurable: true, writable: true });
//   } catch (error) {
//     global[key] = value;
//   } return value;
// };


// /***/ }),

// /***/ 9563:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// "use strict";

// var tryToString = __webpack_require__(9821);

// var $TypeError = TypeError;

// module.exports = function (O, P) {
//   if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
// };


// /***/ }),

// /***/ 7400:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var fails = __webpack_require__(4229);

// // Detect IE8's incomplete defineProperty implementation
// module.exports = !fails(function () {
//   // eslint-disable-next-line es/no-object-defineproperty -- required for testing
//   return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
// });


// /***/ }),

// /***/ 3777:
// /***/ (function(module) {

// var documentAll = typeof document == 'object' && document.all;

// // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// // eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
// var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

// module.exports = {
//   all: documentAll,
//   IS_HTMLDDA: IS_HTMLDDA
// };


// /***/ }),

// /***/ 2635:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);
// var isObject = __webpack_require__(5052);

// var document = global.document;
// // typeof document.createElement is 'object' in old IE
// var EXISTS = isObject(document) && isObject(document.createElement);

// module.exports = function (it) {
//   return EXISTS ? document.createElement(it) : {};
// };


// /***/ }),

// /***/ 3064:
// /***/ (function(module) {

// var $TypeError = TypeError;
// var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

// module.exports = function (it) {
//   if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
//   return it;
// };


// /***/ }),

// /***/ 598:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var getBuiltIn = __webpack_require__(1333);

// module.exports = getBuiltIn('navigator', 'userAgent') || '';


// /***/ }),

// /***/ 6358:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);
// var userAgent = __webpack_require__(598);

// var process = global.process;
// var Deno = global.Deno;
// var versions = process && process.versions || Deno && Deno.version;
// var v8 = versions && versions.v8;
// var match, version;

// if (v8) {
//   match = v8.split('.');
//   // in old Chrome, versions of V8 isn't V8 = Chrome / 10
//   // but their correct versions are not interesting for us
//   version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
// }

// // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// // so check `userAgent` even if `.v8` exists, but 0
// if (!version && userAgent) {
//   match = userAgent.match(/Edge\/(\d+)/);
//   if (!match || match[1] >= 74) {
//     match = userAgent.match(/Chrome\/(\d+)/);
//     if (match) version = +match[1];
//   }
// }

// module.exports = version;


// /***/ }),

// /***/ 3837:
// /***/ (function(module) {

// // IE8- don't enum bug keys
// module.exports = [
//   'constructor',
//   'hasOwnProperty',
//   'isPrototypeOf',
//   'propertyIsEnumerable',
//   'toLocaleString',
//   'toString',
//   'valueOf'
// ];


// /***/ }),

// /***/ 3103:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);
// var getOwnPropertyDescriptor = (__webpack_require__(7933).f);
// var createNonEnumerableProperty = __webpack_require__(5762);
// var defineBuiltIn = __webpack_require__(4768);
// var defineGlobalProperty = __webpack_require__(8400);
// var copyConstructorProperties = __webpack_require__(7081);
// var isForced = __webpack_require__(6541);

// /*
//   options.target         - name of the target object
//   options.global         - target is the global object
//   options.stat           - export as static methods of target
//   options.proto          - export as prototype methods of target
//   options.real           - real prototype method for the `pure` version
//   options.forced         - export even if the native feature is available
//   options.bind           - bind methods to the target, required for the `pure` version
//   options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
//   options.unsafe         - use the simple assignment of property instead of delete + defineProperty
//   options.sham           - add a flag to not completely full polyfills
//   options.enumerable     - export as enumerable property
//   options.dontCallGetSet - prevent calling a getter on target
//   options.name           - the .name of the function if it does not match the key
// */
// module.exports = function (options, source) {
//   var TARGET = options.target;
//   var GLOBAL = options.global;
//   var STATIC = options.stat;
//   var FORCED, target, key, targetProperty, sourceProperty, descriptor;
//   if (GLOBAL) {
//     target = global;
//   } else if (STATIC) {
//     target = global[TARGET] || defineGlobalProperty(TARGET, {});
//   } else {
//     target = (global[TARGET] || {}).prototype;
//   }
//   if (target) for (key in source) {
//     sourceProperty = source[key];
//     if (options.dontCallGetSet) {
//       descriptor = getOwnPropertyDescriptor(target, key);
//       targetProperty = descriptor && descriptor.value;
//     } else targetProperty = target[key];
//     FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
//     // contained in target
//     if (!FORCED && targetProperty !== undefined) {
//       if (typeof sourceProperty == typeof targetProperty) continue;
//       copyConstructorProperties(sourceProperty, targetProperty);
//     }
//     // add a flag to not completely full polyfills
//     if (options.sham || (targetProperty && targetProperty.sham)) {
//       createNonEnumerableProperty(sourceProperty, 'sham', true);
//     }
//     defineBuiltIn(target, key, sourceProperty, options);
//   }
// };


// /***/ }),

// /***/ 4229:
// /***/ (function(module) {

// module.exports = function (exec) {
//   try {
//     return !!exec();
//   } catch (error) {
//     return true;
//   }
// };


// /***/ }),

// /***/ 7188:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var fails = __webpack_require__(4229);

// module.exports = !fails(function () {
//   // eslint-disable-next-line es/no-function-prototype-bind -- safe
//   var test = (function () { /* empty */ }).bind();
//   // eslint-disable-next-line no-prototype-builtins -- safe
//   return typeof test != 'function' || test.hasOwnProperty('prototype');
// });


// /***/ }),

// /***/ 266:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var NATIVE_BIND = __webpack_require__(7188);

// var call = Function.prototype.call;

// module.exports = NATIVE_BIND ? call.bind(call) : function () {
//   return call.apply(call, arguments);
// };


// /***/ }),

// /***/ 1805:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var DESCRIPTORS = __webpack_require__(7400);
// var hasOwn = __webpack_require__(8270);

// var FunctionPrototype = Function.prototype;
// // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
// var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

// var EXISTS = hasOwn(FunctionPrototype, 'name');
// // additional protection from minified / mangled / dropped function names
// var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
// var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

// module.exports = {
//   EXISTS: EXISTS,
//   PROPER: PROPER,
//   CONFIGURABLE: CONFIGURABLE
// };


// /***/ }),

// /***/ 5968:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var NATIVE_BIND = __webpack_require__(7188);

// var FunctionPrototype = Function.prototype;
// var call = FunctionPrototype.call;
// var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

// module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
//   return function () {
//     return call.apply(fn, arguments);
//   };
// };


// /***/ }),

// /***/ 1333:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);
// var isCallable = __webpack_require__(6733);

// var aFunction = function (argument) {
//   return isCallable(argument) ? argument : undefined;
// };

// module.exports = function (namespace, method) {
//   return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
// };


// /***/ }),

// /***/ 5300:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var aCallable = __webpack_require__(7111);
// var isNullOrUndefined = __webpack_require__(9650);

// // `GetMethod` abstract operation
// // https://tc39.es/ecma262/#sec-getmethod
// module.exports = function (V, P) {
//   var func = V[P];
//   return isNullOrUndefined(func) ? undefined : aCallable(func);
// };


// /***/ }),

// /***/ 9859:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var check = function (it) {
//   return it && it.Math == Math && it;
// };

// // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
// module.exports =
//   // eslint-disable-next-line es/no-global-this -- safe
//   check(typeof globalThis == 'object' && globalThis) ||
//   check(typeof window == 'object' && window) ||
//   // eslint-disable-next-line no-restricted-globals -- safe
//   check(typeof self == 'object' && self) ||
//   check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
//   // eslint-disable-next-line no-new-func -- fallback
//   (function () { return this; })() || Function('return this')();


// /***/ }),

// /***/ 8270:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var uncurryThis = __webpack_require__(5968);
// var toObject = __webpack_require__(2991);

// var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// // `HasOwnProperty` abstract operation
// // https://tc39.es/ecma262/#sec-hasownproperty
// // eslint-disable-next-line es/no-object-hasown -- safe
// module.exports = Object.hasOwn || function hasOwn(it, key) {
//   return hasOwnProperty(toObject(it), key);
// };


// /***/ }),

// /***/ 5977:
// /***/ (function(module) {

// module.exports = {};


// /***/ }),

// /***/ 4394:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var DESCRIPTORS = __webpack_require__(7400);
// var fails = __webpack_require__(4229);
// var createElement = __webpack_require__(2635);

// // Thanks to IE8 for its funny defineProperty
// module.exports = !DESCRIPTORS && !fails(function () {
//   // eslint-disable-next-line es/no-object-defineproperty -- required for testing
//   return Object.defineProperty(createElement('div'), 'a', {
//     get: function () { return 7; }
//   }).a != 7;
// });


// /***/ }),

// /***/ 9337:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var uncurryThis = __webpack_require__(5968);
// var fails = __webpack_require__(4229);
// var classof = __webpack_require__(7079);

// var $Object = Object;
// var split = uncurryThis(''.split);

// // fallback for non-array-like ES3 and non-enumerable old V8 strings
// module.exports = fails(function () {
//   // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
//   // eslint-disable-next-line no-prototype-builtins -- safe
//   return !$Object('z').propertyIsEnumerable(0);
// }) ? function (it) {
//   return classof(it) == 'String' ? split(it, '') : $Object(it);
// } : $Object;


// /***/ }),

// /***/ 8511:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var uncurryThis = __webpack_require__(5968);
// var isCallable = __webpack_require__(6733);
// var store = __webpack_require__(5353);

// var functionToString = uncurryThis(Function.toString);

// // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
// if (!isCallable(store.inspectSource)) {
//   store.inspectSource = function (it) {
//     return functionToString(it);
//   };
// }

// module.exports = store.inspectSource;


// /***/ }),

// /***/ 6407:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var NATIVE_WEAK_MAP = __webpack_require__(1180);
// var global = __webpack_require__(9859);
// var isObject = __webpack_require__(5052);
// var createNonEnumerableProperty = __webpack_require__(5762);
// var hasOwn = __webpack_require__(8270);
// var shared = __webpack_require__(5353);
// var sharedKey = __webpack_require__(4399);
// var hiddenKeys = __webpack_require__(5977);

// var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
// var TypeError = global.TypeError;
// var WeakMap = global.WeakMap;
// var set, get, has;

// var enforce = function (it) {
//   return has(it) ? get(it) : set(it, {});
// };

// var getterFor = function (TYPE) {
//   return function (it) {
//     var state;
//     if (!isObject(it) || (state = get(it)).type !== TYPE) {
//       throw TypeError('Incompatible receiver, ' + TYPE + ' required');
//     } return state;
//   };
// };

// if (NATIVE_WEAK_MAP || shared.state) {
//   var store = shared.state || (shared.state = new WeakMap());
//   /* eslint-disable no-self-assign -- prototype methods protection */
//   store.get = store.get;
//   store.has = store.has;
//   store.set = store.set;
//   /* eslint-enable no-self-assign -- prototype methods protection */
//   set = function (it, metadata) {
//     if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
//     metadata.facade = it;
//     store.set(it, metadata);
//     return metadata;
//   };
//   get = function (it) {
//     return store.get(it) || {};
//   };
//   has = function (it) {
//     return store.has(it);
//   };
// } else {
//   var STATE = sharedKey('state');
//   hiddenKeys[STATE] = true;
//   set = function (it, metadata) {
//     if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
//     metadata.facade = it;
//     createNonEnumerableProperty(it, STATE, metadata);
//     return metadata;
//   };
//   get = function (it) {
//     return hasOwn(it, STATE) ? it[STATE] : {};
//   };
//   has = function (it) {
//     return hasOwn(it, STATE);
//   };
// }

// module.exports = {
//   set: set,
//   get: get,
//   has: has,
//   enforce: enforce,
//   getterFor: getterFor
// };


// /***/ }),

// /***/ 3718:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var classof = __webpack_require__(7079);

// // `IsArray` abstract operation
// // https://tc39.es/ecma262/#sec-isarray
// // eslint-disable-next-line es/no-array-isarray -- safe
// module.exports = Array.isArray || function isArray(argument) {
//   return classof(argument) == 'Array';
// };


// /***/ }),

// /***/ 6733:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var $documentAll = __webpack_require__(3777);

// var documentAll = $documentAll.all;

// // `IsCallable` abstract operation
// // https://tc39.es/ecma262/#sec-iscallable
// module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
//   return typeof argument == 'function' || argument === documentAll;
// } : function (argument) {
//   return typeof argument == 'function';
// };


// /***/ }),

// /***/ 6541:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var fails = __webpack_require__(4229);
// var isCallable = __webpack_require__(6733);

// var replacement = /#|\.prototype\./;

// var isForced = function (feature, detection) {
//   var value = data[normalize(feature)];
//   return value == POLYFILL ? true
//     : value == NATIVE ? false
//     : isCallable(detection) ? fails(detection)
//     : !!detection;
// };

// var normalize = isForced.normalize = function (string) {
//   return String(string).replace(replacement, '.').toLowerCase();
// };

// var data = isForced.data = {};
// var NATIVE = isForced.NATIVE = 'N';
// var POLYFILL = isForced.POLYFILL = 'P';

// module.exports = isForced;


// /***/ }),

// /***/ 9650:
// /***/ (function(module) {

// // we can't use just `it == null` since of `document.all` special case
// // https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
// module.exports = function (it) {
//   return it === null || it === undefined;
// };


// /***/ }),

// /***/ 5052:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var isCallable = __webpack_require__(6733);
// var $documentAll = __webpack_require__(3777);

// var documentAll = $documentAll.all;

// module.exports = $documentAll.IS_HTMLDDA ? function (it) {
//   return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
// } : function (it) {
//   return typeof it == 'object' ? it !== null : isCallable(it);
// };


// /***/ }),

// /***/ 4231:
// /***/ (function(module) {

// module.exports = false;


// /***/ }),

// /***/ 9395:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var getBuiltIn = __webpack_require__(1333);
// var isCallable = __webpack_require__(6733);
// var isPrototypeOf = __webpack_require__(1321);
// var USE_SYMBOL_AS_UID = __webpack_require__(6969);

// var $Object = Object;

// module.exports = USE_SYMBOL_AS_UID ? function (it) {
//   return typeof it == 'symbol';
// } : function (it) {
//   var $Symbol = getBuiltIn('Symbol');
//   return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
// };


// /***/ }),

// /***/ 9646:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var toLength = __webpack_require__(4237);

// // `LengthOfArrayLike` abstract operation
// // https://tc39.es/ecma262/#sec-lengthofarraylike
// module.exports = function (obj) {
//   return toLength(obj.length);
// };


// /***/ }),

// /***/ 6039:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var fails = __webpack_require__(4229);
// var isCallable = __webpack_require__(6733);
// var hasOwn = __webpack_require__(8270);
// var DESCRIPTORS = __webpack_require__(7400);
// var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(1805).CONFIGURABLE);
// var inspectSource = __webpack_require__(8511);
// var InternalStateModule = __webpack_require__(6407);

// var enforceInternalState = InternalStateModule.enforce;
// var getInternalState = InternalStateModule.get;
// // eslint-disable-next-line es/no-object-defineproperty -- safe
// var defineProperty = Object.defineProperty;

// var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
//   return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
// });

// var TEMPLATE = String(String).split('String');

// var makeBuiltIn = module.exports = function (value, name, options) {
//   if (String(name).slice(0, 7) === 'Symbol(') {
//     name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
//   }
//   if (options && options.getter) name = 'get ' + name;
//   if (options && options.setter) name = 'set ' + name;
//   if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
//     if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
//     else value.name = name;
//   }
//   if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
//     defineProperty(value, 'length', { value: options.arity });
//   }
//   try {
//     if (options && hasOwn(options, 'constructor') && options.constructor) {
//       if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
//     // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
//     } else if (value.prototype) value.prototype = undefined;
//   } catch (error) { /* empty */ }
//   var state = enforceInternalState(value);
//   if (!hasOwn(state, 'source')) {
//     state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
//   } return value;
// };

// // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// // eslint-disable-next-line no-extend-native -- required
// Function.prototype.toString = makeBuiltIn(function toString() {
//   return isCallable(this) && getInternalState(this).source || inspectSource(this);
// }, 'toString');


// /***/ }),

// /***/ 917:
// /***/ (function(module) {

// var ceil = Math.ceil;
// var floor = Math.floor;

// // `Math.trunc` method
// // https://tc39.es/ecma262/#sec-math.trunc
// // eslint-disable-next-line es/no-math-trunc -- safe
// module.exports = Math.trunc || function trunc(x) {
//   var n = +x;
//   return (n > 0 ? floor : ceil)(n);
// };


// /***/ }),

// /***/ 1787:
// /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

// var DESCRIPTORS = __webpack_require__(7400);
// var IE8_DOM_DEFINE = __webpack_require__(4394);
// var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(7137);
// var anObject = __webpack_require__(1176);
// var toPropertyKey = __webpack_require__(9310);

// var $TypeError = TypeError;
// // eslint-disable-next-line es/no-object-defineproperty -- safe
// var $defineProperty = Object.defineProperty;
// // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
// var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
// var ENUMERABLE = 'enumerable';
// var CONFIGURABLE = 'configurable';
// var WRITABLE = 'writable';

// // `Object.defineProperty` method
// // https://tc39.es/ecma262/#sec-object.defineproperty
// exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
//   anObject(O);
//   P = toPropertyKey(P);
//   anObject(Attributes);
//   if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
//     var current = $getOwnPropertyDescriptor(O, P);
//     if (current && current[WRITABLE]) {
//       O[P] = Attributes.value;
//       Attributes = {
//         configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
//         enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
//         writable: false
//       };
//     }
//   } return $defineProperty(O, P, Attributes);
// } : $defineProperty : function defineProperty(O, P, Attributes) {
//   anObject(O);
//   P = toPropertyKey(P);
//   anObject(Attributes);
//   if (IE8_DOM_DEFINE) try {
//     return $defineProperty(O, P, Attributes);
//   } catch (error) { /* empty */ }
//   if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
//   if ('value' in Attributes) O[P] = Attributes.value;
//   return O;
// };


// /***/ }),

// /***/ 7933:
// /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

// var DESCRIPTORS = __webpack_require__(7400);
// var call = __webpack_require__(266);
// var propertyIsEnumerableModule = __webpack_require__(9195);
// var createPropertyDescriptor = __webpack_require__(5358);
// var toIndexedObject = __webpack_require__(905);
// var toPropertyKey = __webpack_require__(9310);
// var hasOwn = __webpack_require__(8270);
// var IE8_DOM_DEFINE = __webpack_require__(4394);

// // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
// var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// // `Object.getOwnPropertyDescriptor` method
// // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
// exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
//   O = toIndexedObject(O);
//   P = toPropertyKey(P);
//   if (IE8_DOM_DEFINE) try {
//     return $getOwnPropertyDescriptor(O, P);
//   } catch (error) { /* empty */ }
//   if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
// };


// /***/ }),

// /***/ 8151:
// /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

// var internalObjectKeys = __webpack_require__(140);
// var enumBugKeys = __webpack_require__(3837);

// var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// // `Object.getOwnPropertyNames` method
// // https://tc39.es/ecma262/#sec-object.getownpropertynames
// // eslint-disable-next-line es/no-object-getownpropertynames -- safe
// exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
//   return internalObjectKeys(O, hiddenKeys);
// };


// /***/ }),

// /***/ 894:
// /***/ (function(__unused_webpack_module, exports) {

// // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
// exports.f = Object.getOwnPropertySymbols;


// /***/ }),

// /***/ 1321:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var uncurryThis = __webpack_require__(5968);

// module.exports = uncurryThis({}.isPrototypeOf);


// /***/ }),

// /***/ 140:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var uncurryThis = __webpack_require__(5968);
// var hasOwn = __webpack_require__(8270);
// var toIndexedObject = __webpack_require__(905);
// var indexOf = (__webpack_require__(9540).indexOf);
// var hiddenKeys = __webpack_require__(5977);

// var push = uncurryThis([].push);

// module.exports = function (object, names) {
//   var O = toIndexedObject(object);
//   var i = 0;
//   var result = [];
//   var key;
//   for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
//   // Don't enum bug & hidden keys
//   while (names.length > i) if (hasOwn(O, key = names[i++])) {
//     ~indexOf(result, key) || push(result, key);
//   }
//   return result;
// };


// /***/ }),

// /***/ 9195:
// /***/ (function(__unused_webpack_module, exports) {

// "use strict";

// var $propertyIsEnumerable = {}.propertyIsEnumerable;
// // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
// var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// // Nashorn ~ JDK8 bug
// var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// // `Object.prototype.propertyIsEnumerable` method implementation
// // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
// exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
//   var descriptor = getOwnPropertyDescriptor(this, V);
//   return !!descriptor && descriptor.enumerable;
// } : $propertyIsEnumerable;


// /***/ }),

// /***/ 2914:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var call = __webpack_require__(266);
// var isCallable = __webpack_require__(6733);
// var isObject = __webpack_require__(5052);

// var $TypeError = TypeError;

// // `OrdinaryToPrimitive` abstract operation
// // https://tc39.es/ecma262/#sec-ordinarytoprimitive
// module.exports = function (input, pref) {
//   var fn, val;
//   if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
//   if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
//   if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
//   throw $TypeError("Can't convert object to primitive value");
// };


// /***/ }),

// /***/ 4826:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var getBuiltIn = __webpack_require__(1333);
// var uncurryThis = __webpack_require__(5968);
// var getOwnPropertyNamesModule = __webpack_require__(8151);
// var getOwnPropertySymbolsModule = __webpack_require__(894);
// var anObject = __webpack_require__(1176);

// var concat = uncurryThis([].concat);

// // all object keys, includes non-enumerable and symbols
// module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
//   var keys = getOwnPropertyNamesModule.f(anObject(it));
//   var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
//   return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
// };


// /***/ }),

// /***/ 8885:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var isNullOrUndefined = __webpack_require__(9650);

// var $TypeError = TypeError;

// // `RequireObjectCoercible` abstract operation
// // https://tc39.es/ecma262/#sec-requireobjectcoercible
// module.exports = function (it) {
//   if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
//   return it;
// };


// /***/ }),

// /***/ 4399:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var shared = __webpack_require__(3036);
// var uid = __webpack_require__(1441);

// var keys = shared('keys');

// module.exports = function (key) {
//   return keys[key] || (keys[key] = uid(key));
// };


// /***/ }),

// /***/ 5353:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);
// var defineGlobalProperty = __webpack_require__(8400);

// var SHARED = '__core-js_shared__';
// var store = global[SHARED] || defineGlobalProperty(SHARED, {});

// module.exports = store;


// /***/ }),

// /***/ 3036:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var IS_PURE = __webpack_require__(4231);
// var store = __webpack_require__(5353);

// (module.exports = function (key, value) {
//   return store[key] || (store[key] = value !== undefined ? value : {});
// })('versions', []).push({
//   version: '3.27.0',
//   mode: IS_PURE ? 'pure' : 'global',
//   copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
//   license: 'https://github.com/zloirock/core-js/blob/v3.27.0/LICENSE',
//   source: 'https://github.com/zloirock/core-js'
// });


// /***/ }),

// /***/ 4860:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// /* eslint-disable es/no-symbol -- required for testing */
// var V8_VERSION = __webpack_require__(6358);
// var fails = __webpack_require__(4229);

// // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
// module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
//   var symbol = Symbol();
//   // Chrome 38 Symbol has incorrect toString conversion
//   // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
//   return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
//     // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
//     !Symbol.sham && V8_VERSION && V8_VERSION < 41;
// });


// /***/ }),

// /***/ 3231:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var toIntegerOrInfinity = __webpack_require__(3329);

// var max = Math.max;
// var min = Math.min;

// // Helper for a popular repeating case of the spec:
// // Let integer be ? ToInteger(index).
// // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
// module.exports = function (index, length) {
//   var integer = toIntegerOrInfinity(index);
//   return integer < 0 ? max(integer + length, 0) : min(integer, length);
// };


// /***/ }),

// /***/ 905:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// // toObject with fallback for non-array-like ES3 strings
// var IndexedObject = __webpack_require__(9337);
// var requireObjectCoercible = __webpack_require__(8885);

// module.exports = function (it) {
//   return IndexedObject(requireObjectCoercible(it));
// };


// /***/ }),

// /***/ 3329:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var trunc = __webpack_require__(917);

// // `ToIntegerOrInfinity` abstract operation
// // https://tc39.es/ecma262/#sec-tointegerorinfinity
// module.exports = function (argument) {
//   var number = +argument;
//   // eslint-disable-next-line no-self-compare -- NaN check
//   return number !== number || number === 0 ? 0 : trunc(number);
// };


// /***/ }),

// /***/ 4237:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var toIntegerOrInfinity = __webpack_require__(3329);

// var min = Math.min;

// // `ToLength` abstract operation
// // https://tc39.es/ecma262/#sec-tolength
// module.exports = function (argument) {
//   return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
// };


// /***/ }),

// /***/ 2991:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var requireObjectCoercible = __webpack_require__(8885);

// var $Object = Object;

// // `ToObject` abstract operation
// // https://tc39.es/ecma262/#sec-toobject
// module.exports = function (argument) {
//   return $Object(requireObjectCoercible(argument));
// };


// /***/ }),

// /***/ 2066:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var call = __webpack_require__(266);
// var isObject = __webpack_require__(5052);
// var isSymbol = __webpack_require__(9395);
// var getMethod = __webpack_require__(5300);
// var ordinaryToPrimitive = __webpack_require__(2914);
// var wellKnownSymbol = __webpack_require__(95);

// var $TypeError = TypeError;
// var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// // `ToPrimitive` abstract operation
// // https://tc39.es/ecma262/#sec-toprimitive
// module.exports = function (input, pref) {
//   if (!isObject(input) || isSymbol(input)) return input;
//   var exoticToPrim = getMethod(input, TO_PRIMITIVE);
//   var result;
//   if (exoticToPrim) {
//     if (pref === undefined) pref = 'default';
//     result = call(exoticToPrim, input, pref);
//     if (!isObject(result) || isSymbol(result)) return result;
//     throw $TypeError("Can't convert object to primitive value");
//   }
//   if (pref === undefined) pref = 'number';
//   return ordinaryToPrimitive(input, pref);
// };


// /***/ }),

// /***/ 9310:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var toPrimitive = __webpack_require__(2066);
// var isSymbol = __webpack_require__(9395);

// // `ToPropertyKey` abstract operation
// // https://tc39.es/ecma262/#sec-topropertykey
// module.exports = function (argument) {
//   var key = toPrimitive(argument, 'string');
//   return isSymbol(key) ? key : key + '';
// };


// /***/ }),

// /***/ 9821:
// /***/ (function(module) {

// var $String = String;

// module.exports = function (argument) {
//   try {
//     return $String(argument);
//   } catch (error) {
//     return 'Object';
//   }
// };


// /***/ }),

// /***/ 1441:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var uncurryThis = __webpack_require__(5968);

// var id = 0;
// var postfix = Math.random();
// var toString = uncurryThis(1.0.toString);

// module.exports = function (key) {
//   return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
// };


// /***/ }),

// /***/ 6969:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// /* eslint-disable es/no-symbol -- required for testing */
// var NATIVE_SYMBOL = __webpack_require__(4860);

// module.exports = NATIVE_SYMBOL
//   && !Symbol.sham
//   && typeof Symbol.iterator == 'symbol';


// /***/ }),

// /***/ 7137:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var DESCRIPTORS = __webpack_require__(7400);
// var fails = __webpack_require__(4229);

// // V8 ~ Chrome 36-
// // https://bugs.chromium.org/p/v8/issues/detail?id=3334
// module.exports = DESCRIPTORS && fails(function () {
//   // eslint-disable-next-line es/no-object-defineproperty -- required for testing
//   return Object.defineProperty(function () { /* empty */ }, 'prototype', {
//     value: 42,
//     writable: false
//   }).prototype != 42;
// });


// /***/ }),

// /***/ 1180:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);
// var isCallable = __webpack_require__(6733);

// var WeakMap = global.WeakMap;

// module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


// /***/ }),

// /***/ 95:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var global = __webpack_require__(9859);
// var shared = __webpack_require__(3036);
// var hasOwn = __webpack_require__(8270);
// var uid = __webpack_require__(1441);
// var NATIVE_SYMBOL = __webpack_require__(4860);
// var USE_SYMBOL_AS_UID = __webpack_require__(6969);

// var WellKnownSymbolsStore = shared('wks');
// var Symbol = global.Symbol;
// var symbolFor = Symbol && Symbol['for'];
// var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

// module.exports = function (name) {
//   if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
//     var description = 'Symbol.' + name;
//     if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
//       WellKnownSymbolsStore[name] = Symbol[name];
//     } else if (USE_SYMBOL_AS_UID && symbolFor) {
//       WellKnownSymbolsStore[name] = symbolFor(description);
//     } else {
//       WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
//     }
//   } return WellKnownSymbolsStore[name];
// };


// /***/ }),

// /***/ 6728:
// /***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// "use strict";

// var $ = __webpack_require__(3103);
// var toObject = __webpack_require__(2991);
// var lengthOfArrayLike = __webpack_require__(9646);
// var setArrayLength = __webpack_require__(6554);
// var doesNotExceedSafeInteger = __webpack_require__(3064);
// var fails = __webpack_require__(4229);

// var INCORRECT_TO_LENGTH = fails(function () {
//   return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
// });

// // V8 and Safari <= 15.4, FF < 23 throws InternalError
// // https://bugs.chromium.org/p/v8/issues/detail?id=12681
// var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
//   try {
//     // eslint-disable-next-line es/no-object-defineproperty -- safe
//     Object.defineProperty([], 'length', { writable: false }).push();
//   } catch (error) {
//     return error instanceof TypeError;
//   }
// }();

// // `Array.prototype.push` method
// // https://tc39.es/ecma262/#sec-array.prototype.push
// $({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_TO_LENGTH || SILENT_ON_NON_WRITABLE_LENGTH }, {
//   // eslint-disable-next-line no-unused-vars -- required for `.length`
//   push: function push(item) {
//     var O = toObject(this);
//     var len = lengthOfArrayLike(O);
//     var argCount = arguments.length;
//     doesNotExceedSafeInteger(len + argCount);
//     for (var i = 0; i < argCount; i++) {
//       O[len] = arguments[i];
//       len++;
//     }
//     setArrayLength(O, len);
//     return len;
//   }
// });


// /***/ }),

// /***/ 1951:
// /***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// "use strict";

// var $ = __webpack_require__(3103);
// var toObject = __webpack_require__(2991);
// var lengthOfArrayLike = __webpack_require__(9646);
// var setArrayLength = __webpack_require__(6554);
// var deletePropertyOrThrow = __webpack_require__(9563);
// var doesNotExceedSafeInteger = __webpack_require__(3064);

// // IE8-
// var INCORRECT_RESULT = [].unshift(0) !== 1;

// // V8 ~ Chrome < 71 and Safari <= 15.4, FF < 23 throws InternalError
// var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
//   try {
//     // eslint-disable-next-line es/no-object-defineproperty -- safe
//     Object.defineProperty([], 'length', { writable: false }).unshift();
//   } catch (error) {
//     return error instanceof TypeError;
//   }
// }();

// // `Array.prototype.unshift` method
// // https://tc39.es/ecma262/#sec-array.prototype.unshift
// $({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_RESULT || SILENT_ON_NON_WRITABLE_LENGTH }, {
//   // eslint-disable-next-line no-unused-vars -- required for `.length`
//   unshift: function unshift(item) {
//     var O = toObject(this);
//     var len = lengthOfArrayLike(O);
//     var argCount = arguments.length;
//     if (argCount) {
//       doesNotExceedSafeInteger(len + argCount);
//       var k = len;
//       while (k--) {
//         var to = k + argCount;
//         if (k in O) O[to] = O[k];
//         else deletePropertyOrThrow(O, to);
//       }
//       for (var j = 0; j < argCount; j++) {
//         O[j] = arguments[j];
//       }
//     } return setArrayLength(O, len + argCount);
//   }
// });


// /***/ }),

// /***/ 4373:
// /***/ (function(module, __webpack_exports__, __webpack_require__) {

// "use strict";
// __webpack_require__.r(__webpack_exports__);
// /* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9601);
// /* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
// /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2609);
// /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// // Imports


// var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// // Module
// ___CSS_LOADER_EXPORT___.push([module.id, "#app{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;color:#2c3e50;margin-top:60px}", ""]);
// // Exports
// /* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


// /***/ }),

// /***/ 2609:
// /***/ (function(module) {

// "use strict";


// /*
//   MIT License http://www.opensource.org/licenses/mit-license.php
//   Author Tobias Koppers @sokra
// */
// module.exports = function (cssWithMappingToString) {
//   var list = [];

//   // return the list of modules as css string
//   list.toString = function toString() {
//     return this.map(function (item) {
//       var content = "";
//       var needLayer = typeof item[5] !== "undefined";
//       if (item[4]) {
//         content += "@supports (".concat(item[4], ") {");
//       }
//       if (item[2]) {
//         content += "@media ".concat(item[2], " {");
//       }
//       if (needLayer) {
//         content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
//       }
//       content += cssWithMappingToString(item);
//       if (needLayer) {
//         content += "}";
//       }
//       if (item[2]) {
//         content += "}";
//       }
//       if (item[4]) {
//         content += "}";
//       }
//       return content;
//     }).join("");
//   };

//   // import a list of modules into the list
//   list.i = function i(modules, media, dedupe, supports, layer) {
//     if (typeof modules === "string") {
//       modules = [[null, modules, undefined]];
//     }
//     var alreadyImportedModules = {};
//     if (dedupe) {
//       for (var k = 0; k < this.length; k++) {
//         var id = this[k][0];
//         if (id != null) {
//           alreadyImportedModules[id] = true;
//         }
//       }
//     }
//     for (var _k = 0; _k < modules.length; _k++) {
//       var item = [].concat(modules[_k]);
//       if (dedupe && alreadyImportedModules[item[0]]) {
//         continue;
//       }
//       if (typeof layer !== "undefined") {
//         if (typeof item[5] === "undefined") {
//           item[5] = layer;
//         } else {
//           item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
//           item[5] = layer;
//         }
//       }
//       if (media) {
//         if (!item[2]) {
//           item[2] = media;
//         } else {
//           item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
//           item[2] = media;
//         }
//       }
//       if (supports) {
//         if (!item[4]) {
//           item[4] = "".concat(supports);
//         } else {
//           item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
//           item[4] = supports;
//         }
//       }
//       list.push(item);
//     }
//   };
//   return list;
// };

// /***/ }),

// /***/ 9601:
// /***/ (function(module) {

// "use strict";


// module.exports = function (i) {
//   return i[1];
// };

// /***/ }),

// /***/ 7091:
// /***/ (function(__unused_webpack_module, exports) {

// "use strict";
// var __webpack_unused_export__;


// __webpack_unused_export__ = ({
//   value: true
// });
// // runtime helper for setting properties on components
// // in a tree-shakable way
// exports.Z = (sfc, props) => {
//   const target = sfc.__vccOpts || sfc;
//   for (const [key, val] of props) {
//     target[key] = val;
//   }
//   return target;
// };

// /***/ }),

// /***/ 3060:
// /***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// // style-loader: Adds some css to the DOM by adding a <style> tag

// // load the styles
// var content = __webpack_require__(4373);
// if(content.__esModule) content = content.default;
// if(typeof content === 'string') content = [[module.id, content, '']];
// if(content.locals) module.exports = content.locals;
// // add the styles to the DOM
// var add = (__webpack_require__(572)/* ["default"] */ .Z)
// var update = add("25d4214e", content, true, {"sourceMap":false,"shadowMode":false});

// /***/ }),

// /***/ 572:
// /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

// "use strict";

// // EXPORTS
// __webpack_require__.d(__webpack_exports__, {
//   "Z": function() { return /* binding */ addStylesClient; }
// });

// // EXTERNAL MODULE: ../../node_modules/core-js/modules/es.array.push.js
// var es_array_push = __webpack_require__(6728);
// ;// CONCATENATED MODULE: ../../node_modules/vue-style-loader/lib/listToStyles.js

// /**
//  * Translates the list format produced by css-loader into something
//  * easier to manipulate.
//  */
// function listToStyles(parentId, list) {
//   var styles = [];
//   var newStyles = {};
//   for (var i = 0; i < list.length; i++) {
//     var item = list[i];
//     var id = item[0];
//     var css = item[1];
//     var media = item[2];
//     var sourceMap = item[3];
//     var part = {
//       id: parentId + ':' + i,
//       css: css,
//       media: media,
//       sourceMap: sourceMap
//     };
//     if (!newStyles[id]) {
//       styles.push(newStyles[id] = {
//         id: id,
//         parts: [part]
//       });
//     } else {
//       newStyles[id].parts.push(part);
//     }
//   }
//   return styles;
// }
// ;// CONCATENATED MODULE: ../../node_modules/vue-style-loader/lib/addStylesClient.js
// /*
//   MIT License http://www.opensource.org/licenses/mit-license.php
//   Author Tobias Koppers @sokra
//   Modified by Evan You @yyx990803
// */



// var hasDocument = typeof document !== 'undefined'

// if (typeof DEBUG !== 'undefined' && DEBUG) {
//   if (!hasDocument) {
//     throw new Error(
//     'vue-style-loader cannot be used in a non-browser environment. ' +
//     "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
//   ) }
// }

// /*
// type StyleObject = {
//   id: number;
//   parts: Array<StyleObjectPart>
// }

// type StyleObjectPart = {
//   css: string;
//   media: string;
//   sourceMap: ?string
// }
// */

// var stylesInDom = {/*
//   [id: number]: {
//     id: number,
//     refs: number,
//     parts: Array<(obj?: StyleObjectPart) => void>
//   }
// */}

// var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
// var singletonElement = null
// var singletonCounter = 0
// var isProduction = false
// var noop = function () {}
// var options = null
// var ssrIdKey = 'data-vue-ssr-id'

// // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// // tags it will allow on a page
// var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

// function addStylesClient (parentId, list, _isProduction, _options) {
//   isProduction = _isProduction

//   options = _options || {}

//   var styles = listToStyles(parentId, list)
//   addStylesToDom(styles)

//   return function update (newList) {
//     var mayRemove = []
//     for (var i = 0; i < styles.length; i++) {
//       var item = styles[i]
//       var domStyle = stylesInDom[item.id]
//       domStyle.refs--
//       mayRemove.push(domStyle)
//     }
//     if (newList) {
//       styles = listToStyles(parentId, newList)
//       addStylesToDom(styles)
//     } else {
//       styles = []
//     }
//     for (var i = 0; i < mayRemove.length; i++) {
//       var domStyle = mayRemove[i]
//       if (domStyle.refs === 0) {
//         for (var j = 0; j < domStyle.parts.length; j++) {
//           domStyle.parts[j]()
//         }
//         delete stylesInDom[domStyle.id]
//       }
//     }
//   }
// }

// function addStylesToDom (styles /* Array<StyleObject> */) {
//   for (var i = 0; i < styles.length; i++) {
//     var item = styles[i]
//     var domStyle = stylesInDom[item.id]
//     if (domStyle) {
//       domStyle.refs++
//       for (var j = 0; j < domStyle.parts.length; j++) {
//         domStyle.parts[j](item.parts[j])
//       }
//       for (; j < item.parts.length; j++) {
//         domStyle.parts.push(addStyle(item.parts[j]))
//       }
//       if (domStyle.parts.length > item.parts.length) {
//         domStyle.parts.length = item.parts.length
//       }
//     } else {
//       var parts = []
//       for (var j = 0; j < item.parts.length; j++) {
//         parts.push(addStyle(item.parts[j]))
//       }
//       stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
//     }
//   }
// }

// function createStyleElement () {
//   var styleElement = document.createElement('style')
//   styleElement.type = 'text/css'
//   head.appendChild(styleElement)
//   return styleElement
// }

// function addStyle (obj /* StyleObjectPart */) {
//   var update, remove
//   var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

//   if (styleElement) {
//     if (isProduction) {
//       // has SSR styles and in production mode.
//       // simply do nothing.
//       return noop
//     } else {
//       // has SSR styles but in dev mode.
//       // for some reason Chrome can't handle source map in server-rendered
//       // style tags - source maps in <style> only works if the style tag is
//       // created and inserted dynamically. So we remove the server rendered
//       // styles and inject new ones.
//       styleElement.parentNode.removeChild(styleElement)
//     }
//   }

//   if (isOldIE) {
//     // use singleton mode for IE9.
//     var styleIndex = singletonCounter++
//     styleElement = singletonElement || (singletonElement = createStyleElement())
//     update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
//     remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
//   } else {
//     // use multi-style-tag mode in all other cases
//     styleElement = createStyleElement()
//     update = applyToTag.bind(null, styleElement)
//     remove = function () {
//       styleElement.parentNode.removeChild(styleElement)
//     }
//   }

//   update(obj)

//   return function updateStyle (newObj /* StyleObjectPart */) {
//     if (newObj) {
//       if (newObj.css === obj.css &&
//           newObj.media === obj.media &&
//           newObj.sourceMap === obj.sourceMap) {
//         return
//       }
//       update(obj = newObj)
//     } else {
//       remove()
//     }
//   }
// }

// var replaceText = (function () {
//   var textStore = []

//   return function (index, replacement) {
//     textStore[index] = replacement
//     return textStore.filter(Boolean).join('\n')
//   }
// })()

// function applyToSingletonTag (styleElement, index, remove, obj) {
//   var css = remove ? '' : obj.css

//   if (styleElement.styleSheet) {
//     styleElement.styleSheet.cssText = replaceText(index, css)
//   } else {
//     var cssNode = document.createTextNode(css)
//     var childNodes = styleElement.childNodes
//     if (childNodes[index]) styleElement.removeChild(childNodes[index])
//     if (childNodes.length) {
//       styleElement.insertBefore(cssNode, childNodes[index])
//     } else {
//       styleElement.appendChild(cssNode)
//     }
//   }
// }

// function applyToTag (styleElement, obj) {
//   var css = obj.css
//   var media = obj.media
//   var sourceMap = obj.sourceMap

//   if (media) {
//     styleElement.setAttribute('media', media)
//   }
//   if (options.ssrId) {
//     styleElement.setAttribute(ssrIdKey, obj.id)
//   }

//   if (sourceMap) {
//     // https://developer.chrome.com/devtools/docs/javascript-debugging
//     // this makes source maps inside style tags work properly in Chrome
//     css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
//     // http://stackoverflow.com/a/26603875
//     css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
//   }

//   if (styleElement.styleSheet) {
//     styleElement.styleSheet.cssText = css
//   } else {
//     while (styleElement.firstChild) {
//       styleElement.removeChild(styleElement.firstChild)
//     }
//     styleElement.appendChild(document.createTextNode(css))
//   }
// }


// /***/ })

// /******/ 	});
// /************************************************************************/
// /******/ 	// The module cache
// /******/ 	var __webpack_module_cache__ = {};
// /******/ 	
// /******/ 	// The require function
// /******/ 	function __webpack_require__(moduleId) {
// /******/ 		// Check if module is in cache
// /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
// /******/ 		if (cachedModule !== undefined) {
// /******/ 			return cachedModule.exports;
// /******/ 		}
// /******/ 		// Create a new module (and put it into the cache)
// /******/ 		var module = __webpack_module_cache__[moduleId] = {
// /******/ 			id: moduleId,
// /******/ 			// no module.loaded needed
// /******/ 			exports: {}
// /******/ 		};
// /******/ 	
// /******/ 		// Execute the module function
// /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
// /******/ 	
// /******/ 		// Return the exports of the module
// /******/ 		return module.exports;
// /******/ 	}
// /******/ 	
// /************************************************************************/
// /******/ 	/* webpack/runtime/compat get default export */
// /******/ 	!function() {
// /******/ 		// getDefaultExport function for compatibility with non-harmony modules
// /******/ 		__webpack_require__.n = function(module) {
// /******/ 			var getter = module && module.__esModule ?
// /******/ 				function() { return module['default']; } :
// /******/ 				function() { return module; };
// /******/ 			__webpack_require__.d(getter, { a: getter });
// /******/ 			return getter;
// /******/ 		};
// /******/ 	}();
// /******/ 	
// /******/ 	/* webpack/runtime/define property getters */
// /******/ 	!function() {
// /******/ 		// define getter functions for harmony exports
// /******/ 		__webpack_require__.d = function(exports, definition) {
// /******/ 			for(var key in definition) {
// /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
// /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
// /******/ 				}
// /******/ 			}
// /******/ 		};
// /******/ 	}();
// /******/ 	
// /******/ 	/* webpack/runtime/global */
// /******/ 	!function() {
// /******/ 		__webpack_require__.g = (function() {
// /******/ 			if (typeof globalThis === 'object') return globalThis;
// /******/ 			try {
// /******/ 				return this || new Function('return this')();
// /******/ 			} catch (e) {
// /******/ 				if (typeof window === 'object') return window;
// /******/ 			}
// /******/ 		})();
// /******/ 	}();
// /******/ 	
// /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
// /******/ 	!function() {
// /******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
// /******/ 	}();
// /******/ 	
// /******/ 	/* webpack/runtime/make namespace object */
// /******/ 	!function() {
// /******/ 		// define __esModule on exports
// /******/ 		__webpack_require__.r = function(exports) {
// /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
// /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
// /******/ 			}
// /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
// /******/ 		};
// /******/ 	}();
// /******/ 	
// /******/ 	/* webpack/runtime/publicPath */
// /******/ 	!function() {
// /******/ 		__webpack_require__.p = "";
// /******/ 	}();
// /******/ 	
// /************************************************************************/
// var __webpack_exports__ = {};
// // This entry need to be wrapped in an IIFE because it need to be in strict mode.
// !function() {
// "use strict";
// // ESM COMPAT FLAG
// __webpack_require__.r(__webpack_exports__);

// ;// CONCATENATED MODULE: ../../node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// /* eslint-disable no-var */
// // This file is imported into lib/wc client bundles.

// if (typeof window !== 'undefined') {
//   var currentScript = window.document.currentScript
//   if (false) { var getCurrentScript; }

//   var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
//   if (src) {
//     __webpack_require__.p = src[1] // eslint-disable-line
//   }
// }

// // Indicate to webpack that this file can be concatenated
// /* harmony default export */ var setPublicPath = (null);

// // EXTERNAL MODULE: ../../node_modules/core-js/modules/es.array.push.js
// var es_array_push = __webpack_require__(6728);
// ;// CONCATENATED MODULE: ../../node_modules/@vue/shared/dist/shared.esm-bundler.js

// /**
//  * Make a map and return a function for checking if a key
//  * is in that map.
//  * IMPORTANT: all calls of this function must be prefixed with
//  * \/\*#\_\_PURE\_\_\*\/
//  * So that rollup can tree-shake them if necessary.
//  */
// function shared_esm_bundler_makeMap(str, expectsLowerCase) {
//   const map = Object.create(null);
//   const list = str.split(',');
//   for (let i = 0; i < list.length; i++) {
//     map[list[i]] = true;
//   }
//   return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
// }

// /**
//  * dev only flag -> name mapping
//  */
// const PatchFlagNames = {
//   [1 /* PatchFlags.TEXT */]: `TEXT`,
//   [2 /* PatchFlags.CLASS */]: `CLASS`,
//   [4 /* PatchFlags.STYLE */]: `STYLE`,
//   [8 /* PatchFlags.PROPS */]: `PROPS`,
//   [16 /* PatchFlags.FULL_PROPS */]: `FULL_PROPS`,
//   [32 /* PatchFlags.HYDRATE_EVENTS */]: `HYDRATE_EVENTS`,
//   [64 /* PatchFlags.STABLE_FRAGMENT */]: `STABLE_FRAGMENT`,
//   [128 /* PatchFlags.KEYED_FRAGMENT */]: `KEYED_FRAGMENT`,
//   [256 /* PatchFlags.UNKEYED_FRAGMENT */]: `UNKEYED_FRAGMENT`,
//   [512 /* PatchFlags.NEED_PATCH */]: `NEED_PATCH`,
//   [1024 /* PatchFlags.DYNAMIC_SLOTS */]: `DYNAMIC_SLOTS`,
//   [2048 /* PatchFlags.DEV_ROOT_FRAGMENT */]: `DEV_ROOT_FRAGMENT`,
//   [-1 /* PatchFlags.HOISTED */]: `HOISTED`,
//   [-2 /* PatchFlags.BAIL */]: `BAIL`
// };

// /**
//  * Dev only
//  */
// const slotFlagsText = {
//   [1 /* SlotFlags.STABLE */]: 'STABLE',
//   [2 /* SlotFlags.DYNAMIC */]: 'DYNAMIC',
//   [3 /* SlotFlags.FORWARDED */]: 'FORWARDED'
// };
// const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' + 'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' + 'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt';
// const isGloballyWhitelisted = /*#__PURE__*/shared_esm_bundler_makeMap(GLOBALS_WHITE_LISTED);
// const range = 2;
// function generateCodeFrame(source, start = 0, end = source.length) {
//   // Split the content into individual lines but capture the newline sequence
//   // that separated each line. This is important because the actual sequence is
//   // needed to properly take into account the full line length for offset
//   // comparison
//   let lines = source.split(/(\r?\n)/);
//   // Separate the lines and newline sequences into separate arrays for easier referencing
//   const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
//   lines = lines.filter((_, idx) => idx % 2 === 0);
//   let count = 0;
//   const res = [];
//   for (let i = 0; i < lines.length; i++) {
//     count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
//     if (count >= start) {
//       for (let j = i - range; j <= i + range || end > count; j++) {
//         if (j < 0 || j >= lines.length) continue;
//         const line = j + 1;
//         res.push(`${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
//         const lineLength = lines[j].length;
//         const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
//         if (j === i) {
//           // push underline
//           const pad = start - (count - (lineLength + newLineSeqLength));
//           const length = Math.max(1, end > count ? lineLength - pad : end - start);
//           res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length));
//         } else if (j > i) {
//           if (end > count) {
//             const length = Math.max(Math.min(end - count, lineLength), 1);
//             res.push(`   |  ` + '^'.repeat(length));
//           }
//           count += lineLength + newLineSeqLength;
//         }
//       }
//       break;
//     }
//   }
//   return res.join('\n');
// }
// function normalizeStyle(value) {
//   if (shared_esm_bundler_isArray(value)) {
//     const res = {};
//     for (let i = 0; i < value.length; i++) {
//       const item = value[i];
//       const normalized = shared_esm_bundler_isString(item) ? parseStringStyle(item) : normalizeStyle(item);
//       if (normalized) {
//         for (const key in normalized) {
//           res[key] = normalized[key];
//         }
//       }
//     }
//     return res;
//   } else if (shared_esm_bundler_isString(value)) {
//     return value;
//   } else if (shared_esm_bundler_isObject(value)) {
//     return value;
//   }
// }
// const listDelimiterRE = /;(?![^(]*\))/g;
// const propertyDelimiterRE = /:([^]+)/;
// const styleCommentRE = /\/\*.*?\*\//gs;
// function parseStringStyle(cssText) {
//   const ret = {};
//   cssText.replace(styleCommentRE, '').split(listDelimiterRE).forEach(item => {
//     if (item) {
//       const tmp = item.split(propertyDelimiterRE);
//       tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
//     }
//   });
//   return ret;
// }
// function stringifyStyle(styles) {
//   let ret = '';
//   if (!styles || shared_esm_bundler_isString(styles)) {
//     return ret;
//   }
//   for (const key in styles) {
//     const value = styles[key];
//     const normalizedKey = key.startsWith(`--`) ? key : shared_esm_bundler_hyphenate(key);
//     if (shared_esm_bundler_isString(value) || typeof value === 'number') {
//       // only render valid values
//       ret += `${normalizedKey}:${value};`;
//     }
//   }
//   return ret;
// }
// function normalizeClass(value) {
//   let res = '';
//   if (shared_esm_bundler_isString(value)) {
//     res = value;
//   } else if (shared_esm_bundler_isArray(value)) {
//     for (let i = 0; i < value.length; i++) {
//       const normalized = normalizeClass(value[i]);
//       if (normalized) {
//         res += normalized + ' ';
//       }
//     }
//   } else if (shared_esm_bundler_isObject(value)) {
//     for (const name in value) {
//       if (value[name]) {
//         res += name + ' ';
//       }
//     }
//   }
//   return res.trim();
// }
// function normalizeProps(props) {
//   if (!props) return null;
//   let {
//     class: klass,
//     style
//   } = props;
//   if (klass && !shared_esm_bundler_isString(klass)) {
//     props.class = normalizeClass(klass);
//   }
//   if (style) {
//     props.style = normalizeStyle(style);
//   }
//   return props;
// }

// // These tag configs are shared between compiler-dom and runtime-dom, so they
// // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
// const HTML_TAGS = (/* unused pure expression or super */ null && ('html,body,base,head,link,meta,style,title,address,article,aside,footer,' + 'header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,' + 'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' + 'data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,' + 'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' + 'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' + 'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' + 'option,output,progress,select,textarea,details,dialog,menu,' + 'summary,template,blockquote,iframe,tfoot'));
// // https://developer.mozilla.org/en-US/docs/Web/SVG/Element
// const SVG_TAGS = (/* unused pure expression or super */ null && ('svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' + 'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' + 'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' + 'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' + 'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' + 'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' + 'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' + 'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' + 'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' + 'text,textPath,title,tspan,unknown,use,view'));
// const VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';
// /**
//  * Compiler only.
//  * Do NOT use in runtime code paths unless behind `(process.env.NODE_ENV !== 'production')` flag.
//  */
// const shared_esm_bundler_isHTMLTag = /*#__PURE__*/(/* unused pure expression or super */ null && (shared_esm_bundler_makeMap(HTML_TAGS)));
// /**
//  * Compiler only.
//  * Do NOT use in runtime code paths unless behind `(process.env.NODE_ENV !== 'production')` flag.
//  */
// const shared_esm_bundler_isSVGTag = /*#__PURE__*/(/* unused pure expression or super */ null && (shared_esm_bundler_makeMap(SVG_TAGS)));
// /**
//  * Compiler only.
//  * Do NOT use in runtime code paths unless behind `(process.env.NODE_ENV !== 'production')` flag.
//  */
// const isVoidTag = /*#__PURE__*/(/* unused pure expression or super */ null && (shared_esm_bundler_makeMap(VOID_TAGS)));

// /**
//  * On the client we only need to offer special cases for boolean attributes that
//  * have different names from their corresponding dom properties:
//  * - itemscope -> N/A
//  * - allowfullscreen -> allowFullscreen
//  * - formnovalidate -> formNoValidate
//  * - ismap -> isMap
//  * - nomodule -> noModule
//  * - novalidate -> noValidate
//  * - readonly -> readOnly
//  */
// const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
// const isSpecialBooleanAttr = /*#__PURE__*/shared_esm_bundler_makeMap(specialBooleanAttrs);
// /**
//  * The full list is needed during SSR to produce the correct initial markup.
//  */
// const isBooleanAttr = /*#__PURE__*/shared_esm_bundler_makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,` + `loop,open,required,reversed,scoped,seamless,` + `checked,muted,multiple,selected`);
// /**
//  * Boolean attributes should be included if the value is truthy or ''.
//  * e.g. `<select multiple>` compiles to `{ multiple: '' }`
//  */
// function includeBooleanAttr(value) {
//   return !!value || value === '';
// }
// const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
// const attrValidationCache = {};
// function isSSRSafeAttrName(name) {
//   if (attrValidationCache.hasOwnProperty(name)) {
//     return attrValidationCache[name];
//   }
//   const isUnsafe = unsafeAttrCharRE.test(name);
//   if (isUnsafe) {
//     console.error(`unsafe attribute name: ${name}`);
//   }
//   return attrValidationCache[name] = !isUnsafe;
// }
// const propsToAttrMap = {
//   acceptCharset: 'accept-charset',
//   className: 'class',
//   htmlFor: 'for',
//   httpEquiv: 'http-equiv'
// };
// /**
//  * Known attributes, this is used for stringification of runtime static nodes
//  * so that we don't stringify bindings that cannot be set from HTML.
//  * Don't also forget to allow `data-*` and `aria-*`!
//  * Generated from https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
//  */
// const isKnownHtmlAttr = /*#__PURE__*/(/* unused pure expression or super */ null && (shared_esm_bundler_makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,` + `autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,` + `border,buffered,capture,challenge,charset,checked,cite,class,code,` + `codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,` + `coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,` + `disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,` + `formaction,formenctype,formmethod,formnovalidate,formtarget,headers,` + `height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,` + `ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,` + `manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,` + `open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,` + `referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,` + `selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,` + `start,step,style,summary,tabindex,target,title,translate,type,usemap,` + `value,width,wrap`)));
// /**
//  * Generated from https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
//  */
// const isKnownSvgAttr = /*#__PURE__*/(/* unused pure expression or super */ null && (shared_esm_bundler_makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,` + `arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,` + `baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,` + `clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,` + `color-interpolation-filters,color-profile,color-rendering,` + `contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,` + `descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,` + `dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,` + `fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,` + `font-family,font-size,font-size-adjust,font-stretch,font-style,` + `font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,` + `glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,` + `gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,` + `horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,` + `k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,` + `lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,` + `marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,` + `mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,` + `name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,` + `overflow,overline-position,overline-thickness,panose-1,paint-order,path,` + `pathLength,patternContentUnits,patternTransform,patternUnits,ping,` + `pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,` + `preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,` + `rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,` + `restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,` + `specularConstant,specularExponent,speed,spreadMethod,startOffset,` + `stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,` + `strikethrough-position,strikethrough-thickness,string,stroke,` + `stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,` + `stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,` + `systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,` + `text-decoration,text-rendering,textLength,to,transform,transform-origin,` + `type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,` + `unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,` + `v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,` + `vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,` + `writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,` + `xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,` + `xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`)));
// const escapeRE = /["'&<>]/;
// function escapeHtml(string) {
//   const str = '' + string;
//   const match = escapeRE.exec(str);
//   if (!match) {
//     return str;
//   }
//   let html = '';
//   let escaped;
//   let index;
//   let lastIndex = 0;
//   for (index = match.index; index < str.length; index++) {
//     switch (str.charCodeAt(index)) {
//       case 34:
//         // "
//         escaped = '&quot;';
//         break;
//       case 38:
//         // &
//         escaped = '&amp;';
//         break;
//       case 39:
//         // '
//         escaped = '&#39;';
//         break;
//       case 60:
//         // <
//         escaped = '&lt;';
//         break;
//       case 62:
//         // >
//         escaped = '&gt;';
//         break;
//       default:
//         continue;
//     }
//     if (lastIndex !== index) {
//       html += str.slice(lastIndex, index);
//     }
//     lastIndex = index + 1;
//     html += escaped;
//   }
//   return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
// }
// // https://www.w3.org/TR/html52/syntax.html#comments
// const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
// function escapeHtmlComment(src) {
//   return src.replace(commentStripRE, '');
// }
// function looseCompareArrays(a, b) {
//   if (a.length !== b.length) return false;
//   let equal = true;
//   for (let i = 0; equal && i < a.length; i++) {
//     equal = shared_esm_bundler_looseEqual(a[i], b[i]);
//   }
//   return equal;
// }
// function shared_esm_bundler_looseEqual(a, b) {
//   if (a === b) return true;
//   let aValidType = isDate(a);
//   let bValidType = isDate(b);
//   if (aValidType || bValidType) {
//     return aValidType && bValidType ? a.getTime() === b.getTime() : false;
//   }
//   aValidType = isSymbol(a);
//   bValidType = isSymbol(b);
//   if (aValidType || bValidType) {
//     return a === b;
//   }
//   aValidType = shared_esm_bundler_isArray(a);
//   bValidType = shared_esm_bundler_isArray(b);
//   if (aValidType || bValidType) {
//     return aValidType && bValidType ? looseCompareArrays(a, b) : false;
//   }
//   aValidType = shared_esm_bundler_isObject(a);
//   bValidType = shared_esm_bundler_isObject(b);
//   if (aValidType || bValidType) {
//     /* istanbul ignore if: this if will probably never be called */
//     if (!aValidType || !bValidType) {
//       return false;
//     }
//     const aKeysCount = Object.keys(a).length;
//     const bKeysCount = Object.keys(b).length;
//     if (aKeysCount !== bKeysCount) {
//       return false;
//     }
//     for (const key in a) {
//       const aHasKey = a.hasOwnProperty(key);
//       const bHasKey = b.hasOwnProperty(key);
//       if (aHasKey && !bHasKey || !aHasKey && bHasKey || !shared_esm_bundler_looseEqual(a[key], b[key])) {
//         return false;
//       }
//     }
//   }
//   return String(a) === String(b);
// }
// function shared_esm_bundler_looseIndexOf(arr, val) {
//   return arr.findIndex(item => shared_esm_bundler_looseEqual(item, val));
// }

// /**
//  * For converting {{ interpolation }} values to displayed strings.
//  * @private
//  */
// const toDisplayString = val => {
//   return shared_esm_bundler_isString(val) ? val : val == null ? '' : shared_esm_bundler_isArray(val) || shared_esm_bundler_isObject(val) && (val.toString === objectToString || !shared_esm_bundler_isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
// };
// const replacer = (_key, val) => {
//   // can't use isRef here since @vue/shared has no deps
//   if (val && val.__v_isRef) {
//     return replacer(_key, val.value);
//   } else if (isMap(val)) {
//     return {
//       [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
//         entries[`${key} =>`] = val;
//         return entries;
//       }, {})
//     };
//   } else if (shared_esm_bundler_isSet(val)) {
//     return {
//       [`Set(${val.size})`]: [...val.values()]
//     };
//   } else if (shared_esm_bundler_isObject(val) && !shared_esm_bundler_isArray(val) && !isPlainObject(val)) {
//     return String(val);
//   }
//   return val;
// };
// const shared_esm_bundler_EMPTY_OBJ =  false ? 0 : {};
// const EMPTY_ARR =  false ? 0 : [];
// const shared_esm_bundler_NOOP = () => {};
// /**
//  * Always return false.
//  */
// const shared_esm_bundler_NO = () => false;
// const onRE = /^on[^a-z]/;
// const shared_esm_bundler_isOn = key => onRE.test(key);
// const isModelListener = key => key.startsWith('onUpdate:');
// const shared_esm_bundler_extend = Object.assign;
// const remove = (arr, el) => {
//   const i = arr.indexOf(el);
//   if (i > -1) {
//     arr.splice(i, 1);
//   }
// };
// const shared_esm_bundler_hasOwnProperty = Object.prototype.hasOwnProperty;
// const shared_esm_bundler_hasOwn = (val, key) => shared_esm_bundler_hasOwnProperty.call(val, key);
// const shared_esm_bundler_isArray = Array.isArray;
// const isMap = val => toTypeString(val) === '[object Map]';
// const shared_esm_bundler_isSet = val => toTypeString(val) === '[object Set]';
// const isDate = val => toTypeString(val) === '[object Date]';
// const shared_esm_bundler_isFunction = val => typeof val === 'function';
// const shared_esm_bundler_isString = val => typeof val === 'string';
// const isSymbol = val => typeof val === 'symbol';
// const shared_esm_bundler_isObject = val => val !== null && typeof val === 'object';
// const shared_esm_bundler_isPromise = val => {
//   return shared_esm_bundler_isObject(val) && shared_esm_bundler_isFunction(val.then) && shared_esm_bundler_isFunction(val.catch);
// };
// const objectToString = Object.prototype.toString;
// const toTypeString = value => objectToString.call(value);
// const shared_esm_bundler_toRawType = value => {
//   // extract "RawType" from strings like "[object RawType]"
//   return toTypeString(value).slice(8, -1);
// };
// const isPlainObject = val => toTypeString(val) === '[object Object]';
// const isIntegerKey = key => shared_esm_bundler_isString(key) && key !== 'NaN' && key[0] !== '-' && '' + parseInt(key, 10) === key;
// const shared_esm_bundler_isReservedProp = /*#__PURE__*/shared_esm_bundler_makeMap(
// // the leading comma is intentional so empty string "" is also included
// ',key,ref,ref_for,ref_key,' + 'onVnodeBeforeMount,onVnodeMounted,' + 'onVnodeBeforeUpdate,onVnodeUpdated,' + 'onVnodeBeforeUnmount,onVnodeUnmounted');
// const shared_esm_bundler_isBuiltInDirective = /*#__PURE__*/(/* unused pure expression or super */ null && (shared_esm_bundler_makeMap('bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo')));
// const cacheStringFunction = fn => {
//   const cache = Object.create(null);
//   return str => {
//     const hit = cache[str];
//     return hit || (cache[str] = fn(str));
//   };
// };
// const camelizeRE = /-(\w)/g;
// /**
//  * @private
//  */
// const camelize = cacheStringFunction(str => {
//   return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
// });
// const hyphenateRE = /\B([A-Z])/g;
// /**
//  * @private
//  */
// const shared_esm_bundler_hyphenate = cacheStringFunction(str => str.replace(hyphenateRE, '-$1').toLowerCase());
// /**
//  * @private
//  */
// const shared_esm_bundler_capitalize = cacheStringFunction(str => str.charAt(0).toUpperCase() + str.slice(1));
// /**
//  * @private
//  */
// const shared_esm_bundler_toHandlerKey = cacheStringFunction(str => str ? `on${shared_esm_bundler_capitalize(str)}` : ``);
// // compare whether a value has changed, accounting for NaN.
// const shared_esm_bundler_hasChanged = (value, oldValue) => !Object.is(value, oldValue);
// const invokeArrayFns = (fns, arg) => {
//   for (let i = 0; i < fns.length; i++) {
//     fns[i](arg);
//   }
// };
// const def = (obj, key, value) => {
//   Object.defineProperty(obj, key, {
//     configurable: true,
//     enumerable: false,
//     value
//   });
// };
// const shared_esm_bundler_toNumber = val => {
//   const n = parseFloat(val);
//   return isNaN(n) ? val : n;
// };
// let _globalThis;
// const getGlobalThis = () => {
//   return _globalThis || (_globalThis = typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : {});
// };
// const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
// function genPropsAccessExp(name) {
//   return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
// }

// // EXTERNAL MODULE: ../../node_modules/core-js/modules/es.array.unshift.js
// var es_array_unshift = __webpack_require__(1951);
// ;// CONCATENATED MODULE: ../../node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js


// function reactivity_esm_bundler_warn(msg, ...args) {
//   console.warn(`[Vue warn] ${msg}`, ...args);
// }
// let activeEffectScope;
// class EffectScope {
//   constructor(detached = false) {
//     this.detached = detached;
//     /**
//      * @internal
//      */
//     this.active = true;
//     /**
//      * @internal
//      */
//     this.effects = [];
//     /**
//      * @internal
//      */
//     this.cleanups = [];
//     this.parent = activeEffectScope;
//     if (!detached && activeEffectScope) {
//       this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
//     }
//   }
//   run(fn) {
//     if (this.active) {
//       const currentEffectScope = activeEffectScope;
//       try {
//         activeEffectScope = this;
//         return fn();
//       } finally {
//         activeEffectScope = currentEffectScope;
//       }
//     } else if (false) {}
//   }
//   /**
//    * This should only be called on non-detached scopes
//    * @internal
//    */
//   on() {
//     activeEffectScope = this;
//   }
//   /**
//    * This should only be called on non-detached scopes
//    * @internal
//    */
//   off() {
//     activeEffectScope = this.parent;
//   }
//   stop(fromParent) {
//     if (this.active) {
//       let i, l;
//       for (i = 0, l = this.effects.length; i < l; i++) {
//         this.effects[i].stop();
//       }
//       for (i = 0, l = this.cleanups.length; i < l; i++) {
//         this.cleanups[i]();
//       }
//       if (this.scopes) {
//         for (i = 0, l = this.scopes.length; i < l; i++) {
//           this.scopes[i].stop(true);
//         }
//       }
//       // nested scope, dereference from parent to avoid memory leaks
//       if (!this.detached && this.parent && !fromParent) {
//         // optimized O(1) removal
//         const last = this.parent.scopes.pop();
//         if (last && last !== this) {
//           this.parent.scopes[this.index] = last;
//           last.index = this.index;
//         }
//       }
//       this.parent = undefined;
//       this.active = false;
//     }
//   }
// }
// function effectScope(detached) {
//   return new EffectScope(detached);
// }
// function recordEffectScope(effect, scope = activeEffectScope) {
//   if (scope && scope.active) {
//     scope.effects.push(effect);
//   }
// }
// function getCurrentScope() {
//   return activeEffectScope;
// }
// function onScopeDispose(fn) {
//   if (activeEffectScope) {
//     activeEffectScope.cleanups.push(fn);
//   } else if (false) {}
// }
// const createDep = effects => {
//   const dep = new Set(effects);
//   dep.w = 0;
//   dep.n = 0;
//   return dep;
// };
// const wasTracked = dep => (dep.w & trackOpBit) > 0;
// const newTracked = dep => (dep.n & trackOpBit) > 0;
// const initDepMarkers = ({
//   deps
// }) => {
//   if (deps.length) {
//     for (let i = 0; i < deps.length; i++) {
//       deps[i].w |= trackOpBit; // set was tracked
//     }
//   }
// };

// const finalizeDepMarkers = effect => {
//   const {
//     deps
//   } = effect;
//   if (deps.length) {
//     let ptr = 0;
//     for (let i = 0; i < deps.length; i++) {
//       const dep = deps[i];
//       if (wasTracked(dep) && !newTracked(dep)) {
//         dep.delete(effect);
//       } else {
//         deps[ptr++] = dep;
//       }
//       // clear bits
//       dep.w &= ~trackOpBit;
//       dep.n &= ~trackOpBit;
//     }
//     deps.length = ptr;
//   }
// };
// const targetMap = new WeakMap();
// // The number of effects currently being tracked recursively.
// let effectTrackDepth = 0;
// let trackOpBit = 1;
// /**
//  * The bitwise track markers support at most 30 levels of recursion.
//  * This value is chosen to enable modern JS engines to use a SMI on all platforms.
//  * When recursion depth is greater, fall back to using a full cleanup.
//  */
// const maxMarkerBits = 30;
// let activeEffect;
// const ITERATE_KEY = Symbol( false ? 0 : '');
// const MAP_KEY_ITERATE_KEY = Symbol( false ? 0 : '');
// class ReactiveEffect {
//   constructor(fn, scheduler = null, scope) {
//     this.fn = fn;
//     this.scheduler = scheduler;
//     this.active = true;
//     this.deps = [];
//     this.parent = undefined;
//     recordEffectScope(this, scope);
//   }
//   run() {
//     if (!this.active) {
//       return this.fn();
//     }
//     let parent = activeEffect;
//     let lastShouldTrack = shouldTrack;
//     while (parent) {
//       if (parent === this) {
//         return;
//       }
//       parent = parent.parent;
//     }
//     try {
//       this.parent = activeEffect;
//       activeEffect = this;
//       shouldTrack = true;
//       trackOpBit = 1 << ++effectTrackDepth;
//       if (effectTrackDepth <= maxMarkerBits) {
//         initDepMarkers(this);
//       } else {
//         cleanupEffect(this);
//       }
//       return this.fn();
//     } finally {
//       if (effectTrackDepth <= maxMarkerBits) {
//         finalizeDepMarkers(this);
//       }
//       trackOpBit = 1 << --effectTrackDepth;
//       activeEffect = this.parent;
//       shouldTrack = lastShouldTrack;
//       this.parent = undefined;
//       if (this.deferStop) {
//         this.stop();
//       }
//     }
//   }
//   stop() {
//     // stopped while running itself - defer the cleanup
//     if (activeEffect === this) {
//       this.deferStop = true;
//     } else if (this.active) {
//       cleanupEffect(this);
//       if (this.onStop) {
//         this.onStop();
//       }
//       this.active = false;
//     }
//   }
// }
// function cleanupEffect(effect) {
//   const {
//     deps
//   } = effect;
//   if (deps.length) {
//     for (let i = 0; i < deps.length; i++) {
//       deps[i].delete(effect);
//     }
//     deps.length = 0;
//   }
// }
// function effect(fn, options) {
//   if (fn.effect) {
//     fn = fn.effect.fn;
//   }
//   const _effect = new ReactiveEffect(fn);
//   if (options) {
//     extend(_effect, options);
//     if (options.scope) recordEffectScope(_effect, options.scope);
//   }
//   if (!options || !options.lazy) {
//     _effect.run();
//   }
//   const runner = _effect.run.bind(_effect);
//   runner.effect = _effect;
//   return runner;
// }
// function stop(runner) {
//   runner.effect.stop();
// }
// let shouldTrack = true;
// const trackStack = [];
// function pauseTracking() {
//   trackStack.push(shouldTrack);
//   shouldTrack = false;
// }
// function enableTracking() {
//   trackStack.push(shouldTrack);
//   shouldTrack = true;
// }
// function resetTracking() {
//   const last = trackStack.pop();
//   shouldTrack = last === undefined ? true : last;
// }
// function track(target, type, key) {
//   if (shouldTrack && activeEffect) {
//     let depsMap = targetMap.get(target);
//     if (!depsMap) {
//       targetMap.set(target, depsMap = new Map());
//     }
//     let dep = depsMap.get(key);
//     if (!dep) {
//       depsMap.set(key, dep = createDep());
//     }
//     const eventInfo =  false ? 0 : undefined;
//     trackEffects(dep, eventInfo);
//   }
// }
// function trackEffects(dep, debuggerEventExtraInfo) {
//   let shouldTrack = false;
//   if (effectTrackDepth <= maxMarkerBits) {
//     if (!newTracked(dep)) {
//       dep.n |= trackOpBit; // set newly tracked
//       shouldTrack = !wasTracked(dep);
//     }
//   } else {
//     // Full cleanup mode.
//     shouldTrack = !dep.has(activeEffect);
//   }
//   if (shouldTrack) {
//     dep.add(activeEffect);
//     activeEffect.deps.push(dep);
//     if (false) {}
//   }
// }
// function trigger(target, type, key, newValue, oldValue, oldTarget) {
//   const depsMap = targetMap.get(target);
//   if (!depsMap) {
//     // never been tracked
//     return;
//   }
//   let deps = [];
//   if (type === "clear" /* TriggerOpTypes.CLEAR */) {
//     // collection being cleared
//     // trigger all effects for target
//     deps = [...depsMap.values()];
//   } else if (key === 'length' && shared_esm_bundler_isArray(target)) {
//     const newLength = shared_esm_bundler_toNumber(newValue);
//     depsMap.forEach((dep, key) => {
//       if (key === 'length' || key >= newLength) {
//         deps.push(dep);
//       }
//     });
//   } else {
//     // schedule runs for SET | ADD | DELETE
//     if (key !== void 0) {
//       deps.push(depsMap.get(key));
//     }
//     // also run for iteration key on ADD | DELETE | Map.SET
//     switch (type) {
//       case "add" /* TriggerOpTypes.ADD */:
//         if (!shared_esm_bundler_isArray(target)) {
//           deps.push(depsMap.get(ITERATE_KEY));
//           if (isMap(target)) {
//             deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
//           }
//         } else if (isIntegerKey(key)) {
//           // new index added to array -> length changes
//           deps.push(depsMap.get('length'));
//         }
//         break;
//       case "delete" /* TriggerOpTypes.DELETE */:
//         if (!shared_esm_bundler_isArray(target)) {
//           deps.push(depsMap.get(ITERATE_KEY));
//           if (isMap(target)) {
//             deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
//           }
//         }
//         break;
//       case "set" /* TriggerOpTypes.SET */:
//         if (isMap(target)) {
//           deps.push(depsMap.get(ITERATE_KEY));
//         }
//         break;
//     }
//   }
//   const eventInfo =  false ? 0 : undefined;
//   if (deps.length === 1) {
//     if (deps[0]) {
//       if (false) {} else {
//         triggerEffects(deps[0]);
//       }
//     }
//   } else {
//     const effects = [];
//     for (const dep of deps) {
//       if (dep) {
//         effects.push(...dep);
//       }
//     }
//     if (false) {} else {
//       triggerEffects(createDep(effects));
//     }
//   }
// }
// function triggerEffects(dep, debuggerEventExtraInfo) {
//   // spread into array for stabilization
//   const effects = shared_esm_bundler_isArray(dep) ? dep : [...dep];
//   for (const effect of effects) {
//     if (effect.computed) {
//       triggerEffect(effect, debuggerEventExtraInfo);
//     }
//   }
//   for (const effect of effects) {
//     if (!effect.computed) {
//       triggerEffect(effect, debuggerEventExtraInfo);
//     }
//   }
// }
// function triggerEffect(effect, debuggerEventExtraInfo) {
//   if (effect !== activeEffect || effect.allowRecurse) {
//     if (false) {}
//     if (effect.scheduler) {
//       effect.scheduler();
//     } else {
//       effect.run();
//     }
//   }
// }
// const isNonTrackableKeys = /*#__PURE__*/shared_esm_bundler_makeMap(`__proto__,__v_isRef,__isVue`);
// const builtInSymbols = new Set( /*#__PURE__*/
// Object.getOwnPropertyNames(Symbol)
// // ios10.x Object.getOwnPropertyNames(Symbol) can enumerate 'arguments' and 'caller'
// // but accessing them on Symbol leads to TypeError because Symbol is a strict mode
// // function
// .filter(key => key !== 'arguments' && key !== 'caller').map(key => Symbol[key]).filter(isSymbol));
// const get = /*#__PURE__*/createGetter();
// const shallowGet = /*#__PURE__*/createGetter(false, true);
// const readonlyGet = /*#__PURE__*/createGetter(true);
// const shallowReadonlyGet = /*#__PURE__*/createGetter(true, true);
// const arrayInstrumentations = /*#__PURE__*/createArrayInstrumentations();
// function createArrayInstrumentations() {
//   const instrumentations = {};
//   ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
//     instrumentations[key] = function (...args) {
//       const arr = reactivity_esm_bundler_toRaw(this);
//       for (let i = 0, l = this.length; i < l; i++) {
//         track(arr, "get" /* TrackOpTypes.GET */, i + '');
//       }
//       // we run the method using the original args first (which may be reactive)
//       const res = arr[key](...args);
//       if (res === -1 || res === false) {
//         // if that didn't work, run it again using raw values.
//         return arr[key](...args.map(reactivity_esm_bundler_toRaw));
//       } else {
//         return res;
//       }
//     };
//   });
//   ['push', 'pop', 'shift', 'unshift', 'splice'].forEach(key => {
//     instrumentations[key] = function (...args) {
//       pauseTracking();
//       const res = reactivity_esm_bundler_toRaw(this)[key].apply(this, args);
//       resetTracking();
//       return res;
//     };
//   });
//   return instrumentations;
// }
// function createGetter(isReadonly = false, shallow = false) {
//   return function get(target, key, receiver) {
//     if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
//       return !isReadonly;
//     } else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
//       return isReadonly;
//     } else if (key === "__v_isShallow" /* ReactiveFlags.IS_SHALLOW */) {
//       return shallow;
//     } else if (key === "__v_raw" /* ReactiveFlags.RAW */ && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
//       return target;
//     }
//     const targetIsArray = shared_esm_bundler_isArray(target);
//     if (!isReadonly && targetIsArray && shared_esm_bundler_hasOwn(arrayInstrumentations, key)) {
//       return Reflect.get(arrayInstrumentations, key, receiver);
//     }
//     const res = Reflect.get(target, key, receiver);
//     if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
//       return res;
//     }
//     if (!isReadonly) {
//       track(target, "get" /* TrackOpTypes.GET */, key);
//     }
//     if (shallow) {
//       return res;
//     }
//     if (reactivity_esm_bundler_isRef(res)) {
//       // ref unwrapping - skip unwrap for Array + integer key.
//       return targetIsArray && isIntegerKey(key) ? res : res.value;
//     }
//     if (shared_esm_bundler_isObject(res)) {
//       // Convert returned value into a proxy as well. we do the isObject check
//       // here to avoid invalid value warning. Also need to lazy access readonly
//       // and reactive here to avoid circular dependency.
//       return isReadonly ? readonly(res) : reactive(res);
//     }
//     return res;
//   };
// }
// const set = /*#__PURE__*/createSetter();
// const shallowSet = /*#__PURE__*/createSetter(true);
// function createSetter(shallow = false) {
//   return function set(target, key, value, receiver) {
//     let oldValue = target[key];
//     if (reactivity_esm_bundler_isReadonly(oldValue) && reactivity_esm_bundler_isRef(oldValue) && !reactivity_esm_bundler_isRef(value)) {
//       return false;
//     }
//     if (!shallow) {
//       if (!isShallow(value) && !reactivity_esm_bundler_isReadonly(value)) {
//         oldValue = reactivity_esm_bundler_toRaw(oldValue);
//         value = reactivity_esm_bundler_toRaw(value);
//       }
//       if (!shared_esm_bundler_isArray(target) && reactivity_esm_bundler_isRef(oldValue) && !reactivity_esm_bundler_isRef(value)) {
//         oldValue.value = value;
//         return true;
//       }
//     }
//     const hadKey = shared_esm_bundler_isArray(target) && isIntegerKey(key) ? Number(key) < target.length : shared_esm_bundler_hasOwn(target, key);
//     const result = Reflect.set(target, key, value, receiver);
//     // don't trigger if target is something up in the prototype chain of original
//     if (target === reactivity_esm_bundler_toRaw(receiver)) {
//       if (!hadKey) {
//         trigger(target, "add" /* TriggerOpTypes.ADD */, key, value);
//       } else if (shared_esm_bundler_hasChanged(value, oldValue)) {
//         trigger(target, "set" /* TriggerOpTypes.SET */, key, value, oldValue);
//       }
//     }
//     return result;
//   };
// }
// function deleteProperty(target, key) {
//   const hadKey = shared_esm_bundler_hasOwn(target, key);
//   const oldValue = target[key];
//   const result = Reflect.deleteProperty(target, key);
//   if (result && hadKey) {
//     trigger(target, "delete" /* TriggerOpTypes.DELETE */, key, undefined, oldValue);
//   }
//   return result;
// }
// function has(target, key) {
//   const result = Reflect.has(target, key);
//   if (!isSymbol(key) || !builtInSymbols.has(key)) {
//     track(target, "has" /* TrackOpTypes.HAS */, key);
//   }
//   return result;
// }
// function ownKeys(target) {
//   track(target, "iterate" /* TrackOpTypes.ITERATE */, shared_esm_bundler_isArray(target) ? 'length' : ITERATE_KEY);
//   return Reflect.ownKeys(target);
// }
// const mutableHandlers = {
//   get,
//   set,
//   deleteProperty,
//   has,
//   ownKeys
// };
// const readonlyHandlers = {
//   get: readonlyGet,
//   set(target, key) {
//     if (false) {}
//     return true;
//   },
//   deleteProperty(target, key) {
//     if (false) {}
//     return true;
//   }
// };
// const shallowReactiveHandlers = /*#__PURE__*/shared_esm_bundler_extend({}, mutableHandlers, {
//   get: shallowGet,
//   set: shallowSet
// });
// // Props handlers are special in the sense that it should not unwrap top-level
// // refs (in order to allow refs to be explicitly passed down), but should
// // retain the reactivity of the normal readonly object.
// const shallowReadonlyHandlers = /*#__PURE__*/shared_esm_bundler_extend({}, readonlyHandlers, {
//   get: shallowReadonlyGet
// });
// const toShallow = value => value;
// const getProto = v => Reflect.getPrototypeOf(v);
// function get$1(target, key, isReadonly = false, isShallow = false) {
//   // #1772: readonly(reactive(Map)) should return readonly + reactive version
//   // of the value
//   target = target["__v_raw" /* ReactiveFlags.RAW */];
//   const rawTarget = reactivity_esm_bundler_toRaw(target);
//   const rawKey = reactivity_esm_bundler_toRaw(key);
//   if (!isReadonly) {
//     if (key !== rawKey) {
//       track(rawTarget, "get" /* TrackOpTypes.GET */, key);
//     }
//     track(rawTarget, "get" /* TrackOpTypes.GET */, rawKey);
//   }
//   const {
//     has
//   } = getProto(rawTarget);
//   const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
//   if (has.call(rawTarget, key)) {
//     return wrap(target.get(key));
//   } else if (has.call(rawTarget, rawKey)) {
//     return wrap(target.get(rawKey));
//   } else if (target !== rawTarget) {
//     // #3602 readonly(reactive(Map))
//     // ensure that the nested reactive `Map` can do tracking for itself
//     target.get(key);
//   }
// }
// function has$1(key, isReadonly = false) {
//   const target = this["__v_raw" /* ReactiveFlags.RAW */];
//   const rawTarget = reactivity_esm_bundler_toRaw(target);
//   const rawKey = reactivity_esm_bundler_toRaw(key);
//   if (!isReadonly) {
//     if (key !== rawKey) {
//       track(rawTarget, "has" /* TrackOpTypes.HAS */, key);
//     }
//     track(rawTarget, "has" /* TrackOpTypes.HAS */, rawKey);
//   }
//   return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
// }
// function size(target, isReadonly = false) {
//   target = target["__v_raw" /* ReactiveFlags.RAW */];
//   !isReadonly && track(reactivity_esm_bundler_toRaw(target), "iterate" /* TrackOpTypes.ITERATE */, ITERATE_KEY);
//   return Reflect.get(target, 'size', target);
// }
// function add(value) {
//   value = reactivity_esm_bundler_toRaw(value);
//   const target = reactivity_esm_bundler_toRaw(this);
//   const proto = getProto(target);
//   const hadKey = proto.has.call(target, value);
//   if (!hadKey) {
//     target.add(value);
//     trigger(target, "add" /* TriggerOpTypes.ADD */, value, value);
//   }
//   return this;
// }
// function set$1(key, value) {
//   value = reactivity_esm_bundler_toRaw(value);
//   const target = reactivity_esm_bundler_toRaw(this);
//   const {
//     has,
//     get
//   } = getProto(target);
//   let hadKey = has.call(target, key);
//   if (!hadKey) {
//     key = reactivity_esm_bundler_toRaw(key);
//     hadKey = has.call(target, key);
//   } else if (false) {}
//   const oldValue = get.call(target, key);
//   target.set(key, value);
//   if (!hadKey) {
//     trigger(target, "add" /* TriggerOpTypes.ADD */, key, value);
//   } else if (shared_esm_bundler_hasChanged(value, oldValue)) {
//     trigger(target, "set" /* TriggerOpTypes.SET */, key, value, oldValue);
//   }
//   return this;
// }
// function deleteEntry(key) {
//   const target = reactivity_esm_bundler_toRaw(this);
//   const {
//     has,
//     get
//   } = getProto(target);
//   let hadKey = has.call(target, key);
//   if (!hadKey) {
//     key = reactivity_esm_bundler_toRaw(key);
//     hadKey = has.call(target, key);
//   } else if (false) {}
//   const oldValue = get ? get.call(target, key) : undefined;
//   // forward the operation before queueing reactions
//   const result = target.delete(key);
//   if (hadKey) {
//     trigger(target, "delete" /* TriggerOpTypes.DELETE */, key, undefined, oldValue);
//   }
//   return result;
// }
// function clear() {
//   const target = reactivity_esm_bundler_toRaw(this);
//   const hadItems = target.size !== 0;
//   const oldTarget =  false ? 0 : undefined;
//   // forward the operation before queueing reactions
//   const result = target.clear();
//   if (hadItems) {
//     trigger(target, "clear" /* TriggerOpTypes.CLEAR */, undefined, undefined, oldTarget);
//   }
//   return result;
// }
// function createForEach(isReadonly, isShallow) {
//   return function forEach(callback, thisArg) {
//     const observed = this;
//     const target = observed["__v_raw" /* ReactiveFlags.RAW */];
//     const rawTarget = reactivity_esm_bundler_toRaw(target);
//     const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
//     !isReadonly && track(rawTarget, "iterate" /* TrackOpTypes.ITERATE */, ITERATE_KEY);
//     return target.forEach((value, key) => {
//       // important: make sure the callback is
//       // 1. invoked with the reactive map as `this` and 3rd arg
//       // 2. the value received should be a corresponding reactive/readonly.
//       return callback.call(thisArg, wrap(value), wrap(key), observed);
//     });
//   };
// }
// function createIterableMethod(method, isReadonly, isShallow) {
//   return function (...args) {
//     const target = this["__v_raw" /* ReactiveFlags.RAW */];
//     const rawTarget = reactivity_esm_bundler_toRaw(target);
//     const targetIsMap = isMap(rawTarget);
//     const isPair = method === 'entries' || method === Symbol.iterator && targetIsMap;
//     const isKeyOnly = method === 'keys' && targetIsMap;
//     const innerIterator = target[method](...args);
//     const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
//     !isReadonly && track(rawTarget, "iterate" /* TrackOpTypes.ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
//     // return a wrapped iterator which returns observed versions of the
//     // values emitted from the real iterator
//     return {
//       // iterator protocol
//       next() {
//         const {
//           value,
//           done
//         } = innerIterator.next();
//         return done ? {
//           value,
//           done
//         } : {
//           value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
//           done
//         };
//       },
//       // iterable protocol
//       [Symbol.iterator]() {
//         return this;
//       }
//     };
//   };
// }
// function createReadonlyMethod(type) {
//   return function (...args) {
//     if (false) {}
//     return type === "delete" /* TriggerOpTypes.DELETE */ ? false : this;
//   };
// }
// function createInstrumentations() {
//   const mutableInstrumentations = {
//     get(key) {
//       return get$1(this, key);
//     },
//     get size() {
//       return size(this);
//     },
//     has: has$1,
//     add,
//     set: set$1,
//     delete: deleteEntry,
//     clear,
//     forEach: createForEach(false, false)
//   };
//   const shallowInstrumentations = {
//     get(key) {
//       return get$1(this, key, false, true);
//     },
//     get size() {
//       return size(this);
//     },
//     has: has$1,
//     add,
//     set: set$1,
//     delete: deleteEntry,
//     clear,
//     forEach: createForEach(false, true)
//   };
//   const readonlyInstrumentations = {
//     get(key) {
//       return get$1(this, key, true);
//     },
//     get size() {
//       return size(this, true);
//     },
//     has(key) {
//       return has$1.call(this, key, true);
//     },
//     add: createReadonlyMethod("add" /* TriggerOpTypes.ADD */),
//     set: createReadonlyMethod("set" /* TriggerOpTypes.SET */),
//     delete: createReadonlyMethod("delete" /* TriggerOpTypes.DELETE */),
//     clear: createReadonlyMethod("clear" /* TriggerOpTypes.CLEAR */),
//     forEach: createForEach(true, false)
//   };
//   const shallowReadonlyInstrumentations = {
//     get(key) {
//       return get$1(this, key, true, true);
//     },
//     get size() {
//       return size(this, true);
//     },
//     has(key) {
//       return has$1.call(this, key, true);
//     },
//     add: createReadonlyMethod("add" /* TriggerOpTypes.ADD */),
//     set: createReadonlyMethod("set" /* TriggerOpTypes.SET */),
//     delete: createReadonlyMethod("delete" /* TriggerOpTypes.DELETE */),
//     clear: createReadonlyMethod("clear" /* TriggerOpTypes.CLEAR */),
//     forEach: createForEach(true, true)
//   };
//   const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
//   iteratorMethods.forEach(method => {
//     mutableInstrumentations[method] = createIterableMethod(method, false, false);
//     readonlyInstrumentations[method] = createIterableMethod(method, true, false);
//     shallowInstrumentations[method] = createIterableMethod(method, false, true);
//     shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
//   });
//   return [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations];
// }
// const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* #__PURE__*/createInstrumentations();
// function createInstrumentationGetter(isReadonly, shallow) {
//   const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
//   return (target, key, receiver) => {
//     if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
//       return !isReadonly;
//     } else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
//       return isReadonly;
//     } else if (key === "__v_raw" /* ReactiveFlags.RAW */) {
//       return target;
//     }
//     return Reflect.get(shared_esm_bundler_hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
//   };
// }
// const mutableCollectionHandlers = {
//   get: /*#__PURE__*/createInstrumentationGetter(false, false)
// };
// const shallowCollectionHandlers = {
//   get: /*#__PURE__*/createInstrumentationGetter(false, true)
// };
// const readonlyCollectionHandlers = {
//   get: /*#__PURE__*/createInstrumentationGetter(true, false)
// };
// const shallowReadonlyCollectionHandlers = {
//   get: /*#__PURE__*/createInstrumentationGetter(true, true)
// };
// function checkIdentityKeys(target, has, key) {
//   const rawKey = reactivity_esm_bundler_toRaw(key);
//   if (rawKey !== key && has.call(target, rawKey)) {
//     const type = toRawType(target);
//     console.warn(`Reactive ${type} contains both the raw and reactive ` + `versions of the same object${type === `Map` ? ` as keys` : ``}, ` + `which can lead to inconsistencies. ` + `Avoid differentiating between the raw and reactive versions ` + `of an object and only use the reactive version if possible.`);
//   }
// }
// const reactiveMap = new WeakMap();
// const shallowReactiveMap = new WeakMap();
// const readonlyMap = new WeakMap();
// const shallowReadonlyMap = new WeakMap();
// function targetTypeMap(rawType) {
//   switch (rawType) {
//     case 'Object':
//     case 'Array':
//       return 1 /* TargetType.COMMON */;
//     case 'Map':
//     case 'Set':
//     case 'WeakMap':
//     case 'WeakSet':
//       return 2 /* TargetType.COLLECTION */;
//     default:
//       return 0 /* TargetType.INVALID */;
//   }
// }

// function getTargetType(value) {
//   return value["__v_skip" /* ReactiveFlags.SKIP */] || !Object.isExtensible(value) ? 0 /* TargetType.INVALID */ : targetTypeMap(shared_esm_bundler_toRawType(value));
// }
// function reactive(target) {
//   // if trying to observe a readonly proxy, return the readonly version.
//   if (reactivity_esm_bundler_isReadonly(target)) {
//     return target;
//   }
//   return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
// }
// /**
//  * Return a shallowly-reactive copy of the original object, where only the root
//  * level properties are reactive. It also does not auto-unwrap refs (even at the
//  * root level).
//  */
// function shallowReactive(target) {
//   return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
// }
// /**
//  * Creates a readonly copy of the original object. Note the returned copy is not
//  * made reactive, but `readonly` can be called on an already reactive object.
//  */
// function readonly(target) {
//   return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
// }
// /**
//  * Returns a reactive-copy of the original object, where only the root level
//  * properties are readonly, and does NOT unwrap refs nor recursively convert
//  * returned properties.
//  * This is used for creating the props proxy object for stateful components.
//  */
// function shallowReadonly(target) {
//   return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
// }
// function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
//   if (!shared_esm_bundler_isObject(target)) {
//     if (false) {}
//     return target;
//   }
//   // target is already a Proxy, return it.
//   // exception: calling readonly() on a reactive object
//   if (target["__v_raw" /* ReactiveFlags.RAW */] && !(isReadonly && target["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */])) {
//     return target;
//   }
//   // target already has corresponding Proxy
//   const existingProxy = proxyMap.get(target);
//   if (existingProxy) {
//     return existingProxy;
//   }
//   // only specific value types can be observed.
//   const targetType = getTargetType(target);
//   if (targetType === 0 /* TargetType.INVALID */) {
//     return target;
//   }
//   const proxy = new Proxy(target, targetType === 2 /* TargetType.COLLECTION */ ? collectionHandlers : baseHandlers);
//   proxyMap.set(target, proxy);
//   return proxy;
// }
// function reactivity_esm_bundler_isReactive(value) {
//   if (reactivity_esm_bundler_isReadonly(value)) {
//     return reactivity_esm_bundler_isReactive(value["__v_raw" /* ReactiveFlags.RAW */]);
//   }

//   return !!(value && value["__v_isReactive" /* ReactiveFlags.IS_REACTIVE */]);
// }

// function reactivity_esm_bundler_isReadonly(value) {
//   return !!(value && value["__v_isReadonly" /* ReactiveFlags.IS_READONLY */]);
// }

// function isShallow(value) {
//   return !!(value && value["__v_isShallow" /* ReactiveFlags.IS_SHALLOW */]);
// }

// function isProxy(value) {
//   return reactivity_esm_bundler_isReactive(value) || reactivity_esm_bundler_isReadonly(value);
// }
// function reactivity_esm_bundler_toRaw(observed) {
//   const raw = observed && observed["__v_raw" /* ReactiveFlags.RAW */];
//   return raw ? reactivity_esm_bundler_toRaw(raw) : observed;
// }
// function markRaw(value) {
//   def(value, "__v_skip" /* ReactiveFlags.SKIP */, true);
//   return value;
// }
// const toReactive = value => shared_esm_bundler_isObject(value) ? reactive(value) : value;
// const toReadonly = value => shared_esm_bundler_isObject(value) ? readonly(value) : value;
// function trackRefValue(ref) {
//   if (shouldTrack && activeEffect) {
//     ref = reactivity_esm_bundler_toRaw(ref);
//     if (false) {} else {
//       trackEffects(ref.dep || (ref.dep = createDep()));
//     }
//   }
// }
// function triggerRefValue(ref, newVal) {
//   ref = reactivity_esm_bundler_toRaw(ref);
//   if (ref.dep) {
//     if (false) {} else {
//       triggerEffects(ref.dep);
//     }
//   }
// }
// function reactivity_esm_bundler_isRef(r) {
//   return !!(r && r.__v_isRef === true);
// }
// function reactivity_esm_bundler_ref(value) {
//   return createRef(value, false);
// }
// function shallowRef(value) {
//   return createRef(value, true);
// }
// function createRef(rawValue, shallow) {
//   if (reactivity_esm_bundler_isRef(rawValue)) {
//     return rawValue;
//   }
//   return new RefImpl(rawValue, shallow);
// }
// class RefImpl {
//   constructor(value, __v_isShallow) {
//     this.__v_isShallow = __v_isShallow;
//     this.dep = undefined;
//     this.__v_isRef = true;
//     this._rawValue = __v_isShallow ? value : reactivity_esm_bundler_toRaw(value);
//     this._value = __v_isShallow ? value : toReactive(value);
//   }
//   get value() {
//     trackRefValue(this);
//     return this._value;
//   }
//   set value(newVal) {
//     const useDirectValue = this.__v_isShallow || isShallow(newVal) || reactivity_esm_bundler_isReadonly(newVal);
//     newVal = useDirectValue ? newVal : reactivity_esm_bundler_toRaw(newVal);
//     if (shared_esm_bundler_hasChanged(newVal, this._rawValue)) {
//       this._rawValue = newVal;
//       this._value = useDirectValue ? newVal : toReactive(newVal);
//       triggerRefValue(this, newVal);
//     }
//   }
// }
// function triggerRef(ref) {
//   triggerRefValue(ref,  false ? 0 : void 0);
// }
// function unref(ref) {
//   return reactivity_esm_bundler_isRef(ref) ? ref.value : ref;
// }
// const shallowUnwrapHandlers = {
//   get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
//   set: (target, key, value, receiver) => {
//     const oldValue = target[key];
//     if (reactivity_esm_bundler_isRef(oldValue) && !reactivity_esm_bundler_isRef(value)) {
//       oldValue.value = value;
//       return true;
//     } else {
//       return Reflect.set(target, key, value, receiver);
//     }
//   }
// };
// function proxyRefs(objectWithRefs) {
//   return reactivity_esm_bundler_isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
// }
// class CustomRefImpl {
//   constructor(factory) {
//     this.dep = undefined;
//     this.__v_isRef = true;
//     const {
//       get,
//       set
//     } = factory(() => trackRefValue(this), () => triggerRefValue(this));
//     this._get = get;
//     this._set = set;
//   }
//   get value() {
//     return this._get();
//   }
//   set value(newVal) {
//     this._set(newVal);
//   }
// }
// function customRef(factory) {
//   return new CustomRefImpl(factory);
// }
// function toRefs(object) {
//   if (false) {}
//   const ret = isArray(object) ? new Array(object.length) : {};
//   for (const key in object) {
//     ret[key] = toRef(object, key);
//   }
//   return ret;
// }
// class ObjectRefImpl {
//   constructor(_object, _key, _defaultValue) {
//     this._object = _object;
//     this._key = _key;
//     this._defaultValue = _defaultValue;
//     this.__v_isRef = true;
//   }
//   get value() {
//     const val = this._object[this._key];
//     return val === undefined ? this._defaultValue : val;
//   }
//   set value(newVal) {
//     this._object[this._key] = newVal;
//   }
// }
// function toRef(object, key, defaultValue) {
//   const val = object[key];
//   return reactivity_esm_bundler_isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
// }
// var _a;
// class ComputedRefImpl {
//   constructor(getter, _setter, isReadonly, isSSR) {
//     this._setter = _setter;
//     this.dep = undefined;
//     this.__v_isRef = true;
//     this[_a] = false;
//     this._dirty = true;
//     this.effect = new ReactiveEffect(getter, () => {
//       if (!this._dirty) {
//         this._dirty = true;
//         triggerRefValue(this);
//       }
//     });
//     this.effect.computed = this;
//     this.effect.active = this._cacheable = !isSSR;
//     this["__v_isReadonly" /* ReactiveFlags.IS_READONLY */] = isReadonly;
//   }
//   get value() {
//     // the computed ref may get wrapped by other proxies e.g. readonly() #3376
//     const self = reactivity_esm_bundler_toRaw(this);
//     trackRefValue(self);
//     if (self._dirty || !self._cacheable) {
//       self._dirty = false;
//       self._value = self.effect.run();
//     }
//     return self._value;
//   }
//   set value(newValue) {
//     this._setter(newValue);
//   }
// }
// _a = "__v_isReadonly" /* ReactiveFlags.IS_READONLY */;
// function computed(getterOrOptions, debugOptions, isSSR = false) {
//   let getter;
//   let setter;
//   const onlyGetter = shared_esm_bundler_isFunction(getterOrOptions);
//   if (onlyGetter) {
//     getter = getterOrOptions;
//     setter =  false ? 0 : shared_esm_bundler_NOOP;
//   } else {
//     getter = getterOrOptions.get;
//     setter = getterOrOptions.set;
//   }
//   const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
//   if (false) {}
//   return cRef;
// }
// var _a$1;
// const tick = /*#__PURE__*/(/* unused pure expression or super */ null && (Promise.resolve()));
// const queue = (/* unused pure expression or super */ null && ([]));
// let queued = false;
// const scheduler = fn => {
//   queue.push(fn);
//   if (!queued) {
//     queued = true;
//     tick.then(flush);
//   }
// };
// const flush = () => {
//   for (let i = 0; i < queue.length; i++) {
//     queue[i]();
//   }
//   queue.length = 0;
//   queued = false;
// };
// class DeferredComputedRefImpl {
//   constructor(getter) {
//     this.dep = undefined;
//     this._dirty = true;
//     this.__v_isRef = true;
//     this[_a$1] = true;
//     let compareTarget;
//     let hasCompareTarget = false;
//     let scheduled = false;
//     this.effect = new ReactiveEffect(getter, computedTrigger => {
//       if (this.dep) {
//         if (computedTrigger) {
//           compareTarget = this._value;
//           hasCompareTarget = true;
//         } else if (!scheduled) {
//           const valueToCompare = hasCompareTarget ? compareTarget : this._value;
//           scheduled = true;
//           hasCompareTarget = false;
//           scheduler(() => {
//             if (this.effect.active && this._get() !== valueToCompare) {
//               triggerRefValue(this);
//             }
//             scheduled = false;
//           });
//         }
//         // chained upstream computeds are notified synchronously to ensure
//         // value invalidation in case of sync access; normal effects are
//         // deferred to be triggered in scheduler.
//         for (const e of this.dep) {
//           if (e.computed instanceof DeferredComputedRefImpl) {
//             e.scheduler(true /* computedTrigger */);
//           }
//         }
//       }

//       this._dirty = true;
//     });
//     this.effect.computed = this;
//   }
//   _get() {
//     if (this._dirty) {
//       this._dirty = false;
//       return this._value = this.effect.run();
//     }
//     return this._value;
//   }
//   get value() {
//     trackRefValue(this);
//     // the computed ref may get wrapped by other proxies e.g. readonly() #3376
//     return reactivity_esm_bundler_toRaw(this)._get();
//   }
// }
// _a$1 = "__v_isReadonly" /* ReactiveFlags.IS_READONLY */;
// function deferredComputed(getter) {
//   return new DeferredComputedRefImpl(getter);
// }

// ;// CONCATENATED MODULE: ../../node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js






// const stack = [];
// function pushWarningContext(vnode) {
//   stack.push(vnode);
// }
// function popWarningContext() {
//   stack.pop();
// }
// function runtime_core_esm_bundler_warn(msg, ...args) {
//   if (true) return;
//   // avoid props formatting or warn handler tracking deps that might be mutated
//   // during patch, leading to infinite recursion.
//   pauseTracking();
//   const instance = stack.length ? stack[stack.length - 1].component : null;
//   const appWarnHandler = instance && instance.appContext.config.warnHandler;
//   const trace = getComponentTrace();
//   if (appWarnHandler) {
//     callWithErrorHandling(appWarnHandler, instance, 11 /* ErrorCodes.APP_WARN_HANDLER */, [msg + args.join(''), instance && instance.proxy, trace.map(({
//       vnode
//     }) => `at <${formatComponentName(instance, vnode.type)}>`).join('\n'), trace]);
//   } else {
//     const warnArgs = [`[Vue warn]: ${msg}`, ...args];
//     /* istanbul ignore if */
//     if (trace.length &&
//     // avoid spamming console during tests
//     !false) {
//       warnArgs.push(`\n`, ...formatTrace(trace));
//     }
//     console.warn(...warnArgs);
//   }
//   resetTracking();
// }
// function getComponentTrace() {
//   let currentVNode = stack[stack.length - 1];
//   if (!currentVNode) {
//     return [];
//   }
//   // we can't just use the stack because it will be incomplete during updates
//   // that did not start from the root. Re-construct the parent chain using
//   // instance parent pointers.
//   const normalizedStack = [];
//   while (currentVNode) {
//     const last = normalizedStack[0];
//     if (last && last.vnode === currentVNode) {
//       last.recurseCount++;
//     } else {
//       normalizedStack.push({
//         vnode: currentVNode,
//         recurseCount: 0
//       });
//     }
//     const parentInstance = currentVNode.component && currentVNode.component.parent;
//     currentVNode = parentInstance && parentInstance.vnode;
//   }
//   return normalizedStack;
// }
// /* istanbul ignore next */
// function formatTrace(trace) {
//   const logs = [];
//   trace.forEach((entry, i) => {
//     logs.push(...(i === 0 ? [] : [`\n`]), ...formatTraceEntry(entry));
//   });
//   return logs;
// }
// function formatTraceEntry({
//   vnode,
//   recurseCount
// }) {
//   const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
//   const isRoot = vnode.component ? vnode.component.parent == null : false;
//   const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
//   const close = `>` + postfix;
//   return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
// }
// /* istanbul ignore next */
// function formatProps(props) {
//   const res = [];
//   const keys = Object.keys(props);
//   keys.slice(0, 3).forEach(key => {
//     res.push(...formatProp(key, props[key]));
//   });
//   if (keys.length > 3) {
//     res.push(` ...`);
//   }
//   return res;
// }
// /* istanbul ignore next */
// function formatProp(key, value, raw) {
//   if (shared_esm_bundler_isString(value)) {
//     value = JSON.stringify(value);
//     return raw ? value : [`${key}=${value}`];
//   } else if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
//     return raw ? value : [`${key}=${value}`];
//   } else if (reactivity_esm_bundler_isRef(value)) {
//     value = formatProp(key, reactivity_esm_bundler_toRaw(value.value), true);
//     return raw ? value : [`${key}=Ref<`, value, `>`];
//   } else if (shared_esm_bundler_isFunction(value)) {
//     return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
//   } else {
//     value = reactivity_esm_bundler_toRaw(value);
//     return raw ? value : [`${key}=`, value];
//   }
// }
// const ErrorTypeStrings = {
//   ["sp" /* LifecycleHooks.SERVER_PREFETCH */]: 'serverPrefetch hook',
//   ["bc" /* LifecycleHooks.BEFORE_CREATE */]: 'beforeCreate hook',
//   ["c" /* LifecycleHooks.CREATED */]: 'created hook',
//   ["bm" /* LifecycleHooks.BEFORE_MOUNT */]: 'beforeMount hook',
//   ["m" /* LifecycleHooks.MOUNTED */]: 'mounted hook',
//   ["bu" /* LifecycleHooks.BEFORE_UPDATE */]: 'beforeUpdate hook',
//   ["u" /* LifecycleHooks.UPDATED */]: 'updated',
//   ["bum" /* LifecycleHooks.BEFORE_UNMOUNT */]: 'beforeUnmount hook',
//   ["um" /* LifecycleHooks.UNMOUNTED */]: 'unmounted hook',
//   ["a" /* LifecycleHooks.ACTIVATED */]: 'activated hook',
//   ["da" /* LifecycleHooks.DEACTIVATED */]: 'deactivated hook',
//   ["ec" /* LifecycleHooks.ERROR_CAPTURED */]: 'errorCaptured hook',
//   ["rtc" /* LifecycleHooks.RENDER_TRACKED */]: 'renderTracked hook',
//   ["rtg" /* LifecycleHooks.RENDER_TRIGGERED */]: 'renderTriggered hook',
//   [0 /* ErrorCodes.SETUP_FUNCTION */]: 'setup function',
//   [1 /* ErrorCodes.RENDER_FUNCTION */]: 'render function',
//   [2 /* ErrorCodes.WATCH_GETTER */]: 'watcher getter',
//   [3 /* ErrorCodes.WATCH_CALLBACK */]: 'watcher callback',
//   [4 /* ErrorCodes.WATCH_CLEANUP */]: 'watcher cleanup function',
//   [5 /* ErrorCodes.NATIVE_EVENT_HANDLER */]: 'native event handler',
//   [6 /* ErrorCodes.COMPONENT_EVENT_HANDLER */]: 'component event handler',
//   [7 /* ErrorCodes.VNODE_HOOK */]: 'vnode hook',
//   [8 /* ErrorCodes.DIRECTIVE_HOOK */]: 'directive hook',
//   [9 /* ErrorCodes.TRANSITION_HOOK */]: 'transition hook',
//   [10 /* ErrorCodes.APP_ERROR_HANDLER */]: 'app errorHandler',
//   [11 /* ErrorCodes.APP_WARN_HANDLER */]: 'app warnHandler',
//   [12 /* ErrorCodes.FUNCTION_REF */]: 'ref function',
//   [13 /* ErrorCodes.ASYNC_COMPONENT_LOADER */]: 'async component loader',
//   [14 /* ErrorCodes.SCHEDULER */]: 'scheduler flush. This is likely a Vue internals bug. ' + 'Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core'
// };
// function callWithErrorHandling(fn, instance, type, args) {
//   let res;
//   try {
//     res = args ? fn(...args) : fn();
//   } catch (err) {
//     handleError(err, instance, type);
//   }
//   return res;
// }
// function callWithAsyncErrorHandling(fn, instance, type, args) {
//   if (shared_esm_bundler_isFunction(fn)) {
//     const res = callWithErrorHandling(fn, instance, type, args);
//     if (res && shared_esm_bundler_isPromise(res)) {
//       res.catch(err => {
//         handleError(err, instance, type);
//       });
//     }
//     return res;
//   }
//   const values = [];
//   for (let i = 0; i < fn.length; i++) {
//     values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
//   }
//   return values;
// }
// function handleError(err, instance, type, throwInDev = true) {
//   const contextVNode = instance ? instance.vnode : null;
//   if (instance) {
//     let cur = instance.parent;
//     // the exposed instance is the render proxy to keep it consistent with 2.x
//     const exposedInstance = instance.proxy;
//     // in production the hook receives only the error code
//     const errorInfo =  false ? 0 : type;
//     while (cur) {
//       const errorCapturedHooks = cur.ec;
//       if (errorCapturedHooks) {
//         for (let i = 0; i < errorCapturedHooks.length; i++) {
//           if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
//             return;
//           }
//         }
//       }
//       cur = cur.parent;
//     }
//     // app-level handling
//     const appErrorHandler = instance.appContext.config.errorHandler;
//     if (appErrorHandler) {
//       callWithErrorHandling(appErrorHandler, null, 10 /* ErrorCodes.APP_ERROR_HANDLER */, [err, exposedInstance, errorInfo]);
//       return;
//     }
//   }
//   logError(err, type, contextVNode, throwInDev);
// }
// function logError(err, type, contextVNode, throwInDev = true) {
//   if (false) {} else {
//     // recover in prod to reduce the impact on end-user
//     console.error(err);
//   }
// }
// let isFlushing = false;
// let isFlushPending = false;
// const runtime_core_esm_bundler_queue = [];
// let flushIndex = 0;
// const pendingPostFlushCbs = [];
// let activePostFlushCbs = null;
// let postFlushIndex = 0;
// const resolvedPromise = /*#__PURE__*/Promise.resolve();
// let currentFlushPromise = null;
// const RECURSION_LIMIT = 100;
// function runtime_core_esm_bundler_nextTick(fn) {
//   const p = currentFlushPromise || resolvedPromise;
//   return fn ? p.then(this ? fn.bind(this) : fn) : p;
// }
// // #2768
// // Use binary-search to find a suitable position in the queue,
// // so that the queue maintains the increasing order of job's id,
// // which can prevent the job from being skipped and also can avoid repeated patching.
// function findInsertionIndex(id) {
//   // the start index should be `flushIndex + 1`
//   let start = flushIndex + 1;
//   let end = runtime_core_esm_bundler_queue.length;
//   while (start < end) {
//     const middle = start + end >>> 1;
//     const middleJobId = getId(runtime_core_esm_bundler_queue[middle]);
//     middleJobId < id ? start = middle + 1 : end = middle;
//   }
//   return start;
// }
// function queueJob(job) {
//   // the dedupe search uses the startIndex argument of Array.includes()
//   // by default the search index includes the current job that is being run
//   // so it cannot recursively trigger itself again.
//   // if the job is a watch() callback, the search will start with a +1 index to
//   // allow it recursively trigger itself - it is the user's responsibility to
//   // ensure it doesn't end up in an infinite loop.
//   if (!runtime_core_esm_bundler_queue.length || !runtime_core_esm_bundler_queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
//     if (job.id == null) {
//       runtime_core_esm_bundler_queue.push(job);
//     } else {
//       runtime_core_esm_bundler_queue.splice(findInsertionIndex(job.id), 0, job);
//     }
//     queueFlush();
//   }
// }
// function queueFlush() {
//   if (!isFlushing && !isFlushPending) {
//     isFlushPending = true;
//     currentFlushPromise = resolvedPromise.then(flushJobs);
//   }
// }
// function invalidateJob(job) {
//   const i = runtime_core_esm_bundler_queue.indexOf(job);
//   if (i > flushIndex) {
//     runtime_core_esm_bundler_queue.splice(i, 1);
//   }
// }
// function queuePostFlushCb(cb) {
//   if (!shared_esm_bundler_isArray(cb)) {
//     if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
//       pendingPostFlushCbs.push(cb);
//     }
//   } else {
//     // if cb is an array, it is a component lifecycle hook which can only be
//     // triggered by a job, which is already deduped in the main queue, so
//     // we can skip duplicate check here to improve perf
//     pendingPostFlushCbs.push(...cb);
//   }
//   queueFlush();
// }
// function flushPreFlushCbs(seen,
// // if currently flushing, skip the current job itself
// i = isFlushing ? flushIndex + 1 : 0) {
//   if (false) {}
//   for (; i < runtime_core_esm_bundler_queue.length; i++) {
//     const cb = runtime_core_esm_bundler_queue[i];
//     if (cb && cb.pre) {
//       if (false) {}
//       runtime_core_esm_bundler_queue.splice(i, 1);
//       i--;
//       cb();
//     }
//   }
// }
// function flushPostFlushCbs(seen) {
//   if (pendingPostFlushCbs.length) {
//     const deduped = [...new Set(pendingPostFlushCbs)];
//     pendingPostFlushCbs.length = 0;
//     // #1947 already has active queue, nested flushPostFlushCbs call
//     if (activePostFlushCbs) {
//       activePostFlushCbs.push(...deduped);
//       return;
//     }
//     activePostFlushCbs = deduped;
//     if (false) {}
//     activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
//     for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
//       if (false) {}
//       activePostFlushCbs[postFlushIndex]();
//     }
//     activePostFlushCbs = null;
//     postFlushIndex = 0;
//   }
// }
// const getId = job => job.id == null ? Infinity : job.id;
// const comparator = (a, b) => {
//   const diff = getId(a) - getId(b);
//   if (diff === 0) {
//     if (a.pre && !b.pre) return -1;
//     if (b.pre && !a.pre) return 1;
//   }
//   return diff;
// };
// function flushJobs(seen) {
//   isFlushPending = false;
//   isFlushing = true;
//   if (false) {}
//   // Sort queue before flush.
//   // This ensures that:
//   // 1. Components are updated from parent to child. (because parent is always
//   //    created before the child so its render effect will have smaller
//   //    priority number)
//   // 2. If a component is unmounted during a parent component's update,
//   //    its update can be skipped.
//   runtime_core_esm_bundler_queue.sort(comparator);
//   // conditional usage of checkRecursiveUpdate must be determined out of
//   // try ... catch block since Rollup by default de-optimizes treeshaking
//   // inside try-catch. This can leave all warning code unshaked. Although
//   // they would get eventually shaken by a minifier like terser, some minifiers
//   // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)
//   const check =  false ? 0 : shared_esm_bundler_NOOP;
//   try {
//     for (flushIndex = 0; flushIndex < runtime_core_esm_bundler_queue.length; flushIndex++) {
//       const job = runtime_core_esm_bundler_queue[flushIndex];
//       if (job && job.active !== false) {
//         if (false) {}
//         // console.log(`running:`, job.id)
//         callWithErrorHandling(job, null, 14 /* ErrorCodes.SCHEDULER */);
//       }
//     }
//   } finally {
//     flushIndex = 0;
//     runtime_core_esm_bundler_queue.length = 0;
//     flushPostFlushCbs(seen);
//     isFlushing = false;
//     currentFlushPromise = null;
//     // some postFlushCb queued jobs!
//     // keep flushing until it drains.
//     if (runtime_core_esm_bundler_queue.length || pendingPostFlushCbs.length) {
//       flushJobs(seen);
//     }
//   }
// }
// function checkRecursiveUpdates(seen, fn) {
//   if (!seen.has(fn)) {
//     seen.set(fn, 1);
//   } else {
//     const count = seen.get(fn);
//     if (count > RECURSION_LIMIT) {
//       const instance = fn.ownerInstance;
//       const componentName = instance && getComponentName(instance.type);
//       runtime_core_esm_bundler_warn(`Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. ` + `This means you have a reactive effect that is mutating its own ` + `dependencies and thus recursively triggering itself. Possible sources ` + `include component template, render function, updated hook or ` + `watcher source function.`);
//       return true;
//     } else {
//       seen.set(fn, count + 1);
//     }
//   }
// }

// /* eslint-disable no-restricted-globals */
// let isHmrUpdating = false;
// const hmrDirtyComponents = new Set();
// // Expose the HMR runtime on the global object
// // This makes it entirely tree-shakable without polluting the exports and makes
// // it easier to be used in toolings like vue-loader
// // Note: for a component to be eligible for HMR it also needs the __hmrId option
// // to be set so that its instances can be registered / removed.
// if (false) {}
// const map = new Map();
// function registerHMR(instance) {
//   const id = instance.type.__hmrId;
//   let record = map.get(id);
//   if (!record) {
//     createRecord(id, instance.type);
//     record = map.get(id);
//   }
//   record.instances.add(instance);
// }
// function unregisterHMR(instance) {
//   map.get(instance.type.__hmrId).instances.delete(instance);
// }
// function createRecord(id, initialDef) {
//   if (map.has(id)) {
//     return false;
//   }
//   map.set(id, {
//     initialDef: normalizeClassComponent(initialDef),
//     instances: new Set()
//   });
//   return true;
// }
// function normalizeClassComponent(component) {
//   return isClassComponent(component) ? component.__vccOpts : component;
// }
// function rerender(id, newRender) {
//   const record = map.get(id);
//   if (!record) {
//     return;
//   }
//   // update initial record (for not-yet-rendered component)
//   record.initialDef.render = newRender;
//   [...record.instances].forEach(instance => {
//     if (newRender) {
//       instance.render = newRender;
//       normalizeClassComponent(instance.type).render = newRender;
//     }
//     instance.renderCache = [];
//     // this flag forces child components with slot content to update
//     isHmrUpdating = true;
//     instance.update();
//     isHmrUpdating = false;
//   });
// }
// function reload(id, newComp) {
//   const record = map.get(id);
//   if (!record) return;
//   newComp = normalizeClassComponent(newComp);
//   // update initial def (for not-yet-rendered components)
//   updateComponentDef(record.initialDef, newComp);
//   // create a snapshot which avoids the set being mutated during updates
//   const instances = [...record.instances];
//   for (const instance of instances) {
//     const oldComp = normalizeClassComponent(instance.type);
//     if (!hmrDirtyComponents.has(oldComp)) {
//       // 1. Update existing comp definition to match new one
//       if (oldComp !== record.initialDef) {
//         updateComponentDef(oldComp, newComp);
//       }
//       // 2. mark definition dirty. This forces the renderer to replace the
//       // component on patch.
//       hmrDirtyComponents.add(oldComp);
//     }
//     // 3. invalidate options resolution cache
//     instance.appContext.optionsCache.delete(instance.type);
//     // 4. actually update
//     if (instance.ceReload) {
//       // custom element
//       hmrDirtyComponents.add(oldComp);
//       instance.ceReload(newComp.styles);
//       hmrDirtyComponents.delete(oldComp);
//     } else if (instance.parent) {
//       // 4. Force the parent instance to re-render. This will cause all updated
//       // components to be unmounted and re-mounted. Queue the update so that we
//       // don't end up forcing the same parent to re-render multiple times.
//       queueJob(instance.parent.update);
//     } else if (instance.appContext.reload) {
//       // root instance mounted via createApp() has a reload method
//       instance.appContext.reload();
//     } else if (typeof window !== 'undefined') {
//       // root instance inside tree created via raw render(). Force reload.
//       window.location.reload();
//     } else {
//       console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
//     }
//   }
//   // 5. make sure to cleanup dirty hmr components after update
//   queuePostFlushCb(() => {
//     for (const instance of instances) {
//       hmrDirtyComponents.delete(normalizeClassComponent(instance.type));
//     }
//   });
// }
// function updateComponentDef(oldComp, newComp) {
//   extend(oldComp, newComp);
//   for (const key in oldComp) {
//     if (key !== '__file' && !(key in newComp)) {
//       delete oldComp[key];
//     }
//   }
// }
// function tryWrap(fn) {
//   return (id, arg) => {
//     try {
//       return fn(id, arg);
//     } catch (e) {
//       console.error(e);
//       console.warn(`[HMR] Something went wrong during Vue component hot-reload. ` + `Full reload required.`);
//     }
//   };
// }
// let devtools;
// let buffer = (/* unused pure expression or super */ null && ([]));
// let devtoolsNotInstalled = false;
// function emit(event, ...args) {
//   if (devtools) {
//     devtools.emit(event, ...args);
//   } else if (!devtoolsNotInstalled) {
//     buffer.push({
//       event,
//       args
//     });
//   }
// }
// function setDevtoolsHook(hook, target) {
//   var _a, _b;
//   devtools = hook;
//   if (devtools) {
//     devtools.enabled = true;
//     buffer.forEach(({
//       event,
//       args
//     }) => devtools.emit(event, ...args));
//     buffer = [];
//   } else if (
//   // handle late devtools injection - only do this if we are in an actual
//   // browser environment to avoid the timer handle stalling test runner exit
//   // (#4815)
//   typeof window !== 'undefined' &&
//   // some envs mock window but not fully
//   window.HTMLElement &&
//   // also exclude jsdom
//   !((_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === null || _b === void 0 ? void 0 : _b.includes('jsdom'))) {
//     const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
//     replay.push(newHook => {
//       setDevtoolsHook(newHook, target);
//     });
//     // clear buffer after 3s - the user probably doesn't have devtools installed
//     // at all, and keeping the buffer will cause memory leaks (#4738)
//     setTimeout(() => {
//       if (!devtools) {
//         target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
//         devtoolsNotInstalled = true;
//         buffer = [];
//       }
//     }, 3000);
//   } else {
//     // non-browser env, assume not installed
//     devtoolsNotInstalled = true;
//     buffer = [];
//   }
// }
// function devtoolsInitApp(app, version) {
//   emit("app:init" /* DevtoolsHooks.APP_INIT */, app, version, {
//     Fragment: runtime_core_esm_bundler_Fragment,
//     Text,
//     Comment,
//     Static: runtime_core_esm_bundler_Static
//   });
// }
// function devtoolsUnmountApp(app) {
//   emit("app:unmount" /* DevtoolsHooks.APP_UNMOUNT */, app);
// }
// const devtoolsComponentAdded = /*#__PURE__*/(/* unused pure expression or super */ null && (createDevtoolsComponentHook("component:added" /* DevtoolsHooks.COMPONENT_ADDED */)));
// const devtoolsComponentUpdated = /*#__PURE__*/(/* unused pure expression or super */ null && (createDevtoolsComponentHook("component:updated" /* DevtoolsHooks.COMPONENT_UPDATED */)));
// const _devtoolsComponentRemoved = /*#__PURE__*/(/* unused pure expression or super */ null && (createDevtoolsComponentHook("component:removed" /* DevtoolsHooks.COMPONENT_REMOVED */)));
// const devtoolsComponentRemoved = component => {
//   if (devtools && typeof devtools.cleanupBuffer === 'function' &&
//   // remove the component if it wasn't buffered
//   !devtools.cleanupBuffer(component)) {
//     _devtoolsComponentRemoved(component);
//   }
// };
// function createDevtoolsComponentHook(hook) {
//   return component => {
//     emit(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : undefined, component);
//   };
// }
// const devtoolsPerfStart = /*#__PURE__*/(/* unused pure expression or super */ null && (createDevtoolsPerformanceHook("perf:start" /* DevtoolsHooks.PERFORMANCE_START */)));
// const devtoolsPerfEnd = /*#__PURE__*/(/* unused pure expression or super */ null && (createDevtoolsPerformanceHook("perf:end" /* DevtoolsHooks.PERFORMANCE_END */)));
// function createDevtoolsPerformanceHook(hook) {
//   return (component, type, time) => {
//     emit(hook, component.appContext.app, component.uid, component, type, time);
//   };
// }
// function devtoolsComponentEmit(component, event, params) {
//   emit("component:emit" /* DevtoolsHooks.COMPONENT_EMIT */, component.appContext.app, component, event, params);
// }
// function emit$1(instance, event, ...rawArgs) {
//   if (instance.isUnmounted) return;
//   const props = instance.vnode.props || shared_esm_bundler_EMPTY_OBJ;
//   if (false) {}
//   let args = rawArgs;
//   const isModelListener = event.startsWith('update:');
//   // for v-model update:xxx events, apply modifiers on args
//   const modelArg = isModelListener && event.slice(7);
//   if (modelArg && modelArg in props) {
//     const modifiersKey = `${modelArg === 'modelValue' ? 'model' : modelArg}Modifiers`;
//     const {
//       number,
//       trim
//     } = props[modifiersKey] || shared_esm_bundler_EMPTY_OBJ;
//     if (trim) {
//       args = rawArgs.map(a => shared_esm_bundler_isString(a) ? a.trim() : a);
//     }
//     if (number) {
//       args = rawArgs.map(shared_esm_bundler_toNumber);
//     }
//   }
//   if (false) {}
//   if (false) {}
//   let handlerName;
//   let handler = props[handlerName = shared_esm_bundler_toHandlerKey(event)] ||
//   // also try camelCase event handler (#2249)
//   props[handlerName = shared_esm_bundler_toHandlerKey(camelize(event))];
//   // for v-model update:xxx events, also trigger kebab-case equivalent
//   // for props passed via kebab-case
//   if (!handler && isModelListener) {
//     handler = props[handlerName = shared_esm_bundler_toHandlerKey(shared_esm_bundler_hyphenate(event))];
//   }
//   if (handler) {
//     callWithAsyncErrorHandling(handler, instance, 6 /* ErrorCodes.COMPONENT_EVENT_HANDLER */, args);
//   }
//   const onceHandler = props[handlerName + `Once`];
//   if (onceHandler) {
//     if (!instance.emitted) {
//       instance.emitted = {};
//     } else if (instance.emitted[handlerName]) {
//       return;
//     }
//     instance.emitted[handlerName] = true;
//     callWithAsyncErrorHandling(onceHandler, instance, 6 /* ErrorCodes.COMPONENT_EVENT_HANDLER */, args);
//   }
// }
// function normalizeEmitsOptions(comp, appContext, asMixin = false) {
//   const cache = appContext.emitsCache;
//   const cached = cache.get(comp);
//   if (cached !== undefined) {
//     return cached;
//   }
//   const raw = comp.emits;
//   let normalized = {};
//   // apply mixin/extends props
//   let hasExtends = false;
//   if ( true && !shared_esm_bundler_isFunction(comp)) {
//     const extendEmits = raw => {
//       const normalizedFromExtend = normalizeEmitsOptions(raw, appContext, true);
//       if (normalizedFromExtend) {
//         hasExtends = true;
//         shared_esm_bundler_extend(normalized, normalizedFromExtend);
//       }
//     };
//     if (!asMixin && appContext.mixins.length) {
//       appContext.mixins.forEach(extendEmits);
//     }
//     if (comp.extends) {
//       extendEmits(comp.extends);
//     }
//     if (comp.mixins) {
//       comp.mixins.forEach(extendEmits);
//     }
//   }
//   if (!raw && !hasExtends) {
//     if (shared_esm_bundler_isObject(comp)) {
//       cache.set(comp, null);
//     }
//     return null;
//   }
//   if (shared_esm_bundler_isArray(raw)) {
//     raw.forEach(key => normalized[key] = null);
//   } else {
//     shared_esm_bundler_extend(normalized, raw);
//   }
//   if (shared_esm_bundler_isObject(comp)) {
//     cache.set(comp, normalized);
//   }
//   return normalized;
// }
// // Check if an incoming prop key is a declared emit event listener.
// // e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are
// // both considered matched listeners.
// function isEmitListener(options, key) {
//   if (!options || !shared_esm_bundler_isOn(key)) {
//     return false;
//   }
//   key = key.slice(2).replace(/Once$/, '');
//   return shared_esm_bundler_hasOwn(options, key[0].toLowerCase() + key.slice(1)) || shared_esm_bundler_hasOwn(options, shared_esm_bundler_hyphenate(key)) || shared_esm_bundler_hasOwn(options, key);
// }

// /**
//  * mark the current rendering instance for asset resolution (e.g.
//  * resolveComponent, resolveDirective) during render
//  */
// let currentRenderingInstance = null;
// let currentScopeId = null;
// /**
//  * Note: rendering calls maybe nested. The function returns the parent rendering
//  * instance if present, which should be restored after the render is done:
//  *
//  * ```js
//  * const prev = setCurrentRenderingInstance(i)
//  * // ...render
//  * setCurrentRenderingInstance(prev)
//  * ```
//  */
// function setCurrentRenderingInstance(instance) {
//   const prev = currentRenderingInstance;
//   currentRenderingInstance = instance;
//   currentScopeId = instance && instance.type.__scopeId || null;
//   return prev;
// }
// /**
//  * Set scope id when creating hoisted vnodes.
//  * @private compiler helper
//  */
// function pushScopeId(id) {
//   currentScopeId = id;
// }
// /**
//  * Technically we no longer need this after 3.0.8 but we need to keep the same
//  * API for backwards compat w/ code generated by compilers.
//  * @private
//  */
// function popScopeId() {
//   currentScopeId = null;
// }
// /**
//  * Only for backwards compat
//  * @private
//  */
// const withScopeId = _id => withCtx;
// /**
//  * Wrap a slot function to memoize current rendering instance
//  * @private compiler helper
//  */
// function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot // false only
// ) {
//   if (!ctx) return fn;
//   // already normalized
//   if (fn._n) {
//     return fn;
//   }
//   const renderFnWithContext = (...args) => {
//     // If a user calls a compiled slot inside a template expression (#1745), it
//     // can mess up block tracking, so by default we disable block tracking and
//     // force bail out when invoking a compiled slot (indicated by the ._d flag).
//     // This isn't necessary if rendering a compiled `<slot>`, so we flip the
//     // ._d flag off when invoking the wrapped fn inside `renderSlot`.
//     if (renderFnWithContext._d) {
//       setBlockTracking(-1);
//     }
//     const prevInstance = setCurrentRenderingInstance(ctx);
//     let res;
//     try {
//       res = fn(...args);
//     } finally {
//       setCurrentRenderingInstance(prevInstance);
//       if (renderFnWithContext._d) {
//         setBlockTracking(1);
//       }
//     }
//     if (false) {}
//     return res;
//   };
//   // mark normalized to avoid duplicated wrapping
//   renderFnWithContext._n = true;
//   // mark this as compiled by default
//   // this is used in vnode.ts -> normalizeChildren() to set the slot
//   // rendering flag.
//   renderFnWithContext._c = true;
//   // disable block tracking by default
//   renderFnWithContext._d = true;
//   return renderFnWithContext;
// }

// /**
//  * dev only flag to track whether $attrs was used during render.
//  * If $attrs was used during render then the warning for failed attrs
//  * fallthrough can be suppressed.
//  */
// let accessedAttrs = false;
// function markAttrsAccessed() {
//   accessedAttrs = true;
// }
// function renderComponentRoot(instance) {
//   const {
//     type: Component,
//     vnode,
//     proxy,
//     withProxy,
//     props,
//     propsOptions: [propsOptions],
//     slots,
//     attrs,
//     emit,
//     render,
//     renderCache,
//     data,
//     setupState,
//     ctx,
//     inheritAttrs
//   } = instance;
//   let result;
//   let fallthroughAttrs;
//   const prev = setCurrentRenderingInstance(instance);
//   if (false) {}
//   try {
//     if (vnode.shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */) {
//       // withProxy is a proxy with a different `has` trap only for
//       // runtime-compiled render functions using `with` block.
//       const proxyToUse = withProxy || proxy;
//       result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
//       fallthroughAttrs = attrs;
//     } else {
//       // functional
//       const render = Component;
//       // in dev, mark attrs accessed if optional props (attrs === props)
//       if (false) {}
//       result = normalizeVNode(render.length > 1 ? render(props,  false ? 0 : {
//         attrs,
//         slots,
//         emit
//       }) : render(props, null /* we know it doesn't need it */));
//       fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
//     }
//   } catch (err) {
//     blockStack.length = 0;
//     handleError(err, instance, 1 /* ErrorCodes.RENDER_FUNCTION */);
//     result = runtime_core_esm_bundler_createVNode(Comment);
//   }
//   // attr merging
//   // in dev mode, comments are preserved, and it's possible for a template
//   // to have comments along side the root element which makes it a fragment
//   let root = result;
//   let setRoot = undefined;
//   if (false /* PatchFlags.DEV_ROOT_FRAGMENT */) {}
//   if (fallthroughAttrs && inheritAttrs !== false) {
//     const keys = Object.keys(fallthroughAttrs);
//     const {
//       shapeFlag
//     } = root;
//     if (keys.length) {
//       if (shapeFlag & (1 /* ShapeFlags.ELEMENT */ | 6 /* ShapeFlags.COMPONENT */)) {
//         if (propsOptions && keys.some(isModelListener)) {
//           // If a v-model listener (onUpdate:xxx) has a corresponding declared
//           // prop, it indicates this component expects to handle v-model and
//           // it should not fallthrough.
//           // related: #1543, #1643, #1989
//           fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
//         }
//         root = cloneVNode(root, fallthroughAttrs);
//       } else if (false) {}
//     }
//   }
//   // inherit directives
//   if (vnode.dirs) {
//     if (false) {}
//     // clone before mutating since the root may be a hoisted vnode
//     root = cloneVNode(root);
//     root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
//   }
//   // inherit transition data
//   if (vnode.transition) {
//     if (false) {}
//     root.transition = vnode.transition;
//   }
//   if (false) {} else {
//     result = root;
//   }
//   setCurrentRenderingInstance(prev);
//   return result;
// }
// /**
//  * dev only
//  * In dev mode, template root level comments are rendered, which turns the
//  * template into a fragment root, but we need to locate the single element
//  * root for attrs and scope id processing.
//  */
// const getChildRoot = vnode => {
//   const rawChildren = vnode.children;
//   const dynamicChildren = vnode.dynamicChildren;
//   const childRoot = filterSingleRoot(rawChildren);
//   if (!childRoot) {
//     return [vnode, undefined];
//   }
//   const index = rawChildren.indexOf(childRoot);
//   const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
//   const setRoot = updatedRoot => {
//     rawChildren[index] = updatedRoot;
//     if (dynamicChildren) {
//       if (dynamicIndex > -1) {
//         dynamicChildren[dynamicIndex] = updatedRoot;
//       } else if (updatedRoot.patchFlag > 0) {
//         vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
//       }
//     }
//   };
//   return [normalizeVNode(childRoot), setRoot];
// };
// function filterSingleRoot(children) {
//   let singleRoot;
//   for (let i = 0; i < children.length; i++) {
//     const child = children[i];
//     if (isVNode(child)) {
//       // ignore user comment
//       if (child.type !== Comment || child.children === 'v-if') {
//         if (singleRoot) {
//           // has more than 1 non-comment child, return now
//           return;
//         } else {
//           singleRoot = child;
//         }
//       }
//     } else {
//       return;
//     }
//   }
//   return singleRoot;
// }
// const getFunctionalFallthrough = attrs => {
//   let res;
//   for (const key in attrs) {
//     if (key === 'class' || key === 'style' || shared_esm_bundler_isOn(key)) {
//       (res || (res = {}))[key] = attrs[key];
//     }
//   }
//   return res;
// };
// const filterModelListeners = (attrs, props) => {
//   const res = {};
//   for (const key in attrs) {
//     if (!isModelListener(key) || !(key.slice(9) in props)) {
//       res[key] = attrs[key];
//     }
//   }
//   return res;
// };
// const isElementRoot = vnode => {
//   return vnode.shapeFlag & (6 /* ShapeFlags.COMPONENT */ | 1 /* ShapeFlags.ELEMENT */) || vnode.type === Comment // potential v-if branch switch
//   ;
// };

// function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
//   const {
//     props: prevProps,
//     children: prevChildren,
//     component
//   } = prevVNode;
//   const {
//     props: nextProps,
//     children: nextChildren,
//     patchFlag
//   } = nextVNode;
//   const emits = component.emitsOptions;
//   // Parent component's render function was hot-updated. Since this may have
//   // caused the child component's slots content to have changed, we need to
//   // force the child to update as well.
//   if (false) {}
//   // force child update for runtime directive or transition on component vnode.
//   if (nextVNode.dirs || nextVNode.transition) {
//     return true;
//   }
//   if (optimized && patchFlag >= 0) {
//     if (patchFlag & 1024 /* PatchFlags.DYNAMIC_SLOTS */) {
//       // slot content that references values that might have changed,
//       // e.g. in a v-for
//       return true;
//     }
//     if (patchFlag & 16 /* PatchFlags.FULL_PROPS */) {
//       if (!prevProps) {
//         return !!nextProps;
//       }
//       // presence of this flag indicates props are always non-null
//       return hasPropsChanged(prevProps, nextProps, emits);
//     } else if (patchFlag & 8 /* PatchFlags.PROPS */) {
//       const dynamicProps = nextVNode.dynamicProps;
//       for (let i = 0; i < dynamicProps.length; i++) {
//         const key = dynamicProps[i];
//         if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
//           return true;
//         }
//       }
//     }
//   } else {
//     // this path is only taken by manually written render functions
//     // so presence of any children leads to a forced update
//     if (prevChildren || nextChildren) {
//       if (!nextChildren || !nextChildren.$stable) {
//         return true;
//       }
//     }
//     if (prevProps === nextProps) {
//       return false;
//     }
//     if (!prevProps) {
//       return !!nextProps;
//     }
//     if (!nextProps) {
//       return true;
//     }
//     return hasPropsChanged(prevProps, nextProps, emits);
//   }
//   return false;
// }
// function hasPropsChanged(prevProps, nextProps, emitsOptions) {
//   const nextKeys = Object.keys(nextProps);
//   if (nextKeys.length !== Object.keys(prevProps).length) {
//     return true;
//   }
//   for (let i = 0; i < nextKeys.length; i++) {
//     const key = nextKeys[i];
//     if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
//       return true;
//     }
//   }
//   return false;
// }
// function updateHOCHostEl({
//   vnode,
//   parent
// }, el // HostNode
// ) {
//   while (parent && parent.subTree === vnode) {
//     (vnode = parent.vnode).el = el;
//     parent = parent.parent;
//   }
// }
// const isSuspense = type => type.__isSuspense;
// // Suspense exposes a component-like API, and is treated like a component
// // in the compiler, but internally it's a special built-in type that hooks
// // directly into the renderer.
// const SuspenseImpl = {
//   name: 'Suspense',
//   // In order to make Suspense tree-shakable, we need to avoid importing it
//   // directly in the renderer. The renderer checks for the __isSuspense flag
//   // on a vnode's type and calls the `process` method, passing in renderer
//   // internals.
//   __isSuspense: true,
//   process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized,
//   // platform-specific impl passed from renderer
//   rendererInternals) {
//     if (n1 == null) {
//       mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals);
//     } else {
//       patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, rendererInternals);
//     }
//   },
//   hydrate: hydrateSuspense,
//   create: createSuspenseBoundary,
//   normalize: normalizeSuspenseChildren
// };
// // Force-casted public typing for h and TSX props inference
// const Suspense = (/* unused pure expression or super */ null && (SuspenseImpl));
// function triggerEvent(vnode, name) {
//   const eventListener = vnode.props && vnode.props[name];
//   if (shared_esm_bundler_isFunction(eventListener)) {
//     eventListener();
//   }
// }
// function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
//   const {
//     p: patch,
//     o: {
//       createElement
//     }
//   } = rendererInternals;
//   const hiddenContainer = createElement('div');
//   const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals);
//   // start mounting the content subtree in an off-dom container
//   patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds);
//   // now check if we have encountered any async deps
//   if (suspense.deps > 0) {
//     // has async
//     // invoke @fallback event
//     triggerEvent(vnode, 'onPending');
//     triggerEvent(vnode, 'onFallback');
//     // mount the fallback tree
//     patch(null, vnode.ssFallback, container, anchor, parentComponent, null,
//     // fallback tree will not have suspense context
//     isSVG, slotScopeIds);
//     setActiveBranch(suspense, vnode.ssFallback);
//   } else {
//     // Suspense has no async deps. Just resolve.
//     suspense.resolve();
//   }
// }
// function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, {
//   p: patch,
//   um: unmount,
//   o: {
//     createElement
//   }
// }) {
//   const suspense = n2.suspense = n1.suspense;
//   suspense.vnode = n2;
//   n2.el = n1.el;
//   const newBranch = n2.ssContent;
//   const newFallback = n2.ssFallback;
//   const {
//     activeBranch,
//     pendingBranch,
//     isInFallback,
//     isHydrating
//   } = suspense;
//   if (pendingBranch) {
//     suspense.pendingBranch = newBranch;
//     if (isSameVNodeType(newBranch, pendingBranch)) {
//       // same root type but content may have changed.
//       patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
//       if (suspense.deps <= 0) {
//         suspense.resolve();
//       } else if (isInFallback) {
//         patch(activeBranch, newFallback, container, anchor, parentComponent, null,
//         // fallback tree will not have suspense context
//         isSVG, slotScopeIds, optimized);
//         setActiveBranch(suspense, newFallback);
//       }
//     } else {
//       // toggled before pending tree is resolved
//       suspense.pendingId++;
//       if (isHydrating) {
//         // if toggled before hydration is finished, the current DOM tree is
//         // no longer valid. set it as the active branch so it will be unmounted
//         // when resolved
//         suspense.isHydrating = false;
//         suspense.activeBranch = pendingBranch;
//       } else {
//         unmount(pendingBranch, parentComponent, suspense);
//       }
//       // increment pending ID. this is used to invalidate async callbacks
//       // reset suspense state
//       suspense.deps = 0;
//       // discard effects from pending branch
//       suspense.effects.length = 0;
//       // discard previous container
//       suspense.hiddenContainer = createElement('div');
//       if (isInFallback) {
//         // already in fallback state
//         patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
//         if (suspense.deps <= 0) {
//           suspense.resolve();
//         } else {
//           patch(activeBranch, newFallback, container, anchor, parentComponent, null,
//           // fallback tree will not have suspense context
//           isSVG, slotScopeIds, optimized);
//           setActiveBranch(suspense, newFallback);
//         }
//       } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
//         // toggled "back" to current active branch
//         patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
//         // force resolve
//         suspense.resolve(true);
//       } else {
//         // switched to a 3rd branch
//         patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
//         if (suspense.deps <= 0) {
//           suspense.resolve();
//         }
//       }
//     }
//   } else {
//     if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
//       // root did not change, just normal patch
//       patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
//       setActiveBranch(suspense, newBranch);
//     } else {
//       // root node toggled
//       // invoke @pending event
//       triggerEvent(n2, 'onPending');
//       // mount pending branch in off-dom container
//       suspense.pendingBranch = newBranch;
//       suspense.pendingId++;
//       patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
//       if (suspense.deps <= 0) {
//         // incoming branch has no async deps, resolve now.
//         suspense.resolve();
//       } else {
//         const {
//           timeout,
//           pendingId
//         } = suspense;
//         if (timeout > 0) {
//           setTimeout(() => {
//             if (suspense.pendingId === pendingId) {
//               suspense.fallback(newFallback);
//             }
//           }, timeout);
//         } else if (timeout === 0) {
//           suspense.fallback(newFallback);
//         }
//       }
//     }
//   }
// }
// let hasWarned = false;
// function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
//   /* istanbul ignore if */
//   if (false) {}
//   const {
//     p: patch,
//     m: move,
//     um: unmount,
//     n: next,
//     o: {
//       parentNode,
//       remove
//     }
//   } = rendererInternals;
//   const timeout = shared_esm_bundler_toNumber(vnode.props && vnode.props.timeout);
//   const suspense = {
//     vnode,
//     parent,
//     parentComponent,
//     isSVG,
//     container,
//     hiddenContainer,
//     anchor,
//     deps: 0,
//     pendingId: 0,
//     timeout: typeof timeout === 'number' ? timeout : -1,
//     activeBranch: null,
//     pendingBranch: null,
//     isInFallback: true,
//     isHydrating,
//     isUnmounted: false,
//     effects: [],
//     resolve(resume = false) {
//       if (false) {}
//       const {
//         vnode,
//         activeBranch,
//         pendingBranch,
//         pendingId,
//         effects,
//         parentComponent,
//         container
//       } = suspense;
//       if (suspense.isHydrating) {
//         suspense.isHydrating = false;
//       } else if (!resume) {
//         const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === 'out-in';
//         if (delayEnter) {
//           activeBranch.transition.afterLeave = () => {
//             if (pendingId === suspense.pendingId) {
//               move(pendingBranch, container, anchor, 0 /* MoveType.ENTER */);
//             }
//           };
//         }
//         // this is initial anchor on mount
//         let {
//           anchor
//         } = suspense;
//         // unmount current active tree
//         if (activeBranch) {
//           // if the fallback tree was mounted, it may have been moved
//           // as part of a parent suspense. get the latest anchor for insertion
//           anchor = next(activeBranch);
//           unmount(activeBranch, parentComponent, suspense, true);
//         }
//         if (!delayEnter) {
//           // move content from off-dom container to actual container
//           move(pendingBranch, container, anchor, 0 /* MoveType.ENTER */);
//         }
//       }

//       setActiveBranch(suspense, pendingBranch);
//       suspense.pendingBranch = null;
//       suspense.isInFallback = false;
//       // flush buffered effects
//       // check if there is a pending parent suspense
//       let parent = suspense.parent;
//       let hasUnresolvedAncestor = false;
//       while (parent) {
//         if (parent.pendingBranch) {
//           // found a pending parent suspense, merge buffered post jobs
//           // into that parent
//           parent.effects.push(...effects);
//           hasUnresolvedAncestor = true;
//           break;
//         }
//         parent = parent.parent;
//       }
//       // no pending parent suspense, flush all jobs
//       if (!hasUnresolvedAncestor) {
//         queuePostFlushCb(effects);
//       }
//       suspense.effects = [];
//       // invoke @resolve event
//       triggerEvent(vnode, 'onResolve');
//     },
//     fallback(fallbackVNode) {
//       if (!suspense.pendingBranch) {
//         return;
//       }
//       const {
//         vnode,
//         activeBranch,
//         parentComponent,
//         container,
//         isSVG
//       } = suspense;
//       // invoke @fallback event
//       triggerEvent(vnode, 'onFallback');
//       const anchor = next(activeBranch);
//       const mountFallback = () => {
//         if (!suspense.isInFallback) {
//           return;
//         }
//         // mount the fallback tree
//         patch(null, fallbackVNode, container, anchor, parentComponent, null,
//         // fallback tree will not have suspense context
//         isSVG, slotScopeIds, optimized);
//         setActiveBranch(suspense, fallbackVNode);
//       };
//       const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === 'out-in';
//       if (delayEnter) {
//         activeBranch.transition.afterLeave = mountFallback;
//       }
//       suspense.isInFallback = true;
//       // unmount current active branch
//       unmount(activeBranch, parentComponent, null,
//       // no suspense so unmount hooks fire now
//       true // shouldRemove
//       );

//       if (!delayEnter) {
//         mountFallback();
//       }
//     },
//     move(container, anchor, type) {
//       suspense.activeBranch && move(suspense.activeBranch, container, anchor, type);
//       suspense.container = container;
//     },
//     next() {
//       return suspense.activeBranch && next(suspense.activeBranch);
//     },
//     registerDep(instance, setupRenderEffect) {
//       const isInPendingSuspense = !!suspense.pendingBranch;
//       if (isInPendingSuspense) {
//         suspense.deps++;
//       }
//       const hydratedEl = instance.vnode.el;
//       instance.asyncDep.catch(err => {
//         handleError(err, instance, 0 /* ErrorCodes.SETUP_FUNCTION */);
//       }).then(asyncSetupResult => {
//         // retry when the setup() promise resolves.
//         // component may have been unmounted before resolve.
//         if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
//           return;
//         }
//         // retry from this component
//         instance.asyncResolved = true;
//         const {
//           vnode
//         } = instance;
//         if (false) {}
//         handleSetupResult(instance, asyncSetupResult, false);
//         if (hydratedEl) {
//           // vnode may have been replaced if an update happened before the
//           // async dep is resolved.
//           vnode.el = hydratedEl;
//         }
//         const placeholder = !hydratedEl && instance.subTree.el;
//         setupRenderEffect(instance, vnode,
//         // component may have been moved before resolve.
//         // if this is not a hydration, instance.subTree will be the comment
//         // placeholder.
//         parentNode(hydratedEl || instance.subTree.el),
//         // anchor will not be used if this is hydration, so only need to
//         // consider the comment placeholder case.
//         hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);
//         if (placeholder) {
//           remove(placeholder);
//         }
//         updateHOCHostEl(instance, vnode.el);
//         if (false) {}
//         // only decrease deps count if suspense is not already resolved
//         if (isInPendingSuspense && --suspense.deps === 0) {
//           suspense.resolve();
//         }
//       });
//     },
//     unmount(parentSuspense, doRemove) {
//       suspense.isUnmounted = true;
//       if (suspense.activeBranch) {
//         unmount(suspense.activeBranch, parentComponent, parentSuspense, doRemove);
//       }
//       if (suspense.pendingBranch) {
//         unmount(suspense.pendingBranch, parentComponent, parentSuspense, doRemove);
//       }
//     }
//   };
//   return suspense;
// }
// function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
//   /* eslint-disable no-restricted-globals */
//   const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement('div'), null, isSVG, slotScopeIds, optimized, rendererInternals, true /* hydrating */);
//   // there are two possible scenarios for server-rendered suspense:
//   // - success: ssr content should be fully resolved
//   // - failure: ssr content should be the fallback branch.
//   // however, on the client we don't really know if it has failed or not
//   // attempt to hydrate the DOM assuming it has succeeded, but we still
//   // need to construct a suspense boundary first
//   const result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);
//   if (suspense.deps === 0) {
//     suspense.resolve();
//   }
//   return result;
//   /* eslint-enable no-restricted-globals */
// }

// function normalizeSuspenseChildren(vnode) {
//   const {
//     shapeFlag,
//     children
//   } = vnode;
//   const isSlotChildren = shapeFlag & 32 /* ShapeFlags.SLOTS_CHILDREN */;
//   vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
//   vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : runtime_core_esm_bundler_createVNode(Comment);
// }
// function normalizeSuspenseSlot(s) {
//   let block;
//   if (shared_esm_bundler_isFunction(s)) {
//     const trackBlock = isBlockTreeEnabled && s._c;
//     if (trackBlock) {
//       // disableTracking: false
//       // allow block tracking for compiled slots
//       // (see ./componentRenderContext.ts)
//       s._d = false;
//       openBlock();
//     }
//     s = s();
//     if (trackBlock) {
//       s._d = true;
//       block = currentBlock;
//       closeBlock();
//     }
//   }
//   if (shared_esm_bundler_isArray(s)) {
//     const singleChild = filterSingleRoot(s);
//     if (false) {}
//     s = singleChild;
//   }
//   s = normalizeVNode(s);
//   if (block && !s.dynamicChildren) {
//     s.dynamicChildren = block.filter(c => c !== s);
//   }
//   return s;
// }
// function queueEffectWithSuspense(fn, suspense) {
//   if (suspense && suspense.pendingBranch) {
//     if (shared_esm_bundler_isArray(fn)) {
//       suspense.effects.push(...fn);
//     } else {
//       suspense.effects.push(fn);
//     }
//   } else {
//     queuePostFlushCb(fn);
//   }
// }
// function setActiveBranch(suspense, branch) {
//   suspense.activeBranch = branch;
//   const {
//     vnode,
//     parentComponent
//   } = suspense;
//   const el = vnode.el = branch.el;
//   // in case suspense is the root node of a component,
//   // recursively update the HOC el
//   if (parentComponent && parentComponent.subTree === vnode) {
//     parentComponent.vnode.el = el;
//     updateHOCHostEl(parentComponent, el);
//   }
// }
// function provide(key, value) {
//   if (!currentInstance) {
//     if (false) {}
//   } else {
//     let provides = currentInstance.provides;
//     // by default an instance inherits its parent's provides object
//     // but when it needs to provide values of its own, it creates its
//     // own provides object using parent provides object as prototype.
//     // this way in `inject` we can simply look up injections from direct
//     // parent and let the prototype chain do the work.
//     const parentProvides = currentInstance.parent && currentInstance.parent.provides;
//     if (parentProvides === provides) {
//       provides = currentInstance.provides = Object.create(parentProvides);
//     }
//     // TS doesn't allow symbol as index type
//     provides[key] = value;
//   }
// }
// function runtime_core_esm_bundler_inject(key, defaultValue, treatDefaultAsFactory = false) {
//   // fallback to `currentRenderingInstance` so that this can be called in
//   // a functional component
//   const instance = currentInstance || currentRenderingInstance;
//   if (instance) {
//     // #2400
//     // to support `app.use` plugins,
//     // fallback to appContext's `provides` if the instance is at root
//     const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
//     if (provides && key in provides) {
//       // TS doesn't allow symbol as index type
//       return provides[key];
//     } else if (arguments.length > 1) {
//       return treatDefaultAsFactory && shared_esm_bundler_isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
//     } else if (false) {}
//   } else if (false) {}
// }

// // Simple effect.
// function watchEffect(effect, options) {
//   return doWatch(effect, null, options);
// }
// function runtime_core_esm_bundler_watchPostEffect(effect, options) {
//   return doWatch(effect, null,  false ? 0 : {
//     flush: 'post'
//   });
// }
// function watchSyncEffect(effect, options) {
//   return doWatch(effect, null,  false ? 0 : {
//     flush: 'sync'
//   });
// }
// // initial value for watchers to trigger on undefined initial values
// const INITIAL_WATCHER_VALUE = {};
// // implementation
// function runtime_core_esm_bundler_watch(source, cb, options) {
//   if (false) {}
//   return doWatch(source, cb, options);
// }
// function doWatch(source, cb, {
//   immediate,
//   deep,
//   flush,
//   onTrack,
//   onTrigger
// } = shared_esm_bundler_EMPTY_OBJ) {
//   if (false) {}
//   const warnInvalidSource = s => {
//     runtime_core_esm_bundler_warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, ` + `a reactive object, or an array of these types.`);
//   };
//   const instance = currentInstance;
//   let getter;
//   let forceTrigger = false;
//   let isMultiSource = false;
//   if (reactivity_esm_bundler_isRef(source)) {
//     getter = () => source.value;
//     forceTrigger = isShallow(source);
//   } else if (reactivity_esm_bundler_isReactive(source)) {
//     getter = () => source;
//     deep = true;
//   } else if (shared_esm_bundler_isArray(source)) {
//     isMultiSource = true;
//     forceTrigger = source.some(s => reactivity_esm_bundler_isReactive(s) || isShallow(s));
//     getter = () => source.map(s => {
//       if (reactivity_esm_bundler_isRef(s)) {
//         return s.value;
//       } else if (reactivity_esm_bundler_isReactive(s)) {
//         return traverse(s);
//       } else if (shared_esm_bundler_isFunction(s)) {
//         return callWithErrorHandling(s, instance, 2 /* ErrorCodes.WATCH_GETTER */);
//       } else {
//          false && 0;
//       }
//     });
//   } else if (shared_esm_bundler_isFunction(source)) {
//     if (cb) {
//       // getter with cb
//       getter = () => callWithErrorHandling(source, instance, 2 /* ErrorCodes.WATCH_GETTER */);
//     } else {
//       // no cb -> simple effect
//       getter = () => {
//         if (instance && instance.isUnmounted) {
//           return;
//         }
//         if (cleanup) {
//           cleanup();
//         }
//         return callWithAsyncErrorHandling(source, instance, 3 /* ErrorCodes.WATCH_CALLBACK */, [onCleanup]);
//       };
//     }
//   } else {
//     getter = shared_esm_bundler_NOOP;
//      false && 0;
//   }
//   if (cb && deep) {
//     const baseGetter = getter;
//     getter = () => traverse(baseGetter());
//   }
//   let cleanup;
//   let onCleanup = fn => {
//     cleanup = effect.onStop = () => {
//       callWithErrorHandling(fn, instance, 4 /* ErrorCodes.WATCH_CLEANUP */);
//     };
//   };
//   // in SSR there is no need to setup an actual effect, and it should be noop
//   // unless it's eager or sync flush
//   let ssrCleanup;
//   if (isInSSRComponentSetup) {
//     // we will also not call the invalidate callback (+ runner is not set up)
//     onCleanup = shared_esm_bundler_NOOP;
//     if (!cb) {
//       getter();
//     } else if (immediate) {
//       callWithAsyncErrorHandling(cb, instance, 3 /* ErrorCodes.WATCH_CALLBACK */, [getter(), isMultiSource ? [] : undefined, onCleanup]);
//     }
//     if (flush === 'sync') {
//       const ctx = useSSRContext();
//       ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
//     } else {
//       return shared_esm_bundler_NOOP;
//     }
//   }
//   let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
//   const job = () => {
//     if (!effect.active) {
//       return;
//     }
//     if (cb) {
//       // watch(source, cb)
//       const newValue = effect.run();
//       if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => shared_esm_bundler_hasChanged(v, oldValue[i])) : shared_esm_bundler_hasChanged(newValue, oldValue)) || false) {
//         // cleanup before running cb again
//         if (cleanup) {
//           cleanup();
//         }
//         callWithAsyncErrorHandling(cb, instance, 3 /* ErrorCodes.WATCH_CALLBACK */, [newValue,
//         // pass undefined as the old value when it's changed for the first time
//         oldValue === INITIAL_WATCHER_VALUE ? undefined : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue, onCleanup]);
//         oldValue = newValue;
//       }
//     } else {
//       // watchEffect
//       effect.run();
//     }
//   };
//   // important: mark the job as a watcher callback so that scheduler knows
//   // it is allowed to self-trigger (#1727)
//   job.allowRecurse = !!cb;
//   let scheduler;
//   if (flush === 'sync') {
//     scheduler = job; // the scheduler function gets called directly
//   } else if (flush === 'post') {
//     scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
//   } else {
//     // default: 'pre'
//     job.pre = true;
//     if (instance) job.id = instance.uid;
//     scheduler = () => queueJob(job);
//   }
//   const effect = new ReactiveEffect(getter, scheduler);
//   if (false) {}
//   // initial run
//   if (cb) {
//     if (immediate) {
//       job();
//     } else {
//       oldValue = effect.run();
//     }
//   } else if (flush === 'post') {
//     queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
//   } else {
//     effect.run();
//   }
//   const unwatch = () => {
//     effect.stop();
//     if (instance && instance.scope) {
//       remove(instance.scope.effects, effect);
//     }
//   };
//   if (ssrCleanup) ssrCleanup.push(unwatch);
//   return unwatch;
// }
// // this.$watch
// function instanceWatch(source, value, options) {
//   const publicThis = this.proxy;
//   const getter = shared_esm_bundler_isString(source) ? source.includes('.') ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
//   let cb;
//   if (shared_esm_bundler_isFunction(value)) {
//     cb = value;
//   } else {
//     cb = value.handler;
//     options = value;
//   }
//   const cur = currentInstance;
//   setCurrentInstance(this);
//   const res = doWatch(getter, cb.bind(publicThis), options);
//   if (cur) {
//     setCurrentInstance(cur);
//   } else {
//     unsetCurrentInstance();
//   }
//   return res;
// }
// function createPathGetter(ctx, path) {
//   const segments = path.split('.');
//   return () => {
//     let cur = ctx;
//     for (let i = 0; i < segments.length && cur; i++) {
//       cur = cur[segments[i]];
//     }
//     return cur;
//   };
// }
// function traverse(value, seen) {
//   if (!shared_esm_bundler_isObject(value) || value["__v_skip" /* ReactiveFlags.SKIP */]) {
//     return value;
//   }
//   seen = seen || new Set();
//   if (seen.has(value)) {
//     return value;
//   }
//   seen.add(value);
//   if (reactivity_esm_bundler_isRef(value)) {
//     traverse(value.value, seen);
//   } else if (shared_esm_bundler_isArray(value)) {
//     for (let i = 0; i < value.length; i++) {
//       traverse(value[i], seen);
//     }
//   } else if (shared_esm_bundler_isSet(value) || isMap(value)) {
//     value.forEach(v => {
//       traverse(v, seen);
//     });
//   } else if (isPlainObject(value)) {
//     for (const key in value) {
//       traverse(value[key], seen);
//     }
//   }
//   return value;
// }
// function useTransitionState() {
//   const state = {
//     isMounted: false,
//     isLeaving: false,
//     isUnmounting: false,
//     leavingVNodes: new Map()
//   };
//   runtime_core_esm_bundler_onMounted(() => {
//     state.isMounted = true;
//   });
//   onBeforeUnmount(() => {
//     state.isUnmounting = true;
//   });
//   return state;
// }
// const TransitionHookValidator = [Function, Array];
// const BaseTransitionImpl = {
//   name: `BaseTransition`,
//   props: {
//     mode: String,
//     appear: Boolean,
//     persisted: Boolean,
//     // enter
//     onBeforeEnter: TransitionHookValidator,
//     onEnter: TransitionHookValidator,
//     onAfterEnter: TransitionHookValidator,
//     onEnterCancelled: TransitionHookValidator,
//     // leave
//     onBeforeLeave: TransitionHookValidator,
//     onLeave: TransitionHookValidator,
//     onAfterLeave: TransitionHookValidator,
//     onLeaveCancelled: TransitionHookValidator,
//     // appear
//     onBeforeAppear: TransitionHookValidator,
//     onAppear: TransitionHookValidator,
//     onAfterAppear: TransitionHookValidator,
//     onAppearCancelled: TransitionHookValidator
//   },
//   setup(props, {
//     slots
//   }) {
//     const instance = runtime_core_esm_bundler_getCurrentInstance();
//     const state = useTransitionState();
//     let prevTransitionKey;
//     return () => {
//       const children = slots.default && getTransitionRawChildren(slots.default(), true);
//       if (!children || !children.length) {
//         return;
//       }
//       let child = children[0];
//       if (children.length > 1) {
//         let hasFound = false;
//         // locate first non-comment child
//         for (const c of children) {
//           if (c.type !== Comment) {
//             if (false) {}
//             child = c;
//             hasFound = true;
//             if (true) break;
//           }
//         }
//       }
//       // there's no need to track reactivity for these props so use the raw
//       // props for a bit better perf
//       const rawProps = reactivity_esm_bundler_toRaw(props);
//       const {
//         mode
//       } = rawProps;
//       // check mode
//       if (false) {}
//       if (state.isLeaving) {
//         return emptyPlaceholder(child);
//       }
//       // in the case of <transition><keep-alive/></transition>, we need to
//       // compare the type of the kept-alive children.
//       const innerChild = getKeepAliveChild(child);
//       if (!innerChild) {
//         return emptyPlaceholder(child);
//       }
//       const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
//       setTransitionHooks(innerChild, enterHooks);
//       const oldChild = instance.subTree;
//       const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
//       let transitionKeyChanged = false;
//       const {
//         getTransitionKey
//       } = innerChild.type;
//       if (getTransitionKey) {
//         const key = getTransitionKey();
//         if (prevTransitionKey === undefined) {
//           prevTransitionKey = key;
//         } else if (key !== prevTransitionKey) {
//           prevTransitionKey = key;
//           transitionKeyChanged = true;
//         }
//       }
//       // handle mode
//       if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
//         const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
//         // update old tree's hooks in case of dynamic transition
//         setTransitionHooks(oldInnerChild, leavingHooks);
//         // switching between different views
//         if (mode === 'out-in') {
//           state.isLeaving = true;
//           // return placeholder node and queue update when leave finishes
//           leavingHooks.afterLeave = () => {
//             state.isLeaving = false;
//             // #6835
//             // it also needs to be updated when active is undefined
//             if (instance.update.active !== false) {
//               instance.update();
//             }
//           };
//           return emptyPlaceholder(child);
//         } else if (mode === 'in-out' && innerChild.type !== Comment) {
//           leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
//             const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
//             leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
//             // early removal callback
//             el._leaveCb = () => {
//               earlyRemove();
//               el._leaveCb = undefined;
//               delete enterHooks.delayedLeave;
//             };
//             enterHooks.delayedLeave = delayedLeave;
//           };
//         }
//       }
//       return child;
//     };
//   }
// };
// // export the public type for h/tsx inference
// // also to avoid inline import() in generated d.ts files
// const BaseTransition = BaseTransitionImpl;
// function getLeavingNodesForType(state, vnode) {
//   const {
//     leavingVNodes
//   } = state;
//   let leavingVNodesCache = leavingVNodes.get(vnode.type);
//   if (!leavingVNodesCache) {
//     leavingVNodesCache = Object.create(null);
//     leavingVNodes.set(vnode.type, leavingVNodesCache);
//   }
//   return leavingVNodesCache;
// }
// // The transition hooks are attached to the vnode as vnode.transition
// // and will be called at appropriate timing in the renderer.
// function resolveTransitionHooks(vnode, props, state, instance) {
//   const {
//     appear,
//     mode,
//     persisted = false,
//     onBeforeEnter,
//     onEnter,
//     onAfterEnter,
//     onEnterCancelled,
//     onBeforeLeave,
//     onLeave,
//     onAfterLeave,
//     onLeaveCancelled,
//     onBeforeAppear,
//     onAppear,
//     onAfterAppear,
//     onAppearCancelled
//   } = props;
//   const key = String(vnode.key);
//   const leavingVNodesCache = getLeavingNodesForType(state, vnode);
//   const callHook = (hook, args) => {
//     hook && callWithAsyncErrorHandling(hook, instance, 9 /* ErrorCodes.TRANSITION_HOOK */, args);
//   };
//   const callAsyncHook = (hook, args) => {
//     const done = args[1];
//     callHook(hook, args);
//     if (shared_esm_bundler_isArray(hook)) {
//       if (hook.every(hook => hook.length <= 1)) done();
//     } else if (hook.length <= 1) {
//       done();
//     }
//   };
//   const hooks = {
//     mode,
//     persisted,
//     beforeEnter(el) {
//       let hook = onBeforeEnter;
//       if (!state.isMounted) {
//         if (appear) {
//           hook = onBeforeAppear || onBeforeEnter;
//         } else {
//           return;
//         }
//       }
//       // for same element (v-show)
//       if (el._leaveCb) {
//         el._leaveCb(true /* cancelled */);
//       }
//       // for toggled element with same key (v-if)
//       const leavingVNode = leavingVNodesCache[key];
//       if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
//         // force early removal (not cancelled)
//         leavingVNode.el._leaveCb();
//       }
//       callHook(hook, [el]);
//     },
//     enter(el) {
//       let hook = onEnter;
//       let afterHook = onAfterEnter;
//       let cancelHook = onEnterCancelled;
//       if (!state.isMounted) {
//         if (appear) {
//           hook = onAppear || onEnter;
//           afterHook = onAfterAppear || onAfterEnter;
//           cancelHook = onAppearCancelled || onEnterCancelled;
//         } else {
//           return;
//         }
//       }
//       let called = false;
//       const done = el._enterCb = cancelled => {
//         if (called) return;
//         called = true;
//         if (cancelled) {
//           callHook(cancelHook, [el]);
//         } else {
//           callHook(afterHook, [el]);
//         }
//         if (hooks.delayedLeave) {
//           hooks.delayedLeave();
//         }
//         el._enterCb = undefined;
//       };
//       if (hook) {
//         callAsyncHook(hook, [el, done]);
//       } else {
//         done();
//       }
//     },
//     leave(el, remove) {
//       const key = String(vnode.key);
//       if (el._enterCb) {
//         el._enterCb(true /* cancelled */);
//       }

//       if (state.isUnmounting) {
//         return remove();
//       }
//       callHook(onBeforeLeave, [el]);
//       let called = false;
//       const done = el._leaveCb = cancelled => {
//         if (called) return;
//         called = true;
//         remove();
//         if (cancelled) {
//           callHook(onLeaveCancelled, [el]);
//         } else {
//           callHook(onAfterLeave, [el]);
//         }
//         el._leaveCb = undefined;
//         if (leavingVNodesCache[key] === vnode) {
//           delete leavingVNodesCache[key];
//         }
//       };
//       leavingVNodesCache[key] = vnode;
//       if (onLeave) {
//         callAsyncHook(onLeave, [el, done]);
//       } else {
//         done();
//       }
//     },
//     clone(vnode) {
//       return resolveTransitionHooks(vnode, props, state, instance);
//     }
//   };
//   return hooks;
// }
// // the placeholder really only handles one special case: KeepAlive
// // in the case of a KeepAlive in a leave phase we need to return a KeepAlive
// // placeholder with empty content to avoid the KeepAlive instance from being
// // unmounted.
// function emptyPlaceholder(vnode) {
//   if (isKeepAlive(vnode)) {
//     vnode = cloneVNode(vnode);
//     vnode.children = null;
//     return vnode;
//   }
// }
// function getKeepAliveChild(vnode) {
//   return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : undefined : vnode;
// }
// function setTransitionHooks(vnode, hooks) {
//   if (vnode.shapeFlag & 6 /* ShapeFlags.COMPONENT */ && vnode.component) {
//     setTransitionHooks(vnode.component.subTree, hooks);
//   } else if (vnode.shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//     vnode.ssContent.transition = hooks.clone(vnode.ssContent);
//     vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
//   } else {
//     vnode.transition = hooks;
//   }
// }
// function getTransitionRawChildren(children, keepComment = false, parentKey) {
//   let ret = [];
//   let keyedFragmentCount = 0;
//   for (let i = 0; i < children.length; i++) {
//     let child = children[i];
//     // #5360 inherit parent key in case of <template v-for>
//     const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
//     // handle fragment children case, e.g. v-for
//     if (child.type === runtime_core_esm_bundler_Fragment) {
//       if (child.patchFlag & 128 /* PatchFlags.KEYED_FRAGMENT */) keyedFragmentCount++;
//       ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
//     }
//     // comment placeholders should be skipped, e.g. v-if
//     else if (keepComment || child.type !== Comment) {
//       ret.push(key != null ? cloneVNode(child, {
//         key
//       }) : child);
//     }
//   }
//   // #1126 if a transition children list contains multiple sub fragments, these
//   // fragments will be merged into a flat children array. Since each v-for
//   // fragment may contain different static bindings inside, we need to de-op
//   // these children to force full diffs to ensure correct behavior.
//   if (keyedFragmentCount > 1) {
//     for (let i = 0; i < ret.length; i++) {
//       ret[i].patchFlag = -2 /* PatchFlags.BAIL */;
//     }
//   }

//   return ret;
// }

// // implementation, close to no-op
// function runtime_core_esm_bundler_defineComponent(options) {
//   return shared_esm_bundler_isFunction(options) ? {
//     setup: options,
//     name: options.name
//   } : options;
// }
// const isAsyncWrapper = i => !!i.type.__asyncLoader;
// function defineAsyncComponent(source) {
//   if (isFunction(source)) {
//     source = {
//       loader: source
//     };
//   }
//   const {
//     loader,
//     loadingComponent,
//     errorComponent,
//     delay = 200,
//     timeout,
//     // undefined = never times out
//     suspensible = true,
//     onError: userOnError
//   } = source;
//   let pendingRequest = null;
//   let resolvedComp;
//   let retries = 0;
//   const retry = () => {
//     retries++;
//     pendingRequest = null;
//     return load();
//   };
//   const load = () => {
//     let thisRequest;
//     return pendingRequest || (thisRequest = pendingRequest = loader().catch(err => {
//       err = err instanceof Error ? err : new Error(String(err));
//       if (userOnError) {
//         return new Promise((resolve, reject) => {
//           const userRetry = () => resolve(retry());
//           const userFail = () => reject(err);
//           userOnError(err, userRetry, userFail, retries + 1);
//         });
//       } else {
//         throw err;
//       }
//     }).then(comp => {
//       if (thisRequest !== pendingRequest && pendingRequest) {
//         return pendingRequest;
//       }
//       if (false) {}
//       // interop module default
//       if (comp && (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
//         comp = comp.default;
//       }
//       if (false) {}
//       resolvedComp = comp;
//       return comp;
//     }));
//   };
//   return runtime_core_esm_bundler_defineComponent({
//     name: 'AsyncComponentWrapper',
//     __asyncLoader: load,
//     get __asyncResolved() {
//       return resolvedComp;
//     },
//     setup() {
//       const instance = currentInstance;
//       // already resolved
//       if (resolvedComp) {
//         return () => createInnerComp(resolvedComp, instance);
//       }
//       const onError = err => {
//         pendingRequest = null;
//         handleError(err, instance, 13 /* ErrorCodes.ASYNC_COMPONENT_LOADER */, !errorComponent /* do not throw in dev if user provided error component */);
//       };
//       // suspense-controlled or SSR.
//       if (suspensible && instance.suspense || isInSSRComponentSetup) {
//         return load().then(comp => {
//           return () => createInnerComp(comp, instance);
//         }).catch(err => {
//           onError(err);
//           return () => errorComponent ? runtime_core_esm_bundler_createVNode(errorComponent, {
//             error: err
//           }) : null;
//         });
//       }
//       const loaded = ref(false);
//       const error = ref();
//       const delayed = ref(!!delay);
//       if (delay) {
//         setTimeout(() => {
//           delayed.value = false;
//         }, delay);
//       }
//       if (timeout != null) {
//         setTimeout(() => {
//           if (!loaded.value && !error.value) {
//             const err = new Error(`Async component timed out after ${timeout}ms.`);
//             onError(err);
//             error.value = err;
//           }
//         }, timeout);
//       }
//       load().then(() => {
//         loaded.value = true;
//         if (instance.parent && isKeepAlive(instance.parent.vnode)) {
//           // parent is keep-alive, force update so the loaded component's
//           // name is taken into account
//           queueJob(instance.parent.update);
//         }
//       }).catch(err => {
//         onError(err);
//         error.value = err;
//       });
//       return () => {
//         if (loaded.value && resolvedComp) {
//           return createInnerComp(resolvedComp, instance);
//         } else if (error.value && errorComponent) {
//           return runtime_core_esm_bundler_createVNode(errorComponent, {
//             error: error.value
//           });
//         } else if (loadingComponent && !delayed.value) {
//           return runtime_core_esm_bundler_createVNode(loadingComponent);
//         }
//       };
//     }
//   });
// }
// function createInnerComp(comp, parent) {
//   const {
//     ref,
//     props,
//     children,
//     ce
//   } = parent.vnode;
//   const vnode = runtime_core_esm_bundler_createVNode(comp, props, children);
//   // ensure inner component inherits the async wrapper's ref owner
//   vnode.ref = ref;
//   // pass the custom element callback on to the inner comp
//   // and remove it from the async wrapper
//   vnode.ce = ce;
//   delete parent.vnode.ce;
//   return vnode;
// }
// const isKeepAlive = vnode => vnode.type.__isKeepAlive;
// const KeepAliveImpl = {
//   name: `KeepAlive`,
//   // Marker for special handling inside the renderer. We are not using a ===
//   // check directly on KeepAlive in the renderer, because importing it directly
//   // would prevent it from being tree-shaken.
//   __isKeepAlive: true,
//   props: {
//     include: [String, RegExp, Array],
//     exclude: [String, RegExp, Array],
//     max: [String, Number]
//   },
//   setup(props, {
//     slots
//   }) {
//     const instance = runtime_core_esm_bundler_getCurrentInstance();
//     // KeepAlive communicates with the instantiated renderer via the
//     // ctx where the renderer passes in its internals,
//     // and the KeepAlive instance exposes activate/deactivate implementations.
//     // The whole point of this is to avoid importing KeepAlive directly in the
//     // renderer to facilitate tree-shaking.
//     const sharedContext = instance.ctx;
//     // if the internal renderer is not registered, it indicates that this is server-side rendering,
//     // for KeepAlive, we just need to render its children
//     if (!sharedContext.renderer) {
//       return () => {
//         const children = slots.default && slots.default();
//         return children && children.length === 1 ? children[0] : children;
//       };
//     }
//     const cache = new Map();
//     const keys = new Set();
//     let current = null;
//     if (false) {}
//     const parentSuspense = instance.suspense;
//     const {
//       renderer: {
//         p: patch,
//         m: move,
//         um: _unmount,
//         o: {
//           createElement
//         }
//       }
//     } = sharedContext;
//     const storageContainer = createElement('div');
//     sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
//       const instance = vnode.component;
//       move(vnode, container, anchor, 0 /* MoveType.ENTER */, parentSuspense);
//       // in case props have changed
//       patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, vnode.slotScopeIds, optimized);
//       queuePostRenderEffect(() => {
//         instance.isDeactivated = false;
//         if (instance.a) {
//           invokeArrayFns(instance.a);
//         }
//         const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
//         if (vnodeHook) {
//           invokeVNodeHook(vnodeHook, instance.parent, vnode);
//         }
//       }, parentSuspense);
//       if (false) {}
//     };
//     sharedContext.deactivate = vnode => {
//       const instance = vnode.component;
//       move(vnode, storageContainer, null, 1 /* MoveType.LEAVE */, parentSuspense);
//       queuePostRenderEffect(() => {
//         if (instance.da) {
//           invokeArrayFns(instance.da);
//         }
//         const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
//         if (vnodeHook) {
//           invokeVNodeHook(vnodeHook, instance.parent, vnode);
//         }
//         instance.isDeactivated = true;
//       }, parentSuspense);
//       if (false) {}
//     };
//     function unmount(vnode) {
//       // reset the shapeFlag so it can be properly unmounted
//       resetShapeFlag(vnode);
//       _unmount(vnode, instance, parentSuspense, true);
//     }
//     function pruneCache(filter) {
//       cache.forEach((vnode, key) => {
//         const name = getComponentName(vnode.type);
//         if (name && (!filter || !filter(name))) {
//           pruneCacheEntry(key);
//         }
//       });
//     }
//     function pruneCacheEntry(key) {
//       const cached = cache.get(key);
//       if (!current || cached.type !== current.type) {
//         unmount(cached);
//       } else if (current) {
//         // current active instance should no longer be kept-alive.
//         // we can't unmount it now but it might be later, so reset its flag now.
//         resetShapeFlag(current);
//       }
//       cache.delete(key);
//       keys.delete(key);
//     }
//     // prune cache on include/exclude prop change
//     runtime_core_esm_bundler_watch(() => [props.include, props.exclude], ([include, exclude]) => {
//       include && pruneCache(name => matches(include, name));
//       exclude && pruneCache(name => !matches(exclude, name));
//     },
//     // prune post-render after `current` has been updated
//     {
//       flush: 'post',
//       deep: true
//     });
//     // cache sub tree after render
//     let pendingCacheKey = null;
//     const cacheSubtree = () => {
//       // fix #1621, the pendingCacheKey could be 0
//       if (pendingCacheKey != null) {
//         cache.set(pendingCacheKey, getInnerChild(instance.subTree));
//       }
//     };
//     runtime_core_esm_bundler_onMounted(cacheSubtree);
//     onUpdated(cacheSubtree);
//     onBeforeUnmount(() => {
//       cache.forEach(cached => {
//         const {
//           subTree,
//           suspense
//         } = instance;
//         const vnode = getInnerChild(subTree);
//         if (cached.type === vnode.type) {
//           // current instance will be unmounted as part of keep-alive's unmount
//           resetShapeFlag(vnode);
//           // but invoke its deactivated hook here
//           const da = vnode.component.da;
//           da && queuePostRenderEffect(da, suspense);
//           return;
//         }
//         unmount(cached);
//       });
//     });
//     return () => {
//       pendingCacheKey = null;
//       if (!slots.default) {
//         return null;
//       }
//       const children = slots.default();
//       const rawVNode = children[0];
//       if (children.length > 1) {
//         if (false) {}
//         current = null;
//         return children;
//       } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */) && !(rawVNode.shapeFlag & 128 /* ShapeFlags.SUSPENSE */)) {
//         current = null;
//         return rawVNode;
//       }
//       let vnode = getInnerChild(rawVNode);
//       const comp = vnode.type;
//       // for async components, name check should be based in its loaded
//       // inner component if available
//       const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp);
//       const {
//         include,
//         exclude,
//         max
//       } = props;
//       if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
//         current = vnode;
//         return rawVNode;
//       }
//       const key = vnode.key == null ? comp : vnode.key;
//       const cachedVNode = cache.get(key);
//       // clone vnode if it's reused because we are going to mutate it
//       if (vnode.el) {
//         vnode = cloneVNode(vnode);
//         if (rawVNode.shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//           rawVNode.ssContent = vnode;
//         }
//       }
//       // #1513 it's possible for the returned vnode to be cloned due to attr
//       // fallthrough or scopeId, so the vnode here may not be the final vnode
//       // that is mounted. Instead of caching it directly, we store the pending
//       // key and cache `instance.subTree` (the normalized vnode) in
//       // beforeMount/beforeUpdate hooks.
//       pendingCacheKey = key;
//       if (cachedVNode) {
//         // copy over mounted state
//         vnode.el = cachedVNode.el;
//         vnode.component = cachedVNode.component;
//         if (vnode.transition) {
//           // recursively update transition hooks on subTree
//           setTransitionHooks(vnode, vnode.transition);
//         }
//         // avoid vnode being mounted as fresh
//         vnode.shapeFlag |= 512 /* ShapeFlags.COMPONENT_KEPT_ALIVE */;
//         // make this key the freshest
//         keys.delete(key);
//         keys.add(key);
//       } else {
//         keys.add(key);
//         // prune oldest entry
//         if (max && keys.size > parseInt(max, 10)) {
//           pruneCacheEntry(keys.values().next().value);
//         }
//       }
//       // avoid vnode being unmounted
//       vnode.shapeFlag |= 256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */;
//       current = vnode;
//       return isSuspense(rawVNode.type) ? rawVNode : vnode;
//     };
//   }
// };
// // export the public type for h/tsx inference
// // also to avoid inline import() in generated d.ts files
// const KeepAlive = (/* unused pure expression or super */ null && (KeepAliveImpl));
// function matches(pattern, name) {
//   if (shared_esm_bundler_isArray(pattern)) {
//     return pattern.some(p => matches(p, name));
//   } else if (shared_esm_bundler_isString(pattern)) {
//     return pattern.split(',').includes(name);
//   } else if (pattern.test) {
//     return pattern.test(name);
//   }
//   /* istanbul ignore next */
//   return false;
// }
// function runtime_core_esm_bundler_onActivated(hook, target) {
//   registerKeepAliveHook(hook, "a" /* LifecycleHooks.ACTIVATED */, target);
// }
// function runtime_core_esm_bundler_onDeactivated(hook, target) {
//   registerKeepAliveHook(hook, "da" /* LifecycleHooks.DEACTIVATED */, target);
// }
// function registerKeepAliveHook(hook, type, target = currentInstance) {
//   // cache the deactivate branch check wrapper for injected hooks so the same
//   // hook can be properly deduped by the scheduler. "__wdc" stands for "with
//   // deactivation check".
//   const wrappedHook = hook.__wdc || (hook.__wdc = () => {
//     // only fire the hook if the target instance is NOT in a deactivated branch.
//     let current = target;
//     while (current) {
//       if (current.isDeactivated) {
//         return;
//       }
//       current = current.parent;
//     }
//     return hook();
//   });
//   injectHook(type, wrappedHook, target);
//   // In addition to registering it on the target instance, we walk up the parent
//   // chain and register it on all ancestor instances that are keep-alive roots.
//   // This avoids the need to walk the entire component tree when invoking these
//   // hooks, and more importantly, avoids the need to track child components in
//   // arrays.
//   if (target) {
//     let current = target.parent;
//     while (current && current.parent) {
//       if (isKeepAlive(current.parent.vnode)) {
//         injectToKeepAliveRoot(wrappedHook, type, target, current);
//       }
//       current = current.parent;
//     }
//   }
// }
// function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
//   // injectHook wraps the original for error handling, so make sure to remove
//   // the wrapped version.
//   const injected = injectHook(type, hook, keepAliveRoot, true /* prepend */);
//   runtime_core_esm_bundler_onUnmounted(() => {
//     remove(keepAliveRoot[type], injected);
//   }, target);
// }
// function resetShapeFlag(vnode) {
//   // bitwise operations to remove keep alive flags
//   vnode.shapeFlag &= ~256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */;
//   vnode.shapeFlag &= ~512 /* ShapeFlags.COMPONENT_KEPT_ALIVE */;
// }

// function getInnerChild(vnode) {
//   return vnode.shapeFlag & 128 /* ShapeFlags.SUSPENSE */ ? vnode.ssContent : vnode;
// }
// function injectHook(type, hook, target = currentInstance, prepend = false) {
//   if (target) {
//     const hooks = target[type] || (target[type] = []);
//     // cache the error handling wrapper for injected hooks so the same hook
//     // can be properly deduped by the scheduler. "__weh" stands for "with error
//     // handling".
//     const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
//       if (target.isUnmounted) {
//         return;
//       }
//       // disable tracking inside all lifecycle hooks
//       // since they can potentially be called inside effects.
//       pauseTracking();
//       // Set currentInstance during hook invocation.
//       // This assumes the hook does not synchronously trigger other hooks, which
//       // can only be false when the user does something really funky.
//       setCurrentInstance(target);
//       const res = callWithAsyncErrorHandling(hook, target, type, args);
//       unsetCurrentInstance();
//       resetTracking();
//       return res;
//     });
//     if (prepend) {
//       hooks.unshift(wrappedHook);
//     } else {
//       hooks.push(wrappedHook);
//     }
//     return wrappedHook;
//   } else if (false) {}
// }
// const createHook = lifecycle => (hook, target = currentInstance) =>
// // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
// (!isInSSRComponentSetup || lifecycle === "sp" /* LifecycleHooks.SERVER_PREFETCH */) && injectHook(lifecycle, (...args) => hook(...args), target);
// const onBeforeMount = createHook("bm" /* LifecycleHooks.BEFORE_MOUNT */);
// const runtime_core_esm_bundler_onMounted = createHook("m" /* LifecycleHooks.MOUNTED */);
// const onBeforeUpdate = createHook("bu" /* LifecycleHooks.BEFORE_UPDATE */);
// const onUpdated = createHook("u" /* LifecycleHooks.UPDATED */);
// const onBeforeUnmount = createHook("bum" /* LifecycleHooks.BEFORE_UNMOUNT */);
// const runtime_core_esm_bundler_onUnmounted = createHook("um" /* LifecycleHooks.UNMOUNTED */);
// const onServerPrefetch = createHook("sp" /* LifecycleHooks.SERVER_PREFETCH */);
// const onRenderTriggered = createHook("rtg" /* LifecycleHooks.RENDER_TRIGGERED */);
// const onRenderTracked = createHook("rtc" /* LifecycleHooks.RENDER_TRACKED */);
// function onErrorCaptured(hook, target = currentInstance) {
//   injectHook("ec" /* LifecycleHooks.ERROR_CAPTURED */, hook, target);
// }

// /**
// Runtime helper for applying directives to a vnode. Example usage:

// const comp = resolveComponent('comp')
// const foo = resolveDirective('foo')
// const bar = resolveDirective('bar')

// return withDirectives(h(comp), [
//   [foo, this.x],
//   [bar, this.y]
// ])
// */
// function validateDirectiveName(name) {
//   if (isBuiltInDirective(name)) {
//     runtime_core_esm_bundler_warn('Do not use built-in directive ids as custom directive id: ' + name);
//   }
// }
// /**
//  * Adds directives to a VNode.
//  */
// function withDirectives(vnode, directives) {
//   const internalInstance = currentRenderingInstance;
//   if (internalInstance === null) {
//      false && 0;
//     return vnode;
//   }
//   const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
//   const bindings = vnode.dirs || (vnode.dirs = []);
//   for (let i = 0; i < directives.length; i++) {
//     let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
//     if (dir) {
//       if (isFunction(dir)) {
//         dir = {
//           mounted: dir,
//           updated: dir
//         };
//       }
//       if (dir.deep) {
//         traverse(value);
//       }
//       bindings.push({
//         dir,
//         instance,
//         value,
//         oldValue: void 0,
//         arg,
//         modifiers
//       });
//     }
//   }
//   return vnode;
// }
// function invokeDirectiveHook(vnode, prevVNode, instance, name) {
//   const bindings = vnode.dirs;
//   const oldBindings = prevVNode && prevVNode.dirs;
//   for (let i = 0; i < bindings.length; i++) {
//     const binding = bindings[i];
//     if (oldBindings) {
//       binding.oldValue = oldBindings[i].value;
//     }
//     let hook = binding.dir[name];
//     if (hook) {
//       // disable tracking inside all lifecycle hooks
//       // since they can potentially be called inside effects.
//       pauseTracking();
//       callWithAsyncErrorHandling(hook, instance, 8 /* ErrorCodes.DIRECTIVE_HOOK */, [vnode.el, binding, vnode, prevVNode]);
//       resetTracking();
//     }
//   }
// }
// const COMPONENTS = 'components';
// const DIRECTIVES = 'directives';
// /**
//  * @private
//  */
// function resolveComponent(name, maybeSelfReference) {
//   return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
// }
// const NULL_DYNAMIC_COMPONENT = Symbol();
// /**
//  * @private
//  */
// function resolveDynamicComponent(component) {
//   if (isString(component)) {
//     return resolveAsset(COMPONENTS, component, false) || component;
//   } else {
//     // invalid types will fallthrough to createVNode and raise warning
//     return component || NULL_DYNAMIC_COMPONENT;
//   }
// }
// /**
//  * @private
//  */
// function resolveDirective(name) {
//   return resolveAsset(DIRECTIVES, name);
// }
// // implementation
// function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
//   const instance = currentRenderingInstance || currentInstance;
//   if (instance) {
//     const Component = instance.type;
//     // explicit self name has highest priority
//     if (type === COMPONENTS) {
//       const selfName = getComponentName(Component, false /* do not include inferred name to avoid breaking existing code */);
//       if (selfName && (selfName === name || selfName === camelize(name) || selfName === shared_esm_bundler_capitalize(camelize(name)))) {
//         return Component;
//       }
//     }
//     const res =
//     // local registration
//     // check instance[type] first which is resolved for options API
//     resolve(instance[type] || Component[type], name) ||
//     // global registration
//     resolve(instance.appContext[type], name);
//     if (!res && maybeSelfReference) {
//       // fallback to implicit self-reference
//       return Component;
//     }
//     if (false) {}
//     return res;
//   } else if (false) {}
// }
// function resolve(registry, name) {
//   return registry && (registry[name] || registry[camelize(name)] || registry[shared_esm_bundler_capitalize(camelize(name))]);
// }

// /**
//  * Actual implementation
//  */
// function renderList(source, renderItem, cache, index) {
//   let ret;
//   const cached = cache && cache[index];
//   if (isArray(source) || isString(source)) {
//     ret = new Array(source.length);
//     for (let i = 0, l = source.length; i < l; i++) {
//       ret[i] = renderItem(source[i], i, undefined, cached && cached[i]);
//     }
//   } else if (typeof source === 'number') {
//     if (false) {}
//     ret = new Array(source);
//     for (let i = 0; i < source; i++) {
//       ret[i] = renderItem(i + 1, i, undefined, cached && cached[i]);
//     }
//   } else if (isObject(source)) {
//     if (source[Symbol.iterator]) {
//       ret = Array.from(source, (item, i) => renderItem(item, i, undefined, cached && cached[i]));
//     } else {
//       const keys = Object.keys(source);
//       ret = new Array(keys.length);
//       for (let i = 0, l = keys.length; i < l; i++) {
//         const key = keys[i];
//         ret[i] = renderItem(source[key], key, i, cached && cached[i]);
//       }
//     }
//   } else {
//     ret = [];
//   }
//   if (cache) {
//     cache[index] = ret;
//   }
//   return ret;
// }

// /**
//  * Compiler runtime helper for creating dynamic slots object
//  * @private
//  */
// function createSlots(slots, dynamicSlots) {
//   for (let i = 0; i < dynamicSlots.length; i++) {
//     const slot = dynamicSlots[i];
//     // array of dynamic slot generated by <template v-for="..." #[...]>
//     if (isArray(slot)) {
//       for (let j = 0; j < slot.length; j++) {
//         slots[slot[j].name] = slot[j].fn;
//       }
//     } else if (slot) {
//       // conditional single slot generated by <template v-if="..." #foo>
//       slots[slot.name] = slot.key ? (...args) => {
//         const res = slot.fn(...args);
//         // attach branch key so each conditional branch is considered a
//         // different fragment
//         if (res) res.key = slot.key;
//         return res;
//       } : slot.fn;
//     }
//   }
//   return slots;
// }

// /**
//  * Compiler runtime helper for rendering `<slot/>`
//  * @private
//  */
// function renderSlot(slots, name, props = {},
// // this is not a user-facing function, so the fallback is always generated by
// // the compiler and guaranteed to be a function returning an array
// fallback, noSlotted) {
//   if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
//     if (name !== 'default') props.name = name;
//     return runtime_core_esm_bundler_createVNode('slot', props, fallback && fallback());
//   }
//   let slot = slots[name];
//   if (false) {}
//   // a compiled slot disables block tracking by default to avoid manual
//   // invocation interfering with template-based block tracking, but in
//   // `renderSlot` we can be sure that it's template-based so we can force
//   // enable it.
//   if (slot && slot._c) {
//     slot._d = false;
//   }
//   openBlock();
//   const validSlotContent = slot && ensureValidVNode(slot(props));
//   const rendered = createBlock(runtime_core_esm_bundler_Fragment, {
//     key: props.key ||
//     // slot content array of a dynamic conditional slot may have a branch
//     // key attached in the `createSlots` helper, respect that
//     validSlotContent && validSlotContent.key || `_${name}`
//   }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 /* SlotFlags.STABLE */ ? 64 /* PatchFlags.STABLE_FRAGMENT */ : -2 /* PatchFlags.BAIL */);
//   if (!noSlotted && rendered.scopeId) {
//     rendered.slotScopeIds = [rendered.scopeId + '-s'];
//   }
//   if (slot && slot._c) {
//     slot._d = true;
//   }
//   return rendered;
// }
// function ensureValidVNode(vnodes) {
//   return vnodes.some(child => {
//     if (!isVNode(child)) return true;
//     if (child.type === Comment) return false;
//     if (child.type === runtime_core_esm_bundler_Fragment && !ensureValidVNode(child.children)) return false;
//     return true;
//   }) ? vnodes : null;
// }

// /**
//  * For prefixing keys in v-on="obj" with "on"
//  * @private
//  */
// function toHandlers(obj, preserveCaseIfNecessary) {
//   const ret = {};
//   if (false) {}
//   for (const key in obj) {
//     ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
//   }
//   return ret;
// }

// /**
//  * #2437 In Vue 3, functional components do not have a public instance proxy but
//  * they exist in the internal parent chain. For code that relies on traversing
//  * public $parent chains, skip functional ones and go to the parent instead.
//  */
// const getPublicInstance = i => {
//   if (!i) return null;
//   if (isStatefulComponent(i)) return getExposeProxy(i) || i.proxy;
//   return getPublicInstance(i.parent);
// };
// const publicPropertiesMap =
// // Move PURE marker to new line to workaround compiler discarding it
// // due to type annotation
// /*#__PURE__*/
// shared_esm_bundler_extend(Object.create(null), {
//   $: i => i,
//   $el: i => i.vnode.el,
//   $data: i => i.data,
//   $props: i =>  false ? 0 : i.props,
//   $attrs: i =>  false ? 0 : i.attrs,
//   $slots: i =>  false ? 0 : i.slots,
//   $refs: i =>  false ? 0 : i.refs,
//   $parent: i => getPublicInstance(i.parent),
//   $root: i => getPublicInstance(i.root),
//   $emit: i => i.emit,
//   $options: i =>  true ? resolveMergedOptions(i) : 0,
//   $forceUpdate: i => i.f || (i.f = () => queueJob(i.update)),
//   $nextTick: i => i.n || (i.n = runtime_core_esm_bundler_nextTick.bind(i.proxy)),
//   $watch: i =>  true ? instanceWatch.bind(i) : 0
// });
// const isReservedPrefix = key => key === '_' || key === '$';
// const hasSetupBinding = (state, key) => state !== shared_esm_bundler_EMPTY_OBJ && !state.__isScriptSetup && shared_esm_bundler_hasOwn(state, key);
// const PublicInstanceProxyHandlers = {
//   get({
//     _: instance
//   }, key) {
//     const {
//       ctx,
//       setupState,
//       data,
//       props,
//       accessCache,
//       type,
//       appContext
//     } = instance;
//     // for internal formatters to know that this is a Vue instance
//     if (false) {}
//     // data / props / ctx
//     // This getter gets called for every property access on the render context
//     // during render and is a major hotspot. The most expensive part of this
//     // is the multiple hasOwn() calls. It's much faster to do a simple property
//     // access on a plain object, so we use an accessCache object (with null
//     // prototype) to memoize what access type a key corresponds to.
//     let normalizedProps;
//     if (key[0] !== '$') {
//       const n = accessCache[key];
//       if (n !== undefined) {
//         switch (n) {
//           case 1 /* AccessTypes.SETUP */:
//             return setupState[key];
//           case 2 /* AccessTypes.DATA */:
//             return data[key];
//           case 4 /* AccessTypes.CONTEXT */:
//             return ctx[key];
//           case 3 /* AccessTypes.PROPS */:
//             return props[key];
//           // default: just fallthrough
//         }
//       } else if (hasSetupBinding(setupState, key)) {
//         accessCache[key] = 1 /* AccessTypes.SETUP */;
//         return setupState[key];
//       } else if (data !== shared_esm_bundler_EMPTY_OBJ && shared_esm_bundler_hasOwn(data, key)) {
//         accessCache[key] = 2 /* AccessTypes.DATA */;
//         return data[key];
//       } else if (
//       // only cache other properties when instance has declared (thus stable)
//       // props
//       (normalizedProps = instance.propsOptions[0]) && shared_esm_bundler_hasOwn(normalizedProps, key)) {
//         accessCache[key] = 3 /* AccessTypes.PROPS */;
//         return props[key];
//       } else if (ctx !== shared_esm_bundler_EMPTY_OBJ && shared_esm_bundler_hasOwn(ctx, key)) {
//         accessCache[key] = 4 /* AccessTypes.CONTEXT */;
//         return ctx[key];
//       } else if ( false || shouldCacheAccess) {
//         accessCache[key] = 0 /* AccessTypes.OTHER */;
//       }
//     }

//     const publicGetter = publicPropertiesMap[key];
//     let cssModule, globalProperties;
//     // public $xxx properties
//     if (publicGetter) {
//       if (key === '$attrs') {
//         track(instance, "get" /* TrackOpTypes.GET */, key);
//          false && 0;
//       }
//       return publicGetter(instance);
//     } else if (
//     // css module (injected by vue-loader)
//     (cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
//       return cssModule;
//     } else if (ctx !== shared_esm_bundler_EMPTY_OBJ && shared_esm_bundler_hasOwn(ctx, key)) {
//       // user may set custom properties to `this` that start with `$`
//       accessCache[key] = 4 /* AccessTypes.CONTEXT */;
//       return ctx[key];
//     } else if (
//     // global properties
//     globalProperties = appContext.config.globalProperties, shared_esm_bundler_hasOwn(globalProperties, key)) {
//       {
//         return globalProperties[key];
//       }
//     } else if (false) {}
//   },
//   set({
//     _: instance
//   }, key, value) {
//     const {
//       data,
//       setupState,
//       ctx
//     } = instance;
//     if (hasSetupBinding(setupState, key)) {
//       setupState[key] = value;
//       return true;
//     } else if (false) {} else if (data !== shared_esm_bundler_EMPTY_OBJ && shared_esm_bundler_hasOwn(data, key)) {
//       data[key] = value;
//       return true;
//     } else if (shared_esm_bundler_hasOwn(instance.props, key)) {
//        false && 0;
//       return false;
//     }
//     if (key[0] === '$' && key.slice(1) in instance) {
//        false && 0;
//       return false;
//     } else {
//       if (false) {} else {
//         ctx[key] = value;
//       }
//     }
//     return true;
//   },
//   has({
//     _: {
//       data,
//       setupState,
//       accessCache,
//       ctx,
//       appContext,
//       propsOptions
//     }
//   }, key) {
//     let normalizedProps;
//     return !!accessCache[key] || data !== shared_esm_bundler_EMPTY_OBJ && shared_esm_bundler_hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && shared_esm_bundler_hasOwn(normalizedProps, key) || shared_esm_bundler_hasOwn(ctx, key) || shared_esm_bundler_hasOwn(publicPropertiesMap, key) || shared_esm_bundler_hasOwn(appContext.config.globalProperties, key);
//   },
//   defineProperty(target, key, descriptor) {
//     if (descriptor.get != null) {
//       // invalidate key cache of a getter based property #5417
//       target._.accessCache[key] = 0;
//     } else if (shared_esm_bundler_hasOwn(descriptor, 'value')) {
//       this.set(target, key, descriptor.value, null);
//     }
//     return Reflect.defineProperty(target, key, descriptor);
//   }
// };
// if (false) {}
// const RuntimeCompiledPublicInstanceProxyHandlers = /*#__PURE__*/shared_esm_bundler_extend({}, PublicInstanceProxyHandlers, {
//   get(target, key) {
//     // fast path for unscopables when using `with` block
//     if (key === Symbol.unscopables) {
//       return;
//     }
//     return PublicInstanceProxyHandlers.get(target, key, target);
//   },
//   has(_, key) {
//     const has = key[0] !== '_' && !isGloballyWhitelisted(key);
//     if (false) {}
//     return has;
//   }
// });
// // dev only
// // In dev mode, the proxy target exposes the same properties as seen on `this`
// // for easier console inspection. In prod mode it will be an empty object so
// // these properties definitions can be skipped.
// function createDevRenderContext(instance) {
//   const target = {};
//   // expose internal instance for proxy handlers
//   Object.defineProperty(target, `_`, {
//     configurable: true,
//     enumerable: false,
//     get: () => instance
//   });
//   // expose public properties
//   Object.keys(publicPropertiesMap).forEach(key => {
//     Object.defineProperty(target, key, {
//       configurable: true,
//       enumerable: false,
//       get: () => publicPropertiesMap[key](instance),
//       // intercepted by the proxy so no need for implementation,
//       // but needed to prevent set errors
//       set: NOOP
//     });
//   });
//   return target;
// }
// // dev only
// function exposePropsOnRenderContext(instance) {
//   const {
//     ctx,
//     propsOptions: [propsOptions]
//   } = instance;
//   if (propsOptions) {
//     Object.keys(propsOptions).forEach(key => {
//       Object.defineProperty(ctx, key, {
//         enumerable: true,
//         configurable: true,
//         get: () => instance.props[key],
//         set: NOOP
//       });
//     });
//   }
// }
// // dev only
// function exposeSetupStateOnRenderContext(instance) {
//   const {
//     ctx,
//     setupState
//   } = instance;
//   Object.keys(toRaw(setupState)).forEach(key => {
//     if (!setupState.__isScriptSetup) {
//       if (isReservedPrefix(key[0])) {
//         runtime_core_esm_bundler_warn(`setup() return property ${JSON.stringify(key)} should not start with "$" or "_" ` + `which are reserved prefixes for Vue internals.`);
//         return;
//       }
//       Object.defineProperty(ctx, key, {
//         enumerable: true,
//         configurable: true,
//         get: () => setupState[key],
//         set: NOOP
//       });
//     }
//   });
// }
// function createDuplicateChecker() {
//   const cache = Object.create(null);
//   return (type, key) => {
//     if (cache[key]) {
//       runtime_core_esm_bundler_warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
//     } else {
//       cache[key] = type;
//     }
//   };
// }
// let shouldCacheAccess = true;
// function applyOptions(instance) {
//   const options = resolveMergedOptions(instance);
//   const publicThis = instance.proxy;
//   const ctx = instance.ctx;
//   // do not cache property access on public proxy during state initialization
//   shouldCacheAccess = false;
//   // call beforeCreate first before accessing other options since
//   // the hook may mutate resolved options (#2791)
//   if (options.beforeCreate) {
//     callHook(options.beforeCreate, instance, "bc" /* LifecycleHooks.BEFORE_CREATE */);
//   }

//   const {
//     // state
//     data: dataOptions,
//     computed: computedOptions,
//     methods,
//     watch: watchOptions,
//     provide: provideOptions,
//     inject: injectOptions,
//     // lifecycle
//     created,
//     beforeMount,
//     mounted,
//     beforeUpdate,
//     updated,
//     activated,
//     deactivated,
//     beforeDestroy,
//     beforeUnmount,
//     destroyed,
//     unmounted,
//     render,
//     renderTracked,
//     renderTriggered,
//     errorCaptured,
//     serverPrefetch,
//     // public API
//     expose,
//     inheritAttrs,
//     // assets
//     components,
//     directives,
//     filters
//   } = options;
//   const checkDuplicateProperties =  false ? 0 : null;
//   if (false) {}
//   // options initialization order (to be consistent with Vue 2):
//   // - props (already done outside of this function)
//   // - inject
//   // - methods
//   // - data (deferred since it relies on `this` access)
//   // - computed
//   // - watch (deferred since it relies on `this` access)
//   if (injectOptions) {
//     resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
//   }
//   if (methods) {
//     for (const key in methods) {
//       const methodHandler = methods[key];
//       if (shared_esm_bundler_isFunction(methodHandler)) {
//         // In dev mode, we use the `createRenderContext` function to define
//         // methods to the proxy target, and those are read-only but
//         // reconfigurable, so it needs to be redefined here
//         if (false) {} else {
//           ctx[key] = methodHandler.bind(publicThis);
//         }
//         if (false) {}
//       } else if (false) {}
//     }
//   }
//   if (dataOptions) {
//     if (false) {}
//     const data = dataOptions.call(publicThis, publicThis);
//     if (false) {}
//     if (!shared_esm_bundler_isObject(data)) {
//        false && 0;
//     } else {
//       instance.data = reactive(data);
//       if (false) {}
//     }
//   }
//   // state initialization complete at this point - start caching access
//   shouldCacheAccess = true;
//   if (computedOptions) {
//     for (const key in computedOptions) {
//       const opt = computedOptions[key];
//       const get = shared_esm_bundler_isFunction(opt) ? opt.bind(publicThis, publicThis) : shared_esm_bundler_isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : shared_esm_bundler_NOOP;
//       if (false) {}
//       const set = !shared_esm_bundler_isFunction(opt) && shared_esm_bundler_isFunction(opt.set) ? opt.set.bind(publicThis) :  false ? 0 : shared_esm_bundler_NOOP;
//       const c = runtime_core_esm_bundler_computed({
//         get,
//         set
//       });
//       Object.defineProperty(ctx, key, {
//         enumerable: true,
//         configurable: true,
//         get: () => c.value,
//         set: v => c.value = v
//       });
//       if (false) {}
//     }
//   }
//   if (watchOptions) {
//     for (const key in watchOptions) {
//       createWatcher(watchOptions[key], ctx, publicThis, key);
//     }
//   }
//   if (provideOptions) {
//     const provides = shared_esm_bundler_isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
//     Reflect.ownKeys(provides).forEach(key => {
//       provide(key, provides[key]);
//     });
//   }
//   if (created) {
//     callHook(created, instance, "c" /* LifecycleHooks.CREATED */);
//   }

//   function registerLifecycleHook(register, hook) {
//     if (shared_esm_bundler_isArray(hook)) {
//       hook.forEach(_hook => register(_hook.bind(publicThis)));
//     } else if (hook) {
//       register(hook.bind(publicThis));
//     }
//   }
//   registerLifecycleHook(onBeforeMount, beforeMount);
//   registerLifecycleHook(runtime_core_esm_bundler_onMounted, mounted);
//   registerLifecycleHook(onBeforeUpdate, beforeUpdate);
//   registerLifecycleHook(onUpdated, updated);
//   registerLifecycleHook(runtime_core_esm_bundler_onActivated, activated);
//   registerLifecycleHook(runtime_core_esm_bundler_onDeactivated, deactivated);
//   registerLifecycleHook(onErrorCaptured, errorCaptured);
//   registerLifecycleHook(onRenderTracked, renderTracked);
//   registerLifecycleHook(onRenderTriggered, renderTriggered);
//   registerLifecycleHook(onBeforeUnmount, beforeUnmount);
//   registerLifecycleHook(runtime_core_esm_bundler_onUnmounted, unmounted);
//   registerLifecycleHook(onServerPrefetch, serverPrefetch);
//   if (shared_esm_bundler_isArray(expose)) {
//     if (expose.length) {
//       const exposed = instance.exposed || (instance.exposed = {});
//       expose.forEach(key => {
//         Object.defineProperty(exposed, key, {
//           get: () => publicThis[key],
//           set: val => publicThis[key] = val
//         });
//       });
//     } else if (!instance.exposed) {
//       instance.exposed = {};
//     }
//   }
//   // options that are handled when creating the instance but also need to be
//   // applied from mixins
//   if (render && instance.render === shared_esm_bundler_NOOP) {
//     instance.render = render;
//   }
//   if (inheritAttrs != null) {
//     instance.inheritAttrs = inheritAttrs;
//   }
//   // asset options.
//   if (components) instance.components = components;
//   if (directives) instance.directives = directives;
// }
// function resolveInjections(injectOptions, ctx, checkDuplicateProperties = shared_esm_bundler_NOOP, unwrapRef = false) {
//   if (shared_esm_bundler_isArray(injectOptions)) {
//     injectOptions = normalizeInject(injectOptions);
//   }
//   for (const key in injectOptions) {
//     const opt = injectOptions[key];
//     let injected;
//     if (shared_esm_bundler_isObject(opt)) {
//       if ('default' in opt) {
//         injected = runtime_core_esm_bundler_inject(opt.from || key, opt.default, true /* treat default function as factory */);
//       } else {
//         injected = runtime_core_esm_bundler_inject(opt.from || key);
//       }
//     } else {
//       injected = runtime_core_esm_bundler_inject(opt);
//     }
//     if (reactivity_esm_bundler_isRef(injected)) {
//       // TODO remove the check in 3.3
//       if (unwrapRef) {
//         Object.defineProperty(ctx, key, {
//           enumerable: true,
//           configurable: true,
//           get: () => injected.value,
//           set: v => injected.value = v
//         });
//       } else {
//         if (false) {}
//         ctx[key] = injected;
//       }
//     } else {
//       ctx[key] = injected;
//     }
//     if (false) {}
//   }
// }
// function callHook(hook, instance, type) {
//   callWithAsyncErrorHandling(shared_esm_bundler_isArray(hook) ? hook.map(h => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
// }
// function createWatcher(raw, ctx, publicThis, key) {
//   const getter = key.includes('.') ? createPathGetter(publicThis, key) : () => publicThis[key];
//   if (shared_esm_bundler_isString(raw)) {
//     const handler = ctx[raw];
//     if (shared_esm_bundler_isFunction(handler)) {
//       runtime_core_esm_bundler_watch(getter, handler);
//     } else if (false) {}
//   } else if (shared_esm_bundler_isFunction(raw)) {
//     runtime_core_esm_bundler_watch(getter, raw.bind(publicThis));
//   } else if (shared_esm_bundler_isObject(raw)) {
//     if (shared_esm_bundler_isArray(raw)) {
//       raw.forEach(r => createWatcher(r, ctx, publicThis, key));
//     } else {
//       const handler = shared_esm_bundler_isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
//       if (shared_esm_bundler_isFunction(handler)) {
//         runtime_core_esm_bundler_watch(getter, handler, raw);
//       } else if (false) {}
//     }
//   } else if (false) {}
// }
// /**
//  * Resolve merged options and cache it on the component.
//  * This is done only once per-component since the merging does not involve
//  * instances.
//  */
// function resolveMergedOptions(instance) {
//   const base = instance.type;
//   const {
//     mixins,
//     extends: extendsOptions
//   } = base;
//   const {
//     mixins: globalMixins,
//     optionsCache: cache,
//     config: {
//       optionMergeStrategies
//     }
//   } = instance.appContext;
//   const cached = cache.get(base);
//   let resolved;
//   if (cached) {
//     resolved = cached;
//   } else if (!globalMixins.length && !mixins && !extendsOptions) {
//     {
//       resolved = base;
//     }
//   } else {
//     resolved = {};
//     if (globalMixins.length) {
//       globalMixins.forEach(m => mergeOptions(resolved, m, optionMergeStrategies, true));
//     }
//     mergeOptions(resolved, base, optionMergeStrategies);
//   }
//   if (shared_esm_bundler_isObject(base)) {
//     cache.set(base, resolved);
//   }
//   return resolved;
// }
// function mergeOptions(to, from, strats, asMixin = false) {
//   const {
//     mixins,
//     extends: extendsOptions
//   } = from;
//   if (extendsOptions) {
//     mergeOptions(to, extendsOptions, strats, true);
//   }
//   if (mixins) {
//     mixins.forEach(m => mergeOptions(to, m, strats, true));
//   }
//   for (const key in from) {
//     if (asMixin && key === 'expose') {
//        false && 0;
//     } else {
//       const strat = internalOptionMergeStrats[key] || strats && strats[key];
//       to[key] = strat ? strat(to[key], from[key]) : from[key];
//     }
//   }
//   return to;
// }
// const internalOptionMergeStrats = {
//   data: mergeDataFn,
//   props: mergeObjectOptions,
//   emits: mergeObjectOptions,
//   // objects
//   methods: mergeObjectOptions,
//   computed: mergeObjectOptions,
//   // lifecycle
//   beforeCreate: mergeAsArray,
//   created: mergeAsArray,
//   beforeMount: mergeAsArray,
//   mounted: mergeAsArray,
//   beforeUpdate: mergeAsArray,
//   updated: mergeAsArray,
//   beforeDestroy: mergeAsArray,
//   beforeUnmount: mergeAsArray,
//   destroyed: mergeAsArray,
//   unmounted: mergeAsArray,
//   activated: mergeAsArray,
//   deactivated: mergeAsArray,
//   errorCaptured: mergeAsArray,
//   serverPrefetch: mergeAsArray,
//   // assets
//   components: mergeObjectOptions,
//   directives: mergeObjectOptions,
//   // watch
//   watch: mergeWatchOptions,
//   // provide / inject
//   provide: mergeDataFn,
//   inject: mergeInject
// };
// function mergeDataFn(to, from) {
//   if (!from) {
//     return to;
//   }
//   if (!to) {
//     return from;
//   }
//   return function mergedDataFn() {
//     return shared_esm_bundler_extend(shared_esm_bundler_isFunction(to) ? to.call(this, this) : to, shared_esm_bundler_isFunction(from) ? from.call(this, this) : from);
//   };
// }
// function mergeInject(to, from) {
//   return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
// }
// function normalizeInject(raw) {
//   if (shared_esm_bundler_isArray(raw)) {
//     const res = {};
//     for (let i = 0; i < raw.length; i++) {
//       res[raw[i]] = raw[i];
//     }
//     return res;
//   }
//   return raw;
// }
// function mergeAsArray(to, from) {
//   return to ? [...new Set([].concat(to, from))] : from;
// }
// function mergeObjectOptions(to, from) {
//   return to ? shared_esm_bundler_extend(shared_esm_bundler_extend(Object.create(null), to), from) : from;
// }
// function mergeWatchOptions(to, from) {
//   if (!to) return from;
//   if (!from) return to;
//   const merged = shared_esm_bundler_extend(Object.create(null), to);
//   for (const key in from) {
//     merged[key] = mergeAsArray(to[key], from[key]);
//   }
//   return merged;
// }
// function initProps(instance, rawProps, isStateful,
// // result of bitwise flag comparison
// isSSR = false) {
//   const props = {};
//   const attrs = {};
//   def(attrs, InternalObjectKey, 1);
//   instance.propsDefaults = Object.create(null);
//   setFullProps(instance, rawProps, props, attrs);
//   // ensure all declared prop keys are present
//   for (const key in instance.propsOptions[0]) {
//     if (!(key in props)) {
//       props[key] = undefined;
//     }
//   }
//   // validation
//   if (false) {}
//   if (isStateful) {
//     // stateful
//     instance.props = isSSR ? props : shallowReactive(props);
//   } else {
//     if (!instance.type.props) {
//       // functional w/ optional props, props === attrs
//       instance.props = attrs;
//     } else {
//       // functional w/ declared props
//       instance.props = props;
//     }
//   }
//   instance.attrs = attrs;
// }
// function isInHmrContext(instance) {
//   while (instance) {
//     if (instance.type.__hmrId) return true;
//     instance = instance.parent;
//   }
// }
// function updateProps(instance, rawProps, rawPrevProps, optimized) {
//   const {
//     props,
//     attrs,
//     vnode: {
//       patchFlag
//     }
//   } = instance;
//   const rawCurrentProps = reactivity_esm_bundler_toRaw(props);
//   const [options] = instance.propsOptions;
//   let hasAttrsChanged = false;
//   if (
//   // always force full diff in dev
//   // - #1942 if hmr is enabled with sfc component
//   // - vite#872 non-sfc component used by sfc component
//    true && (optimized || patchFlag > 0) && !(patchFlag & 16 /* PatchFlags.FULL_PROPS */)) {
//     if (patchFlag & 8 /* PatchFlags.PROPS */) {
//       // Compiler-generated props & no keys change, just set the updated
//       // the props.
//       const propsToUpdate = instance.vnode.dynamicProps;
//       for (let i = 0; i < propsToUpdate.length; i++) {
//         let key = propsToUpdate[i];
//         // skip if the prop key is a declared emit event listener
//         if (isEmitListener(instance.emitsOptions, key)) {
//           continue;
//         }
//         // PROPS flag guarantees rawProps to be non-null
//         const value = rawProps[key];
//         if (options) {
//           // attr / props separation was done on init and will be consistent
//           // in this code path, so just check if attrs have it.
//           if (shared_esm_bundler_hasOwn(attrs, key)) {
//             if (value !== attrs[key]) {
//               attrs[key] = value;
//               hasAttrsChanged = true;
//             }
//           } else {
//             const camelizedKey = camelize(key);
//             props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false /* isAbsent */);
//           }
//         } else {
//           if (value !== attrs[key]) {
//             attrs[key] = value;
//             hasAttrsChanged = true;
//           }
//         }
//       }
//     }
//   } else {
//     // full props update.
//     if (setFullProps(instance, rawProps, props, attrs)) {
//       hasAttrsChanged = true;
//     }
//     // in case of dynamic props, check if we need to delete keys from
//     // the props object
//     let kebabKey;
//     for (const key in rawCurrentProps) {
//       if (!rawProps ||
//       // for camelCase
//       !shared_esm_bundler_hasOwn(rawProps, key) && (
//       // it's possible the original props was passed in as kebab-case
//       // and converted to camelCase (#955)
//       (kebabKey = shared_esm_bundler_hyphenate(key)) === key || !shared_esm_bundler_hasOwn(rawProps, kebabKey))) {
//         if (options) {
//           if (rawPrevProps && (
//           // for camelCase
//           rawPrevProps[key] !== undefined ||
//           // for kebab-case
//           rawPrevProps[kebabKey] !== undefined)) {
//             props[key] = resolvePropValue(options, rawCurrentProps, key, undefined, instance, true /* isAbsent */);
//           }
//         } else {
//           delete props[key];
//         }
//       }
//     }
//     // in the case of functional component w/o props declaration, props and
//     // attrs point to the same object so it should already have been updated.
//     if (attrs !== rawCurrentProps) {
//       for (const key in attrs) {
//         if (!rawProps || !shared_esm_bundler_hasOwn(rawProps, key) && !false) {
//           delete attrs[key];
//           hasAttrsChanged = true;
//         }
//       }
//     }
//   }
//   // trigger updates for $attrs in case it's used in component slots
//   if (hasAttrsChanged) {
//     trigger(instance, "set" /* TriggerOpTypes.SET */, '$attrs');
//   }
//   if (false) {}
// }
// function setFullProps(instance, rawProps, props, attrs) {
//   const [options, needCastKeys] = instance.propsOptions;
//   let hasAttrsChanged = false;
//   let rawCastValues;
//   if (rawProps) {
//     for (let key in rawProps) {
//       // key, ref are reserved and never passed down
//       if (shared_esm_bundler_isReservedProp(key)) {
//         continue;
//       }
//       const value = rawProps[key];
//       // prop option names are camelized during normalization, so to support
//       // kebab -> camel conversion here we need to camelize the key.
//       let camelKey;
//       if (options && shared_esm_bundler_hasOwn(options, camelKey = camelize(key))) {
//         if (!needCastKeys || !needCastKeys.includes(camelKey)) {
//           props[camelKey] = value;
//         } else {
//           (rawCastValues || (rawCastValues = {}))[camelKey] = value;
//         }
//       } else if (!isEmitListener(instance.emitsOptions, key)) {
//         if (!(key in attrs) || value !== attrs[key]) {
//           attrs[key] = value;
//           hasAttrsChanged = true;
//         }
//       }
//     }
//   }
//   if (needCastKeys) {
//     const rawCurrentProps = reactivity_esm_bundler_toRaw(props);
//     const castValues = rawCastValues || shared_esm_bundler_EMPTY_OBJ;
//     for (let i = 0; i < needCastKeys.length; i++) {
//       const key = needCastKeys[i];
//       props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !shared_esm_bundler_hasOwn(castValues, key));
//     }
//   }
//   return hasAttrsChanged;
// }
// function resolvePropValue(options, props, key, value, instance, isAbsent) {
//   const opt = options[key];
//   if (opt != null) {
//     const hasDefault = shared_esm_bundler_hasOwn(opt, 'default');
//     // default values
//     if (hasDefault && value === undefined) {
//       const defaultValue = opt.default;
//       if (opt.type !== Function && shared_esm_bundler_isFunction(defaultValue)) {
//         const {
//           propsDefaults
//         } = instance;
//         if (key in propsDefaults) {
//           value = propsDefaults[key];
//         } else {
//           setCurrentInstance(instance);
//           value = propsDefaults[key] = defaultValue.call(null, props);
//           unsetCurrentInstance();
//         }
//       } else {
//         value = defaultValue;
//       }
//     }
//     // boolean casting
//     if (opt[0 /* BooleanFlags.shouldCast */]) {
//       if (isAbsent && !hasDefault) {
//         value = false;
//       } else if (opt[1 /* BooleanFlags.shouldCastTrue */] && (value === '' || value === shared_esm_bundler_hyphenate(key))) {
//         value = true;
//       }
//     }
//   }
//   return value;
// }
// function normalizePropsOptions(comp, appContext, asMixin = false) {
//   const cache = appContext.propsCache;
//   const cached = cache.get(comp);
//   if (cached) {
//     return cached;
//   }
//   const raw = comp.props;
//   const normalized = {};
//   const needCastKeys = [];
//   // apply mixin/extends props
//   let hasExtends = false;
//   if ( true && !shared_esm_bundler_isFunction(comp)) {
//     const extendProps = raw => {
//       hasExtends = true;
//       const [props, keys] = normalizePropsOptions(raw, appContext, true);
//       shared_esm_bundler_extend(normalized, props);
//       if (keys) needCastKeys.push(...keys);
//     };
//     if (!asMixin && appContext.mixins.length) {
//       appContext.mixins.forEach(extendProps);
//     }
//     if (comp.extends) {
//       extendProps(comp.extends);
//     }
//     if (comp.mixins) {
//       comp.mixins.forEach(extendProps);
//     }
//   }
//   if (!raw && !hasExtends) {
//     if (shared_esm_bundler_isObject(comp)) {
//       cache.set(comp, EMPTY_ARR);
//     }
//     return EMPTY_ARR;
//   }
//   if (shared_esm_bundler_isArray(raw)) {
//     for (let i = 0; i < raw.length; i++) {
//       if (false) {}
//       const normalizedKey = camelize(raw[i]);
//       if (validatePropName(normalizedKey)) {
//         normalized[normalizedKey] = shared_esm_bundler_EMPTY_OBJ;
//       }
//     }
//   } else if (raw) {
//     if (false) {}
//     for (const key in raw) {
//       const normalizedKey = camelize(key);
//       if (validatePropName(normalizedKey)) {
//         const opt = raw[key];
//         const prop = normalized[normalizedKey] = shared_esm_bundler_isArray(opt) || shared_esm_bundler_isFunction(opt) ? {
//           type: opt
//         } : Object.assign({}, opt);
//         if (prop) {
//           const booleanIndex = getTypeIndex(Boolean, prop.type);
//           const stringIndex = getTypeIndex(String, prop.type);
//           prop[0 /* BooleanFlags.shouldCast */] = booleanIndex > -1;
//           prop[1 /* BooleanFlags.shouldCastTrue */] = stringIndex < 0 || booleanIndex < stringIndex;
//           // if the prop needs boolean casting or default value
//           if (booleanIndex > -1 || shared_esm_bundler_hasOwn(prop, 'default')) {
//             needCastKeys.push(normalizedKey);
//           }
//         }
//       }
//     }
//   }
//   const res = [normalized, needCastKeys];
//   if (shared_esm_bundler_isObject(comp)) {
//     cache.set(comp, res);
//   }
//   return res;
// }
// function validatePropName(key) {
//   if (key[0] !== '$') {
//     return true;
//   } else if (false) {}
//   return false;
// }
// // use function string name to check type constructors
// // so that it works across vms / iframes.
// function getType(ctor) {
//   const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
//   return match ? match[1] : ctor === null ? 'null' : '';
// }
// function isSameType(a, b) {
//   return getType(a) === getType(b);
// }
// function getTypeIndex(type, expectedTypes) {
//   if (shared_esm_bundler_isArray(expectedTypes)) {
//     return expectedTypes.findIndex(t => isSameType(t, type));
//   } else if (shared_esm_bundler_isFunction(expectedTypes)) {
//     return isSameType(expectedTypes, type) ? 0 : -1;
//   }
//   return -1;
// }
// /**
//  * dev only
//  */
// function validateProps(rawProps, props, instance) {
//   const resolvedValues = toRaw(props);
//   const options = instance.propsOptions[0];
//   for (const key in options) {
//     let opt = options[key];
//     if (opt == null) continue;
//     validateProp(key, resolvedValues[key], opt, !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key)));
//   }
// }
// /**
//  * dev only
//  */
// function validateProp(name, value, prop, isAbsent) {
//   const {
//     type,
//     required,
//     validator
//   } = prop;
//   // required!
//   if (required && isAbsent) {
//     runtime_core_esm_bundler_warn('Missing required prop: "' + name + '"');
//     return;
//   }
//   // missing but optional
//   if (value == null && !prop.required) {
//     return;
//   }
//   // type check
//   if (type != null && type !== true) {
//     let isValid = false;
//     const types = isArray(type) ? type : [type];
//     const expectedTypes = [];
//     // value is valid as long as one of the specified types match
//     for (let i = 0; i < types.length && !isValid; i++) {
//       const {
//         valid,
//         expectedType
//       } = assertType(value, types[i]);
//       expectedTypes.push(expectedType || '');
//       isValid = valid;
//     }
//     if (!isValid) {
//       runtime_core_esm_bundler_warn(getInvalidTypeMessage(name, value, expectedTypes));
//       return;
//     }
//   }
//   // custom validator
//   if (validator && !validator(value)) {
//     runtime_core_esm_bundler_warn('Invalid prop: custom validator check failed for prop "' + name + '".');
//   }
// }
// const isSimpleType = /*#__PURE__*/(/* unused pure expression or super */ null && (makeMap('String,Number,Boolean,Function,Symbol,BigInt')));
// /**
//  * dev only
//  */
// function assertType(value, type) {
//   let valid;
//   const expectedType = getType(type);
//   if (isSimpleType(expectedType)) {
//     const t = typeof value;
//     valid = t === expectedType.toLowerCase();
//     // for primitive wrapper objects
//     if (!valid && t === 'object') {
//       valid = value instanceof type;
//     }
//   } else if (expectedType === 'Object') {
//     valid = isObject(value);
//   } else if (expectedType === 'Array') {
//     valid = isArray(value);
//   } else if (expectedType === 'null') {
//     valid = value === null;
//   } else {
//     valid = value instanceof type;
//   }
//   return {
//     valid,
//     expectedType
//   };
// }
// /**
//  * dev only
//  */
// function getInvalidTypeMessage(name, value, expectedTypes) {
//   let message = `Invalid prop: type check failed for prop "${name}".` + ` Expected ${expectedTypes.map(capitalize).join(' | ')}`;
//   const expectedType = expectedTypes[0];
//   const receivedType = toRawType(value);
//   const expectedValue = styleValue(value, expectedType);
//   const receivedValue = styleValue(value, receivedType);
//   // check if we need to specify expected value
//   if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
//     message += ` with value ${expectedValue}`;
//   }
//   message += `, got ${receivedType} `;
//   // check if we need to specify received value
//   if (isExplicable(receivedType)) {
//     message += `with value ${receivedValue}.`;
//   }
//   return message;
// }
// /**
//  * dev only
//  */
// function styleValue(value, type) {
//   if (type === 'String') {
//     return `"${value}"`;
//   } else if (type === 'Number') {
//     return `${Number(value)}`;
//   } else {
//     return `${value}`;
//   }
// }
// /**
//  * dev only
//  */
// function isExplicable(type) {
//   const explicitTypes = ['string', 'number', 'boolean'];
//   return explicitTypes.some(elem => type.toLowerCase() === elem);
// }
// /**
//  * dev only
//  */
// function isBoolean(...args) {
//   return args.some(elem => elem.toLowerCase() === 'boolean');
// }
// const isInternalKey = key => key[0] === '_' || key === '$stable';
// const normalizeSlotValue = value => shared_esm_bundler_isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
// const normalizeSlot = (key, rawSlot, ctx) => {
//   if (rawSlot._n) {
//     // already normalized - #5353
//     return rawSlot;
//   }
//   const normalized = withCtx((...args) => {
//     if (false) {}
//     return normalizeSlotValue(rawSlot(...args));
//   }, ctx);
//   normalized._c = false;
//   return normalized;
// };
// const normalizeObjectSlots = (rawSlots, slots, instance) => {
//   const ctx = rawSlots._ctx;
//   for (const key in rawSlots) {
//     if (isInternalKey(key)) continue;
//     const value = rawSlots[key];
//     if (shared_esm_bundler_isFunction(value)) {
//       slots[key] = normalizeSlot(key, value, ctx);
//     } else if (value != null) {
//       if (false) {}
//       const normalized = normalizeSlotValue(value);
//       slots[key] = () => normalized;
//     }
//   }
// };
// const normalizeVNodeSlots = (instance, children) => {
//   if (false) {}
//   const normalized = normalizeSlotValue(children);
//   instance.slots.default = () => normalized;
// };
// const initSlots = (instance, children) => {
//   if (instance.vnode.shapeFlag & 32 /* ShapeFlags.SLOTS_CHILDREN */) {
//     const type = children._;
//     if (type) {
//       // users can get the shallow readonly version of the slots object through `this.$slots`,
//       // we should avoid the proxy object polluting the slots of the internal instance
//       instance.slots = reactivity_esm_bundler_toRaw(children);
//       // make compiler marker non-enumerable
//       def(children, '_', type);
//     } else {
//       normalizeObjectSlots(children, instance.slots = {});
//     }
//   } else {
//     instance.slots = {};
//     if (children) {
//       normalizeVNodeSlots(instance, children);
//     }
//   }
//   def(instance.slots, InternalObjectKey, 1);
// };
// const updateSlots = (instance, children, optimized) => {
//   const {
//     vnode,
//     slots
//   } = instance;
//   let needDeletionCheck = true;
//   let deletionComparisonTarget = shared_esm_bundler_EMPTY_OBJ;
//   if (vnode.shapeFlag & 32 /* ShapeFlags.SLOTS_CHILDREN */) {
//     const type = children._;
//     if (type) {
//       // compiled slots.
//       if (false) {} else if (optimized && type === 1 /* SlotFlags.STABLE */) {
//         // compiled AND stable.
//         // no need to update, and skip stale slots removal.
//         needDeletionCheck = false;
//       } else {
//         // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
//         // normalization.
//         shared_esm_bundler_extend(slots, children);
//         // #2893
//         // when rendering the optimized slots by manually written render function,
//         // we need to delete the `slots._` flag if necessary to make subsequent updates reliable,
//         // i.e. let the `renderSlot` create the bailed Fragment
//         if (!optimized && type === 1 /* SlotFlags.STABLE */) {
//           delete slots._;
//         }
//       }
//     } else {
//       needDeletionCheck = !children.$stable;
//       normalizeObjectSlots(children, slots);
//     }
//     deletionComparisonTarget = children;
//   } else if (children) {
//     // non slot object children (direct value) passed to a component
//     normalizeVNodeSlots(instance, children);
//     deletionComparisonTarget = {
//       default: 1
//     };
//   }
//   // delete stale slots
//   if (needDeletionCheck) {
//     for (const key in slots) {
//       if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
//         delete slots[key];
//       }
//     }
//   }
// };
// function createAppContext() {
//   return {
//     app: null,
//     config: {
//       isNativeTag: shared_esm_bundler_NO,
//       performance: false,
//       globalProperties: {},
//       optionMergeStrategies: {},
//       errorHandler: undefined,
//       warnHandler: undefined,
//       compilerOptions: {}
//     },
//     mixins: [],
//     components: {},
//     directives: {},
//     provides: Object.create(null),
//     optionsCache: new WeakMap(),
//     propsCache: new WeakMap(),
//     emitsCache: new WeakMap()
//   };
// }
// let uid = 0;
// function createAppAPI(render, hydrate) {
//   return function createApp(rootComponent, rootProps = null) {
//     if (!shared_esm_bundler_isFunction(rootComponent)) {
//       rootComponent = Object.assign({}, rootComponent);
//     }
//     if (rootProps != null && !shared_esm_bundler_isObject(rootProps)) {
//        false && 0;
//       rootProps = null;
//     }
//     const context = createAppContext();
//     const installedPlugins = new Set();
//     let isMounted = false;
//     const app = context.app = {
//       _uid: uid++,
//       _component: rootComponent,
//       _props: rootProps,
//       _container: null,
//       _context: context,
//       _instance: null,
//       version,
//       get config() {
//         return context.config;
//       },
//       set config(v) {
//         if (false) {}
//       },
//       use(plugin, ...options) {
//         if (installedPlugins.has(plugin)) {
//            false && 0;
//         } else if (plugin && shared_esm_bundler_isFunction(plugin.install)) {
//           installedPlugins.add(plugin);
//           plugin.install(app, ...options);
//         } else if (shared_esm_bundler_isFunction(plugin)) {
//           installedPlugins.add(plugin);
//           plugin(app, ...options);
//         } else if (false) {}
//         return app;
//       },
//       mixin(mixin) {
//         if (true) {
//           if (!context.mixins.includes(mixin)) {
//             context.mixins.push(mixin);
//           } else if (false) {}
//         } else {}
//         return app;
//       },
//       component(name, component) {
//         if (false) {}
//         if (!component) {
//           return context.components[name];
//         }
//         if (false) {}
//         context.components[name] = component;
//         return app;
//       },
//       directive(name, directive) {
//         if (false) {}
//         if (!directive) {
//           return context.directives[name];
//         }
//         if (false) {}
//         context.directives[name] = directive;
//         return app;
//       },
//       mount(rootContainer, isHydrate, isSVG) {
//         if (!isMounted) {
//           // #5571
//           if (false) {}
//           const vnode = runtime_core_esm_bundler_createVNode(rootComponent, rootProps);
//           // store app context on the root VNode.
//           // this will be set on the root instance on initial mount.
//           vnode.appContext = context;
//           // HMR root reload
//           if (false) {}
//           if (isHydrate && hydrate) {
//             hydrate(vnode, rootContainer);
//           } else {
//             render(vnode, rootContainer, isSVG);
//           }
//           isMounted = true;
//           app._container = rootContainer;
//           rootContainer.__vue_app__ = app;
//           if (false) {}
//           return getExposeProxy(vnode.component) || vnode.component.proxy;
//         } else if (false) {}
//       },
//       unmount() {
//         if (isMounted) {
//           render(null, app._container);
//           if (false) {}
//           delete app._container.__vue_app__;
//         } else if (false) {}
//       },
//       provide(key, value) {
//         if (false) {}
//         context.provides[key] = value;
//         return app;
//       }
//     };
//     return app;
//   };
// }

// /**
//  * Function for handling a template ref
//  */
// function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
//   if (shared_esm_bundler_isArray(rawRef)) {
//     rawRef.forEach((r, i) => setRef(r, oldRawRef && (shared_esm_bundler_isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
//     return;
//   }
//   if (isAsyncWrapper(vnode) && !isUnmount) {
//     // when mounting async components, nothing needs to be done,
//     // because the template ref is forwarded to inner component
//     return;
//   }
//   const refValue = vnode.shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */ ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
//   const value = isUnmount ? null : refValue;
//   const {
//     i: owner,
//     r: ref
//   } = rawRef;
//   if (false) {}
//   const oldRef = oldRawRef && oldRawRef.r;
//   const refs = owner.refs === shared_esm_bundler_EMPTY_OBJ ? owner.refs = {} : owner.refs;
//   const setupState = owner.setupState;
//   // dynamic ref changed. unset old ref
//   if (oldRef != null && oldRef !== ref) {
//     if (shared_esm_bundler_isString(oldRef)) {
//       refs[oldRef] = null;
//       if (shared_esm_bundler_hasOwn(setupState, oldRef)) {
//         setupState[oldRef] = null;
//       }
//     } else if (reactivity_esm_bundler_isRef(oldRef)) {
//       oldRef.value = null;
//     }
//   }
//   if (shared_esm_bundler_isFunction(ref)) {
//     callWithErrorHandling(ref, owner, 12 /* ErrorCodes.FUNCTION_REF */, [value, refs]);
//   } else {
//     const _isString = shared_esm_bundler_isString(ref);
//     const _isRef = reactivity_esm_bundler_isRef(ref);
//     if (_isString || _isRef) {
//       const doSet = () => {
//         if (rawRef.f) {
//           const existing = _isString ? shared_esm_bundler_hasOwn(setupState, ref) ? setupState[ref] : refs[ref] : ref.value;
//           if (isUnmount) {
//             shared_esm_bundler_isArray(existing) && remove(existing, refValue);
//           } else {
//             if (!shared_esm_bundler_isArray(existing)) {
//               if (_isString) {
//                 refs[ref] = [refValue];
//                 if (shared_esm_bundler_hasOwn(setupState, ref)) {
//                   setupState[ref] = refs[ref];
//                 }
//               } else {
//                 ref.value = [refValue];
//                 if (rawRef.k) refs[rawRef.k] = ref.value;
//               }
//             } else if (!existing.includes(refValue)) {
//               existing.push(refValue);
//             }
//           }
//         } else if (_isString) {
//           refs[ref] = value;
//           if (shared_esm_bundler_hasOwn(setupState, ref)) {
//             setupState[ref] = value;
//           }
//         } else if (_isRef) {
//           ref.value = value;
//           if (rawRef.k) refs[rawRef.k] = value;
//         } else if (false) {}
//       };
//       if (value) {
//         doSet.id = -1;
//         queuePostRenderEffect(doSet, parentSuspense);
//       } else {
//         doSet();
//       }
//     } else if (false) {}
//   }
// }
// let hasMismatch = false;
// const isSVGContainer = container => /svg/.test(container.namespaceURI) && container.tagName !== 'foreignObject';
// const isComment = node => node.nodeType === 8 /* DOMNodeTypes.COMMENT */;
// // Note: hydration is DOM-specific
// // But we have to place it in core due to tight coupling with core - splitting
// // it out creates a ton of unnecessary complexity.
// // Hydration also depends on some renderer internal logic which needs to be
// // passed in via arguments.
// function createHydrationFunctions(rendererInternals) {
//   const {
//     mt: mountComponent,
//     p: patch,
//     o: {
//       patchProp,
//       createText,
//       nextSibling,
//       parentNode,
//       remove,
//       insert,
//       createComment
//     }
//   } = rendererInternals;
//   const hydrate = (vnode, container) => {
//     if (!container.hasChildNodes()) {
//        false && 0;
//       patch(null, vnode, container);
//       flushPostFlushCbs();
//       container._vnode = vnode;
//       return;
//     }
//     hasMismatch = false;
//     hydrateNode(container.firstChild, vnode, null, null, null);
//     flushPostFlushCbs();
//     container._vnode = vnode;
//     if (hasMismatch && !false) {
//       // this error should show up in production
//       console.error(`Hydration completed but contains mismatches.`);
//     }
//   };
//   const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
//     const isFragmentStart = isComment(node) && node.data === '[';
//     const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);
//     const {
//       type,
//       ref,
//       shapeFlag,
//       patchFlag
//     } = vnode;
//     let domType = node.nodeType;
//     vnode.el = node;
//     if (patchFlag === -2 /* PatchFlags.BAIL */) {
//       optimized = false;
//       vnode.dynamicChildren = null;
//     }
//     let nextNode = null;
//     switch (type) {
//       case Text:
//         if (domType !== 3 /* DOMNodeTypes.TEXT */) {
//           // #5728 empty text node inside a slot can cause hydration failure
//           // because the server rendered HTML won't contain a text node
//           if (vnode.children === '') {
//             insert(vnode.el = createText(''), parentNode(node), node);
//             nextNode = node;
//           } else {
//             nextNode = onMismatch();
//           }
//         } else {
//           if (node.data !== vnode.children) {
//             hasMismatch = true;
//              false && 0;
//             node.data = vnode.children;
//           }
//           nextNode = nextSibling(node);
//         }
//         break;
//       case Comment:
//         if (domType !== 8 /* DOMNodeTypes.COMMENT */ || isFragmentStart) {
//           nextNode = onMismatch();
//         } else {
//           nextNode = nextSibling(node);
//         }
//         break;
//       case runtime_core_esm_bundler_Static:
//         if (isFragmentStart) {
//           // entire template is static but SSRed as a fragment
//           node = nextSibling(node);
//           domType = node.nodeType;
//         }
//         if (domType === 1 /* DOMNodeTypes.ELEMENT */ || domType === 3 /* DOMNodeTypes.TEXT */) {
//           // determine anchor, adopt content
//           nextNode = node;
//           // if the static vnode has its content stripped during build,
//           // adopt it from the server-rendered HTML.
//           const needToAdoptContent = !vnode.children.length;
//           for (let i = 0; i < vnode.staticCount; i++) {
//             if (needToAdoptContent) vnode.children += nextNode.nodeType === 1 /* DOMNodeTypes.ELEMENT */ ? nextNode.outerHTML : nextNode.data;
//             if (i === vnode.staticCount - 1) {
//               vnode.anchor = nextNode;
//             }
//             nextNode = nextSibling(nextNode);
//           }
//           return isFragmentStart ? nextSibling(nextNode) : nextNode;
//         } else {
//           onMismatch();
//         }
//         break;
//       case runtime_core_esm_bundler_Fragment:
//         if (!isFragmentStart) {
//           nextNode = onMismatch();
//         } else {
//           nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
//         }
//         break;
//       default:
//         if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
//           if (domType !== 1 /* DOMNodeTypes.ELEMENT */ || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) {
//             nextNode = onMismatch();
//           } else {
//             nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
//           }
//         } else if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
//           // when setting up the render effect, if the initial vnode already
//           // has .el set, the component will perform hydration instead of mount
//           // on its sub-tree.
//           vnode.slotScopeIds = slotScopeIds;
//           const container = parentNode(node);
//           mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized);
//           // component may be async, so in the case of fragments we cannot rely
//           // on component's rendered output to determine the end of the fragment
//           // instead, we do a lookahead to find the end anchor node.
//           nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node);
//           // #4293 teleport as component root
//           if (nextNode && isComment(nextNode) && nextNode.data === 'teleport end') {
//             nextNode = nextSibling(nextNode);
//           }
//           // #3787
//           // if component is async, it may get moved / unmounted before its
//           // inner component is loaded, so we need to give it a placeholder
//           // vnode that matches its adopted DOM.
//           if (isAsyncWrapper(vnode)) {
//             let subTree;
//             if (isFragmentStart) {
//               subTree = runtime_core_esm_bundler_createVNode(runtime_core_esm_bundler_Fragment);
//               subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
//             } else {
//               subTree = node.nodeType === 3 ? createTextVNode('') : runtime_core_esm_bundler_createVNode('div');
//             }
//             subTree.el = node;
//             vnode.component.subTree = subTree;
//           }
//         } else if (shapeFlag & 64 /* ShapeFlags.TELEPORT */) {
//           if (domType !== 8 /* DOMNodeTypes.COMMENT */) {
//             nextNode = onMismatch();
//           } else {
//             nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
//           }
//         } else if (shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//           nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
//         } else if (false) {}
//     }
//     if (ref != null) {
//       setRef(ref, null, parentSuspense, vnode);
//     }
//     return nextNode;
//   };
//   const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
//     optimized = optimized || !!vnode.dynamicChildren;
//     const {
//       type,
//       props,
//       patchFlag,
//       shapeFlag,
//       dirs
//     } = vnode;
//     // #4006 for form elements with non-string v-model value bindings
//     // e.g. <option :value="obj">, <input type="checkbox" :true-value="1">
//     const forcePatchValue = type === 'input' && dirs || type === 'option';
//     // skip props & children if this is hoisted static nodes
//     // #5405 in dev, always hydrate children for HMR
//     if ( false || forcePatchValue || patchFlag !== -1 /* PatchFlags.HOISTED */) {
//       if (dirs) {
//         invokeDirectiveHook(vnode, null, parentComponent, 'created');
//       }
//       // props
//       if (props) {
//         if (forcePatchValue || !optimized || patchFlag & (16 /* PatchFlags.FULL_PROPS */ | 32 /* PatchFlags.HYDRATE_EVENTS */)) {
//           for (const key in props) {
//             if (forcePatchValue && key.endsWith('value') || isOn(key) && !isReservedProp(key)) {
//               patchProp(el, key, null, props[key], false, undefined, parentComponent);
//             }
//           }
//         } else if (props.onClick) {
//           // Fast path for click listeners (which is most often) to avoid
//           // iterating through props.
//           patchProp(el, 'onClick', null, props.onClick, false, undefined, parentComponent);
//         }
//       }
//       // vnode / directive hooks
//       let vnodeHooks;
//       if (vnodeHooks = props && props.onVnodeBeforeMount) {
//         invokeVNodeHook(vnodeHooks, parentComponent, vnode);
//       }
//       if (dirs) {
//         invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
//       }
//       if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
//         queueEffectWithSuspense(() => {
//           vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
//           dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
//         }, parentSuspense);
//       }
//       // children
//       if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */ &&
//       // skip if element has innerHTML / textContent
//       !(props && (props.innerHTML || props.textContent))) {
//         let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);
//         let hasWarned = false;
//         while (next) {
//           hasMismatch = true;
//           if (false) {}
//           // The SSRed DOM contains more nodes than it should. Remove them.
//           const cur = next;
//           next = next.nextSibling;
//           remove(cur);
//         }
//       } else if (shapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
//         if (el.textContent !== vnode.children) {
//           hasMismatch = true;
//            false && 0;
//           el.textContent = vnode.children;
//         }
//       }
//     }
//     return el.nextSibling;
//   };
//   const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
//     optimized = optimized || !!parentVNode.dynamicChildren;
//     const children = parentVNode.children;
//     const l = children.length;
//     let hasWarned = false;
//     for (let i = 0; i < l; i++) {
//       const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
//       if (node) {
//         node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
//       } else if (vnode.type === Text && !vnode.children) {
//         continue;
//       } else {
//         hasMismatch = true;
//         if (false) {}
//         // the SSRed DOM didn't contain enough nodes. Mount the missing ones.
//         patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
//       }
//     }
//     return node;
//   };
//   const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
//     const {
//       slotScopeIds: fragmentSlotScopeIds
//     } = vnode;
//     if (fragmentSlotScopeIds) {
//       slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
//     }
//     const container = parentNode(node);
//     const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);
//     if (next && isComment(next) && next.data === ']') {
//       return nextSibling(vnode.anchor = next);
//     } else {
//       // fragment didn't hydrate successfully, since we didn't get a end anchor
//       // back. This should have led to node/children mismatch warnings.
//       hasMismatch = true;
//       // since the anchor is missing, we need to create one and insert it
//       insert(vnode.anchor = createComment(`]`), container, next);
//       return next;
//     }
//   };
//   const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
//     hasMismatch = true;
//      false && 0;
//     vnode.el = null;
//     if (isFragment) {
//       // remove excessive fragment nodes
//       const end = locateClosingAsyncAnchor(node);
//       while (true) {
//         const next = nextSibling(node);
//         if (next && next !== end) {
//           remove(next);
//         } else {
//           break;
//         }
//       }
//     }
//     const next = nextSibling(node);
//     const container = parentNode(node);
//     remove(node);
//     patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
//     return next;
//   };
//   const locateClosingAsyncAnchor = node => {
//     let match = 0;
//     while (node) {
//       node = nextSibling(node);
//       if (node && isComment(node)) {
//         if (node.data === '[') match++;
//         if (node.data === ']') {
//           if (match === 0) {
//             return nextSibling(node);
//           } else {
//             match--;
//           }
//         }
//       }
//     }
//     return node;
//   };
//   return [hydrate, hydrateNode];
// }

// /* eslint-disable no-restricted-globals */
// let supported;
// let perf;
// function startMeasure(instance, type) {
//   if (instance.appContext.config.performance && isSupported()) {
//     perf.mark(`vue-${type}-${instance.uid}`);
//   }
//   if (false) {}
// }
// function endMeasure(instance, type) {
//   if (instance.appContext.config.performance && isSupported()) {
//     const startTag = `vue-${type}-${instance.uid}`;
//     const endTag = startTag + `:end`;
//     perf.mark(endTag);
//     perf.measure(`<${formatComponentName(instance, instance.type)}> ${type}`, startTag, endTag);
//     perf.clearMarks(startTag);
//     perf.clearMarks(endTag);
//   }
//   if (false) {}
// }
// function isSupported() {
//   if (supported !== undefined) {
//     return supported;
//   }
//   if (typeof window !== 'undefined' && window.performance) {
//     supported = true;
//     perf = window.performance;
//   } else {
//     supported = false;
//   }
//   return supported;
// }

// /**
//  * This is only called in esm-bundler builds.
//  * It is called when a renderer is created, in `baseCreateRenderer` so that
//  * importing runtime-core is side-effects free.
//  *
//  * istanbul-ignore-next
//  */
// function initFeatureFlags() {
//   const needWarn = [];
//   if (false) {}
//   if (false) {}
//   if (false) {}
// }
// const queuePostRenderEffect = queueEffectWithSuspense;
// /**
//  * The createRenderer function accepts two generic arguments:
//  * HostNode and HostElement, corresponding to Node and Element types in the
//  * host environment. For example, for runtime-dom, HostNode would be the DOM
//  * `Node` interface and HostElement would be the DOM `Element` interface.
//  *
//  * Custom renderers can pass in the platform specific types like this:
//  *
//  * ``` js
//  * const { render, createApp } = createRenderer<Node, Element>({
//  *   patchProp,
//  *   ...nodeOps
//  * })
//  * ```
//  */
// function createRenderer(options) {
//   return baseCreateRenderer(options);
// }
// // Separate API for creating hydration-enabled renderer.
// // Hydration logic is only used when calling this function, making it
// // tree-shakable.
// function runtime_core_esm_bundler_createHydrationRenderer(options) {
//   return baseCreateRenderer(options, createHydrationFunctions);
// }
// // implementation
// function baseCreateRenderer(options, createHydrationFns) {
//   // compile-time feature flags check
//   {
//     initFeatureFlags();
//   }
//   const target = getGlobalThis();
//   target.__VUE__ = true;
//   if (false) {}
//   const {
//     insert: hostInsert,
//     remove: hostRemove,
//     patchProp: hostPatchProp,
//     createElement: hostCreateElement,
//     createText: hostCreateText,
//     createComment: hostCreateComment,
//     setText: hostSetText,
//     setElementText: hostSetElementText,
//     parentNode: hostParentNode,
//     nextSibling: hostNextSibling,
//     setScopeId: hostSetScopeId = shared_esm_bundler_NOOP,
//     insertStaticContent: hostInsertStaticContent
//   } = options;
//   // Note: functions inside this closure should use `const xxx = () => {}`
//   // style in order to prevent being inlined by minifiers.
//   const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized =  false ? 0 : !!n2.dynamicChildren) => {
//     if (n1 === n2) {
//       return;
//     }
//     // patching & not same type, unmount old tree
//     if (n1 && !isSameVNodeType(n1, n2)) {
//       anchor = getNextHostNode(n1);
//       unmount(n1, parentComponent, parentSuspense, true);
//       n1 = null;
//     }
//     if (n2.patchFlag === -2 /* PatchFlags.BAIL */) {
//       optimized = false;
//       n2.dynamicChildren = null;
//     }
//     const {
//       type,
//       ref,
//       shapeFlag
//     } = n2;
//     switch (type) {
//       case Text:
//         processText(n1, n2, container, anchor);
//         break;
//       case Comment:
//         processCommentNode(n1, n2, container, anchor);
//         break;
//       case runtime_core_esm_bundler_Static:
//         if (n1 == null) {
//           mountStaticNode(n2, container, anchor, isSVG);
//         } else if (false) {}
//         break;
//       case runtime_core_esm_bundler_Fragment:
//         processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         break;
//       default:
//         if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
//           processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         } else if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
//           processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         } else if (shapeFlag & 64 /* ShapeFlags.TELEPORT */) {
//           type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
//         } else if (shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//           type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
//         } else if (false) {}
//     }
//     // set ref
//     if (ref != null && parentComponent) {
//       setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
//     }
//   };
//   const processText = (n1, n2, container, anchor) => {
//     if (n1 == null) {
//       hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
//     } else {
//       const el = n2.el = n1.el;
//       if (n2.children !== n1.children) {
//         hostSetText(el, n2.children);
//       }
//     }
//   };
//   const processCommentNode = (n1, n2, container, anchor) => {
//     if (n1 == null) {
//       hostInsert(n2.el = hostCreateComment(n2.children || ''), container, anchor);
//     } else {
//       // there's no support for dynamic comments
//       n2.el = n1.el;
//     }
//   };
//   const mountStaticNode = (n2, container, anchor, isSVG) => {
//     [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
//   };
//   /**
//    * Dev / HMR only
//    */
//   const patchStaticNode = (n1, n2, container, isSVG) => {
//     // static nodes are only patched during dev for HMR
//     if (n2.children !== n1.children) {
//       const anchor = hostNextSibling(n1.anchor);
//       // remove existing
//       removeStaticNode(n1);
//       [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
//     } else {
//       n2.el = n1.el;
//       n2.anchor = n1.anchor;
//     }
//   };
//   const moveStaticNode = ({
//     el,
//     anchor
//   }, container, nextSibling) => {
//     let next;
//     while (el && el !== anchor) {
//       next = hostNextSibling(el);
//       hostInsert(el, container, nextSibling);
//       el = next;
//     }
//     hostInsert(anchor, container, nextSibling);
//   };
//   const removeStaticNode = ({
//     el,
//     anchor
//   }) => {
//     let next;
//     while (el && el !== anchor) {
//       next = hostNextSibling(el);
//       hostRemove(el);
//       el = next;
//     }
//     hostRemove(anchor);
//   };
//   const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
//     isSVG = isSVG || n2.type === 'svg';
//     if (n1 == null) {
//       mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//     } else {
//       patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//     }
//   };
//   const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
//     let el;
//     let vnodeHook;
//     const {
//       type,
//       props,
//       shapeFlag,
//       transition,
//       dirs
//     } = vnode;
//     el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
//     // mount children first, since some props may rely on child content
//     // being already rendered, e.g. `<select value>`
//     if (shapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
//       hostSetElementText(el, vnode.children);
//     } else if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//       mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', slotScopeIds, optimized);
//     }
//     if (dirs) {
//       invokeDirectiveHook(vnode, null, parentComponent, 'created');
//     }
//     // props
//     if (props) {
//       for (const key in props) {
//         if (key !== 'value' && !shared_esm_bundler_isReservedProp(key)) {
//           hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
//         }
//       }
//       /**
//        * Special case for setting value on DOM elements:
//        * - it can be order-sensitive (e.g. should be set *after* min/max, #2325, #4024)
//        * - it needs to be forced (#1471)
//        * #2353 proposes adding another renderer option to configure this, but
//        * the properties affects are so finite it is worth special casing it
//        * here to reduce the complexity. (Special casing it also should not
//        * affect non-DOM renderers)
//        */
//       if ('value' in props) {
//         hostPatchProp(el, 'value', null, props.value);
//       }
//       if (vnodeHook = props.onVnodeBeforeMount) {
//         invokeVNodeHook(vnodeHook, parentComponent, vnode);
//       }
//     }
//     // scopeId
//     setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
//     if (false) {}
//     if (dirs) {
//       invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
//     }
//     // #1583 For inside suspense + suspense not resolved case, enter hook should call when suspense resolved
//     // #1689 For inside suspense + suspense resolved case, just call it
//     const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
//     if (needCallTransitionHooks) {
//       transition.beforeEnter(el);
//     }
//     hostInsert(el, container, anchor);
//     if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
//       queuePostRenderEffect(() => {
//         vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
//         needCallTransitionHooks && transition.enter(el);
//         dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
//       }, parentSuspense);
//     }
//   };
//   const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
//     if (scopeId) {
//       hostSetScopeId(el, scopeId);
//     }
//     if (slotScopeIds) {
//       for (let i = 0; i < slotScopeIds.length; i++) {
//         hostSetScopeId(el, slotScopeIds[i]);
//       }
//     }
//     if (parentComponent) {
//       let subTree = parentComponent.subTree;
//       if (false /* PatchFlags.DEV_ROOT_FRAGMENT */) {}
//       if (vnode === subTree) {
//         const parentVNode = parentComponent.vnode;
//         setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
//       }
//     }
//   };
//   const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
//     for (let i = start; i < children.length; i++) {
//       const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
//       patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//     }
//   };
//   const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
//     const el = n2.el = n1.el;
//     let {
//       patchFlag,
//       dynamicChildren,
//       dirs
//     } = n2;
//     // #1426 take the old vnode's patch flag into account since user may clone a
//     // compiler-generated vnode, which de-opts to FULL_PROPS
//     patchFlag |= n1.patchFlag & 16 /* PatchFlags.FULL_PROPS */;
//     const oldProps = n1.props || shared_esm_bundler_EMPTY_OBJ;
//     const newProps = n2.props || shared_esm_bundler_EMPTY_OBJ;
//     let vnodeHook;
//     // disable recurse in beforeUpdate hooks
//     parentComponent && toggleRecurse(parentComponent, false);
//     if (vnodeHook = newProps.onVnodeBeforeUpdate) {
//       invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
//     }
//     if (dirs) {
//       invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
//     }
//     parentComponent && toggleRecurse(parentComponent, true);
//     if (false) {}
//     const areChildrenSVG = isSVG && n2.type !== 'foreignObject';
//     if (dynamicChildren) {
//       patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
//       if (false) {}
//     } else if (!optimized) {
//       // full diff
//       patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
//     }
//     if (patchFlag > 0) {
//       // the presence of a patchFlag means this element's render code was
//       // generated by the compiler and can take the fast path.
//       // in this path old node and new node are guaranteed to have the same shape
//       // (i.e. at the exact same position in the source template)
//       if (patchFlag & 16 /* PatchFlags.FULL_PROPS */) {
//         // element props contain dynamic keys, full diff needed
//         patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
//       } else {
//         // class
//         // this flag is matched when the element has dynamic class bindings.
//         if (patchFlag & 2 /* PatchFlags.CLASS */) {
//           if (oldProps.class !== newProps.class) {
//             hostPatchProp(el, 'class', null, newProps.class, isSVG);
//           }
//         }
//         // style
//         // this flag is matched when the element has dynamic style bindings
//         if (patchFlag & 4 /* PatchFlags.STYLE */) {
//           hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
//         }
//         // props
//         // This flag is matched when the element has dynamic prop/attr bindings
//         // other than class and style. The keys of dynamic prop/attrs are saved for
//         // faster iteration.
//         // Note dynamic keys like :[foo]="bar" will cause this optimization to
//         // bail out and go through a full diff because we need to unset the old key
//         if (patchFlag & 8 /* PatchFlags.PROPS */) {
//           // if the flag is present then dynamicProps must be non-null
//           const propsToUpdate = n2.dynamicProps;
//           for (let i = 0; i < propsToUpdate.length; i++) {
//             const key = propsToUpdate[i];
//             const prev = oldProps[key];
//             const next = newProps[key];
//             // #1471 force patch value
//             if (next !== prev || key === 'value') {
//               hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
//             }
//           }
//         }
//       }
//       // text
//       // This flag is matched when the element has only dynamic text children.
//       if (patchFlag & 1 /* PatchFlags.TEXT */) {
//         if (n1.children !== n2.children) {
//           hostSetElementText(el, n2.children);
//         }
//       }
//     } else if (!optimized && dynamicChildren == null) {
//       // unoptimized, full diff
//       patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
//     }
//     if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
//       queuePostRenderEffect(() => {
//         vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
//         dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
//       }, parentSuspense);
//     }
//   };
//   // The fast path for blocks.
//   const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
//     for (let i = 0; i < newChildren.length; i++) {
//       const oldVNode = oldChildren[i];
//       const newVNode = newChildren[i];
//       // Determine the container (parent element) for the patch.
//       const container =
//       // oldVNode may be an errored async setup() component inside Suspense
//       // which will not have a mounted element
//       oldVNode.el && (
//       // - In the case of a Fragment, we need to provide the actual parent
//       // of the Fragment itself so it can move its children.
//       oldVNode.type === runtime_core_esm_bundler_Fragment ||
//       // - In the case of different nodes, there is going to be a replacement
//       // which also requires the correct parent container
//       !isSameVNodeType(oldVNode, newVNode) ||
//       // - In the case of a component, it could contain anything.
//       oldVNode.shapeFlag & (6 /* ShapeFlags.COMPONENT */ | 64 /* ShapeFlags.TELEPORT */)) ? hostParentNode(oldVNode.el) :
//       // In other cases, the parent container is not actually used so we
//       // just pass the block element here to avoid a DOM parentNode call.
//       fallbackContainer;
//       patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
//     }
//   };
//   const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
//     if (oldProps !== newProps) {
//       if (oldProps !== shared_esm_bundler_EMPTY_OBJ) {
//         for (const key in oldProps) {
//           if (!shared_esm_bundler_isReservedProp(key) && !(key in newProps)) {
//             hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
//           }
//         }
//       }
//       for (const key in newProps) {
//         // empty string is not valid prop
//         if (shared_esm_bundler_isReservedProp(key)) continue;
//         const next = newProps[key];
//         const prev = oldProps[key];
//         // defer patching value
//         if (next !== prev && key !== 'value') {
//           hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
//         }
//       }
//       if ('value' in newProps) {
//         hostPatchProp(el, 'value', oldProps.value, newProps.value);
//       }
//     }
//   };
//   const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
//     const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText('');
//     const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText('');
//     let {
//       patchFlag,
//       dynamicChildren,
//       slotScopeIds: fragmentSlotScopeIds
//     } = n2;
//     if (false) {}
//     // check if this is a slot fragment with :slotted scope ids
//     if (fragmentSlotScopeIds) {
//       slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
//     }
//     if (n1 == null) {
//       hostInsert(fragmentStartAnchor, container, anchor);
//       hostInsert(fragmentEndAnchor, container, anchor);
//       // a fragment can only have array children
//       // since they are either generated by the compiler, or implicitly created
//       // from arrays.
//       mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//     } else {
//       if (patchFlag > 0 && patchFlag & 64 /* PatchFlags.STABLE_FRAGMENT */ && dynamicChildren &&
//       // #2715 the previous fragment could've been a BAILed one as a result
//       // of renderSlot() with no valid children
//       n1.dynamicChildren) {
//         // a stable fragment (template root or <template v-for>) doesn't need to
//         // patch children order, but it may contain dynamicChildren.
//         patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
//         if (false) {} else if (
//         // #2080 if the stable fragment has a key, it's a <template v-for> that may
//         //  get moved around. Make sure all root level vnodes inherit el.
//         // #2134 or if it's a component root, it may also get moved around
//         // as the component is being moved.
//         n2.key != null || parentComponent && n2 === parentComponent.subTree) {
//           traverseStaticChildren(n1, n2, true /* shallow */);
//         }
//       } else {
//         // keyed / unkeyed, or manual fragments.
//         // for keyed & unkeyed, since they are compiler generated from v-for,
//         // each child is guaranteed to be a block so the fragment will never
//         // have dynamicChildren.
//         patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//       }
//     }
//   };
//   const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
//     n2.slotScopeIds = slotScopeIds;
//     if (n1 == null) {
//       if (n2.shapeFlag & 512 /* ShapeFlags.COMPONENT_KEPT_ALIVE */) {
//         parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
//       } else {
//         mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
//       }
//     } else {
//       updateComponent(n1, n2, optimized);
//     }
//   };
//   const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
//     const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
//     if (false) {}
//     if (false) {}
//     // inject renderer internals for keepAlive
//     if (isKeepAlive(initialVNode)) {
//       instance.ctx.renderer = internals;
//     }
//     // resolve props and slots for setup context
//     {
//       if (false) {}
//       setupComponent(instance);
//       if (false) {}
//     }
//     // setup() is async. This component relies on async logic to be resolved
//     // before proceeding
//     if (instance.asyncDep) {
//       parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
//       // Give it a placeholder if this is not hydration
//       // TODO handle self-defined fallback
//       if (!initialVNode.el) {
//         const placeholder = instance.subTree = runtime_core_esm_bundler_createVNode(Comment);
//         processCommentNode(null, placeholder, container, anchor);
//       }
//       return;
//     }
//     setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
//     if (false) {}
//   };
//   const updateComponent = (n1, n2, optimized) => {
//     const instance = n2.component = n1.component;
//     if (shouldUpdateComponent(n1, n2, optimized)) {
//       if (instance.asyncDep && !instance.asyncResolved) {
//         // async & still pending - just update props and slots
//         // since the component's reactive effect for render isn't set-up yet
//         if (false) {}
//         updateComponentPreRender(instance, n2, optimized);
//         if (false) {}
//         return;
//       } else {
//         // normal update
//         instance.next = n2;
//         // in case the child component is also queued, remove it to avoid
//         // double updating the same child component in the same flush.
//         invalidateJob(instance.update);
//         // instance.update is the reactive effect.
//         instance.update();
//       }
//     } else {
//       // no update needed. just copy over properties
//       n2.el = n1.el;
//       instance.vnode = n2;
//     }
//   };
//   const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
//     const componentUpdateFn = () => {
//       if (!instance.isMounted) {
//         let vnodeHook;
//         const {
//           el,
//           props
//         } = initialVNode;
//         const {
//           bm,
//           m,
//           parent
//         } = instance;
//         const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
//         toggleRecurse(instance, false);
//         // beforeMount hook
//         if (bm) {
//           invokeArrayFns(bm);
//         }
//         // onVnodeBeforeMount
//         if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
//           invokeVNodeHook(vnodeHook, parent, initialVNode);
//         }
//         toggleRecurse(instance, true);
//         if (el && hydrateNode) {
//           // vnode has adopted host node - perform hydration instead of mount.
//           const hydrateSubTree = () => {
//             if (false) {}
//             instance.subTree = renderComponentRoot(instance);
//             if (false) {}
//             if (false) {}
//             hydrateNode(el, instance.subTree, instance, parentSuspense, null);
//             if (false) {}
//           };
//           if (isAsyncWrapperVNode) {
//             initialVNode.type.__asyncLoader().then(
//             // note: we are moving the render call into an async callback,
//             // which means it won't track dependencies - but it's ok because
//             // a server-rendered async wrapper is already in resolved state
//             // and it will never need to change.
//             () => !instance.isUnmounted && hydrateSubTree());
//           } else {
//             hydrateSubTree();
//           }
//         } else {
//           if (false) {}
//           const subTree = instance.subTree = renderComponentRoot(instance);
//           if (false) {}
//           if (false) {}
//           patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
//           if (false) {}
//           initialVNode.el = subTree.el;
//         }
//         // mounted hook
//         if (m) {
//           queuePostRenderEffect(m, parentSuspense);
//         }
//         // onVnodeMounted
//         if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
//           const scopedInitialVNode = initialVNode;
//           queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
//         }
//         // activated hook for keep-alive roots.
//         // #1742 activated hook must be accessed after first render
//         // since the hook may be injected by a child keep-alive
//         if (initialVNode.shapeFlag & 256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */ || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */) {
//           instance.a && queuePostRenderEffect(instance.a, parentSuspense);
//         }
//         instance.isMounted = true;
//         if (false) {}
//         // #2458: deference mount-only object parameters to prevent memleaks
//         initialVNode = container = anchor = null;
//       } else {
//         // updateComponent
//         // This is triggered by mutation of component's own state (next: null)
//         // OR parent calling processComponent (next: VNode)
//         let {
//           next,
//           bu,
//           u,
//           parent,
//           vnode
//         } = instance;
//         let originNext = next;
//         let vnodeHook;
//         if (false) {}
//         // Disallow component effect recursion during pre-lifecycle hooks.
//         toggleRecurse(instance, false);
//         if (next) {
//           next.el = vnode.el;
//           updateComponentPreRender(instance, next, optimized);
//         } else {
//           next = vnode;
//         }
//         // beforeUpdate hook
//         if (bu) {
//           invokeArrayFns(bu);
//         }
//         // onVnodeBeforeUpdate
//         if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
//           invokeVNodeHook(vnodeHook, parent, next, vnode);
//         }
//         toggleRecurse(instance, true);
//         // render
//         if (false) {}
//         const nextTree = renderComponentRoot(instance);
//         if (false) {}
//         const prevTree = instance.subTree;
//         instance.subTree = nextTree;
//         if (false) {}
//         patch(prevTree, nextTree,
//         // parent may have changed if it's in a teleport
//         hostParentNode(prevTree.el),
//         // anchor may have changed if it's in a fragment
//         getNextHostNode(prevTree), instance, parentSuspense, isSVG);
//         if (false) {}
//         next.el = nextTree.el;
//         if (originNext === null) {
//           // self-triggered update. In case of HOC, update parent component
//           // vnode el. HOC is indicated by parent instance's subTree pointing
//           // to child component's vnode
//           updateHOCHostEl(instance, nextTree.el);
//         }
//         // updated hook
//         if (u) {
//           queuePostRenderEffect(u, parentSuspense);
//         }
//         // onVnodeUpdated
//         if (vnodeHook = next.props && next.props.onVnodeUpdated) {
//           queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
//         }
//         if (false) {}
//         if (false) {}
//       }
//     };
//     // create reactive effect for rendering
//     const effect = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(update), instance.scope // track it in component's effect scope
//     );

//     const update = instance.update = () => effect.run();
//     update.id = instance.uid;
//     // allowRecurse
//     // #1801, #2043 component render effects should allow recursive updates
//     toggleRecurse(instance, true);
//     if (false) {}
//     update();
//   };
//   const updateComponentPreRender = (instance, nextVNode, optimized) => {
//     nextVNode.component = instance;
//     const prevProps = instance.vnode.props;
//     instance.vnode = nextVNode;
//     instance.next = null;
//     updateProps(instance, nextVNode.props, prevProps, optimized);
//     updateSlots(instance, nextVNode.children, optimized);
//     pauseTracking();
//     // props update may have triggered pre-flush watchers.
//     // flush them before the render update.
//     flushPreFlushCbs();
//     resetTracking();
//   };
//   const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
//     const c1 = n1 && n1.children;
//     const prevShapeFlag = n1 ? n1.shapeFlag : 0;
//     const c2 = n2.children;
//     const {
//       patchFlag,
//       shapeFlag
//     } = n2;
//     // fast path
//     if (patchFlag > 0) {
//       if (patchFlag & 128 /* PatchFlags.KEYED_FRAGMENT */) {
//         // this could be either fully-keyed or mixed (some keyed some not)
//         // presence of patchFlag means children are guaranteed to be arrays
//         patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         return;
//       } else if (patchFlag & 256 /* PatchFlags.UNKEYED_FRAGMENT */) {
//         // unkeyed
//         patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         return;
//       }
//     }
//     // children has 3 possibilities: text, array or no children.
//     if (shapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
//       // text children fast path
//       if (prevShapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//         unmountChildren(c1, parentComponent, parentSuspense);
//       }
//       if (c2 !== c1) {
//         hostSetElementText(container, c2);
//       }
//     } else {
//       if (prevShapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//         // prev children was array
//         if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//           // two arrays, cannot assume anything, do full diff
//           patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         } else {
//           // no new children, just unmount old
//           unmountChildren(c1, parentComponent, parentSuspense, true);
//         }
//       } else {
//         // prev children was text OR null
//         // new children is array OR null
//         if (prevShapeFlag & 8 /* ShapeFlags.TEXT_CHILDREN */) {
//           hostSetElementText(container, '');
//         }
//         // mount new if array
//         if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//           mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         }
//       }
//     }
//   };
//   const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
//     c1 = c1 || EMPTY_ARR;
//     c2 = c2 || EMPTY_ARR;
//     const oldLength = c1.length;
//     const newLength = c2.length;
//     const commonLength = Math.min(oldLength, newLength);
//     let i;
//     for (i = 0; i < commonLength; i++) {
//       const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
//       patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//     }
//     if (oldLength > newLength) {
//       // remove old
//       unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
//     } else {
//       // mount new
//       mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
//     }
//   };
//   // can be all-keyed or mixed
//   const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
//     let i = 0;
//     const l2 = c2.length;
//     let e1 = c1.length - 1; // prev ending index
//     let e2 = l2 - 1; // next ending index
//     // 1. sync from start
//     // (a b) c
//     // (a b) d e
//     while (i <= e1 && i <= e2) {
//       const n1 = c1[i];
//       const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
//       if (isSameVNodeType(n1, n2)) {
//         patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//       } else {
//         break;
//       }
//       i++;
//     }
//     // 2. sync from end
//     // a (b c)
//     // d e (b c)
//     while (i <= e1 && i <= e2) {
//       const n1 = c1[e1];
//       const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
//       if (isSameVNodeType(n1, n2)) {
//         patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//       } else {
//         break;
//       }
//       e1--;
//       e2--;
//     }
//     // 3. common sequence + mount
//     // (a b)
//     // (a b) c
//     // i = 2, e1 = 1, e2 = 2
//     // (a b)
//     // c (a b)
//     // i = 0, e1 = -1, e2 = 0
//     if (i > e1) {
//       if (i <= e2) {
//         const nextPos = e2 + 1;
//         const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
//         while (i <= e2) {
//           patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//           i++;
//         }
//       }
//     }
//     // 4. common sequence + unmount
//     // (a b) c
//     // (a b)
//     // i = 2, e1 = 2, e2 = 1
//     // a (b c)
//     // (b c)
//     // i = 0, e1 = 0, e2 = -1
//     else if (i > e2) {
//       while (i <= e1) {
//         unmount(c1[i], parentComponent, parentSuspense, true);
//         i++;
//       }
//     }
//     // 5. unknown sequence
//     // [i ... e1 + 1]: a b [c d e] f g
//     // [i ... e2 + 1]: a b [e d c h] f g
//     // i = 2, e1 = 4, e2 = 5
//     else {
//       const s1 = i; // prev starting index
//       const s2 = i; // next starting index
//       // 5.1 build key:index map for newChildren
//       const keyToNewIndexMap = new Map();
//       for (i = s2; i <= e2; i++) {
//         const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
//         if (nextChild.key != null) {
//           if (false) {}
//           keyToNewIndexMap.set(nextChild.key, i);
//         }
//       }
//       // 5.2 loop through old children left to be patched and try to patch
//       // matching nodes & remove nodes that are no longer present
//       let j;
//       let patched = 0;
//       const toBePatched = e2 - s2 + 1;
//       let moved = false;
//       // used to track whether any node has moved
//       let maxNewIndexSoFar = 0;
//       // works as Map<newIndex, oldIndex>
//       // Note that oldIndex is offset by +1
//       // and oldIndex = 0 is a special value indicating the new node has
//       // no corresponding old node.
//       // used for determining longest stable subsequence
//       const newIndexToOldIndexMap = new Array(toBePatched);
//       for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
//       for (i = s1; i <= e1; i++) {
//         const prevChild = c1[i];
//         if (patched >= toBePatched) {
//           // all new children have been patched so this can only be a removal
//           unmount(prevChild, parentComponent, parentSuspense, true);
//           continue;
//         }
//         let newIndex;
//         if (prevChild.key != null) {
//           newIndex = keyToNewIndexMap.get(prevChild.key);
//         } else {
//           // key-less node, try to locate a key-less node of the same type
//           for (j = s2; j <= e2; j++) {
//             if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
//               newIndex = j;
//               break;
//             }
//           }
//         }
//         if (newIndex === undefined) {
//           unmount(prevChild, parentComponent, parentSuspense, true);
//         } else {
//           newIndexToOldIndexMap[newIndex - s2] = i + 1;
//           if (newIndex >= maxNewIndexSoFar) {
//             maxNewIndexSoFar = newIndex;
//           } else {
//             moved = true;
//           }
//           patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//           patched++;
//         }
//       }
//       // 5.3 move and mount
//       // generate longest stable subsequence only when nodes have moved
//       const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
//       j = increasingNewIndexSequence.length - 1;
//       // looping backwards so that we can use last patched node as anchor
//       for (i = toBePatched - 1; i >= 0; i--) {
//         const nextIndex = s2 + i;
//         const nextChild = c2[nextIndex];
//         const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
//         if (newIndexToOldIndexMap[i] === 0) {
//           // mount new
//           patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         } else if (moved) {
//           // move if:
//           // There is no stable subsequence (e.g. a reverse)
//           // OR current node is not among the stable sequence
//           if (j < 0 || i !== increasingNewIndexSequence[j]) {
//             move(nextChild, container, anchor, 2 /* MoveType.REORDER */);
//           } else {
//             j--;
//           }
//         }
//       }
//     }
//   };
//   const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
//     const {
//       el,
//       type,
//       transition,
//       children,
//       shapeFlag
//     } = vnode;
//     if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
//       move(vnode.component.subTree, container, anchor, moveType);
//       return;
//     }
//     if (shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//       vnode.suspense.move(container, anchor, moveType);
//       return;
//     }
//     if (shapeFlag & 64 /* ShapeFlags.TELEPORT */) {
//       type.move(vnode, container, anchor, internals);
//       return;
//     }
//     if (type === runtime_core_esm_bundler_Fragment) {
//       hostInsert(el, container, anchor);
//       for (let i = 0; i < children.length; i++) {
//         move(children[i], container, anchor, moveType);
//       }
//       hostInsert(vnode.anchor, container, anchor);
//       return;
//     }
//     if (type === runtime_core_esm_bundler_Static) {
//       moveStaticNode(vnode, container, anchor);
//       return;
//     }
//     // single nodes
//     const needTransition = moveType !== 2 /* MoveType.REORDER */ && shapeFlag & 1 /* ShapeFlags.ELEMENT */ && transition;
//     if (needTransition) {
//       if (moveType === 0 /* MoveType.ENTER */) {
//         transition.beforeEnter(el);
//         hostInsert(el, container, anchor);
//         queuePostRenderEffect(() => transition.enter(el), parentSuspense);
//       } else {
//         const {
//           leave,
//           delayLeave,
//           afterLeave
//         } = transition;
//         const remove = () => hostInsert(el, container, anchor);
//         const performLeave = () => {
//           leave(el, () => {
//             remove();
//             afterLeave && afterLeave();
//           });
//         };
//         if (delayLeave) {
//           delayLeave(el, remove, performLeave);
//         } else {
//           performLeave();
//         }
//       }
//     } else {
//       hostInsert(el, container, anchor);
//     }
//   };
//   const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
//     const {
//       type,
//       props,
//       ref,
//       children,
//       dynamicChildren,
//       shapeFlag,
//       patchFlag,
//       dirs
//     } = vnode;
//     // unset ref
//     if (ref != null) {
//       setRef(ref, null, parentSuspense, vnode, true);
//     }
//     if (shapeFlag & 256 /* ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE */) {
//       parentComponent.ctx.deactivate(vnode);
//       return;
//     }
//     const shouldInvokeDirs = shapeFlag & 1 /* ShapeFlags.ELEMENT */ && dirs;
//     const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
//     let vnodeHook;
//     if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
//       invokeVNodeHook(vnodeHook, parentComponent, vnode);
//     }
//     if (shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
//       unmountComponent(vnode.component, parentSuspense, doRemove);
//     } else {
//       if (shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//         vnode.suspense.unmount(parentSuspense, doRemove);
//         return;
//       }
//       if (shouldInvokeDirs) {
//         invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount');
//       }
//       if (shapeFlag & 64 /* ShapeFlags.TELEPORT */) {
//         vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
//       } else if (dynamicChildren && (
//       // #1153: fast path should not be taken for non-stable (v-for) fragments
//       type !== runtime_core_esm_bundler_Fragment || patchFlag > 0 && patchFlag & 64 /* PatchFlags.STABLE_FRAGMENT */)) {
//         // fast path for block nodes: only need to unmount dynamic children.
//         unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
//       } else if (type === runtime_core_esm_bundler_Fragment && patchFlag & (128 /* PatchFlags.KEYED_FRAGMENT */ | 256 /* PatchFlags.UNKEYED_FRAGMENT */) || !optimized && shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//         unmountChildren(children, parentComponent, parentSuspense);
//       }
//       if (doRemove) {
//         remove(vnode);
//       }
//     }
//     if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
//       queuePostRenderEffect(() => {
//         vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
//         shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
//       }, parentSuspense);
//     }
//   };
//   const remove = vnode => {
//     const {
//       type,
//       el,
//       anchor,
//       transition
//     } = vnode;
//     if (type === runtime_core_esm_bundler_Fragment) {
//       if (false) {} else {
//         removeFragment(el, anchor);
//       }
//       return;
//     }
//     if (type === runtime_core_esm_bundler_Static) {
//       removeStaticNode(vnode);
//       return;
//     }
//     const performRemove = () => {
//       hostRemove(el);
//       if (transition && !transition.persisted && transition.afterLeave) {
//         transition.afterLeave();
//       }
//     };
//     if (vnode.shapeFlag & 1 /* ShapeFlags.ELEMENT */ && transition && !transition.persisted) {
//       const {
//         leave,
//         delayLeave
//       } = transition;
//       const performLeave = () => leave(el, performRemove);
//       if (delayLeave) {
//         delayLeave(vnode.el, performRemove, performLeave);
//       } else {
//         performLeave();
//       }
//     } else {
//       performRemove();
//     }
//   };
//   const removeFragment = (cur, end) => {
//     // For fragments, directly remove all contained DOM nodes.
//     // (fragment child nodes cannot have transition)
//     let next;
//     while (cur !== end) {
//       next = hostNextSibling(cur);
//       hostRemove(cur);
//       cur = next;
//     }
//     hostRemove(end);
//   };
//   const unmountComponent = (instance, parentSuspense, doRemove) => {
//     if (false) {}
//     const {
//       bum,
//       scope,
//       update,
//       subTree,
//       um
//     } = instance;
//     // beforeUnmount hook
//     if (bum) {
//       invokeArrayFns(bum);
//     }
//     // stop effects in component scope
//     scope.stop();
//     // update may be null if a component is unmounted before its async
//     // setup has resolved.
//     if (update) {
//       // so that scheduler will no longer invoke it
//       update.active = false;
//       unmount(subTree, instance, parentSuspense, doRemove);
//     }
//     // unmounted hook
//     if (um) {
//       queuePostRenderEffect(um, parentSuspense);
//     }
//     queuePostRenderEffect(() => {
//       instance.isUnmounted = true;
//     }, parentSuspense);
//     // A component with async dep inside a pending suspense is unmounted before
//     // its async dep resolves. This should remove the dep from the suspense, and
//     // cause the suspense to resolve immediately if that was the last dep.
//     if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
//       parentSuspense.deps--;
//       if (parentSuspense.deps === 0) {
//         parentSuspense.resolve();
//       }
//     }
//     if (false) {}
//   };
//   const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
//     for (let i = start; i < children.length; i++) {
//       unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
//     }
//   };
//   const getNextHostNode = vnode => {
//     if (vnode.shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
//       return getNextHostNode(vnode.component.subTree);
//     }
//     if (vnode.shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//       return vnode.suspense.next();
//     }
//     return hostNextSibling(vnode.anchor || vnode.el);
//   };
//   const render = (vnode, container, isSVG) => {
//     if (vnode == null) {
//       if (container._vnode) {
//         unmount(container._vnode, null, null, true);
//       }
//     } else {
//       patch(container._vnode || null, vnode, container, null, null, null, isSVG);
//     }
//     flushPreFlushCbs();
//     flushPostFlushCbs();
//     container._vnode = vnode;
//   };
//   const internals = {
//     p: patch,
//     um: unmount,
//     m: move,
//     r: remove,
//     mt: mountComponent,
//     mc: mountChildren,
//     pc: patchChildren,
//     pbc: patchBlockChildren,
//     n: getNextHostNode,
//     o: options
//   };
//   let hydrate;
//   let hydrateNode;
//   if (createHydrationFns) {
//     [hydrate, hydrateNode] = createHydrationFns(internals);
//   }
//   return {
//     render,
//     hydrate,
//     createApp: createAppAPI(render, hydrate)
//   };
// }
// function toggleRecurse({
//   effect,
//   update
// }, allowed) {
//   effect.allowRecurse = update.allowRecurse = allowed;
// }
// /**
//  * #1156
//  * When a component is HMR-enabled, we need to make sure that all static nodes
//  * inside a block also inherit the DOM element from the previous tree so that
//  * HMR updates (which are full updates) can retrieve the element for patching.
//  *
//  * #2080
//  * Inside keyed `template` fragment static children, if a fragment is moved,
//  * the children will always be moved. Therefore, in order to ensure correct move
//  * position, el should be inherited from previous nodes.
//  */
// function traverseStaticChildren(n1, n2, shallow = false) {
//   const ch1 = n1.children;
//   const ch2 = n2.children;
//   if (shared_esm_bundler_isArray(ch1) && shared_esm_bundler_isArray(ch2)) {
//     for (let i = 0; i < ch1.length; i++) {
//       // this is only called in the optimized path so array children are
//       // guaranteed to be vnodes
//       const c1 = ch1[i];
//       let c2 = ch2[i];
//       if (c2.shapeFlag & 1 /* ShapeFlags.ELEMENT */ && !c2.dynamicChildren) {
//         if (c2.patchFlag <= 0 || c2.patchFlag === 32 /* PatchFlags.HYDRATE_EVENTS */) {
//           c2 = ch2[i] = cloneIfMounted(ch2[i]);
//           c2.el = c1.el;
//         }
//         if (!shallow) traverseStaticChildren(c1, c2);
//       }
//       // #6852 also inherit for text nodes
//       if (c2.type === Text) {
//         c2.el = c1.el;
//       }
//       // also inherit for comment nodes, but not placeholders (e.g. v-if which
//       // would have received .el during block patch)
//       if (false) {}
//     }
//   }
// }
// // https://en.wikipedia.org/wiki/Longest_increasing_subsequence
// function getSequence(arr) {
//   const p = arr.slice();
//   const result = [0];
//   let i, j, u, v, c;
//   const len = arr.length;
//   for (i = 0; i < len; i++) {
//     const arrI = arr[i];
//     if (arrI !== 0) {
//       j = result[result.length - 1];
//       if (arr[j] < arrI) {
//         p[i] = j;
//         result.push(i);
//         continue;
//       }
//       u = 0;
//       v = result.length - 1;
//       while (u < v) {
//         c = u + v >> 1;
//         if (arr[result[c]] < arrI) {
//           u = c + 1;
//         } else {
//           v = c;
//         }
//       }
//       if (arrI < arr[result[u]]) {
//         if (u > 0) {
//           p[i] = result[u - 1];
//         }
//         result[u] = i;
//       }
//     }
//   }
//   u = result.length;
//   v = result[u - 1];
//   while (u-- > 0) {
//     result[u] = v;
//     v = p[v];
//   }
//   return result;
// }
// const isTeleport = type => type.__isTeleport;
// const isTeleportDisabled = props => props && (props.disabled || props.disabled === '');
// const isTargetSVG = target => typeof SVGElement !== 'undefined' && target instanceof SVGElement;
// const resolveTarget = (props, select) => {
//   const targetSelector = props && props.to;
//   if (shared_esm_bundler_isString(targetSelector)) {
//     if (!select) {
//        false && 0;
//       return null;
//     } else {
//       const target = select(targetSelector);
//       if (!target) {
//          false && 0;
//       }
//       return target;
//     }
//   } else {
//     if (false) {}
//     return targetSelector;
//   }
// };
// const TeleportImpl = {
//   __isTeleport: true,
//   process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
//     const {
//       mc: mountChildren,
//       pc: patchChildren,
//       pbc: patchBlockChildren,
//       o: {
//         insert,
//         querySelector,
//         createText,
//         createComment
//       }
//     } = internals;
//     const disabled = isTeleportDisabled(n2.props);
//     let {
//       shapeFlag,
//       children,
//       dynamicChildren
//     } = n2;
//     // #3302
//     // HMR updated, force full diff
//     if (false) {}
//     if (n1 == null) {
//       // insert anchors in the main view
//       const placeholder = n2.el =  false ? 0 : createText('');
//       const mainAnchor = n2.anchor =  false ? 0 : createText('');
//       insert(placeholder, container, anchor);
//       insert(mainAnchor, container, anchor);
//       const target = n2.target = resolveTarget(n2.props, querySelector);
//       const targetAnchor = n2.targetAnchor = createText('');
//       if (target) {
//         insert(targetAnchor, target);
//         // #2652 we could be teleporting from a non-SVG tree into an SVG tree
//         isSVG = isSVG || isTargetSVG(target);
//       } else if (false) {}
//       const mount = (container, anchor) => {
//         // Teleport *always* has Array children. This is enforced in both the
//         // compiler and vnode children normalization.
//         if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//           mountChildren(children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
//         }
//       };
//       if (disabled) {
//         mount(container, mainAnchor);
//       } else if (target) {
//         mount(target, targetAnchor);
//       }
//     } else {
//       // update content
//       n2.el = n1.el;
//       const mainAnchor = n2.anchor = n1.anchor;
//       const target = n2.target = n1.target;
//       const targetAnchor = n2.targetAnchor = n1.targetAnchor;
//       const wasDisabled = isTeleportDisabled(n1.props);
//       const currentContainer = wasDisabled ? container : target;
//       const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
//       isSVG = isSVG || isTargetSVG(target);
//       if (dynamicChildren) {
//         // fast path when the teleport happens to be a block root
//         patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
//         // even in block tree mode we need to make sure all root-level nodes
//         // in the teleport inherit previous DOM references so that they can
//         // be moved in future patches.
//         traverseStaticChildren(n1, n2, true);
//       } else if (!optimized) {
//         patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
//       }
//       if (disabled) {
//         if (!wasDisabled) {
//           // enabled -> disabled
//           // move into main container
//           moveTeleport(n2, container, mainAnchor, internals, 1 /* TeleportMoveTypes.TOGGLE */);
//         }
//       } else {
//         // target changed
//         if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
//           const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
//           if (nextTarget) {
//             moveTeleport(n2, nextTarget, null, internals, 0 /* TeleportMoveTypes.TARGET_CHANGE */);
//           } else if (false) {}
//         } else if (wasDisabled) {
//           // disabled -> enabled
//           // move into teleport target
//           moveTeleport(n2, target, targetAnchor, internals, 1 /* TeleportMoveTypes.TOGGLE */);
//         }
//       }
//     }

//     updateCssVars(n2);
//   },
//   remove(vnode, parentComponent, parentSuspense, optimized, {
//     um: unmount,
//     o: {
//       remove: hostRemove
//     }
//   }, doRemove) {
//     const {
//       shapeFlag,
//       children,
//       anchor,
//       targetAnchor,
//       target,
//       props
//     } = vnode;
//     if (target) {
//       hostRemove(targetAnchor);
//     }
//     // an unmounted teleport should always remove its children if not disabled
//     if (doRemove || !isTeleportDisabled(props)) {
//       hostRemove(anchor);
//       if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//         for (let i = 0; i < children.length; i++) {
//           const child = children[i];
//           unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
//         }
//       }
//     }
//   },
//   move: moveTeleport,
//   hydrate: hydrateTeleport
// };
// function moveTeleport(vnode, container, parentAnchor, {
//   o: {
//     insert
//   },
//   m: move
// }, moveType = 2 /* TeleportMoveTypes.REORDER */) {
//   // move target anchor if this is a target change.
//   if (moveType === 0 /* TeleportMoveTypes.TARGET_CHANGE */) {
//     insert(vnode.targetAnchor, container, parentAnchor);
//   }
//   const {
//     el,
//     anchor,
//     shapeFlag,
//     children,
//     props
//   } = vnode;
//   const isReorder = moveType === 2 /* TeleportMoveTypes.REORDER */;
//   // move main view anchor if this is a re-order.
//   if (isReorder) {
//     insert(el, container, parentAnchor);
//   }
//   // if this is a re-order and teleport is enabled (content is in target)
//   // do not move children. So the opposite is: only move children if this
//   // is not a reorder, or the teleport is disabled
//   if (!isReorder || isTeleportDisabled(props)) {
//     // Teleport has either Array children or no children.
//     if (shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//       for (let i = 0; i < children.length; i++) {
//         move(children[i], container, parentAnchor, 2 /* MoveType.REORDER */);
//       }
//     }
//   }
//   // move main view anchor if this is a re-order.
//   if (isReorder) {
//     insert(anchor, container, parentAnchor);
//   }
// }
// function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
//   o: {
//     nextSibling,
//     parentNode,
//     querySelector
//   }
// }, hydrateChildren) {
//   const target = vnode.target = resolveTarget(vnode.props, querySelector);
//   if (target) {
//     // if multiple teleports rendered to the same target element, we need to
//     // pick up from where the last teleport finished instead of the first node
//     const targetNode = target._lpa || target.firstChild;
//     if (vnode.shapeFlag & 16 /* ShapeFlags.ARRAY_CHILDREN */) {
//       if (isTeleportDisabled(vnode.props)) {
//         vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
//         vnode.targetAnchor = targetNode;
//       } else {
//         vnode.anchor = nextSibling(node);
//         // lookahead until we find the target anchor
//         // we cannot rely on return value of hydrateChildren() because there
//         // could be nested teleports
//         let targetAnchor = targetNode;
//         while (targetAnchor) {
//           targetAnchor = nextSibling(targetAnchor);
//           if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === 'teleport anchor') {
//             vnode.targetAnchor = targetAnchor;
//             target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
//             break;
//           }
//         }
//         hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
//       }
//     }
//     updateCssVars(vnode);
//   }
//   return vnode.anchor && nextSibling(vnode.anchor);
// }
// // Force-casted public typing for h and TSX props inference
// const Teleport = (/* unused pure expression or super */ null && (TeleportImpl));
// function updateCssVars(vnode) {
//   // presence of .ut method indicates owner component uses css vars.
//   // code path here can assume browser environment.
//   const ctx = vnode.ctx;
//   if (ctx && ctx.ut) {
//     let node = vnode.children[0].el;
//     while (node !== vnode.targetAnchor) {
//       if (node.nodeType === 1) node.setAttribute('data-v-owner', ctx.uid);
//       node = node.nextSibling;
//     }
//     ctx.ut();
//   }
// }
// const runtime_core_esm_bundler_Fragment = Symbol( false ? 0 : undefined);
// const Text = Symbol( false ? 0 : undefined);
// const Comment = Symbol( false ? 0 : undefined);
// const runtime_core_esm_bundler_Static = Symbol( false ? 0 : undefined);
// // Since v-if and v-for are the two possible ways node structure can dynamically
// // change, once we consider v-if branches and each v-for fragment a block, we
// // can divide a template into nested blocks, and within each block the node
// // structure would be stable. This allows us to skip most children diffing
// // and only worry about the dynamic nodes (indicated by patch flags).
// const blockStack = [];
// let currentBlock = null;
// /**
//  * Open a block.
//  * This must be called before `createBlock`. It cannot be part of `createBlock`
//  * because the children of the block are evaluated before `createBlock` itself
//  * is called. The generated code typically looks like this:
//  *
//  * ```js
//  * function render() {
//  *   return (openBlock(),createBlock('div', null, [...]))
//  * }
//  * ```
//  * disableTracking is true when creating a v-for fragment block, since a v-for
//  * fragment always diffs its children.
//  *
//  * @private
//  */
// function openBlock(disableTracking = false) {
//   blockStack.push(currentBlock = disableTracking ? null : []);
// }
// function closeBlock() {
//   blockStack.pop();
//   currentBlock = blockStack[blockStack.length - 1] || null;
// }
// // Whether we should be tracking dynamic child nodes inside a block.
// // Only tracks when this value is > 0
// // We are not using a simple boolean because this value may need to be
// // incremented/decremented by nested usage of v-once (see below)
// let isBlockTreeEnabled = 1;
// /**
//  * Block tracking sometimes needs to be disabled, for example during the
//  * creation of a tree that needs to be cached by v-once. The compiler generates
//  * code like this:
//  *
//  * ``` js
//  * _cache[1] || (
//  *   setBlockTracking(-1),
//  *   _cache[1] = createVNode(...),
//  *   setBlockTracking(1),
//  *   _cache[1]
//  * )
//  * ```
//  *
//  * @private
//  */
// function setBlockTracking(value) {
//   isBlockTreeEnabled += value;
// }
// function setupBlock(vnode) {
//   // save current block children on the block vnode
//   vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
//   // close block
//   closeBlock();
//   // a block is always going to be patched, so track it as a child of its
//   // parent block
//   if (isBlockTreeEnabled > 0 && currentBlock) {
//     currentBlock.push(vnode);
//   }
//   return vnode;
// }
// /**
//  * @private
//  */
// function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
//   return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true /* isBlock */));
// }
// /**
//  * Create a block root vnode. Takes the same exact arguments as `createVNode`.
//  * A block root keeps track of dynamic nodes within the block in the
//  * `dynamicChildren` array.
//  *
//  * @private
//  */
// function createBlock(type, props, children, patchFlag, dynamicProps) {
//   return setupBlock(runtime_core_esm_bundler_createVNode(type, props, children, patchFlag, dynamicProps, true /* isBlock: prevent a block from tracking itself */));
// }

// function isVNode(value) {
//   return value ? value.__v_isVNode === true : false;
// }
// function isSameVNodeType(n1, n2) {
//   if (false) {}
//   return n1.type === n2.type && n1.key === n2.key;
// }
// let vnodeArgsTransformer;
// /**
//  * Internal API for registering an arguments transform for createVNode
//  * used for creating stubs in the test-utils
//  * It is *internal* but needs to be exposed for test-utils to pick up proper
//  * typings
//  */
// function transformVNodeArgs(transformer) {
//   vnodeArgsTransformer = transformer;
// }
// const createVNodeWithArgsTransform = (...args) => {
//   return _createVNode(...(vnodeArgsTransformer ? vnodeArgsTransformer(args, currentRenderingInstance) : args));
// };
// const InternalObjectKey = `__vInternal`;
// const normalizeKey = ({
//   key
// }) => key != null ? key : null;
// const normalizeRef = ({
//   ref,
//   ref_key,
//   ref_for
// }) => {
//   return ref != null ? shared_esm_bundler_isString(ref) || reactivity_esm_bundler_isRef(ref) || shared_esm_bundler_isFunction(ref) ? {
//     i: currentRenderingInstance,
//     r: ref,
//     k: ref_key,
//     f: !!ref_for
//   } : ref : null;
// };
// function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === runtime_core_esm_bundler_Fragment ? 0 : 1 /* ShapeFlags.ELEMENT */, isBlockNode = false, needFullChildrenNormalization = false) {
//   const vnode = {
//     __v_isVNode: true,
//     __v_skip: true,
//     type,
//     props,
//     key: props && normalizeKey(props),
//     ref: props && normalizeRef(props),
//     scopeId: currentScopeId,
//     slotScopeIds: null,
//     children,
//     component: null,
//     suspense: null,
//     ssContent: null,
//     ssFallback: null,
//     dirs: null,
//     transition: null,
//     el: null,
//     anchor: null,
//     target: null,
//     targetAnchor: null,
//     staticCount: 0,
//     shapeFlag,
//     patchFlag,
//     dynamicProps,
//     dynamicChildren: null,
//     appContext: null,
//     ctx: currentRenderingInstance
//   };
//   if (needFullChildrenNormalization) {
//     normalizeChildren(vnode, children);
//     // normalize suspense children
//     if (shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//       type.normalize(vnode);
//     }
//   } else if (children) {
//     // compiled element vnode - if children is passed, only possible types are
//     // string or Array.
//     vnode.shapeFlag |= shared_esm_bundler_isString(children) ? 8 /* ShapeFlags.TEXT_CHILDREN */ : 16 /* ShapeFlags.ARRAY_CHILDREN */;
//   }
//   // validate key
//   if (false) {}
//   // track vnode for block tree
//   if (isBlockTreeEnabled > 0 &&
//   // avoid a block node from tracking itself
//   !isBlockNode &&
//   // has current parent block
//   currentBlock && (
//   // presence of a patch flag indicates this node needs patching on updates.
//   // component nodes also should always be patched, because even if the
//   // component doesn't need to update, it needs to persist the instance on to
//   // the next vnode so that it can be properly unmounted later.
//   vnode.patchFlag > 0 || shapeFlag & 6 /* ShapeFlags.COMPONENT */) &&
//   // the EVENTS flag is only for hydration and if it is the only flag, the
//   // vnode should not be considered dynamic due to handler caching.
//   vnode.patchFlag !== 32 /* PatchFlags.HYDRATE_EVENTS */) {
//     currentBlock.push(vnode);
//   }
//   return vnode;
// }
// const runtime_core_esm_bundler_createVNode =  false ? 0 : _createVNode;
// function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
//   if (!type || type === NULL_DYNAMIC_COMPONENT) {
//     if (false) {}
//     type = Comment;
//   }
//   if (isVNode(type)) {
//     // createVNode receiving an existing vnode. This happens in cases like
//     // <component :is="vnode"/>
//     // #2078 make sure to merge refs during the clone instead of overwriting it
//     const cloned = cloneVNode(type, props, true /* mergeRef: true */);
//     if (children) {
//       normalizeChildren(cloned, children);
//     }
//     if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
//       if (cloned.shapeFlag & 6 /* ShapeFlags.COMPONENT */) {
//         currentBlock[currentBlock.indexOf(type)] = cloned;
//       } else {
//         currentBlock.push(cloned);
//       }
//     }
//     cloned.patchFlag |= -2 /* PatchFlags.BAIL */;
//     return cloned;
//   }
//   // class component normalization.
//   if (isClassComponent(type)) {
//     type = type.__vccOpts;
//   }
//   // class & style normalization.
//   if (props) {
//     // for reactive or proxy objects, we need to clone it to enable mutation.
//     props = guardReactiveProps(props);
//     let {
//       class: klass,
//       style
//     } = props;
//     if (klass && !shared_esm_bundler_isString(klass)) {
//       props.class = normalizeClass(klass);
//     }
//     if (shared_esm_bundler_isObject(style)) {
//       // reactive state objects need to be cloned since they are likely to be
//       // mutated
//       if (isProxy(style) && !shared_esm_bundler_isArray(style)) {
//         style = shared_esm_bundler_extend({}, style);
//       }
//       props.style = normalizeStyle(style);
//     }
//   }
//   // encode the vnode type information into a bitmap
//   const shapeFlag = shared_esm_bundler_isString(type) ? 1 /* ShapeFlags.ELEMENT */ : isSuspense(type) ? 128 /* ShapeFlags.SUSPENSE */ : isTeleport(type) ? 64 /* ShapeFlags.TELEPORT */ : shared_esm_bundler_isObject(type) ? 4 /* ShapeFlags.STATEFUL_COMPONENT */ : shared_esm_bundler_isFunction(type) ? 2 /* ShapeFlags.FUNCTIONAL_COMPONENT */ : 0;
//   if (false) {}
//   return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
// }
// function guardReactiveProps(props) {
//   if (!props) return null;
//   return isProxy(props) || InternalObjectKey in props ? shared_esm_bundler_extend({}, props) : props;
// }
// function cloneVNode(vnode, extraProps, mergeRef = false) {
//   // This is intentionally NOT using spread or extend to avoid the runtime
//   // key enumeration cost.
//   const {
//     props,
//     ref,
//     patchFlag,
//     children
//   } = vnode;
//   const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
//   const cloned = {
//     __v_isVNode: true,
//     __v_skip: true,
//     type: vnode.type,
//     props: mergedProps,
//     key: mergedProps && normalizeKey(mergedProps),
//     ref: extraProps && extraProps.ref ?
//     // #2078 in the case of <component :is="vnode" ref="extra"/>
//     // if the vnode itself already has a ref, cloneVNode will need to merge
//     // the refs so the single vnode can be set on multiple refs
//     mergeRef && ref ? shared_esm_bundler_isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
//     scopeId: vnode.scopeId,
//     slotScopeIds: vnode.slotScopeIds,
//     children:  false ? 0 : children,
//     target: vnode.target,
//     targetAnchor: vnode.targetAnchor,
//     staticCount: vnode.staticCount,
//     shapeFlag: vnode.shapeFlag,
//     // if the vnode is cloned with extra props, we can no longer assume its
//     // existing patch flag to be reliable and need to add the FULL_PROPS flag.
//     // note: preserve flag for fragments since they use the flag for children
//     // fast paths only.
//     patchFlag: extraProps && vnode.type !== runtime_core_esm_bundler_Fragment ? patchFlag === -1 // hoisted node
//     ? 16 /* PatchFlags.FULL_PROPS */ : patchFlag | 16 /* PatchFlags.FULL_PROPS */ : patchFlag,
//     dynamicProps: vnode.dynamicProps,
//     dynamicChildren: vnode.dynamicChildren,
//     appContext: vnode.appContext,
//     dirs: vnode.dirs,
//     transition: vnode.transition,
//     // These should technically only be non-null on mounted VNodes. However,
//     // they *should* be copied for kept-alive vnodes. So we just always copy
//     // them since them being non-null during a mount doesn't affect the logic as
//     // they will simply be overwritten.
//     component: vnode.component,
//     suspense: vnode.suspense,
//     ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
//     ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
//     el: vnode.el,
//     anchor: vnode.anchor,
//     ctx: vnode.ctx
//   };
//   return cloned;
// }
// /**
//  * Dev only, for HMR of hoisted vnodes reused in v-for
//  * https://github.com/vitejs/vite/issues/2022
//  */
// function deepCloneVNode(vnode) {
//   const cloned = cloneVNode(vnode);
//   if (isArray(vnode.children)) {
//     cloned.children = vnode.children.map(deepCloneVNode);
//   }
//   return cloned;
// }
// /**
//  * @private
//  */
// function createTextVNode(text = ' ', flag = 0) {
//   return runtime_core_esm_bundler_createVNode(Text, null, text, flag);
// }
// /**
//  * @private
//  */
// function createStaticVNode(content, numberOfNodes) {
//   // A static vnode can contain multiple stringified elements, and the number
//   // of elements is necessary for hydration.
//   const vnode = runtime_core_esm_bundler_createVNode(runtime_core_esm_bundler_Static, null, content);
//   vnode.staticCount = numberOfNodes;
//   return vnode;
// }
// /**
//  * @private
//  */
// function createCommentVNode(text = '',
// // when used as the v-else branch, the comment node must be created as a
// // block to ensure correct updates.
// asBlock = false) {
//   return asBlock ? (openBlock(), createBlock(Comment, null, text)) : runtime_core_esm_bundler_createVNode(Comment, null, text);
// }
// function normalizeVNode(child) {
//   if (child == null || typeof child === 'boolean') {
//     // empty placeholder
//     return runtime_core_esm_bundler_createVNode(Comment);
//   } else if (shared_esm_bundler_isArray(child)) {
//     // fragment
//     return runtime_core_esm_bundler_createVNode(runtime_core_esm_bundler_Fragment, null,
//     // #3666, avoid reference pollution when reusing vnode
//     child.slice());
//   } else if (typeof child === 'object') {
//     // already vnode, this should be the most common since compiled templates
//     // always produce all-vnode children arrays
//     return cloneIfMounted(child);
//   } else {
//     // strings and numbers
//     return runtime_core_esm_bundler_createVNode(Text, null, String(child));
//   }
// }
// // optimized normalization for template-compiled render fns
// function cloneIfMounted(child) {
//   return child.el === null && child.patchFlag !== -1 /* PatchFlags.HOISTED */ || child.memo ? child : cloneVNode(child);
// }
// function normalizeChildren(vnode, children) {
//   let type = 0;
//   const {
//     shapeFlag
//   } = vnode;
//   if (children == null) {
//     children = null;
//   } else if (shared_esm_bundler_isArray(children)) {
//     type = 16 /* ShapeFlags.ARRAY_CHILDREN */;
//   } else if (typeof children === 'object') {
//     if (shapeFlag & (1 /* ShapeFlags.ELEMENT */ | 64 /* ShapeFlags.TELEPORT */)) {
//       // Normalize slot to plain children for plain element and Teleport
//       const slot = children.default;
//       if (slot) {
//         // _c marker is added by withCtx() indicating this is a compiled slot
//         slot._c && (slot._d = false);
//         normalizeChildren(vnode, slot());
//         slot._c && (slot._d = true);
//       }
//       return;
//     } else {
//       type = 32 /* ShapeFlags.SLOTS_CHILDREN */;
//       const slotFlag = children._;
//       if (!slotFlag && !(InternalObjectKey in children)) {
//         children._ctx = currentRenderingInstance;
//       } else if (slotFlag === 3 /* SlotFlags.FORWARDED */ && currentRenderingInstance) {
//         // a child component receives forwarded slots from the parent.
//         // its slot type is determined by its parent's slot type.
//         if (currentRenderingInstance.slots._ === 1 /* SlotFlags.STABLE */) {
//           children._ = 1 /* SlotFlags.STABLE */;
//         } else {
//           children._ = 2 /* SlotFlags.DYNAMIC */;
//           vnode.patchFlag |= 1024 /* PatchFlags.DYNAMIC_SLOTS */;
//         }
//       }
//     }
//   } else if (shared_esm_bundler_isFunction(children)) {
//     children = {
//       default: children,
//       _ctx: currentRenderingInstance
//     };
//     type = 32 /* ShapeFlags.SLOTS_CHILDREN */;
//   } else {
//     children = String(children);
//     // force teleport children to array so it can be moved around
//     if (shapeFlag & 64 /* ShapeFlags.TELEPORT */) {
//       type = 16 /* ShapeFlags.ARRAY_CHILDREN */;
//       children = [createTextVNode(children)];
//     } else {
//       type = 8 /* ShapeFlags.TEXT_CHILDREN */;
//     }
//   }

//   vnode.children = children;
//   vnode.shapeFlag |= type;
// }
// function mergeProps(...args) {
//   const ret = {};
//   for (let i = 0; i < args.length; i++) {
//     const toMerge = args[i];
//     for (const key in toMerge) {
//       if (key === 'class') {
//         if (ret.class !== toMerge.class) {
//           ret.class = normalizeClass([ret.class, toMerge.class]);
//         }
//       } else if (key === 'style') {
//         ret.style = normalizeStyle([ret.style, toMerge.style]);
//       } else if (shared_esm_bundler_isOn(key)) {
//         const existing = ret[key];
//         const incoming = toMerge[key];
//         if (incoming && existing !== incoming && !(shared_esm_bundler_isArray(existing) && existing.includes(incoming))) {
//           ret[key] = existing ? [].concat(existing, incoming) : incoming;
//         }
//       } else if (key !== '') {
//         ret[key] = toMerge[key];
//       }
//     }
//   }
//   return ret;
// }
// function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
//   callWithAsyncErrorHandling(hook, instance, 7 /* ErrorCodes.VNODE_HOOK */, [vnode, prevVNode]);
// }
// const emptyAppContext = createAppContext();
// let uid$1 = 0;
// function createComponentInstance(vnode, parent, suspense) {
//   const type = vnode.type;
//   // inherit parent app context - or - if root, adopt from root vnode
//   const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
//   const instance = {
//     uid: uid$1++,
//     vnode,
//     type,
//     parent,
//     appContext,
//     root: null,
//     next: null,
//     subTree: null,
//     effect: null,
//     update: null,
//     scope: new EffectScope(true /* detached */),
//     render: null,
//     proxy: null,
//     exposed: null,
//     exposeProxy: null,
//     withProxy: null,
//     provides: parent ? parent.provides : Object.create(appContext.provides),
//     accessCache: null,
//     renderCache: [],
//     // local resolved assets
//     components: null,
//     directives: null,
//     // resolved props and emits options
//     propsOptions: normalizePropsOptions(type, appContext),
//     emitsOptions: normalizeEmitsOptions(type, appContext),
//     // emit
//     emit: null,
//     emitted: null,
//     // props default value
//     propsDefaults: shared_esm_bundler_EMPTY_OBJ,
//     // inheritAttrs
//     inheritAttrs: type.inheritAttrs,
//     // state
//     ctx: shared_esm_bundler_EMPTY_OBJ,
//     data: shared_esm_bundler_EMPTY_OBJ,
//     props: shared_esm_bundler_EMPTY_OBJ,
//     attrs: shared_esm_bundler_EMPTY_OBJ,
//     slots: shared_esm_bundler_EMPTY_OBJ,
//     refs: shared_esm_bundler_EMPTY_OBJ,
//     setupState: shared_esm_bundler_EMPTY_OBJ,
//     setupContext: null,
//     // suspense related
//     suspense,
//     suspenseId: suspense ? suspense.pendingId : 0,
//     asyncDep: null,
//     asyncResolved: false,
//     // lifecycle hooks
//     // not using enums here because it results in computed properties
//     isMounted: false,
//     isUnmounted: false,
//     isDeactivated: false,
//     bc: null,
//     c: null,
//     bm: null,
//     m: null,
//     bu: null,
//     u: null,
//     um: null,
//     bum: null,
//     da: null,
//     a: null,
//     rtg: null,
//     rtc: null,
//     ec: null,
//     sp: null
//   };
//   if (false) {} else {
//     instance.ctx = {
//       _: instance
//     };
//   }
//   instance.root = parent ? parent.root : instance;
//   instance.emit = emit$1.bind(null, instance);
//   // apply custom element special handling
//   if (vnode.ce) {
//     vnode.ce(instance);
//   }
//   return instance;
// }
// let currentInstance = null;
// const runtime_core_esm_bundler_getCurrentInstance = () => currentInstance || currentRenderingInstance;
// const setCurrentInstance = instance => {
//   currentInstance = instance;
//   instance.scope.on();
// };
// const unsetCurrentInstance = () => {
//   currentInstance && currentInstance.scope.off();
//   currentInstance = null;
// };
// const isBuiltInTag = /*#__PURE__*/(/* unused pure expression or super */ null && (makeMap('slot,component')));
// function validateComponentName(name, config) {
//   const appIsNativeTag = config.isNativeTag || NO;
//   if (isBuiltInTag(name) || appIsNativeTag(name)) {
//     runtime_core_esm_bundler_warn('Do not use built-in or reserved HTML elements as component id: ' + name);
//   }
// }
// function isStatefulComponent(instance) {
//   return instance.vnode.shapeFlag & 4 /* ShapeFlags.STATEFUL_COMPONENT */;
// }

// let isInSSRComponentSetup = false;
// function setupComponent(instance, isSSR = false) {
//   isInSSRComponentSetup = isSSR;
//   const {
//     props,
//     children
//   } = instance.vnode;
//   const isStateful = isStatefulComponent(instance);
//   initProps(instance, props, isStateful, isSSR);
//   initSlots(instance, children);
//   const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : undefined;
//   isInSSRComponentSetup = false;
//   return setupResult;
// }
// function setupStatefulComponent(instance, isSSR) {
//   var _a;
//   const Component = instance.type;
//   if (false) {}
//   // 0. create render proxy property access cache
//   instance.accessCache = Object.create(null);
//   // 1. create public instance / render proxy
//   // also mark it raw so it's never observed
//   instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
//   if (false) {}
//   // 2. call setup()
//   const {
//     setup
//   } = Component;
//   if (setup) {
//     const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
//     setCurrentInstance(instance);
//     pauseTracking();
//     const setupResult = callWithErrorHandling(setup, instance, 0 /* ErrorCodes.SETUP_FUNCTION */, [ false ? 0 : instance.props, setupContext]);
//     resetTracking();
//     unsetCurrentInstance();
//     if (shared_esm_bundler_isPromise(setupResult)) {
//       setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
//       if (isSSR) {
//         // return the promise so server-renderer can wait on it
//         return setupResult.then(resolvedResult => {
//           handleSetupResult(instance, resolvedResult, isSSR);
//         }).catch(e => {
//           handleError(e, instance, 0 /* ErrorCodes.SETUP_FUNCTION */);
//         });
//       } else {
//         // async setup returned Promise.
//         // bail here and wait for re-entry.
//         instance.asyncDep = setupResult;
//         if (false) {}
//       }
//     } else {
//       handleSetupResult(instance, setupResult, isSSR);
//     }
//   } else {
//     finishComponentSetup(instance, isSSR);
//   }
// }
// function handleSetupResult(instance, setupResult, isSSR) {
//   if (shared_esm_bundler_isFunction(setupResult)) {
//     // setup returned an inline render function
//     if (instance.type.__ssrInlineRender) {
//       // when the function's name is `ssrRender` (compiled by SFC inline mode),
//       // set it as ssrRender instead.
//       instance.ssrRender = setupResult;
//     } else {
//       instance.render = setupResult;
//     }
//   } else if (shared_esm_bundler_isObject(setupResult)) {
//     if (false) {}
//     // setup returned bindings.
//     // assuming a render function compiled from template is present.
//     if (false) {}
//     instance.setupState = proxyRefs(setupResult);
//     if (false) {}
//   } else if (false) {}
//   finishComponentSetup(instance, isSSR);
// }
// let compile;
// let installWithProxy;
// /**
//  * For runtime-dom to register the compiler.
//  * Note the exported method uses any to avoid d.ts relying on the compiler types.
//  */
// function registerRuntimeCompiler(_compile) {
//   compile = _compile;
//   installWithProxy = i => {
//     if (i.render._rc) {
//       i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
//     }
//   };
// }
// // dev only
// const runtime_core_esm_bundler_isRuntimeOnly = () => !compile;
// function finishComponentSetup(instance, isSSR, skipOptions) {
//   const Component = instance.type;
//   // template / render function normalization
//   // could be already set when returned from setup()
//   if (!instance.render) {
//     // only do on-the-fly compile if not in SSR - SSR on-the-fly compilation
//     // is done by server-renderer
//     if (!isSSR && compile && !Component.render) {
//       const template = Component.template || resolveMergedOptions(instance).template;
//       if (template) {
//         if (false) {}
//         const {
//           isCustomElement,
//           compilerOptions
//         } = instance.appContext.config;
//         const {
//           delimiters,
//           compilerOptions: componentCompilerOptions
//         } = Component;
//         const finalCompilerOptions = shared_esm_bundler_extend(shared_esm_bundler_extend({
//           isCustomElement,
//           delimiters
//         }, compilerOptions), componentCompilerOptions);
//         Component.render = compile(template, finalCompilerOptions);
//         if (false) {}
//       }
//     }
//     instance.render = Component.render || shared_esm_bundler_NOOP;
//     // for runtime-compiled render functions using `with` blocks, the render
//     // proxy used needs a different `has` handler which is more performant and
//     // also only allows a whitelist of globals to fallthrough.
//     if (installWithProxy) {
//       installWithProxy(instance);
//     }
//   }
//   // support for 2.x options
//   if (true) {
//     setCurrentInstance(instance);
//     pauseTracking();
//     applyOptions(instance);
//     resetTracking();
//     unsetCurrentInstance();
//   }
//   // warn missing template/render
//   // the runtime compilation of template in SSR is done by server-render
//   if (false) {}
// }
// function createAttrsProxy(instance) {
//   return new Proxy(instance.attrs,  false ? 0 : {
//     get(target, key) {
//       track(instance, "get" /* TrackOpTypes.GET */, '$attrs');
//       return target[key];
//     }
//   });
// }
// function createSetupContext(instance) {
//   const expose = exposed => {
//     if (false) {}
//     instance.exposed = exposed || {};
//   };
//   let attrs;
//   if (false) {} else {
//     return {
//       get attrs() {
//         return attrs || (attrs = createAttrsProxy(instance));
//       },
//       slots: instance.slots,
//       emit: instance.emit,
//       expose
//     };
//   }
// }
// function getExposeProxy(instance) {
//   if (instance.exposed) {
//     return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
//       get(target, key) {
//         if (key in target) {
//           return target[key];
//         } else if (key in publicPropertiesMap) {
//           return publicPropertiesMap[key](instance);
//         }
//       },
//       has(target, key) {
//         return key in target || key in publicPropertiesMap;
//       }
//     }));
//   }
// }
// const classifyRE = /(?:^|[-_])(\w)/g;
// const classify = str => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
// function getComponentName(Component, includeInferred = true) {
//   return shared_esm_bundler_isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
// }
// /* istanbul ignore next */
// function formatComponentName(instance, Component, isRoot = false) {
//   let name = getComponentName(Component);
//   if (!name && Component.__file) {
//     const match = Component.__file.match(/([^/\\]+)\.\w+$/);
//     if (match) {
//       name = match[1];
//     }
//   }
//   if (!name && instance && instance.parent) {
//     // try to infer the name based on reverse resolution
//     const inferFromRegistry = registry => {
//       for (const key in registry) {
//         if (registry[key] === Component) {
//           return key;
//         }
//       }
//     };
//     name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
//   }
//   return name ? classify(name) : isRoot ? `App` : `Anonymous`;
// }
// function isClassComponent(value) {
//   return shared_esm_bundler_isFunction(value) && '__vccOpts' in value;
// }
// const runtime_core_esm_bundler_computed = (getterOrOptions, debugOptions) => {
//   // @ts-ignore
//   return computed(getterOrOptions, debugOptions, isInSSRComponentSetup);
// };

// // dev only
// const warnRuntimeUsage = method => runtime_core_esm_bundler_warn(`${method}() is a compiler-hint helper that is only usable inside ` + `<script setup> of a single file component. Its arguments should be ` + `compiled away and passing it at runtime has no effect.`);
// // implementation
// function defineProps() {
//   if (false) {}
//   return null;
// }
// // implementation
// function defineEmits() {
//   if (false) {}
//   return null;
// }
// /**
//  * Vue `<script setup>` compiler macro for declaring a component's exposed
//  * instance properties when it is accessed by a parent component via template
//  * refs.
//  *
//  * `<script setup>` components are closed by default - i.e. variables inside
//  * the `<script setup>` scope is not exposed to parent unless explicitly exposed
//  * via `defineExpose`.
//  *
//  * This is only usable inside `<script setup>`, is compiled away in the
//  * output and should **not** be actually called at runtime.
//  */
// function defineExpose(exposed) {
//   if (false) {}
// }
// /**
//  * Vue `<script setup>` compiler macro for providing props default values when
//  * using type-based `defineProps` declaration.
//  *
//  * Example usage:
//  * ```ts
//  * withDefaults(defineProps<{
//  *   size?: number
//  *   labels?: string[]
//  * }>(), {
//  *   size: 3,
//  *   labels: () => ['default label']
//  * })
//  * ```
//  *
//  * This is only usable inside `<script setup>`, is compiled away in the output
//  * and should **not** be actually called at runtime.
//  */
// function withDefaults(props, defaults) {
//   if (false) {}
//   return null;
// }
// function useSlots() {
//   return getContext().slots;
// }
// function useAttrs() {
//   return getContext().attrs;
// }
// function getContext() {
//   const i = runtime_core_esm_bundler_getCurrentInstance();
//   if (false) {}
//   return i.setupContext || (i.setupContext = createSetupContext(i));
// }
// /**
//  * Runtime helper for merging default declarations. Imported by compiled code
//  * only.
//  * @internal
//  */
// function mergeDefaults(raw, defaults) {
//   const props = isArray(raw) ? raw.reduce((normalized, p) => (normalized[p] = {}, normalized), {}) : raw;
//   for (const key in defaults) {
//     const opt = props[key];
//     if (opt) {
//       if (isArray(opt) || isFunction(opt)) {
//         props[key] = {
//           type: opt,
//           default: defaults[key]
//         };
//       } else {
//         opt.default = defaults[key];
//       }
//     } else if (opt === null) {
//       props[key] = {
//         default: defaults[key]
//       };
//     } else if (false) {}
//   }
//   return props;
// }
// /**
//  * Used to create a proxy for the rest element when destructuring props with
//  * defineProps().
//  * @internal
//  */
// function createPropsRestProxy(props, excludedKeys) {
//   const ret = {};
//   for (const key in props) {
//     if (!excludedKeys.includes(key)) {
//       Object.defineProperty(ret, key, {
//         enumerable: true,
//         get: () => props[key]
//       });
//     }
//   }
//   return ret;
// }
// /**
//  * `<script setup>` helper for persisting the current instance context over
//  * async/await flows.
//  *
//  * `@vue/compiler-sfc` converts the following:
//  *
//  * ```ts
//  * const x = await foo()
//  * ```
//  *
//  * into:
//  *
//  * ```ts
//  * let __temp, __restore
//  * const x = (([__temp, __restore] = withAsyncContext(() => foo())),__temp=await __temp,__restore(),__temp)
//  * ```
//  * @internal
//  */
// function withAsyncContext(getAwaitable) {
//   const ctx = runtime_core_esm_bundler_getCurrentInstance();
//   if (false) {}
//   let awaitable = getAwaitable();
//   unsetCurrentInstance();
//   if (isPromise(awaitable)) {
//     awaitable = awaitable.catch(e => {
//       setCurrentInstance(ctx);
//       throw e;
//     });
//   }
//   return [awaitable, () => setCurrentInstance(ctx)];
// }

// // Actual implementation
// function h(type, propsOrChildren, children) {
//   const l = arguments.length;
//   if (l === 2) {
//     if (shared_esm_bundler_isObject(propsOrChildren) && !shared_esm_bundler_isArray(propsOrChildren)) {
//       // single vnode without props
//       if (isVNode(propsOrChildren)) {
//         return runtime_core_esm_bundler_createVNode(type, null, [propsOrChildren]);
//       }
//       // props without children
//       return runtime_core_esm_bundler_createVNode(type, propsOrChildren);
//     } else {
//       // omit props
//       return runtime_core_esm_bundler_createVNode(type, null, propsOrChildren);
//     }
//   } else {
//     if (l > 3) {
//       children = Array.prototype.slice.call(arguments, 2);
//     } else if (l === 3 && isVNode(children)) {
//       children = [children];
//     }
//     return runtime_core_esm_bundler_createVNode(type, propsOrChildren, children);
//   }
// }
// const ssrContextKey = Symbol( false ? 0 : ``);
// const useSSRContext = () => {
//   {
//     const ctx = runtime_core_esm_bundler_inject(ssrContextKey);
//     if (!ctx) {
//        false && 0;
//     }
//     return ctx;
//   }
// };
// function runtime_core_esm_bundler_isShallow(value) {
//   return !!(value && value["__v_isShallow" /* ReactiveFlags.IS_SHALLOW */]);
// }

// function initCustomFormatter() {
//   /* eslint-disable no-restricted-globals */
//   if (true) {
//     return;
//   }
//   const vueStyle = {
//     style: 'color:#3ba776'
//   };
//   const numberStyle = {
//     style: 'color:#0b1bc9'
//   };
//   const stringStyle = {
//     style: 'color:#b62e24'
//   };
//   const keywordStyle = {
//     style: 'color:#9d288c'
//   };
//   // custom formatter for Chrome
//   // https://www.mattzeunert.com/2016/02/19/custom-chrome-devtools-object-formatters.html
//   const formatter = {
//     header(obj) {
//       // TODO also format ComponentPublicInstance & ctx.slots/attrs in setup
//       if (!isObject(obj)) {
//         return null;
//       }
//       if (obj.__isVue) {
//         return ['div', vueStyle, `VueInstance`];
//       } else if (isRef(obj)) {
//         return ['div', {}, ['span', vueStyle, genRefFlag(obj)], '<', formatValue(obj.value), `>`];
//       } else if (isReactive(obj)) {
//         return ['div', {}, ['span', vueStyle, runtime_core_esm_bundler_isShallow(obj) ? 'ShallowReactive' : 'Reactive'], '<', formatValue(obj), `>${isReadonly(obj) ? ` (readonly)` : ``}`];
//       } else if (isReadonly(obj)) {
//         return ['div', {}, ['span', vueStyle, runtime_core_esm_bundler_isShallow(obj) ? 'ShallowReadonly' : 'Readonly'], '<', formatValue(obj), '>'];
//       }
//       return null;
//     },
//     hasBody(obj) {
//       return obj && obj.__isVue;
//     },
//     body(obj) {
//       if (obj && obj.__isVue) {
//         return ['div', {}, ...formatInstance(obj.$)];
//       }
//     }
//   };
//   function formatInstance(instance) {
//     const blocks = [];
//     if (instance.type.props && instance.props) {
//       blocks.push(createInstanceBlock('props', toRaw(instance.props)));
//     }
//     if (instance.setupState !== EMPTY_OBJ) {
//       blocks.push(createInstanceBlock('setup', instance.setupState));
//     }
//     if (instance.data !== EMPTY_OBJ) {
//       blocks.push(createInstanceBlock('data', toRaw(instance.data)));
//     }
//     const computed = extractKeys(instance, 'computed');
//     if (computed) {
//       blocks.push(createInstanceBlock('computed', computed));
//     }
//     const injected = extractKeys(instance, 'inject');
//     if (injected) {
//       blocks.push(createInstanceBlock('injected', injected));
//     }
//     blocks.push(['div', {}, ['span', {
//       style: keywordStyle.style + ';opacity:0.66'
//     }, '$ (internal): '], ['object', {
//       object: instance
//     }]]);
//     return blocks;
//   }
//   function createInstanceBlock(type, target) {
//     target = extend({}, target);
//     if (!Object.keys(target).length) {
//       return ['span', {}];
//     }
//     return ['div', {
//       style: 'line-height:1.25em;margin-bottom:0.6em'
//     }, ['div', {
//       style: 'color:#476582'
//     }, type], ['div', {
//       style: 'padding-left:1.25em'
//     }, ...Object.keys(target).map(key => {
//       return ['div', {}, ['span', keywordStyle, key + ': '], formatValue(target[key], false)];
//     })]];
//   }
//   function formatValue(v, asRaw = true) {
//     if (typeof v === 'number') {
//       return ['span', numberStyle, v];
//     } else if (typeof v === 'string') {
//       return ['span', stringStyle, JSON.stringify(v)];
//     } else if (typeof v === 'boolean') {
//       return ['span', keywordStyle, v];
//     } else if (isObject(v)) {
//       return ['object', {
//         object: asRaw ? toRaw(v) : v
//       }];
//     } else {
//       return ['span', stringStyle, String(v)];
//     }
//   }
//   function extractKeys(instance, type) {
//     const Comp = instance.type;
//     if (isFunction(Comp)) {
//       return;
//     }
//     const extracted = {};
//     for (const key in instance.ctx) {
//       if (isKeyOfType(Comp, key, type)) {
//         extracted[key] = instance.ctx[key];
//       }
//     }
//     return extracted;
//   }
//   function isKeyOfType(Comp, key, type) {
//     const opts = Comp[type];
//     if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) {
//       return true;
//     }
//     if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
//       return true;
//     }
//     if (Comp.mixins && Comp.mixins.some(m => isKeyOfType(m, key, type))) {
//       return true;
//     }
//   }
//   function genRefFlag(v) {
//     if (runtime_core_esm_bundler_isShallow(v)) {
//       return `ShallowRef`;
//     }
//     if (v.effect) {
//       return `ComputedRef`;
//     }
//     return `Ref`;
//   }
//   if (window.devtoolsFormatters) {
//     window.devtoolsFormatters.push(formatter);
//   } else {
//     window.devtoolsFormatters = [formatter];
//   }
// }
// function withMemo(memo, render, cache, index) {
//   const cached = cache[index];
//   if (cached && isMemoSame(cached, memo)) {
//     return cached;
//   }
//   const ret = render();
//   // shallow clone
//   ret.memo = memo.slice();
//   return cache[index] = ret;
// }
// function isMemoSame(cached, memo) {
//   const prev = cached.memo;
//   if (prev.length != memo.length) {
//     return false;
//   }
//   for (let i = 0; i < prev.length; i++) {
//     if (hasChanged(prev[i], memo[i])) {
//       return false;
//     }
//   }
//   // make sure to let parent block track it when returning cached
//   if (isBlockTreeEnabled > 0 && currentBlock) {
//     currentBlock.push(cached);
//   }
//   return true;
// }

// // Core API ------------------------------------------------------------------
// const version = "3.2.45";
// const _ssrUtils = {
//   createComponentInstance,
//   setupComponent,
//   renderComponentRoot,
//   setCurrentRenderingInstance,
//   isVNode,
//   normalizeVNode
// };
// /**
//  * SSR utils for \@vue/server-renderer. Only exposed in ssr-possible builds.
//  * @internal
//  */
// const ssrUtils = (/* unused pure expression or super */ null && (_ssrUtils));
// /**
//  * @internal only exposed in compat builds
//  */
// const resolveFilter = null;
// /**
//  * @internal only exposed in compat builds.
//  */
// const compatUtils = null;

// ;// CONCATENATED MODULE: ../../node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js




// const svgNS = 'http://www.w3.org/2000/svg';
// const doc = typeof document !== 'undefined' ? document : null;
// const templateContainer = doc && /*#__PURE__*/doc.createElement('template');
// const nodeOps = {
//   insert: (child, parent, anchor) => {
//     parent.insertBefore(child, anchor || null);
//   },
//   remove: child => {
//     const parent = child.parentNode;
//     if (parent) {
//       parent.removeChild(child);
//     }
//   },
//   createElement: (tag, isSVG, is, props) => {
//     const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? {
//       is
//     } : undefined);
//     if (tag === 'select' && props && props.multiple != null) {
//       el.setAttribute('multiple', props.multiple);
//     }
//     return el;
//   },
//   createText: text => doc.createTextNode(text),
//   createComment: text => doc.createComment(text),
//   setText: (node, text) => {
//     node.nodeValue = text;
//   },
//   setElementText: (el, text) => {
//     el.textContent = text;
//   },
//   parentNode: node => node.parentNode,
//   nextSibling: node => node.nextSibling,
//   querySelector: selector => doc.querySelector(selector),
//   setScopeId(el, id) {
//     el.setAttribute(id, '');
//   },
//   // __UNSAFE__
//   // Reason: innerHTML.
//   // Static content here can only come from compiled templates.
//   // As long as the user only uses trusted templates, this is safe.
//   insertStaticContent(content, parent, anchor, isSVG, start, end) {
//     // <parent> before | first ... last | anchor </parent>
//     const before = anchor ? anchor.previousSibling : parent.lastChild;
//     // #5308 can only take cached path if:
//     // - has a single root node
//     // - nextSibling info is still available
//     if (start && (start === end || start.nextSibling)) {
//       // cached
//       while (true) {
//         parent.insertBefore(start.cloneNode(true), anchor);
//         if (start === end || !(start = start.nextSibling)) break;
//       }
//     } else {
//       // fresh insert
//       templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
//       const template = templateContainer.content;
//       if (isSVG) {
//         // remove outer svg wrapper
//         const wrapper = template.firstChild;
//         while (wrapper.firstChild) {
//           template.appendChild(wrapper.firstChild);
//         }
//         template.removeChild(wrapper);
//       }
//       parent.insertBefore(template, anchor);
//     }
//     return [
//     // first
//     before ? before.nextSibling : parent.firstChild,
//     // last
//     anchor ? anchor.previousSibling : parent.lastChild];
//   }
// };

// // compiler should normalize class + :class bindings on the same element
// // into a single binding ['staticClass', dynamic]
// function patchClass(el, value, isSVG) {
//   // directly setting className should be faster than setAttribute in theory
//   // if this is an element during a transition, take the temporary transition
//   // classes into account.
//   const transitionClasses = el._vtc;
//   if (transitionClasses) {
//     value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(' ');
//   }
//   if (value == null) {
//     el.removeAttribute('class');
//   } else if (isSVG) {
//     el.setAttribute('class', value);
//   } else {
//     el.className = value;
//   }
// }
// function patchStyle(el, prev, next) {
//   const style = el.style;
//   const isCssString = shared_esm_bundler_isString(next);
//   if (next && !isCssString) {
//     for (const key in next) {
//       setStyle(style, key, next[key]);
//     }
//     if (prev && !shared_esm_bundler_isString(prev)) {
//       for (const key in prev) {
//         if (next[key] == null) {
//           setStyle(style, key, '');
//         }
//       }
//     }
//   } else {
//     const currentDisplay = style.display;
//     if (isCssString) {
//       if (prev !== next) {
//         style.cssText = next;
//       }
//     } else if (prev) {
//       el.removeAttribute('style');
//     }
//     // indicates that the `display` of the element is controlled by `v-show`,
//     // so we always keep the current `display` value regardless of the `style`
//     // value, thus handing over control to `v-show`.
//     if ('_vod' in el) {
//       style.display = currentDisplay;
//     }
//   }
// }
// const semicolonRE = /[^\\];\s*$/;
// const importantRE = /\s*!important$/;
// function setStyle(style, name, val) {
//   if (shared_esm_bundler_isArray(val)) {
//     val.forEach(v => setStyle(style, name, v));
//   } else {
//     if (val == null) val = '';
//     if (false) {}
//     if (name.startsWith('--')) {
//       // custom property definition
//       style.setProperty(name, val);
//     } else {
//       const prefixed = autoPrefix(style, name);
//       if (importantRE.test(val)) {
//         // !important
//         style.setProperty(shared_esm_bundler_hyphenate(prefixed), val.replace(importantRE, ''), 'important');
//       } else {
//         style[prefixed] = val;
//       }
//     }
//   }
// }
// const prefixes = ['Webkit', 'Moz', 'ms'];
// const prefixCache = {};
// function autoPrefix(style, rawName) {
//   const cached = prefixCache[rawName];
//   if (cached) {
//     return cached;
//   }
//   let name = camelize(rawName);
//   if (name !== 'filter' && name in style) {
//     return prefixCache[rawName] = name;
//   }
//   name = shared_esm_bundler_capitalize(name);
//   for (let i = 0; i < prefixes.length; i++) {
//     const prefixed = prefixes[i] + name;
//     if (prefixed in style) {
//       return prefixCache[rawName] = prefixed;
//     }
//   }
//   return rawName;
// }
// const xlinkNS = 'http://www.w3.org/1999/xlink';
// function patchAttr(el, key, value, isSVG, instance) {
//   if (isSVG && key.startsWith('xlink:')) {
//     if (value == null) {
//       el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
//     } else {
//       el.setAttributeNS(xlinkNS, key, value);
//     }
//   } else {
//     // note we are only checking boolean attributes that don't have a
//     // corresponding dom prop of the same name here.
//     const isBoolean = isSpecialBooleanAttr(key);
//     if (value == null || isBoolean && !includeBooleanAttr(value)) {
//       el.removeAttribute(key);
//     } else {
//       el.setAttribute(key, isBoolean ? '' : value);
//     }
//   }
// }

// // __UNSAFE__
// // functions. The user is responsible for using them with only trusted content.
// function patchDOMProp(el, key, value,
// // the following args are passed only due to potential innerHTML/textContent
// // overriding existing VNodes, in which case the old tree must be properly
// // unmounted.
// prevChildren, parentComponent, parentSuspense, unmountChildren) {
//   if (key === 'innerHTML' || key === 'textContent') {
//     if (prevChildren) {
//       unmountChildren(prevChildren, parentComponent, parentSuspense);
//     }
//     el[key] = value == null ? '' : value;
//     return;
//   }
//   if (key === 'value' && el.tagName !== 'PROGRESS' &&
//   // custom elements may use _value internally
//   !el.tagName.includes('-')) {
//     // store value as _value as well since
//     // non-string values will be stringified.
//     el._value = value;
//     const newValue = value == null ? '' : value;
//     if (el.value !== newValue ||
//     // #4956: always set for OPTION elements because its value falls back to
//     // textContent if no value attribute is present. And setting .value for
//     // OPTION has no side effect
//     el.tagName === 'OPTION') {
//       el.value = newValue;
//     }
//     if (value == null) {
//       el.removeAttribute(key);
//     }
//     return;
//   }
//   let needRemove = false;
//   if (value === '' || value == null) {
//     const type = typeof el[key];
//     if (type === 'boolean') {
//       // e.g. <select multiple> compiles to { multiple: '' }
//       value = includeBooleanAttr(value);
//     } else if (value == null && type === 'string') {
//       // e.g. <div :id="null">
//       value = '';
//       needRemove = true;
//     } else if (type === 'number') {
//       // e.g. <img :width="null">
//       value = 0;
//       needRemove = true;
//     }
//   }
//   // some properties perform value validation and throw,
//   // some properties has getter, no setter, will error in 'use strict'
//   // eg. <select :type="null"></select> <select :willValidate="null"></select>
//   try {
//     el[key] = value;
//   } catch (e) {
//     // do not warn if value is auto-coerced from nullish values
//     if (false) {}
//   }
//   needRemove && el.removeAttribute(key);
// }
// function addEventListener(el, event, handler, options) {
//   el.addEventListener(event, handler, options);
// }
// function removeEventListener(el, event, handler, options) {
//   el.removeEventListener(event, handler, options);
// }
// function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
//   // vei = vue event invokers
//   const invokers = el._vei || (el._vei = {});
//   const existingInvoker = invokers[rawName];
//   if (nextValue && existingInvoker) {
//     // patch
//     existingInvoker.value = nextValue;
//   } else {
//     const [name, options] = parseName(rawName);
//     if (nextValue) {
//       // add
//       const invoker = invokers[rawName] = createInvoker(nextValue, instance);
//       addEventListener(el, name, invoker, options);
//     } else if (existingInvoker) {
//       // remove
//       removeEventListener(el, name, existingInvoker, options);
//       invokers[rawName] = undefined;
//     }
//   }
// }
// const optionsModifierRE = /(?:Once|Passive|Capture)$/;
// function parseName(name) {
//   let options;
//   if (optionsModifierRE.test(name)) {
//     options = {};
//     let m;
//     while (m = name.match(optionsModifierRE)) {
//       name = name.slice(0, name.length - m[0].length);
//       options[m[0].toLowerCase()] = true;
//     }
//   }
//   const event = name[2] === ':' ? name.slice(3) : shared_esm_bundler_hyphenate(name.slice(2));
//   return [event, options];
// }
// // To avoid the overhead of repeatedly calling Date.now(), we cache
// // and use the same timestamp for all event listeners attached in the same tick.
// let cachedNow = 0;
// const p = /*#__PURE__*/Promise.resolve();
// const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
// function createInvoker(initialValue, instance) {
//   const invoker = e => {
//     // async edge case vuejs/vue#6566
//     // inner click event triggers patch, event handler
//     // attached to outer element during patch, and triggered again. This
//     // happens because browsers fire microtask ticks between event propagation.
//     // this no longer happens for templates in Vue 3, but could still be
//     // theoretically possible for hand-written render functions.
//     // the solution: we save the timestamp when a handler is attached,
//     // and also attach the timestamp to any event that was handled by vue
//     // for the first time (to avoid inconsistent event timestamp implementations
//     // or events fired from iframes, e.g. #2513)
//     // The handler would only fire if the event passed to it was fired
//     // AFTER it was attached.
//     if (!e._vts) {
//       e._vts = Date.now();
//     } else if (e._vts <= invoker.attached) {
//       return;
//     }
//     callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5 /* ErrorCodes.NATIVE_EVENT_HANDLER */, [e]);
//   };
//   invoker.value = initialValue;
//   invoker.attached = getNow();
//   return invoker;
// }
// function patchStopImmediatePropagation(e, value) {
//   if (shared_esm_bundler_isArray(value)) {
//     const originalStop = e.stopImmediatePropagation;
//     e.stopImmediatePropagation = () => {
//       originalStop.call(e);
//       e._stopped = true;
//     };
//     return value.map(fn => e => !e._stopped && fn && fn(e));
//   } else {
//     return value;
//   }
// }
// const nativeOnRE = /^on[a-z]/;
// const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
//   if (key === 'class') {
//     patchClass(el, nextValue, isSVG);
//   } else if (key === 'style') {
//     patchStyle(el, prevValue, nextValue);
//   } else if (shared_esm_bundler_isOn(key)) {
//     // ignore v-model listeners
//     if (!isModelListener(key)) {
//       patchEvent(el, key, prevValue, nextValue, parentComponent);
//     }
//   } else if (key[0] === '.' ? (key = key.slice(1), true) : key[0] === '^' ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
//     patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
//   } else {
//     // special case for <input v-model type="checkbox"> with
//     // :true-value & :false-value
//     // store value as dom properties since non-string values will be
//     // stringified.
//     if (key === 'true-value') {
//       el._trueValue = nextValue;
//     } else if (key === 'false-value') {
//       el._falseValue = nextValue;
//     }
//     patchAttr(el, key, nextValue, isSVG);
//   }
// };
// function shouldSetAsProp(el, key, value, isSVG) {
//   if (isSVG) {
//     // most keys must be set as attribute on svg elements to work
//     // ...except innerHTML & textContent
//     if (key === 'innerHTML' || key === 'textContent') {
//       return true;
//     }
//     // or native onclick with function values
//     if (key in el && nativeOnRE.test(key) && shared_esm_bundler_isFunction(value)) {
//       return true;
//     }
//     return false;
//   }
//   // these are enumerated attrs, however their corresponding DOM properties
//   // are actually booleans - this leads to setting it with a string "false"
//   // value leading it to be coerced to `true`, so we need to always treat
//   // them as attributes.
//   // Note that `contentEditable` doesn't have this problem: its DOM
//   // property is also enumerated string values.
//   if (key === 'spellcheck' || key === 'draggable' || key === 'translate') {
//     return false;
//   }
//   // #1787, #2840 form property on form elements is readonly and must be set as
//   // attribute.
//   if (key === 'form') {
//     return false;
//   }
//   // #1526 <input list> must be set as attribute
//   if (key === 'list' && el.tagName === 'INPUT') {
//     return false;
//   }
//   // #2766 <textarea type> must be set as attribute
//   if (key === 'type' && el.tagName === 'TEXTAREA') {
//     return false;
//   }
//   // native onclick with string value, must be set as attribute
//   if (nativeOnRE.test(key) && shared_esm_bundler_isString(value)) {
//     return false;
//   }
//   return key in el;
// }
// function defineCustomElement(options, hydrate) {
//   const Comp = defineComponent(options);
//   class VueCustomElement extends VueElement {
//     constructor(initialProps) {
//       super(Comp, initialProps, hydrate);
//     }
//   }
//   VueCustomElement.def = Comp;
//   return VueCustomElement;
// }
// const defineSSRCustomElement = options => {
//   // @ts-ignore
//   return defineCustomElement(options, hydrate);
// };
// const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};
// class VueElement extends (/* unused pure expression or super */ null && (BaseClass)) {
//   constructor(_def, _props = {}, hydrate) {
//     super();
//     this._def = _def;
//     this._props = _props;
//     /**
//      * @internal
//      */
//     this._instance = null;
//     this._connected = false;
//     this._resolved = false;
//     this._numberProps = null;
//     if (this.shadowRoot && hydrate) {
//       hydrate(this._createVNode(), this.shadowRoot);
//     } else {
//       if (false) {}
//       this.attachShadow({
//         mode: 'open'
//       });
//       if (!this._def.__asyncLoader) {
//         // for sync component defs we can immediately resolve props
//         this._resolveProps(this._def);
//       }
//     }
//   }
//   connectedCallback() {
//     this._connected = true;
//     if (!this._instance) {
//       if (this._resolved) {
//         this._update();
//       } else {
//         this._resolveDef();
//       }
//     }
//   }
//   disconnectedCallback() {
//     this._connected = false;
//     nextTick(() => {
//       if (!this._connected) {
//         render(null, this.shadowRoot);
//         this._instance = null;
//       }
//     });
//   }
//   /**
//    * resolve inner component definition (handle possible async component)
//    */
//   _resolveDef() {
//     this._resolved = true;
//     // set initial attrs
//     for (let i = 0; i < this.attributes.length; i++) {
//       this._setAttr(this.attributes[i].name);
//     }
//     // watch future attr changes
//     new MutationObserver(mutations => {
//       for (const m of mutations) {
//         this._setAttr(m.attributeName);
//       }
//     }).observe(this, {
//       attributes: true
//     });
//     const resolve = (def, isAsync = false) => {
//       const {
//         props,
//         styles
//       } = def;
//       // cast Number-type props set before resolve
//       let numberProps;
//       if (props && !isArray(props)) {
//         for (const key in props) {
//           const opt = props[key];
//           if (opt === Number || opt && opt.type === Number) {
//             if (key in this._props) {
//               this._props[key] = toNumber(this._props[key]);
//             }
//             (numberProps || (numberProps = Object.create(null)))[camelize$1(key)] = true;
//           }
//         }
//       }
//       this._numberProps = numberProps;
//       if (isAsync) {
//         // defining getter/setters on prototype
//         // for sync defs, this already happened in the constructor
//         this._resolveProps(def);
//       }
//       // apply CSS
//       this._applyStyles(styles);
//       // initial render
//       this._update();
//     };
//     const asyncDef = this._def.__asyncLoader;
//     if (asyncDef) {
//       asyncDef().then(def => resolve(def, true));
//     } else {
//       resolve(this._def);
//     }
//   }
//   _resolveProps(def) {
//     const {
//       props
//     } = def;
//     const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
//     // check if there are props set pre-upgrade or connect
//     for (const key of Object.keys(this)) {
//       if (key[0] !== '_' && declaredPropKeys.includes(key)) {
//         this._setProp(key, this[key], true, false);
//       }
//     }
//     // defining getter/setters on prototype
//     for (const key of declaredPropKeys.map(camelize$1)) {
//       Object.defineProperty(this, key, {
//         get() {
//           return this._getProp(key);
//         },
//         set(val) {
//           this._setProp(key, val);
//         }
//       });
//     }
//   }
//   _setAttr(key) {
//     let value = this.getAttribute(key);
//     const camelKey = camelize$1(key);
//     if (this._numberProps && this._numberProps[camelKey]) {
//       value = toNumber(value);
//     }
//     this._setProp(camelKey, value, false);
//   }
//   /**
//    * @internal
//    */
//   _getProp(key) {
//     return this._props[key];
//   }
//   /**
//    * @internal
//    */
//   _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
//     if (val !== this._props[key]) {
//       this._props[key] = val;
//       if (shouldUpdate && this._instance) {
//         this._update();
//       }
//       // reflect
//       if (shouldReflect) {
//         if (val === true) {
//           this.setAttribute(hyphenate(key), '');
//         } else if (typeof val === 'string' || typeof val === 'number') {
//           this.setAttribute(hyphenate(key), val + '');
//         } else if (!val) {
//           this.removeAttribute(hyphenate(key));
//         }
//       }
//     }
//   }
//   _update() {
//     render(this._createVNode(), this.shadowRoot);
//   }
//   _createVNode() {
//     const vnode = createVNode(this._def, extend({}, this._props));
//     if (!this._instance) {
//       vnode.ce = instance => {
//         this._instance = instance;
//         instance.isCE = true;
//         // HMR
//         if (false) {}
//         const dispatch = (event, args) => {
//           this.dispatchEvent(new CustomEvent(event, {
//             detail: args
//           }));
//         };
//         // intercept emit
//         instance.emit = (event, ...args) => {
//           // dispatch both the raw and hyphenated versions of an event
//           // to match Vue behavior
//           dispatch(event, args);
//           if (hyphenate(event) !== event) {
//             dispatch(hyphenate(event), args);
//           }
//         };
//         // locate nearest Vue custom element parent for provide/inject
//         let parent = this;
//         while (parent = parent && (parent.parentNode || parent.host)) {
//           if (parent instanceof VueElement) {
//             instance.parent = parent._instance;
//             instance.provides = parent._instance.provides;
//             break;
//           }
//         }
//       };
//     }
//     return vnode;
//   }
//   _applyStyles(styles) {
//     if (styles) {
//       styles.forEach(css => {
//         const s = document.createElement('style');
//         s.textContent = css;
//         this.shadowRoot.appendChild(s);
//         // record for HMR
//         if (false) {}
//       });
//     }
//   }
// }
// function useCssModule(name = '$style') {
//   /* istanbul ignore else */
//   {
//     const instance = getCurrentInstance();
//     if (!instance) {
//        false && 0;
//       return EMPTY_OBJ;
//     }
//     const modules = instance.type.__cssModules;
//     if (!modules) {
//        false && 0;
//       return EMPTY_OBJ;
//     }
//     const mod = modules[name];
//     if (!mod) {
//        false && 0;
//       return EMPTY_OBJ;
//     }
//     return mod;
//   }
// }

// /**
//  * Runtime helper for SFC's CSS variable injection feature.
//  * @private
//  */
// function useCssVars(getter) {
//   const instance = getCurrentInstance();
//   /* istanbul ignore next */
//   if (!instance) {
//      false && 0;
//     return;
//   }
//   const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
//     Array.from(document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)).forEach(node => setVarsOnNode(node, vars));
//   };
//   const setVars = () => {
//     const vars = getter(instance.proxy);
//     setVarsOnVNode(instance.subTree, vars);
//     updateTeleports(vars);
//   };
//   watchPostEffect(setVars);
//   onMounted(() => {
//     const ob = new MutationObserver(setVars);
//     ob.observe(instance.subTree.el.parentNode, {
//       childList: true
//     });
//     onUnmounted(() => ob.disconnect());
//   });
// }
// function setVarsOnVNode(vnode, vars) {
//   if (vnode.shapeFlag & 128 /* ShapeFlags.SUSPENSE */) {
//     const suspense = vnode.suspense;
//     vnode = suspense.activeBranch;
//     if (suspense.pendingBranch && !suspense.isHydrating) {
//       suspense.effects.push(() => {
//         setVarsOnVNode(suspense.activeBranch, vars);
//       });
//     }
//   }
//   // drill down HOCs until it's a non-component vnode
//   while (vnode.component) {
//     vnode = vnode.component.subTree;
//   }
//   if (vnode.shapeFlag & 1 /* ShapeFlags.ELEMENT */ && vnode.el) {
//     setVarsOnNode(vnode.el, vars);
//   } else if (vnode.type === Fragment) {
//     vnode.children.forEach(c => setVarsOnVNode(c, vars));
//   } else if (vnode.type === Static) {
//     let {
//       el,
//       anchor
//     } = vnode;
//     while (el) {
//       setVarsOnNode(el, vars);
//       if (el === anchor) break;
//       el = el.nextSibling;
//     }
//   }
// }
// function setVarsOnNode(el, vars) {
//   if (el.nodeType === 1) {
//     const style = el.style;
//     for (const key in vars) {
//       style.setProperty(`--${key}`, vars[key]);
//     }
//   }
// }
// const TRANSITION = 'transition';
// const ANIMATION = 'animation';
// // DOM Transition is a higher-order-component based on the platform-agnostic
// // base Transition component, with DOM-specific logic.
// const Transition = (props, {
//   slots
// }) => h(BaseTransition, resolveTransitionProps(props), slots);
// Transition.displayName = 'Transition';
// const DOMTransitionPropsValidators = {
//   name: String,
//   type: String,
//   css: {
//     type: Boolean,
//     default: true
//   },
//   duration: [String, Number, Object],
//   enterFromClass: String,
//   enterActiveClass: String,
//   enterToClass: String,
//   appearFromClass: String,
//   appearActiveClass: String,
//   appearToClass: String,
//   leaveFromClass: String,
//   leaveActiveClass: String,
//   leaveToClass: String
// };
// const TransitionPropsValidators = Transition.props = /*#__PURE__*/shared_esm_bundler_extend({}, BaseTransition.props, DOMTransitionPropsValidators);
// /**
//  * #3227 Incoming hooks may be merged into arrays when wrapping Transition
//  * with custom HOCs.
//  */
// const runtime_dom_esm_bundler_callHook = (hook, args = []) => {
//   if (shared_esm_bundler_isArray(hook)) {
//     hook.forEach(h => h(...args));
//   } else if (hook) {
//     hook(...args);
//   }
// };
// /**
//  * Check if a hook expects a callback (2nd arg), which means the user
//  * intends to explicitly control the end of the transition.
//  */
// const hasExplicitCallback = hook => {
//   return hook ? shared_esm_bundler_isArray(hook) ? hook.some(h => h.length > 1) : hook.length > 1 : false;
// };
// function resolveTransitionProps(rawProps) {
//   const baseProps = {};
//   for (const key in rawProps) {
//     if (!(key in DOMTransitionPropsValidators)) {
//       baseProps[key] = rawProps[key];
//     }
//   }
//   if (rawProps.css === false) {
//     return baseProps;
//   }
//   const {
//     name = 'v',
//     type,
//     duration,
//     enterFromClass = `${name}-enter-from`,
//     enterActiveClass = `${name}-enter-active`,
//     enterToClass = `${name}-enter-to`,
//     appearFromClass = enterFromClass,
//     appearActiveClass = enterActiveClass,
//     appearToClass = enterToClass,
//     leaveFromClass = `${name}-leave-from`,
//     leaveActiveClass = `${name}-leave-active`,
//     leaveToClass = `${name}-leave-to`
//   } = rawProps;
//   const durations = normalizeDuration(duration);
//   const enterDuration = durations && durations[0];
//   const leaveDuration = durations && durations[1];
//   const {
//     onBeforeEnter,
//     onEnter,
//     onEnterCancelled,
//     onLeave,
//     onLeaveCancelled,
//     onBeforeAppear = onBeforeEnter,
//     onAppear = onEnter,
//     onAppearCancelled = onEnterCancelled
//   } = baseProps;
//   const finishEnter = (el, isAppear, done) => {
//     removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
//     removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
//     done && done();
//   };
//   const finishLeave = (el, done) => {
//     el._isLeaving = false;
//     removeTransitionClass(el, leaveFromClass);
//     removeTransitionClass(el, leaveToClass);
//     removeTransitionClass(el, leaveActiveClass);
//     done && done();
//   };
//   const makeEnterHook = isAppear => {
//     return (el, done) => {
//       const hook = isAppear ? onAppear : onEnter;
//       const resolve = () => finishEnter(el, isAppear, done);
//       runtime_dom_esm_bundler_callHook(hook, [el, resolve]);
//       nextFrame(() => {
//         removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
//         addTransitionClass(el, isAppear ? appearToClass : enterToClass);
//         if (!hasExplicitCallback(hook)) {
//           whenTransitionEnds(el, type, enterDuration, resolve);
//         }
//       });
//     };
//   };
//   return shared_esm_bundler_extend(baseProps, {
//     onBeforeEnter(el) {
//       runtime_dom_esm_bundler_callHook(onBeforeEnter, [el]);
//       addTransitionClass(el, enterFromClass);
//       addTransitionClass(el, enterActiveClass);
//     },
//     onBeforeAppear(el) {
//       runtime_dom_esm_bundler_callHook(onBeforeAppear, [el]);
//       addTransitionClass(el, appearFromClass);
//       addTransitionClass(el, appearActiveClass);
//     },
//     onEnter: makeEnterHook(false),
//     onAppear: makeEnterHook(true),
//     onLeave(el, done) {
//       el._isLeaving = true;
//       const resolve = () => finishLeave(el, done);
//       addTransitionClass(el, leaveFromClass);
//       // force reflow so *-leave-from classes immediately take effect (#2593)
//       forceReflow();
//       addTransitionClass(el, leaveActiveClass);
//       nextFrame(() => {
//         if (!el._isLeaving) {
//           // cancelled
//           return;
//         }
//         removeTransitionClass(el, leaveFromClass);
//         addTransitionClass(el, leaveToClass);
//         if (!hasExplicitCallback(onLeave)) {
//           whenTransitionEnds(el, type, leaveDuration, resolve);
//         }
//       });
//       runtime_dom_esm_bundler_callHook(onLeave, [el, resolve]);
//     },
//     onEnterCancelled(el) {
//       finishEnter(el, false);
//       runtime_dom_esm_bundler_callHook(onEnterCancelled, [el]);
//     },
//     onAppearCancelled(el) {
//       finishEnter(el, true);
//       runtime_dom_esm_bundler_callHook(onAppearCancelled, [el]);
//     },
//     onLeaveCancelled(el) {
//       finishLeave(el);
//       runtime_dom_esm_bundler_callHook(onLeaveCancelled, [el]);
//     }
//   });
// }
// function normalizeDuration(duration) {
//   if (duration == null) {
//     return null;
//   } else if (shared_esm_bundler_isObject(duration)) {
//     return [NumberOf(duration.enter), NumberOf(duration.leave)];
//   } else {
//     const n = NumberOf(duration);
//     return [n, n];
//   }
// }
// function NumberOf(val) {
//   const res = shared_esm_bundler_toNumber(val);
//   if (false) {}
//   return res;
// }
// function validateDuration(val) {
//   if (typeof val !== 'number') {
//     warn(`<transition> explicit duration is not a valid number - ` + `got ${JSON.stringify(val)}.`);
//   } else if (isNaN(val)) {
//     warn(`<transition> explicit duration is NaN - ` + 'the duration expression might be incorrect.');
//   }
// }
// function addTransitionClass(el, cls) {
//   cls.split(/\s+/).forEach(c => c && el.classList.add(c));
//   (el._vtc || (el._vtc = new Set())).add(cls);
// }
// function removeTransitionClass(el, cls) {
//   cls.split(/\s+/).forEach(c => c && el.classList.remove(c));
//   const {
//     _vtc
//   } = el;
//   if (_vtc) {
//     _vtc.delete(cls);
//     if (!_vtc.size) {
//       el._vtc = undefined;
//     }
//   }
// }
// function nextFrame(cb) {
//   requestAnimationFrame(() => {
//     requestAnimationFrame(cb);
//   });
// }
// let endId = 0;
// function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
//   const id = el._endId = ++endId;
//   const resolveIfNotStale = () => {
//     if (id === el._endId) {
//       resolve();
//     }
//   };
//   if (explicitTimeout) {
//     return setTimeout(resolveIfNotStale, explicitTimeout);
//   }
//   const {
//     type,
//     timeout,
//     propCount
//   } = getTransitionInfo(el, expectedType);
//   if (!type) {
//     return resolve();
//   }
//   const endEvent = type + 'end';
//   let ended = 0;
//   const end = () => {
//     el.removeEventListener(endEvent, onEnd);
//     resolveIfNotStale();
//   };
//   const onEnd = e => {
//     if (e.target === el && ++ended >= propCount) {
//       end();
//     }
//   };
//   setTimeout(() => {
//     if (ended < propCount) {
//       end();
//     }
//   }, timeout + 1);
//   el.addEventListener(endEvent, onEnd);
// }
// function getTransitionInfo(el, expectedType) {
//   const styles = window.getComputedStyle(el);
//   // JSDOM may return undefined for transition properties
//   const getStyleProperties = key => (styles[key] || '').split(', ');
//   const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
//   const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
//   const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
//   const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
//   const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
//   const animationTimeout = getTimeout(animationDelays, animationDurations);
//   let type = null;
//   let timeout = 0;
//   let propCount = 0;
//   /* istanbul ignore if */
//   if (expectedType === TRANSITION) {
//     if (transitionTimeout > 0) {
//       type = TRANSITION;
//       timeout = transitionTimeout;
//       propCount = transitionDurations.length;
//     }
//   } else if (expectedType === ANIMATION) {
//     if (animationTimeout > 0) {
//       type = ANIMATION;
//       timeout = animationTimeout;
//       propCount = animationDurations.length;
//     }
//   } else {
//     timeout = Math.max(transitionTimeout, animationTimeout);
//     type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
//     propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
//   }
//   const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
//   return {
//     type,
//     timeout,
//     propCount,
//     hasTransform
//   };
// }
// function getTimeout(delays, durations) {
//   while (delays.length < durations.length) {
//     delays = delays.concat(delays);
//   }
//   return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
// }
// // Old versions of Chromium (below 61.0.3163.100) formats floating pointer
// // numbers in a locale-dependent way, using a comma instead of a dot.
// // If comma is not replaced with a dot, the input will be rounded down
// // (i.e. acting as a floor function) causing unexpected behaviors
// function toMs(s) {
//   return Number(s.slice(0, -1).replace(',', '.')) * 1000;
// }
// // synchronously force layout to put elements into a certain state
// function forceReflow() {
//   return document.body.offsetHeight;
// }
// const positionMap = new WeakMap();
// const newPositionMap = new WeakMap();
// const TransitionGroupImpl = {
//   name: 'TransitionGroup',
//   props: /*#__PURE__*/shared_esm_bundler_extend({}, TransitionPropsValidators, {
//     tag: String,
//     moveClass: String
//   }),
//   setup(props, {
//     slots
//   }) {
//     const instance = runtime_core_esm_bundler_getCurrentInstance();
//     const state = useTransitionState();
//     let prevChildren;
//     let children;
//     onUpdated(() => {
//       // children is guaranteed to exist after initial render
//       if (!prevChildren.length) {
//         return;
//       }
//       const moveClass = props.moveClass || `${props.name || 'v'}-move`;
//       if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
//         return;
//       }
//       // we divide the work into three loops to avoid mixing DOM reads and writes
//       // in each iteration - which helps prevent layout thrashing.
//       prevChildren.forEach(callPendingCbs);
//       prevChildren.forEach(recordPosition);
//       const movedChildren = prevChildren.filter(applyTranslation);
//       // force reflow to put everything in position
//       forceReflow();
//       movedChildren.forEach(c => {
//         const el = c.el;
//         const style = el.style;
//         addTransitionClass(el, moveClass);
//         style.transform = style.webkitTransform = style.transitionDuration = '';
//         const cb = el._moveCb = e => {
//           if (e && e.target !== el) {
//             return;
//           }
//           if (!e || /transform$/.test(e.propertyName)) {
//             el.removeEventListener('transitionend', cb);
//             el._moveCb = null;
//             removeTransitionClass(el, moveClass);
//           }
//         };
//         el.addEventListener('transitionend', cb);
//       });
//     });
//     return () => {
//       const rawProps = reactivity_esm_bundler_toRaw(props);
//       const cssTransitionProps = resolveTransitionProps(rawProps);
//       let tag = rawProps.tag || runtime_core_esm_bundler_Fragment;
//       prevChildren = children;
//       children = slots.default ? getTransitionRawChildren(slots.default()) : [];
//       for (let i = 0; i < children.length; i++) {
//         const child = children[i];
//         if (child.key != null) {
//           setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
//         } else if (false) {}
//       }
//       if (prevChildren) {
//         for (let i = 0; i < prevChildren.length; i++) {
//           const child = prevChildren[i];
//           setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
//           positionMap.set(child, child.el.getBoundingClientRect());
//         }
//       }
//       return runtime_core_esm_bundler_createVNode(tag, null, children);
//     };
//   }
// };
// const TransitionGroup = (/* unused pure expression or super */ null && (TransitionGroupImpl));
// function callPendingCbs(c) {
//   const el = c.el;
//   if (el._moveCb) {
//     el._moveCb();
//   }
//   if (el._enterCb) {
//     el._enterCb();
//   }
// }
// function recordPosition(c) {
//   newPositionMap.set(c, c.el.getBoundingClientRect());
// }
// function applyTranslation(c) {
//   const oldPos = positionMap.get(c);
//   const newPos = newPositionMap.get(c);
//   const dx = oldPos.left - newPos.left;
//   const dy = oldPos.top - newPos.top;
//   if (dx || dy) {
//     const s = c.el.style;
//     s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
//     s.transitionDuration = '0s';
//     return c;
//   }
// }
// function hasCSSTransform(el, root, moveClass) {
//   // Detect whether an element with the move class applied has
//   // CSS transitions. Since the element may be inside an entering
//   // transition at this very moment, we make a clone of it and remove
//   // all other transition classes applied to ensure only the move class
//   // is applied.
//   const clone = el.cloneNode();
//   if (el._vtc) {
//     el._vtc.forEach(cls => {
//       cls.split(/\s+/).forEach(c => c && clone.classList.remove(c));
//     });
//   }
//   moveClass.split(/\s+/).forEach(c => c && clone.classList.add(c));
//   clone.style.display = 'none';
//   const container = root.nodeType === 1 ? root : root.parentNode;
//   container.appendChild(clone);
//   const {
//     hasTransform
//   } = getTransitionInfo(clone);
//   container.removeChild(clone);
//   return hasTransform;
// }
// const getModelAssigner = vnode => {
//   const fn = vnode.props['onUpdate:modelValue'] || false;
//   return shared_esm_bundler_isArray(fn) ? value => invokeArrayFns(fn, value) : fn;
// };
// function onCompositionStart(e) {
//   e.target.composing = true;
// }
// function onCompositionEnd(e) {
//   const target = e.target;
//   if (target.composing) {
//     target.composing = false;
//     target.dispatchEvent(new Event('input'));
//   }
// }
// // We are exporting the v-model runtime directly as vnode hooks so that it can
// // be tree-shaken in case v-model is never used.
// const vModelText = {
//   created(el, {
//     modifiers: {
//       lazy,
//       trim,
//       number
//     }
//   }, vnode) {
//     el._assign = getModelAssigner(vnode);
//     const castToNumber = number || vnode.props && vnode.props.type === 'number';
//     addEventListener(el, lazy ? 'change' : 'input', e => {
//       if (e.target.composing) return;
//       let domValue = el.value;
//       if (trim) {
//         domValue = domValue.trim();
//       }
//       if (castToNumber) {
//         domValue = shared_esm_bundler_toNumber(domValue);
//       }
//       el._assign(domValue);
//     });
//     if (trim) {
//       addEventListener(el, 'change', () => {
//         el.value = el.value.trim();
//       });
//     }
//     if (!lazy) {
//       addEventListener(el, 'compositionstart', onCompositionStart);
//       addEventListener(el, 'compositionend', onCompositionEnd);
//       // Safari < 10.2 & UIWebView doesn't fire compositionend when
//       // switching focus before confirming composition choice
//       // this also fixes the issue where some browsers e.g. iOS Chrome
//       // fires "change" instead of "input" on autocomplete.
//       addEventListener(el, 'change', onCompositionEnd);
//     }
//   },
//   // set value on mounted so it's after min/max for type="range"
//   mounted(el, {
//     value
//   }) {
//     el.value = value == null ? '' : value;
//   },
//   beforeUpdate(el, {
//     value,
//     modifiers: {
//       lazy,
//       trim,
//       number
//     }
//   }, vnode) {
//     el._assign = getModelAssigner(vnode);
//     // avoid clearing unresolved text. #2302
//     if (el.composing) return;
//     if (document.activeElement === el && el.type !== 'range') {
//       if (lazy) {
//         return;
//       }
//       if (trim && el.value.trim() === value) {
//         return;
//       }
//       if ((number || el.type === 'number') && shared_esm_bundler_toNumber(el.value) === value) {
//         return;
//       }
//     }
//     const newValue = value == null ? '' : value;
//     if (el.value !== newValue) {
//       el.value = newValue;
//     }
//   }
// };
// const vModelCheckbox = {
//   // #4096 array checkboxes need to be deep traversed
//   deep: true,
//   created(el, _, vnode) {
//     el._assign = getModelAssigner(vnode);
//     addEventListener(el, 'change', () => {
//       const modelValue = el._modelValue;
//       const elementValue = getValue(el);
//       const checked = el.checked;
//       const assign = el._assign;
//       if (shared_esm_bundler_isArray(modelValue)) {
//         const index = shared_esm_bundler_looseIndexOf(modelValue, elementValue);
//         const found = index !== -1;
//         if (checked && !found) {
//           assign(modelValue.concat(elementValue));
//         } else if (!checked && found) {
//           const filtered = [...modelValue];
//           filtered.splice(index, 1);
//           assign(filtered);
//         }
//       } else if (shared_esm_bundler_isSet(modelValue)) {
//         const cloned = new Set(modelValue);
//         if (checked) {
//           cloned.add(elementValue);
//         } else {
//           cloned.delete(elementValue);
//         }
//         assign(cloned);
//       } else {
//         assign(getCheckboxValue(el, checked));
//       }
//     });
//   },
//   // set initial checked on mount to wait for true-value/false-value
//   mounted: setChecked,
//   beforeUpdate(el, binding, vnode) {
//     el._assign = getModelAssigner(vnode);
//     setChecked(el, binding, vnode);
//   }
// };
// function setChecked(el, {
//   value,
//   oldValue
// }, vnode) {
//   el._modelValue = value;
//   if (shared_esm_bundler_isArray(value)) {
//     el.checked = shared_esm_bundler_looseIndexOf(value, vnode.props.value) > -1;
//   } else if (shared_esm_bundler_isSet(value)) {
//     el.checked = value.has(vnode.props.value);
//   } else if (value !== oldValue) {
//     el.checked = shared_esm_bundler_looseEqual(value, getCheckboxValue(el, true));
//   }
// }
// const vModelRadio = {
//   created(el, {
//     value
//   }, vnode) {
//     el.checked = shared_esm_bundler_looseEqual(value, vnode.props.value);
//     el._assign = getModelAssigner(vnode);
//     addEventListener(el, 'change', () => {
//       el._assign(getValue(el));
//     });
//   },
//   beforeUpdate(el, {
//     value,
//     oldValue
//   }, vnode) {
//     el._assign = getModelAssigner(vnode);
//     if (value !== oldValue) {
//       el.checked = shared_esm_bundler_looseEqual(value, vnode.props.value);
//     }
//   }
// };
// const vModelSelect = {
//   // <select multiple> value need to be deep traversed
//   deep: true,
//   created(el, {
//     value,
//     modifiers: {
//       number
//     }
//   }, vnode) {
//     const isSetModel = shared_esm_bundler_isSet(value);
//     addEventListener(el, 'change', () => {
//       const selectedVal = Array.prototype.filter.call(el.options, o => o.selected).map(o => number ? shared_esm_bundler_toNumber(getValue(o)) : getValue(o));
//       el._assign(el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]);
//     });
//     el._assign = getModelAssigner(vnode);
//   },
//   // set value in mounted & updated because <select> relies on its children
//   // <option>s.
//   mounted(el, {
//     value
//   }) {
//     setSelected(el, value);
//   },
//   beforeUpdate(el, _binding, vnode) {
//     el._assign = getModelAssigner(vnode);
//   },
//   updated(el, {
//     value
//   }) {
//     setSelected(el, value);
//   }
// };
// function setSelected(el, value) {
//   const isMultiple = el.multiple;
//   if (isMultiple && !shared_esm_bundler_isArray(value) && !shared_esm_bundler_isSet(value)) {
//      false && 0;
//     return;
//   }
//   for (let i = 0, l = el.options.length; i < l; i++) {
//     const option = el.options[i];
//     const optionValue = getValue(option);
//     if (isMultiple) {
//       if (shared_esm_bundler_isArray(value)) {
//         option.selected = shared_esm_bundler_looseIndexOf(value, optionValue) > -1;
//       } else {
//         option.selected = value.has(optionValue);
//       }
//     } else {
//       if (shared_esm_bundler_looseEqual(getValue(option), value)) {
//         if (el.selectedIndex !== i) el.selectedIndex = i;
//         return;
//       }
//     }
//   }
//   if (!isMultiple && el.selectedIndex !== -1) {
//     el.selectedIndex = -1;
//   }
// }
// // retrieve raw value set via :value bindings
// function getValue(el) {
//   return '_value' in el ? el._value : el.value;
// }
// // retrieve raw value for true-value and false-value set via :true-value or :false-value bindings
// function getCheckboxValue(el, checked) {
//   const key = checked ? '_trueValue' : '_falseValue';
//   return key in el ? el[key] : checked;
// }
// const vModelDynamic = {
//   created(el, binding, vnode) {
//     callModelHook(el, binding, vnode, null, 'created');
//   },
//   mounted(el, binding, vnode) {
//     callModelHook(el, binding, vnode, null, 'mounted');
//   },
//   beforeUpdate(el, binding, vnode, prevVNode) {
//     callModelHook(el, binding, vnode, prevVNode, 'beforeUpdate');
//   },
//   updated(el, binding, vnode, prevVNode) {
//     callModelHook(el, binding, vnode, prevVNode, 'updated');
//   }
// };
// function resolveDynamicModel(tagName, type) {
//   switch (tagName) {
//     case 'SELECT':
//       return vModelSelect;
//     case 'TEXTAREA':
//       return vModelText;
//     default:
//       switch (type) {
//         case 'checkbox':
//           return vModelCheckbox;
//         case 'radio':
//           return vModelRadio;
//         default:
//           return vModelText;
//       }
//   }
// }
// function callModelHook(el, binding, vnode, prevVNode, hook) {
//   const modelToUse = resolveDynamicModel(el.tagName, vnode.props && vnode.props.type);
//   const fn = modelToUse[hook];
//   fn && fn(el, binding, vnode, prevVNode);
// }
// // SSR vnode transforms, only used when user includes client-oriented render
// // function in SSR
// function initVModelForSSR() {
//   vModelText.getSSRProps = ({
//     value
//   }) => ({
//     value
//   });
//   vModelRadio.getSSRProps = ({
//     value
//   }, vnode) => {
//     if (vnode.props && looseEqual(vnode.props.value, value)) {
//       return {
//         checked: true
//       };
//     }
//   };
//   vModelCheckbox.getSSRProps = ({
//     value
//   }, vnode) => {
//     if (isArray(value)) {
//       if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) {
//         return {
//           checked: true
//         };
//       }
//     } else if (isSet(value)) {
//       if (vnode.props && value.has(vnode.props.value)) {
//         return {
//           checked: true
//         };
//       }
//     } else if (value) {
//       return {
//         checked: true
//       };
//     }
//   };
//   vModelDynamic.getSSRProps = (binding, vnode) => {
//     if (typeof vnode.type !== 'string') {
//       return;
//     }
//     const modelToUse = resolveDynamicModel(
//     // resolveDynamicModel expects an uppercase tag name, but vnode.type is lowercase
//     vnode.type.toUpperCase(), vnode.props && vnode.props.type);
//     if (modelToUse.getSSRProps) {
//       return modelToUse.getSSRProps(binding, vnode);
//     }
//   };
// }
// const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
// const modifierGuards = {
//   stop: e => e.stopPropagation(),
//   prevent: e => e.preventDefault(),
//   self: e => e.target !== e.currentTarget,
//   ctrl: e => !e.ctrlKey,
//   shift: e => !e.shiftKey,
//   alt: e => !e.altKey,
//   meta: e => !e.metaKey,
//   left: e => 'button' in e && e.button !== 0,
//   middle: e => 'button' in e && e.button !== 1,
//   right: e => 'button' in e && e.button !== 2,
//   exact: (e, modifiers) => systemModifiers.some(m => e[`${m}Key`] && !modifiers.includes(m))
// };
// /**
//  * @private
//  */
// const withModifiers = (fn, modifiers) => {
//   return (event, ...args) => {
//     for (let i = 0; i < modifiers.length; i++) {
//       const guard = modifierGuards[modifiers[i]];
//       if (guard && guard(event, modifiers)) return;
//     }
//     return fn(event, ...args);
//   };
// };
// // Kept for 2.x compat.
// // Note: IE11 compat for `spacebar` and `del` is removed for now.
// const keyNames = {
//   esc: 'escape',
//   space: ' ',
//   up: 'arrow-up',
//   left: 'arrow-left',
//   right: 'arrow-right',
//   down: 'arrow-down',
//   delete: 'backspace'
// };
// /**
//  * @private
//  */
// const withKeys = (fn, modifiers) => {
//   return event => {
//     if (!('key' in event)) {
//       return;
//     }
//     const eventKey = hyphenate(event.key);
//     if (modifiers.some(k => k === eventKey || keyNames[k] === eventKey)) {
//       return fn(event);
//     }
//   };
// };
// const vShow = {
//   beforeMount(el, {
//     value
//   }, {
//     transition
//   }) {
//     el._vod = el.style.display === 'none' ? '' : el.style.display;
//     if (transition && value) {
//       transition.beforeEnter(el);
//     } else {
//       setDisplay(el, value);
//     }
//   },
//   mounted(el, {
//     value
//   }, {
//     transition
//   }) {
//     if (transition && value) {
//       transition.enter(el);
//     }
//   },
//   updated(el, {
//     value,
//     oldValue
//   }, {
//     transition
//   }) {
//     if (!value === !oldValue) return;
//     if (transition) {
//       if (value) {
//         transition.beforeEnter(el);
//         setDisplay(el, true);
//         transition.enter(el);
//       } else {
//         transition.leave(el, () => {
//           setDisplay(el, false);
//         });
//       }
//     } else {
//       setDisplay(el, value);
//     }
//   },
//   beforeUnmount(el, {
//     value
//   }) {
//     setDisplay(el, value);
//   }
// };
// function setDisplay(el, value) {
//   el.style.display = value ? el._vod : 'none';
// }
// // SSR vnode transforms, only used when user includes client-oriented render
// // function in SSR
// function initVShowForSSR() {
//   vShow.getSSRProps = ({
//     value
//   }) => {
//     if (!value) {
//       return {
//         style: {
//           display: 'none'
//         }
//       };
//     }
//   };
// }
// const rendererOptions = /*#__PURE__*/shared_esm_bundler_extend({
//   patchProp
// }, nodeOps);
// // lazy create the renderer - this makes core renderer logic tree-shakable
// // in case the user only imports reactivity utilities from Vue.
// let renderer;
// let enabledHydration = false;
// function ensureRenderer() {
//   return renderer || (renderer = createRenderer(rendererOptions));
// }
// function ensureHydrationRenderer() {
//   renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
//   enabledHydration = true;
//   return renderer;
// }
// // use explicit type casts here to avoid import() calls in rolled-up d.ts
// const render = (...args) => {
//   ensureRenderer().render(...args);
// };
// const hydrate = (...args) => {
//   ensureHydrationRenderer().hydrate(...args);
// };
// const createApp = (...args) => {
//   const app = ensureRenderer().createApp(...args);
//   if (false) {}
//   const {
//     mount
//   } = app;
//   app.mount = containerOrSelector => {
//     const container = normalizeContainer(containerOrSelector);
//     if (!container) return;
//     const component = app._component;
//     if (!shared_esm_bundler_isFunction(component) && !component.render && !component.template) {
//       // __UNSAFE__
//       // Reason: potential execution of JS expressions in in-DOM template.
//       // The user must make sure the in-DOM template is trusted. If it's
//       // rendered by the server, the template should not contain any user data.
//       component.template = container.innerHTML;
//     }
//     // clear content before mounting
//     container.innerHTML = '';
//     const proxy = mount(container, false, container instanceof SVGElement);
//     if (container instanceof Element) {
//       container.removeAttribute('v-cloak');
//       container.setAttribute('data-v-app', '');
//     }
//     return proxy;
//   };
//   return app;
// };
// const createSSRApp = (...args) => {
//   const app = ensureHydrationRenderer().createApp(...args);
//   if (false) {}
//   const {
//     mount
//   } = app;
//   app.mount = containerOrSelector => {
//     const container = normalizeContainer(containerOrSelector);
//     if (container) {
//       return mount(container, true, container instanceof SVGElement);
//     }
//   };
//   return app;
// };
// function injectNativeTagCheck(app) {
//   // Inject `isNativeTag`
//   // this is used for component name validation (dev only)
//   Object.defineProperty(app.config, 'isNativeTag', {
//     value: tag => isHTMLTag(tag) || isSVGTag(tag),
//     writable: false
//   });
// }
// // dev only
// function injectCompilerOptionsCheck(app) {
//   if (isRuntimeOnly()) {
//     const isCustomElement = app.config.isCustomElement;
//     Object.defineProperty(app.config, 'isCustomElement', {
//       get() {
//         return isCustomElement;
//       },
//       set() {
//         warn(`The \`isCustomElement\` config option is deprecated. Use ` + `\`compilerOptions.isCustomElement\` instead.`);
//       }
//     });
//     const compilerOptions = app.config.compilerOptions;
//     const msg = `The \`compilerOptions\` config option is only respected when using ` + `a build of Vue.js that includes the runtime compiler (aka "full build"). ` + `Since you are using the runtime-only build, \`compilerOptions\` ` + `must be passed to \`@vue/compiler-dom\` in the build setup instead.\n` + `- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.\n` + `- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n` + `- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom`;
//     Object.defineProperty(app.config, 'compilerOptions', {
//       get() {
//         warn(msg);
//         return compilerOptions;
//       },
//       set() {
//         warn(msg);
//       }
//     });
//   }
// }
// function normalizeContainer(container) {
//   if (shared_esm_bundler_isString(container)) {
//     const res = document.querySelector(container);
//     if (false) {}
//     return res;
//   }
//   if (false) {}
//   return container;
// }
// let ssrDirectiveInitialized = false;
// /**
//  * @internal
//  */
// const initDirectivesForSSR = () => {
//   if (!ssrDirectiveInitialized) {
//     ssrDirectiveInitialized = true;
//     initVModelForSSR();
//     initVShowForSSR();
//   }
// };

// ;// CONCATENATED MODULE: ../../node_modules/vue-router/dist/vue-router.mjs


// /*!
//   * vue-router v4.2.1
//   * (c) 2023 Eduardo San Martin Morote
//   * @license MIT
//   */


// const isBrowser = typeof window !== 'undefined';
// function isESModule(obj) {
//   return obj.__esModule || obj[Symbol.toStringTag] === 'Module';
// }
// const vue_router_assign = Object.assign;
// function applyToParams(fn, params) {
//   const newParams = {};
//   for (const key in params) {
//     const value = params[key];
//     newParams[key] = vue_router_isArray(value) ? value.map(fn) : fn(value);
//   }
//   return newParams;
// }
// const noop = () => {};
// /**
//  * Typesafe alternative to Array.isArray
//  * https://github.com/microsoft/TypeScript/pull/48228
//  */
// const vue_router_isArray = Array.isArray;
// function vue_router_warn(msg) {
//   // avoid using ...args as it breaks in older Edge builds
//   const args = Array.from(arguments).slice(1);
//   console.warn.apply(console, ['[Vue Router warn]: ' + msg].concat(args));
// }
// const TRAILING_SLASH_RE = /\/$/;
// const removeTrailingSlash = path => path.replace(TRAILING_SLASH_RE, '');
// /**
//  * Transforms a URI into a normalized history location
//  *
//  * @param parseQuery
//  * @param location - URI to normalize
//  * @param currentLocation - current absolute location. Allows resolving relative
//  * paths. Must start with `/`. Defaults to `/`
//  * @returns a normalized history location
//  */
// function parseURL(parseQuery, location, currentLocation = '/') {
//   let path,
//     query = {},
//     searchString = '',
//     hash = '';
//   // Could use URL and URLSearchParams but IE 11 doesn't support it
//   // TODO: move to new URL()
//   const hashPos = location.indexOf('#');
//   let searchPos = location.indexOf('?');
//   // the hash appears before the search, so it's not part of the search string
//   if (hashPos < searchPos && hashPos >= 0) {
//     searchPos = -1;
//   }
//   if (searchPos > -1) {
//     path = location.slice(0, searchPos);
//     searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);
//     query = parseQuery(searchString);
//   }
//   if (hashPos > -1) {
//     path = path || location.slice(0, hashPos);
//     // keep the # character
//     hash = location.slice(hashPos, location.length);
//   }
//   // no search and no query
//   path = resolveRelativePath(path != null ? path : location, currentLocation);
//   // empty path means a relative query or hash `?foo=f`, `#thing`
//   return {
//     fullPath: path + (searchString && '?') + searchString + hash,
//     path,
//     query,
//     hash
//   };
// }
// /**
//  * Stringifies a URL object
//  *
//  * @param stringifyQuery
//  * @param location
//  */
// function stringifyURL(stringifyQuery, location) {
//   const query = location.query ? stringifyQuery(location.query) : '';
//   return location.path + (query && '?') + query + (location.hash || '');
// }
// /**
//  * Strips off the base from the beginning of a location.pathname in a non-case-sensitive way.
//  *
//  * @param pathname - location.pathname
//  * @param base - base to strip off
//  */
// function stripBase(pathname, base) {
//   // no base or base is not found at the beginning
//   if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase())) return pathname;
//   return pathname.slice(base.length) || '/';
// }
// /**
//  * Checks if two RouteLocation are equal. This means that both locations are
//  * pointing towards the same {@link RouteRecord} and that all `params`, `query`
//  * parameters and `hash` are the same
//  *
//  * @param stringifyQuery - A function that takes a query object of type LocationQueryRaw and returns a string representation of it.
//  * @param a - first {@link RouteLocation}
//  * @param b - second {@link RouteLocation}
//  */
// function isSameRouteLocation(stringifyQuery, a, b) {
//   const aLastIndex = a.matched.length - 1;
//   const bLastIndex = b.matched.length - 1;
//   return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery(a.query) === stringifyQuery(b.query) && a.hash === b.hash;
// }
// /**
//  * Check if two `RouteRecords` are equal. Takes into account aliases: they are
//  * considered equal to the `RouteRecord` they are aliasing.
//  *
//  * @param a - first {@link RouteRecord}
//  * @param b - second {@link RouteRecord}
//  */
// function isSameRouteRecord(a, b) {
//   // since the original record has an undefined value for aliasOf
//   // but all aliases point to the original record, this will always compare
//   // the original record
//   return (a.aliasOf || a) === (b.aliasOf || b);
// }
// function isSameRouteLocationParams(a, b) {
//   if (Object.keys(a).length !== Object.keys(b).length) return false;
//   for (const key in a) {
//     if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
//   }
//   return true;
// }
// function isSameRouteLocationParamsValue(a, b) {
//   return vue_router_isArray(a) ? isEquivalentArray(a, b) : vue_router_isArray(b) ? isEquivalentArray(b, a) : a === b;
// }
// /**
//  * Check if two arrays are the same or if an array with one single entry is the
//  * same as another primitive value. Used to check query and parameters
//  *
//  * @param a - array of values
//  * @param b - array of values or a single value
//  */
// function isEquivalentArray(a, b) {
//   return vue_router_isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
// }
// /**
//  * Resolves a relative path that starts with `.`.
//  *
//  * @param to - path location we are resolving
//  * @param from - currentLocation.path, should start with `/`
//  */
// function resolveRelativePath(to, from) {
//   if (to.startsWith('/')) return to;
//   if (false) {}
//   if (!to) return from;
//   const fromSegments = from.split('/');
//   const toSegments = to.split('/');
//   const lastToSegment = toSegments[toSegments.length - 1];
//   // make . and ./ the same (../ === .., ../../ === ../..)
//   // this is the same behavior as new URL()
//   if (lastToSegment === '..' || lastToSegment === '.') {
//     toSegments.push('');
//   }
//   let position = fromSegments.length - 1;
//   let toPosition;
//   let segment;
//   for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
//     segment = toSegments[toPosition];
//     // we stay on the same position
//     if (segment === '.') continue;
//     // go up in the from array
//     if (segment === '..') {
//       // we can't go below zero, but we still need to increment toPosition
//       if (position > 1) position--;
//       // continue
//     }
//     // we reached a non-relative path, we stop here
//     else break;
//   }
//   return fromSegments.slice(0, position).join('/') + '/' + toSegments
//   // ensure we use at least the last element in the toSegments
//   .slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join('/');
// }
// var NavigationType;
// (function (NavigationType) {
//   NavigationType["pop"] = "pop";
//   NavigationType["push"] = "push";
// })(NavigationType || (NavigationType = {}));
// var NavigationDirection;
// (function (NavigationDirection) {
//   NavigationDirection["back"] = "back";
//   NavigationDirection["forward"] = "forward";
//   NavigationDirection["unknown"] = "";
// })(NavigationDirection || (NavigationDirection = {}));
// /**
//  * Starting location for Histories
//  */
// const START = '';
// // Generic utils
// /**
//  * Normalizes a base by removing any trailing slash and reading the base tag if
//  * present.
//  *
//  * @param base - base to normalize
//  */
// function normalizeBase(base) {
//   if (!base) {
//     if (isBrowser) {
//       // respect <base> tag
//       const baseEl = document.querySelector('base');
//       base = baseEl && baseEl.getAttribute('href') || '/';
//       // strip full URL origin
//       base = base.replace(/^\w+:\/\/[^\/]+/, '');
//     } else {
//       base = '/';
//     }
//   }
//   // ensure leading slash when it was removed by the regex above avoid leading
//   // slash with hash because the file could be read from the disk like file://
//   // and the leading slash would cause problems
//   if (base[0] !== '/' && base[0] !== '#') base = '/' + base;
//   // remove the trailing slash so all other method can just do `base + fullPath`
//   // to build an href
//   return removeTrailingSlash(base);
// }
// // remove any character before the hash
// const BEFORE_HASH_RE = /^[^#]+#/;
// function createHref(base, location) {
//   return base.replace(BEFORE_HASH_RE, '#') + location;
// }
// function getElementPosition(el, offset) {
//   const docRect = document.documentElement.getBoundingClientRect();
//   const elRect = el.getBoundingClientRect();
//   return {
//     behavior: offset.behavior,
//     left: elRect.left - docRect.left - (offset.left || 0),
//     top: elRect.top - docRect.top - (offset.top || 0)
//   };
// }
// const computeScrollPosition = () => ({
//   left: window.pageXOffset,
//   top: window.pageYOffset
// });
// function scrollToPosition(position) {
//   let scrollToOptions;
//   if ('el' in position) {
//     const positionEl = position.el;
//     const isIdSelector = typeof positionEl === 'string' && positionEl.startsWith('#');
//     /**
//      * `id`s can accept pretty much any characters, including CSS combinators
//      * like `>` or `~`. It's still possible to retrieve elements using
//      * `document.getElementById('~')` but it needs to be escaped when using
//      * `document.querySelector('#\\~')` for it to be valid. The only
//      * requirements for `id`s are them to be unique on the page and to not be
//      * empty (`id=""`). Because of that, when passing an id selector, it should
//      * be properly escaped for it to work with `querySelector`. We could check
//      * for the id selector to be simple (no CSS combinators `+ >~`) but that
//      * would make things inconsistent since they are valid characters for an
//      * `id` but would need to be escaped when using `querySelector`, breaking
//      * their usage and ending up in no selector returned. Selectors need to be
//      * escaped:
//      *
//      * - `#1-thing` becomes `#\31 -thing`
//      * - `#with~symbols` becomes `#with\\~symbols`
//      *
//      * - More information about  the topic can be found at
//      *   https://mathiasbynens.be/notes/html5-id-class.
//      * - Practical example: https://mathiasbynens.be/demo/html5-id
//      */
//     if (false) {}
//     const el = typeof positionEl === 'string' ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
//     if (!el) {
//        false && 0;
//       return;
//     }
//     scrollToOptions = getElementPosition(el, position);
//   } else {
//     scrollToOptions = position;
//   }
//   if ('scrollBehavior' in document.documentElement.style) window.scrollTo(scrollToOptions);else {
//     window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
//   }
// }
// function getScrollKey(path, delta) {
//   const position = history.state ? history.state.position - delta : -1;
//   return position + path;
// }
// const scrollPositions = new Map();
// function saveScrollPosition(key, scrollPosition) {
//   scrollPositions.set(key, scrollPosition);
// }
// function getSavedScrollPosition(key) {
//   const scroll = scrollPositions.get(key);
//   // consume it so it's not used again
//   scrollPositions.delete(key);
//   return scroll;
// }
// // TODO: RFC about how to save scroll position
// /**
//  * ScrollBehavior instance used by the router to compute and restore the scroll
//  * position when navigating.
//  */
// // export interface ScrollHandler<ScrollPositionEntry extends HistoryStateValue, ScrollPosition extends ScrollPositionEntry> {
// //   // returns a scroll position that can be saved in history
// //   compute(): ScrollPositionEntry
// //   // can take an extended ScrollPositionEntry
// //   scroll(position: ScrollPosition): void
// // }
// // export const scrollHandler: ScrollHandler<ScrollPosition> = {
// //   compute: computeScroll,
// //   scroll: scrollToPosition,
// // }

// let createBaseLocation = () => location.protocol + '//' + location.host;
// /**
//  * Creates a normalized history location from a window.location object
//  * @param base - The base path
//  * @param location - The window.location object
//  */
// function createCurrentLocation(base, location) {
//   const {
//     pathname,
//     search,
//     hash
//   } = location;
//   // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
//   const hashPos = base.indexOf('#');
//   if (hashPos > -1) {
//     let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
//     let pathFromHash = hash.slice(slicePos);
//     // prepend the starting slash to hash so the url starts with /#
//     if (pathFromHash[0] !== '/') pathFromHash = '/' + pathFromHash;
//     return stripBase(pathFromHash, '');
//   }
//   const path = stripBase(pathname, base);
//   return path + search + hash;
// }
// function useHistoryListeners(base, historyState, currentLocation, replace) {
//   let listeners = [];
//   let teardowns = [];
//   // TODO: should it be a stack? a Dict. Check if the popstate listener
//   // can trigger twice
//   let pauseState = null;
//   const popStateHandler = ({
//     state
//   }) => {

//     console.log('this: ', this === window.proxy);

//     const to = createCurrentLocation(base, location);
//     const from = currentLocation.value;
//     const fromState = historyState.value;
//     let delta = 0;
//     if (state) {
//       currentLocation.value = to;
//       historyState.value = state;
//       // ignore the popstate and reset the pauseState
//       if (pauseState && pauseState === from) {
//         pauseState = null;
//         return;
//       }
//       delta = fromState ? state.position - fromState.position : 0;
//     } else {
//       replace(to);
//     }
//     // console.log({ deltaFromCurrent })
//     // Here we could also revert the navigation by calling history.go(-delta)
//     // this listener will have to be adapted to not trigger again and to wait for the url
//     // to be updated before triggering the listeners. Some kind of validation function would also
//     // need to be passed to the listeners so the navigation can be accepted
//     // call all listeners
//     listeners.forEach(listener => {
//       listener(currentLocation.value, from, {
//         delta,
//         type: NavigationType.pop,
//         direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
//       });
//     });
//   };
//   function pauseListeners() {
//     pauseState = currentLocation.value;
//   }
//   function listen(callback) {
//     // set up the listener and prepare teardown callbacks
//     listeners.push(callback);
//     const teardown = () => {
//       const index = listeners.indexOf(callback);
//       if (index > -1) listeners.splice(index, 1);
//     };
//     teardowns.push(teardown);
//     return teardown;
//   }
//   function beforeUnloadListener() {
//     const {
//       history
//     } = window;
//     if (!history.state) return;
//     history.replaceState(vue_router_assign({}, history.state, {
//       scroll: computeScrollPosition()
//     }), '');
//   }
//   function destroy() {
//     for (const teardown of teardowns) teardown();
//     teardowns = [];
//     window.removeEventListener('popstate', popStateHandler);
//     window.removeEventListener('beforeunload', beforeUnloadListener);
//   }
//   // set up the listeners and prepare teardown callbacks
//   window.addEventListener('popstate', popStateHandler);
//   // TODO: could we use 'pagehide' or 'visibilitychange' instead?
//   // https://developer.chrome.com/blog/page-lifecycle-api/
//   window.addEventListener('beforeunload', beforeUnloadListener, {
//     passive: true
//   });
//   return {
//     pauseListeners,
//     listen,
//     destroy
//   };
// }
// /**
//  * Creates a state object
//  */
// function buildState(back, current, forward, replaced = false, computeScroll = false) {
//   return {
//     back,
//     current,
//     forward,
//     replaced,
//     position: window.history.length,
//     scroll: computeScroll ? computeScrollPosition() : null
//   };
// }
// function useHistoryStateNavigation(base) {
//   const {
//     history,
//     location
//   } = window;
//   // private variables
//   const currentLocation = {
//     value: createCurrentLocation(base, location)
//   };
//   const historyState = {
//     value: history.state
//   };
//   // build current history entry as this is a fresh navigation
//   if (!historyState.value) {
//     changeLocation(currentLocation.value, {
//       back: null,
//       current: currentLocation.value,
//       forward: null,
//       // the length is off by one, we need to decrease it
//       position: history.length - 1,
//       replaced: true,
//       // don't add a scroll as the user may have an anchor, and we want
//       // scrollBehavior to be triggered without a saved position
//       scroll: null
//     }, true);
//   }
//   function changeLocation(to, state, replace) {
//     /**
//      * if a base tag is provided, and we are on a normal domain, we have to
//      * respect the provided `base` attribute because pushState() will use it and
//      * potentially erase anything before the `#` like at
//      * https://github.com/vuejs/router/issues/685 where a base of
//      * `/folder/#` but a base of `/` would erase the `/folder/` section. If
//      * there is no host, the `<base>` tag makes no sense and if there isn't a
//      * base tag we can just use everything after the `#`.
//      */
//     const hashIndex = base.indexOf('#');
//     const url = hashIndex > -1 ? (location.host && document.querySelector('base') ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
//     try {
//       // BROWSER QUIRK
//       // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
//       history[replace ? 'replaceState' : 'pushState'](state, '', url);
//       historyState.value = state;
//     } catch (err) {
//       if (false) {} else {
//         console.error(err);
//       }
//       // Force the navigation, this also resets the call count
//       location[replace ? 'replace' : 'assign'](url);
//     }
//   }
//   function replace(to, data) {
//     const state = vue_router_assign({}, history.state, buildState(historyState.value.back,
//     // keep back and forward entries but override current position
//     to, historyState.value.forward, true), data, {
//       position: historyState.value.position
//     });
//     changeLocation(to, state, true);
//     currentLocation.value = to;
//   }
//   function push(to, data) {
//     // Add to current entry the information of where we are going
//     // as well as saving the current position
//     const currentState = vue_router_assign({},
//     // use current history state to gracefully handle a wrong call to
//     // history.replaceState
//     // https://github.com/vuejs/router/issues/366
//     historyState.value, history.state, {
//       forward: to,
//       scroll: computeScrollPosition()
//     });
//     if (false) {}
//     changeLocation(currentState.current, currentState, true);
//     const state = vue_router_assign({}, buildState(currentLocation.value, to, null), {
//       position: currentState.position + 1
//     }, data);
//     changeLocation(to, state, false);
//     currentLocation.value = to;
//   }
//   return {
//     location: currentLocation,
//     state: historyState,
//     push,
//     replace
//   };
// }
// /**
//  * Creates an HTML5 history. Most common history for single page applications.
//  *
//  * @param base -
//  */
// function createWebHistory(base) {
//   base = normalizeBase(base);
//   const historyNavigation = useHistoryStateNavigation(base);
//   const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
//   function go(delta, triggerListeners = true) {
//     if (!triggerListeners) historyListeners.pauseListeners();
//     history.go(delta);
//   }
//   const routerHistory = vue_router_assign({
//     // it's overridden right after
//     location: '',
//     base,
//     go,
//     createHref: createHref.bind(null, base)
//   }, historyNavigation, historyListeners);
//   Object.defineProperty(routerHistory, 'location', {
//     enumerable: true,
//     get: () => historyNavigation.location.value
//   });
//   Object.defineProperty(routerHistory, 'state', {
//     enumerable: true,
//     get: () => historyNavigation.state.value
//   });
//   return routerHistory;
// }

// /**
//  * Creates an in-memory based history. The main purpose of this history is to handle SSR. It starts in a special location that is nowhere.
//  * It's up to the user to replace that location with the starter location by either calling `router.push` or `router.replace`.
//  *
//  * @param base - Base applied to all urls, defaults to '/'
//  * @returns a history object that can be passed to the router constructor
//  */
// function createMemoryHistory(base = '') {
//   let listeners = [];
//   let queue = [START];
//   let position = 0;
//   base = normalizeBase(base);
//   function setLocation(location) {
//     position++;
//     if (position === queue.length) {
//       // we are at the end, we can simply append a new entry
//       queue.push(location);
//     } else {
//       // we are in the middle, we remove everything from here in the queue
//       queue.splice(position);
//       queue.push(location);
//     }
//   }
//   function triggerListeners(to, from, {
//     direction,
//     delta
//   }) {
//     const info = {
//       direction,
//       delta,
//       type: NavigationType.pop
//     };
//     for (const callback of listeners) {
//       callback(to, from, info);
//     }
//   }
//   const routerHistory = {
//     // rewritten by Object.defineProperty
//     location: START,
//     // TODO: should be kept in queue
//     state: {},
//     base,
//     createHref: createHref.bind(null, base),
//     replace(to) {
//       // remove current entry and decrement position
//       queue.splice(position--, 1);
//       setLocation(to);
//     },
//     push(to, data) {
//       setLocation(to);
//     },
//     listen(callback) {
//       listeners.push(callback);
//       return () => {
//         const index = listeners.indexOf(callback);
//         if (index > -1) listeners.splice(index, 1);
//       };
//     },
//     destroy() {
//       listeners = [];
//       queue = [START];
//       position = 0;
//     },
//     go(delta, shouldTrigger = true) {
//       const from = this.location;
//       const direction =
//       // we are considering delta === 0 going forward, but in abstract mode
//       // using 0 for the delta doesn't make sense like it does in html5 where
//       // it reloads the page
//       delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
//       position = Math.max(0, Math.min(position + delta, queue.length - 1));
//       if (shouldTrigger) {
//         triggerListeners(this.location, from, {
//           direction,
//           delta
//         });
//       }
//     }
//   };
//   Object.defineProperty(routerHistory, 'location', {
//     enumerable: true,
//     get: () => queue[position]
//   });
//   return routerHistory;
// }

// /**
//  * Creates a hash history. Useful for web applications with no host (e.g. `file://`) or when configuring a server to
//  * handle any URL is not possible.
//  *
//  * @param base - optional base to provide. Defaults to `location.pathname + location.search` If there is a `<base>` tag
//  * in the `head`, its value will be ignored in favor of this parameter **but note it affects all the history.pushState()
//  * calls**, meaning that if you use a `<base>` tag, it's `href` value **has to match this parameter** (ignoring anything
//  * after the `#`).
//  *
//  * @example
//  * ```js
//  * // at https://example.com/folder
//  * createWebHashHistory() // gives a url of `https://example.com/folder#`
//  * createWebHashHistory('/folder/') // gives a url of `https://example.com/folder/#`
//  * // if the `#` is provided in the base, it won't be added by `createWebHashHistory`
//  * createWebHashHistory('/folder/#/app/') // gives a url of `https://example.com/folder/#/app/`
//  * // you should avoid doing this because it changes the original url and breaks copying urls
//  * createWebHashHistory('/other-folder/') // gives a url of `https://example.com/other-folder/#`
//  *
//  * // at file:///usr/etc/folder/index.html
//  * // for locations with no `host`, the base is ignored
//  * createWebHashHistory('/iAmIgnored') // gives a url of `file:///usr/etc/folder/index.html#`
//  * ```
//  */
// function createWebHashHistory(base) {
//   // Make sure this implementation is fine in terms of encoding, specially for IE11
//   // for `file://`, directly use the pathname and ignore the base
//   // location.pathname contains an initial `/` even at the root: `https://example.com`
//   base = location.host ? base || location.pathname + location.search : '';
//   // allow the user to provide a `#` in the middle: `/base/#/app`
//   if (!base.includes('#')) base += '#';
//   if (false) {}
//   return createWebHistory(base);
// }
// function isRouteLocation(route) {
//   return typeof route === 'string' || route && typeof route === 'object';
// }
// function isRouteName(name) {
//   return typeof name === 'string' || typeof name === 'symbol';
// }

// /**
//  * Initial route location where the router is. Can be used in navigation guards
//  * to differentiate the initial navigation.
//  *
//  * @example
//  * ```js
//  * import { START_LOCATION } from 'vue-router'
//  *
//  * router.beforeEach((to, from) => {
//  *   if (from === START_LOCATION) {
//  *     // initial navigation
//  *   }
//  * })
//  * ```
//  */
// const START_LOCATION_NORMALIZED = {
//   path: '/',
//   name: undefined,
//   params: {},
//   query: {},
//   hash: '',
//   fullPath: '/',
//   matched: [],
//   meta: {},
//   redirectedFrom: undefined
// };
// const NavigationFailureSymbol = Symbol( false ? 0 : '');
// /**
//  * Enumeration with all possible types for navigation failures. Can be passed to
//  * {@link isNavigationFailure} to check for specific failures.
//  */
// var NavigationFailureType;
// (function (NavigationFailureType) {
//   /**
//    * An aborted navigation is a navigation that failed because a navigation
//    * guard returned `false` or called `next(false)`
//    */
//   NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
//   /**
//    * A cancelled navigation is a navigation that failed because a more recent
//    * navigation finished started (not necessarily finished).
//    */
//   NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
//   /**
//    * A duplicated navigation is a navigation that failed because it was
//    * initiated while already being at the exact same location.
//    */
//   NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
// })(NavigationFailureType || (NavigationFailureType = {}));
// // DEV only debug messages
// const ErrorTypeMessages = {
//   [1 /* ErrorTypes.MATCHER_NOT_FOUND */]({
//     location,
//     currentLocation
//   }) {
//     return `No match for\n ${JSON.stringify(location)}${currentLocation ? '\nwhile being at\n' + JSON.stringify(currentLocation) : ''}`;
//   },
//   [2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */]({
//     from,
//     to
//   }) {
//     return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
//   },
//   [4 /* ErrorTypes.NAVIGATION_ABORTED */]({
//     from,
//     to
//   }) {
//     return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
//   },
//   [8 /* ErrorTypes.NAVIGATION_CANCELLED */]({
//     from,
//     to
//   }) {
//     return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
//   },
//   [16 /* ErrorTypes.NAVIGATION_DUPLICATED */]({
//     from,
//     to
//   }) {
//     return `Avoided redundant navigation to current location: "${from.fullPath}".`;
//   }
// };
// function createRouterError(type, params) {
//   // keep full error messages in cjs versions
//   if (false) {} else {
//     return vue_router_assign(new Error(), {
//       type,
//       [NavigationFailureSymbol]: true
//     }, params);
//   }
// }
// function isNavigationFailure(error, type) {
//   return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
// }
// const propertiesToLog = ['params', 'query', 'hash'];
// function stringifyRoute(to) {
//   if (typeof to === 'string') return to;
//   if ('path' in to) return to.path;
//   const location = {};
//   for (const key of propertiesToLog) {
//     if (key in to) location[key] = to[key];
//   }
//   return JSON.stringify(location, null, 2);
// }

// // default pattern for a param: non-greedy everything but /
// const BASE_PARAM_PATTERN = '[^/]+?';
// const BASE_PATH_PARSER_OPTIONS = {
//   sensitive: false,
//   strict: false,
//   start: true,
//   end: true
// };
// // Special Regex characters that must be escaped in static tokens
// const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
// /**
//  * Creates a path parser from an array of Segments (a segment is an array of Tokens)
//  *
//  * @param segments - array of segments returned by tokenizePath
//  * @param extraOptions - optional options for the regexp
//  * @returns a PathParser
//  */
// function tokensToParser(segments, extraOptions) {
//   const options = vue_router_assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
//   // the amount of scores is the same as the length of segments except for the root segment "/"
//   const score = [];
//   // the regexp as a string
//   let pattern = options.start ? '^' : '';
//   // extracted keys
//   const keys = [];
//   for (const segment of segments) {
//     // the root segment needs special treatment
//     const segmentScores = segment.length ? [] : [90 /* PathScore.Root */];
//     // allow trailing slash
//     if (options.strict && !segment.length) pattern += '/';
//     for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
//       const token = segment[tokenIndex];
//       // resets the score if we are inside a sub-segment /:a-other-:b
//       let subSegmentScore = 40 /* PathScore.Segment */ + (options.sensitive ? 0.25 /* PathScore.BonusCaseSensitive */ : 0);
//       if (token.type === 0 /* TokenType.Static */) {
//         // prepend the slash if we are starting a new segment
//         if (!tokenIndex) pattern += '/';
//         pattern += token.value.replace(REGEX_CHARS_RE, '\\$&');
//         subSegmentScore += 40 /* PathScore.Static */;
//       } else if (token.type === 1 /* TokenType.Param */) {
//         const {
//           value,
//           repeatable,
//           optional,
//           regexp
//         } = token;
//         keys.push({
//           name: value,
//           repeatable,
//           optional
//         });
//         const re = regexp ? regexp : BASE_PARAM_PATTERN;
//         // the user provided a custom regexp /:id(\\d+)
//         if (re !== BASE_PARAM_PATTERN) {
//           subSegmentScore += 10 /* PathScore.BonusCustomRegExp */;
//           // make sure the regexp is valid before using it
//           try {
//             new RegExp(`(${re})`);
//           } catch (err) {
//             throw new Error(`Invalid custom RegExp for param "${value}" (${re}): ` + err.message);
//           }
//         }
//         // when we repeat we must take care of the repeating leading slash
//         let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`;
//         // prepend the slash if we are starting a new segment
//         if (!tokenIndex) subPattern =
//         // avoid an optional / if there are more segments e.g. /:p?-static
//         // or /:p?-:p2
//         optional && segment.length < 2 ? `(?:/${subPattern})` : '/' + subPattern;
//         if (optional) subPattern += '?';
//         pattern += subPattern;
//         subSegmentScore += 20 /* PathScore.Dynamic */;
//         if (optional) subSegmentScore += -8 /* PathScore.BonusOptional */;
//         if (repeatable) subSegmentScore += -20 /* PathScore.BonusRepeatable */;
//         if (re === '.*') subSegmentScore += -50 /* PathScore.BonusWildcard */;
//       }

//       segmentScores.push(subSegmentScore);
//     }
//     // an empty array like /home/ -> [[{home}], []]
//     // if (!segment.length) pattern += '/'
//     score.push(segmentScores);
//   }
//   // only apply the strict bonus to the last score
//   if (options.strict && options.end) {
//     const i = score.length - 1;
//     score[i][score[i].length - 1] += 0.7000000000000001 /* PathScore.BonusStrict */;
//   }
//   // TODO: dev only warn double trailing slash
//   if (!options.strict) pattern += '/?';
//   if (options.end) pattern += '$';
//   // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
//   else if (options.strict) pattern += '(?:/|$)';
//   const re = new RegExp(pattern, options.sensitive ? '' : 'i');
//   function parse(path) {
//     const match = path.match(re);
//     const params = {};
//     if (!match) return null;
//     for (let i = 1; i < match.length; i++) {
//       const value = match[i] || '';
//       const key = keys[i - 1];
//       params[key.name] = value && key.repeatable ? value.split('/') : value;
//     }
//     return params;
//   }
//   function stringify(params) {
//     let path = '';
//     // for optional parameters to allow to be empty
//     let avoidDuplicatedSlash = false;
//     for (const segment of segments) {
//       if (!avoidDuplicatedSlash || !path.endsWith('/')) path += '/';
//       avoidDuplicatedSlash = false;
//       for (const token of segment) {
//         if (token.type === 0 /* TokenType.Static */) {
//           path += token.value;
//         } else if (token.type === 1 /* TokenType.Param */) {
//           const {
//             value,
//             repeatable,
//             optional
//           } = token;
//           const param = value in params ? params[value] : '';
//           if (vue_router_isArray(param) && !repeatable) {
//             throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
//           }
//           const text = vue_router_isArray(param) ? param.join('/') : param;
//           if (!text) {
//             if (optional) {
//               // if we have more than one optional param like /:a?-static we don't need to care about the optional param
//               if (segment.length < 2) {
//                 // remove the last slash as we could be at the end
//                 if (path.endsWith('/')) path = path.slice(0, -1);
//                 // do not append a slash on the next iteration
//                 else avoidDuplicatedSlash = true;
//               }
//             } else throw new Error(`Missing required param "${value}"`);
//           }
//           path += text;
//         }
//       }
//     }
//     // avoid empty path when we have multiple optional params
//     return path || '/';
//   }
//   return {
//     re,
//     score,
//     keys,
//     parse,
//     stringify
//   };
// }
// /**
//  * Compares an array of numbers as used in PathParser.score and returns a
//  * number. This function can be used to `sort` an array
//  *
//  * @param a - first array of numbers
//  * @param b - second array of numbers
//  * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
//  * should be sorted first
//  */
// function compareScoreArray(a, b) {
//   let i = 0;
//   while (i < a.length && i < b.length) {
//     const diff = b[i] - a[i];
//     // only keep going if diff === 0
//     if (diff) return diff;
//     i++;
//   }
//   // if the last subsegment was Static, the shorter segments should be sorted first
//   // otherwise sort the longest segment first
//   if (a.length < b.length) {
//     return a.length === 1 && a[0] === 40 /* PathScore.Static */ + 40 /* PathScore.Segment */ ? -1 : 1;
//   } else if (a.length > b.length) {
//     return b.length === 1 && b[0] === 40 /* PathScore.Static */ + 40 /* PathScore.Segment */ ? 1 : -1;
//   }
//   return 0;
// }
// /**
//  * Compare function that can be used with `sort` to sort an array of PathParser
//  *
//  * @param a - first PathParser
//  * @param b - second PathParser
//  * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
//  */
// function comparePathParserScore(a, b) {
//   let i = 0;
//   const aScore = a.score;
//   const bScore = b.score;
//   while (i < aScore.length && i < bScore.length) {
//     const comp = compareScoreArray(aScore[i], bScore[i]);
//     // do not return if both are equal
//     if (comp) return comp;
//     i++;
//   }
//   if (Math.abs(bScore.length - aScore.length) === 1) {
//     if (isLastScoreNegative(aScore)) return 1;
//     if (isLastScoreNegative(bScore)) return -1;
//   }
//   // if a and b share the same score entries but b has more, sort b first
//   return bScore.length - aScore.length;
//   // this is the ternary version
//   // return aScore.length < bScore.length
//   //   ? 1
//   //   : aScore.length > bScore.length
//   //   ? -1
//   //   : 0
// }
// /**
//  * This allows detecting splats at the end of a path: /home/:id(.*)*
//  *
//  * @param score - score to check
//  * @returns true if the last entry is negative
//  */
// function isLastScoreNegative(score) {
//   const last = score[score.length - 1];
//   return score.length > 0 && last[last.length - 1] < 0;
// }
// const ROOT_TOKEN = {
//   type: 0 /* TokenType.Static */,
//   value: ''
// };
// const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
// // After some profiling, the cache seems to be unnecessary because tokenizePath
// // (the slowest part of adding a route) is very fast
// // const tokenCache = new Map<string, Token[][]>()
// function tokenizePath(path) {
//   if (!path) return [[]];
//   if (path === '/') return [[ROOT_TOKEN]];
//   if (!path.startsWith('/')) {
//     throw new Error( false ? 0 : `Invalid path "${path}"`);
//   }
//   // if (tokenCache.has(path)) return tokenCache.get(path)!
//   function crash(message) {
//     throw new Error(`ERR (${state})/"${buffer}": ${message}`);
//   }
//   let state = 0 /* TokenizerState.Static */;
//   let previousState = state;
//   const tokens = [];
//   // the segment will always be valid because we get into the initial state
//   // with the leading /
//   let segment;
//   function finalizeSegment() {
//     if (segment) tokens.push(segment);
//     segment = [];
//   }
//   // index on the path
//   let i = 0;
//   // char at index
//   let char;
//   // buffer of the value read
//   let buffer = '';
//   // custom regexp for a param
//   let customRe = '';
//   function consumeBuffer() {
//     if (!buffer) return;
//     if (state === 0 /* TokenizerState.Static */) {
//       segment.push({
//         type: 0 /* TokenType.Static */,
//         value: buffer
//       });
//     } else if (state === 1 /* TokenizerState.Param */ || state === 2 /* TokenizerState.ParamRegExp */ || state === 3 /* TokenizerState.ParamRegExpEnd */) {
//       if (segment.length > 1 && (char === '*' || char === '+')) crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
//       segment.push({
//         type: 1 /* TokenType.Param */,
//         value: buffer,
//         regexp: customRe,
//         repeatable: char === '*' || char === '+',
//         optional: char === '*' || char === '?'
//       });
//     } else {
//       crash('Invalid state to consume buffer');
//     }
//     buffer = '';
//   }
//   function addCharToBuffer() {
//     buffer += char;
//   }
//   while (i < path.length) {
//     char = path[i++];
//     if (char === '\\' && state !== 2 /* TokenizerState.ParamRegExp */) {
//       previousState = state;
//       state = 4 /* TokenizerState.EscapeNext */;
//       continue;
//     }
//     switch (state) {
//       case 0 /* TokenizerState.Static */:
//         if (char === '/') {
//           if (buffer) {
//             consumeBuffer();
//           }
//           finalizeSegment();
//         } else if (char === ':') {
//           consumeBuffer();
//           state = 1 /* TokenizerState.Param */;
//         } else {
//           addCharToBuffer();
//         }
//         break;
//       case 4 /* TokenizerState.EscapeNext */:
//         addCharToBuffer();
//         state = previousState;
//         break;
//       case 1 /* TokenizerState.Param */:
//         if (char === '(') {
//           state = 2 /* TokenizerState.ParamRegExp */;
//         } else if (VALID_PARAM_RE.test(char)) {
//           addCharToBuffer();
//         } else {
//           consumeBuffer();
//           state = 0 /* TokenizerState.Static */;
//           // go back one character if we were not modifying
//           if (char !== '*' && char !== '?' && char !== '+') i--;
//         }
//         break;
//       case 2 /* TokenizerState.ParamRegExp */:
//         // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
//         // it already works by escaping the closing )
//         // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
//         // is this really something people need since you can also write
//         // /prefix_:p()_suffix
//         if (char === ')') {
//           // handle the escaped )
//           if (customRe[customRe.length - 1] == '\\') customRe = customRe.slice(0, -1) + char;else state = 3 /* TokenizerState.ParamRegExpEnd */;
//         } else {
//           customRe += char;
//         }
//         break;
//       case 3 /* TokenizerState.ParamRegExpEnd */:
//         // same as finalizing a param
//         consumeBuffer();
//         state = 0 /* TokenizerState.Static */;
//         // go back one character if we were not modifying
//         if (char !== '*' && char !== '?' && char !== '+') i--;
//         customRe = '';
//         break;
//       default:
//         crash('Unknown state');
//         break;
//     }
//   }
//   if (state === 2 /* TokenizerState.ParamRegExp */) crash(`Unfinished custom RegExp for param "${buffer}"`);
//   consumeBuffer();
//   finalizeSegment();
//   // tokenCache.set(path, tokens)
//   return tokens;
// }
// function createRouteRecordMatcher(record, parent, options) {
//   const parser = tokensToParser(tokenizePath(record.path), options);
//   // warn against params with the same name
//   if (false) {}
//   const matcher = vue_router_assign(parser, {
//     record,
//     parent,
//     // these needs to be populated by the parent
//     children: [],
//     alias: []
//   });
//   if (parent) {
//     // both are aliases or both are not aliases
//     // we don't want to mix them because the order is used when
//     // passing originalRecord in Matcher.addRoute
//     if (!matcher.record.aliasOf === !parent.record.aliasOf) parent.children.push(matcher);
//   }
//   return matcher;
// }

// /**
//  * Creates a Router Matcher.
//  *
//  * @internal
//  * @param routes - array of initial routes
//  * @param globalOptions - global route options
//  */
// function createRouterMatcher(routes, globalOptions) {
//   // normalized ordered array of matchers
//   const matchers = [];
//   const matcherMap = new Map();
//   globalOptions = vue_router_mergeOptions({
//     strict: false,
//     end: true,
//     sensitive: false
//   }, globalOptions);
//   function getRecordMatcher(name) {
//     return matcherMap.get(name);
//   }
//   function addRoute(record, parent, originalRecord) {
//     // used later on to remove by name
//     const isRootAdd = !originalRecord;
//     const mainNormalizedRecord = normalizeRouteRecord(record);
//     if (false) {}
//     // we might be the child of an alias
//     mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
//     const options = vue_router_mergeOptions(globalOptions, record);
//     // generate an array of records to correctly handle aliases
//     const normalizedRecords = [mainNormalizedRecord];
//     if ('alias' in record) {
//       const aliases = typeof record.alias === 'string' ? [record.alias] : record.alias;
//       for (const alias of aliases) {
//         normalizedRecords.push(vue_router_assign({}, mainNormalizedRecord, {
//           // this allows us to hold a copy of the `components` option
//           // so that async components cache is hold on the original record
//           components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
//           path: alias,
//           // we might be the child of an alias
//           aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
//           // the aliases are always of the same kind as the original since they
//           // are defined on the same record
//         }));
//       }
//     }

//     let matcher;
//     let originalMatcher;
//     for (const normalizedRecord of normalizedRecords) {
//       const {
//         path
//       } = normalizedRecord;
//       // Build up the path for nested routes if the child isn't an absolute
//       // route. Only add the / delimiter if the child path isn't empty and if the
//       // parent path doesn't have a trailing slash
//       if (parent && path[0] !== '/') {
//         const parentPath = parent.record.path;
//         const connectingSlash = parentPath[parentPath.length - 1] === '/' ? '' : '/';
//         normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
//       }
//       if (false) {}
//       // create the object beforehand, so it can be passed to children
//       matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
//       if (false) {}
//       // if we are an alias we must tell the original record that we exist,
//       // so we can be removed
//       if (originalRecord) {
//         originalRecord.alias.push(matcher);
//         if (false) {}
//       } else {
//         // otherwise, the first record is the original and others are aliases
//         originalMatcher = originalMatcher || matcher;
//         if (originalMatcher !== matcher) originalMatcher.alias.push(matcher);
//         // remove the route if named and only for the top record (avoid in nested calls)
//         // this works because the original record is the first one
//         if (isRootAdd && record.name && !isAliasRecord(matcher)) removeRoute(record.name);
//       }
//       if (mainNormalizedRecord.children) {
//         const children = mainNormalizedRecord.children;
//         for (let i = 0; i < children.length; i++) {
//           addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
//         }
//       }
//       // if there was no original record, then the first one was not an alias and all
//       // other aliases (if any) need to reference this record when adding children
//       originalRecord = originalRecord || matcher;
//       // TODO: add normalized records for more flexibility
//       // if (parent && isAliasRecord(originalRecord)) {
//       //   parent.children.push(originalRecord)
//       // }
//       // Avoid adding a record that doesn't display anything. This allows passing through records without a component to
//       // not be reached and pass through the catch all route
//       if (matcher.record.components && Object.keys(matcher.record.components).length || matcher.record.name || matcher.record.redirect) {
//         insertMatcher(matcher);
//       }
//     }
//     return originalMatcher ? () => {
//       // since other matchers are aliases, they should be removed by the original matcher
//       removeRoute(originalMatcher);
//     } : noop;
//   }
//   function removeRoute(matcherRef) {
//     if (isRouteName(matcherRef)) {
//       const matcher = matcherMap.get(matcherRef);
//       if (matcher) {
//         matcherMap.delete(matcherRef);
//         matchers.splice(matchers.indexOf(matcher), 1);
//         matcher.children.forEach(removeRoute);
//         matcher.alias.forEach(removeRoute);
//       }
//     } else {
//       const index = matchers.indexOf(matcherRef);
//       if (index > -1) {
//         matchers.splice(index, 1);
//         if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name);
//         matcherRef.children.forEach(removeRoute);
//         matcherRef.alias.forEach(removeRoute);
//       }
//     }
//   }
//   function getRoutes() {
//     return matchers;
//   }
//   function insertMatcher(matcher) {
//     let i = 0;
//     while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (
//     // Adding children with empty path should still appear before the parent
//     // https://github.com/vuejs/router/issues/1124
//     matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i]))) i++;
//     matchers.splice(i, 0, matcher);
//     // only add the original record to the name map
//     if (matcher.record.name && !isAliasRecord(matcher)) matcherMap.set(matcher.record.name, matcher);
//   }
//   function resolve(location, currentLocation) {
//     let matcher;
//     let params = {};
//     let path;
//     let name;
//     if ('name' in location && location.name) {
//       matcher = matcherMap.get(location.name);
//       if (!matcher) throw createRouterError(1 /* ErrorTypes.MATCHER_NOT_FOUND */, {
//         location
//       });
//       // warn if the user is passing invalid params so they can debug it better when they get removed
//       if (false) {}
//       name = matcher.record.name;
//       params = vue_router_assign(
//       // paramsFromLocation is a new object
//       paramsFromLocation(currentLocation.params,
//       // only keep params that exist in the resolved location
//       // TODO: only keep optional params coming from a parent record
//       matcher.keys.filter(k => !k.optional).map(k => k.name)),
//       // discard any existing params in the current location that do not exist here
//       // #1497 this ensures better active/exact matching
//       location.params && paramsFromLocation(location.params, matcher.keys.map(k => k.name)));
//       // throws if cannot be stringified
//       path = matcher.stringify(params);
//     } else if ('path' in location) {
//       // no need to resolve the path with the matcher as it was provided
//       // this also allows the user to control the encoding
//       path = location.path;
//       if (false) {}
//       matcher = matchers.find(m => m.re.test(path));
//       // matcher should have a value after the loop
//       if (matcher) {
//         // we know the matcher works because we tested the regexp
//         params = matcher.parse(path);
//         name = matcher.record.name;
//       }
//       // location is a relative path
//     } else {
//       // match by name or path of current route
//       matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find(m => m.re.test(currentLocation.path));
//       if (!matcher) throw createRouterError(1 /* ErrorTypes.MATCHER_NOT_FOUND */, {
//         location,
//         currentLocation
//       });
//       name = matcher.record.name;
//       // since we are navigating to the same location, we don't need to pick the
//       // params like when `name` is provided
//       params = vue_router_assign({}, currentLocation.params, location.params);
//       path = matcher.stringify(params);
//     }
//     const matched = [];
//     let parentMatcher = matcher;
//     while (parentMatcher) {
//       // reversed order so parents are at the beginning
//       matched.unshift(parentMatcher.record);
//       parentMatcher = parentMatcher.parent;
//     }
//     return {
//       name,
//       path,
//       params,
//       matched,
//       meta: mergeMetaFields(matched)
//     };
//   }
//   // add initial routes
//   routes.forEach(route => addRoute(route));
//   return {
//     addRoute,
//     resolve,
//     removeRoute,
//     getRoutes,
//     getRecordMatcher
//   };
// }
// function paramsFromLocation(params, keys) {
//   const newParams = {};
//   for (const key of keys) {
//     if (key in params) newParams[key] = params[key];
//   }
//   return newParams;
// }
// /**
//  * Normalizes a RouteRecordRaw. Creates a copy
//  *
//  * @param record
//  * @returns the normalized version
//  */
// function normalizeRouteRecord(record) {
//   return {
//     path: record.path,
//     redirect: record.redirect,
//     name: record.name,
//     meta: record.meta || {},
//     aliasOf: undefined,
//     beforeEnter: record.beforeEnter,
//     props: normalizeRecordProps(record),
//     children: record.children || [],
//     instances: {},
//     leaveGuards: new Set(),
//     updateGuards: new Set(),
//     enterCallbacks: {},
//     components: 'components' in record ? record.components || null : record.component && {
//       default: record.component
//     }
//   };
// }
// /**
//  * Normalize the optional `props` in a record to always be an object similar to
//  * components. Also accept a boolean for components.
//  * @param record
//  */
// function normalizeRecordProps(record) {
//   const propsObject = {};
//   // props does not exist on redirect records, but we can set false directly
//   const props = record.props || false;
//   if ('component' in record) {
//     propsObject.default = props;
//   } else {
//     // NOTE: we could also allow a function to be applied to every component.
//     // Would need user feedback for use cases
//     for (const name in record.components) propsObject[name] = typeof props === 'boolean' ? props : props[name];
//   }
//   return propsObject;
// }
// /**
//  * Checks if a record or any of its parent is an alias
//  * @param record
//  */
// function isAliasRecord(record) {
//   while (record) {
//     if (record.record.aliasOf) return true;
//     record = record.parent;
//   }
//   return false;
// }
// /**
//  * Merge meta fields of an array of records
//  *
//  * @param matched - array of matched records
//  */
// function mergeMetaFields(matched) {
//   return matched.reduce((meta, record) => vue_router_assign(meta, record.meta), {});
// }
// function vue_router_mergeOptions(defaults, partialOptions) {
//   const options = {};
//   for (const key in defaults) {
//     options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
//   }
//   return options;
// }
// function isSameParam(a, b) {
//   return a.name === b.name && a.optional === b.optional && a.repeatable === b.repeatable;
// }
// /**
//  * Check if a path and its alias have the same required params
//  *
//  * @param a - original record
//  * @param b - alias record
//  */
// function checkSameParams(a, b) {
//   for (const key of a.keys) {
//     if (!key.optional && !b.keys.find(isSameParam.bind(null, key))) return vue_router_warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
//   }
//   for (const key of b.keys) {
//     if (!key.optional && !a.keys.find(isSameParam.bind(null, key))) return vue_router_warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
//   }
// }
// /**
//  * A route with a name and a child with an empty path without a name should warn when adding the route
//  *
//  * @param mainNormalizedRecord - RouteRecordNormalized
//  * @param parent - RouteRecordMatcher
//  */
// function checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent) {
//   if (parent && parent.record.name && !mainNormalizedRecord.name && !mainNormalizedRecord.path) {
//     vue_router_warn(`The route named "${String(parent.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
//   }
// }
// function checkMissingParamsInAbsolutePath(record, parent) {
//   for (const key of parent.keys) {
//     if (!record.keys.find(isSameParam.bind(null, key))) return vue_router_warn(`Absolute path "${record.record.path}" must have the exact same param named "${key.name}" as its parent "${parent.record.path}".`);
//   }
// }
// function isRecordChildOf(record, parent) {
//   return parent.children.some(child => child === record || isRecordChildOf(record, child));
// }

// /**
//  * Encoding Rules ␣ = Space Path: ␣ " < > # ? { } Query: ␣ " < > # & = Hash: ␣ "
//  * < > `
//  *
//  * On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
//  * defines some extra characters to be encoded. Most browsers do not encode them
//  * in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
//  * also encode `!'()*`. Leaving un-encoded only ASCII alphanumeric(`a-zA-Z0-9`)
//  * plus `-._~`. This extra safety should be applied to query by patching the
//  * string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
//  * should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
//  * into a `/` if directly typed in. The _backtick_ (`````) should also be
//  * encoded everywhere because some browsers like FF encode it when directly
//  * written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
//  */
// // const EXTRA_RESERVED_RE = /[!'()*]/g
// // const encodeReservedReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16)
// const HASH_RE = /#/g; // %23
// const AMPERSAND_RE = /&/g; // %26
// const SLASH_RE = /\//g; // %2F
// const EQUAL_RE = /=/g; // %3D
// const IM_RE = /\?/g; // %3F
// const PLUS_RE = /\+/g; // %2B
// /**
//  * NOTE: It's not clear to me if we should encode the + symbol in queries, it
//  * seems to be less flexible than not doing so and I can't find out the legacy
//  * systems requiring this for regular requests like text/html. In the standard,
//  * the encoding of the plus character is only mentioned for
//  * application/x-www-form-urlencoded
//  * (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
//  * leave the plus character as is in queries. To be more flexible, we allow the
//  * plus character on the query, but it can also be manually encoded by the user.
//  *
//  * Resources:
//  * - https://url.spec.whatwg.org/#urlencoded-parsing
//  * - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
//  */
// const ENC_BRACKET_OPEN_RE = /%5B/g; // [
// const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
// const ENC_CARET_RE = /%5E/g; // ^
// const ENC_BACKTICK_RE = /%60/g; // `
// const ENC_CURLY_OPEN_RE = /%7B/g; // {
// const ENC_PIPE_RE = /%7C/g; // |
// const ENC_CURLY_CLOSE_RE = /%7D/g; // }
// const ENC_SPACE_RE = /%20/g; // }
// /**
//  * Encode characters that need to be encoded on the path, search and hash
//  * sections of the URL.
//  *
//  * @internal
//  * @param text - string to encode
//  * @returns encoded string
//  */
// function commonEncode(text) {
//   return encodeURI('' + text).replace(ENC_PIPE_RE, '|').replace(ENC_BRACKET_OPEN_RE, '[').replace(ENC_BRACKET_CLOSE_RE, ']');
// }
// /**
//  * Encode characters that need to be encoded on the hash section of the URL.
//  *
//  * @param text - string to encode
//  * @returns encoded string
//  */
// function encodeHash(text) {
//   return commonEncode(text).replace(ENC_CURLY_OPEN_RE, '{').replace(ENC_CURLY_CLOSE_RE, '}').replace(ENC_CARET_RE, '^');
// }
// /**
//  * Encode characters that need to be encoded query values on the query
//  * section of the URL.
//  *
//  * @param text - string to encode
//  * @returns encoded string
//  */
// function encodeQueryValue(text) {
//   return commonEncode(text)
//   // Encode the space as +, encode the + to differentiate it from the space
//   .replace(PLUS_RE, '%2B').replace(ENC_SPACE_RE, '+').replace(HASH_RE, '%23').replace(AMPERSAND_RE, '%26').replace(ENC_BACKTICK_RE, '`').replace(ENC_CURLY_OPEN_RE, '{').replace(ENC_CURLY_CLOSE_RE, '}').replace(ENC_CARET_RE, '^');
// }
// /**
//  * Like `encodeQueryValue` but also encodes the `=` character.
//  *
//  * @param text - string to encode
//  */
// function encodeQueryKey(text) {
//   return encodeQueryValue(text).replace(EQUAL_RE, '%3D');
// }
// /**
//  * Encode characters that need to be encoded on the path section of the URL.
//  *
//  * @param text - string to encode
//  * @returns encoded string
//  */
// function encodePath(text) {
//   return commonEncode(text).replace(HASH_RE, '%23').replace(IM_RE, '%3F');
// }
// /**
//  * Encode characters that need to be encoded on the path section of the URL as a
//  * param. This function encodes everything {@link encodePath} does plus the
//  * slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
//  * string instead.
//  *
//  * @param text - string to encode
//  * @returns encoded string
//  */
// function encodeParam(text) {
//   return text == null ? '' : encodePath(text).replace(SLASH_RE, '%2F');
// }
// /**
//  * Decode text using `decodeURIComponent`. Returns the original text if it
//  * fails.
//  *
//  * @param text - string to decode
//  * @returns decoded string
//  */
// function decode(text) {
//   try {
//     return decodeURIComponent('' + text);
//   } catch (err) {
//      false && 0;
//   }
//   return '' + text;
// }

// /**
//  * Transforms a queryString into a {@link LocationQuery} object. Accept both, a
//  * version with the leading `?` and without Should work as URLSearchParams

//  * @internal
//  *
//  * @param search - search string to parse
//  * @returns a query object
//  */
// function parseQuery(search) {
//   const query = {};
//   // avoid creating an object with an empty key and empty value
//   // because of split('&')
//   if (search === '' || search === '?') return query;
//   const hasLeadingIM = search[0] === '?';
//   const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');
//   for (let i = 0; i < searchParams.length; ++i) {
//     // pre decode the + into space
//     const searchParam = searchParams[i].replace(PLUS_RE, ' ');
//     // allow the = character
//     const eqPos = searchParam.indexOf('=');
//     const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
//     const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
//     if (key in query) {
//       // an extra variable for ts types
//       let currentValue = query[key];
//       if (!vue_router_isArray(currentValue)) {
//         currentValue = query[key] = [currentValue];
//       }
//       currentValue.push(value);
//     } else {
//       query[key] = value;
//     }
//   }
//   return query;
// }
// /**
//  * Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
//  * doesn't prepend a `?`
//  *
//  * @internal
//  *
//  * @param query - query object to stringify
//  * @returns string version of the query without the leading `?`
//  */
// function stringifyQuery(query) {
//   let search = '';
//   for (let key in query) {
//     const value = query[key];
//     key = encodeQueryKey(key);
//     if (value == null) {
//       // only null adds the value
//       if (value !== undefined) {
//         search += (search.length ? '&' : '') + key;
//       }
//       continue;
//     }
//     // keep null values
//     const values = vue_router_isArray(value) ? value.map(v => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
//     values.forEach(value => {
//       // skip undefined values in arrays as if they were not present
//       // smaller code than using filter
//       if (value !== undefined) {
//         // only append & with non-empty search
//         search += (search.length ? '&' : '') + key;
//         if (value != null) search += '=' + value;
//       }
//     });
//   }
//   return search;
// }
// /**
//  * Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
//  * numbers into strings, removing keys with an undefined value and replacing
//  * undefined with null in arrays
//  *
//  * @param query - query object to normalize
//  * @returns a normalized query object
//  */
// function normalizeQuery(query) {
//   const normalizedQuery = {};
//   for (const key in query) {
//     const value = query[key];
//     if (value !== undefined) {
//       normalizedQuery[key] = vue_router_isArray(value) ? value.map(v => v == null ? null : '' + v) : value == null ? value : '' + value;
//     }
//   }
//   return normalizedQuery;
// }

// /**
//  * RouteRecord being rendered by the closest ancestor Router View. Used for
//  * `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
//  * Location Matched
//  *
//  * @internal
//  */
// const matchedRouteKey = Symbol( false ? 0 : '');
// /**
//  * Allows overriding the router view depth to control which component in
//  * `matched` is rendered. rvd stands for Router View Depth
//  *
//  * @internal
//  */
// const viewDepthKey = Symbol( false ? 0 : '');
// /**
//  * Allows overriding the router instance returned by `useRouter` in tests. r
//  * stands for router
//  *
//  * @internal
//  */
// const routerKey = Symbol( false ? 0 : '');
// /**
//  * Allows overriding the current route returned by `useRoute` in tests. rl
//  * stands for route location
//  *
//  * @internal
//  */
// const routeLocationKey = Symbol( false ? 0 : '');
// /**
//  * Allows overriding the current route used by router-view. Internally this is
//  * used when the `route` prop is passed.
//  *
//  * @internal
//  */
// const routerViewLocationKey = Symbol( false ? 0 : '');

// /**
//  * Create a list of callbacks that can be reset. Used to create before and after navigation guards list
//  */
// function useCallbacks() {
//   let handlers = [];
//   function add(handler) {
//     handlers.push(handler);
//     return () => {
//       const i = handlers.indexOf(handler);
//       if (i > -1) handlers.splice(i, 1);
//     };
//   }
//   function reset() {
//     handlers = [];
//   }
//   return {
//     add,
//     list: () => handlers,
//     reset
//   };
// }
// function registerGuard(record, name, guard) {
//   const removeFromList = () => {
//     record[name].delete(guard);
//   };
//   onUnmounted(removeFromList);
//   onDeactivated(removeFromList);
//   onActivated(() => {
//     record[name].add(guard);
//   });
//   record[name].add(guard);
// }
// /**
//  * Add a navigation guard that triggers whenever the component for the current
//  * location is about to be left. Similar to {@link beforeRouteLeave} but can be
//  * used in any component. The guard is removed when the component is unmounted.
//  *
//  * @param leaveGuard - {@link NavigationGuard}
//  */
// function onBeforeRouteLeave(leaveGuard) {
//   if (false) {}
//   const activeRecord = inject(matchedRouteKey,
//   // to avoid warning
//   {}).value;
//   if (!activeRecord) {
//      false && 0;
//     return;
//   }
//   registerGuard(activeRecord, 'leaveGuards', leaveGuard);
// }
// /**
//  * Add a navigation guard that triggers whenever the current location is about
//  * to be updated. Similar to {@link beforeRouteUpdate} but can be used in any
//  * component. The guard is removed when the component is unmounted.
//  *
//  * @param updateGuard - {@link NavigationGuard}
//  */
// function onBeforeRouteUpdate(updateGuard) {
//   if (false) {}
//   const activeRecord = inject(matchedRouteKey,
//   // to avoid warning
//   {}).value;
//   if (!activeRecord) {
//      false && 0;
//     return;
//   }
//   registerGuard(activeRecord, 'updateGuards', updateGuard);
// }
// function guardToPromiseFn(guard, to, from, record, name) {
//   // keep a reference to the enterCallbackArray to prevent pushing callbacks if a new navigation took place
//   const enterCallbackArray = record && (
//   // name is defined if record is because of the function overload
//   record.enterCallbacks[name] = record.enterCallbacks[name] || []);
//   return () => new Promise((resolve, reject) => {
//     const next = valid => {
//       if (valid === false) {
//         reject(createRouterError(4 /* ErrorTypes.NAVIGATION_ABORTED */, {
//           from,
//           to
//         }));
//       } else if (valid instanceof Error) {
//         reject(valid);
//       } else if (isRouteLocation(valid)) {
//         reject(createRouterError(2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */, {
//           from: to,
//           to: valid
//         }));
//       } else {
//         if (enterCallbackArray &&
//         // since enterCallbackArray is truthy, both record and name also are
//         record.enterCallbacks[name] === enterCallbackArray && typeof valid === 'function') {
//           enterCallbackArray.push(valid);
//         }
//         resolve();
//       }
//     };
//     // wrapping with Promise.resolve allows it to work with both async and sync guards
//     const guardReturn = guard.call(record && record.instances[name], to, from,  false ? 0 : next);
//     let guardCall = Promise.resolve(guardReturn);
//     if (guard.length < 3) guardCall = guardCall.then(next);
//     if (false) {}
//     guardCall.catch(err => reject(err));
//   });
// }
// function canOnlyBeCalledOnce(next, to, from) {
//   let called = 0;
//   return function () {
//     if (called++ === 1) vue_router_warn(`The "next" callback was called more than once in one navigation guard when going from "${from.fullPath}" to "${to.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`);
//     // @ts-expect-error: we put it in the original one because it's easier to check
//     next._called = true;
//     if (called === 1) next.apply(null, arguments);
//   };
// }
// function extractComponentsGuards(matched, guardType, to, from) {
//   const guards = [];
//   for (const record of matched) {
//     if (false) {}
//     for (const name in record.components) {
//       let rawComponent = record.components[name];
//       if (false) {}
//       // skip update and leave guards if the route component is not mounted
//       if (guardType !== 'beforeRouteEnter' && !record.instances[name]) continue;
//       if (isRouteComponent(rawComponent)) {
//         // __vccOpts is added by vue-class-component and contain the regular options
//         const options = rawComponent.__vccOpts || rawComponent;
//         const guard = options[guardType];
//         guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
//       } else {
//         // start requesting the chunk already
//         let componentPromise = rawComponent();
//         if (false) {}
//         guards.push(() => componentPromise.then(resolved => {
//           if (!resolved) return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
//           const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
//           // replace the function with the resolved component
//           // cannot be null or undefined because we went into the for loop
//           record.components[name] = resolvedComponent;
//           // __vccOpts is added by vue-class-component and contain the regular options
//           const options = resolvedComponent.__vccOpts || resolvedComponent;
//           const guard = options[guardType];
//           return guard && guardToPromiseFn(guard, to, from, record, name)();
//         }));
//       }
//     }
//   }
//   return guards;
// }
// /**
//  * Allows differentiating lazy components from functional components and vue-class-component
//  * @internal
//  *
//  * @param component
//  */
// function isRouteComponent(component) {
//   return typeof component === 'object' || 'displayName' in component || 'props' in component || '__vccOpts' in component;
// }
// /**
//  * Ensures a route is loaded, so it can be passed as o prop to `<RouterView>`.
//  *
//  * @param route - resolved route to load
//  */
// function loadRouteLocation(route) {
//   return route.matched.every(record => record.redirect) ? Promise.reject(new Error('Cannot load a route that redirects.')) : Promise.all(route.matched.map(record => record.components && Promise.all(Object.keys(record.components).reduce((promises, name) => {
//     const rawComponent = record.components[name];
//     if (typeof rawComponent === 'function' && !('displayName' in rawComponent)) {
//       promises.push(rawComponent().then(resolved => {
//         if (!resolved) return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}". Ensure you passed a function that returns a promise.`));
//         const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
//         // replace the function with the resolved component
//         // cannot be null or undefined because we went into the for loop
//         record.components[name] = resolvedComponent;
//         return;
//       }));
//     }
//     return promises;
//   }, [])))).then(() => route);
// }

// // TODO: we could allow currentRoute as a prop to expose `isActive` and
// // `isExactActive` behavior should go through an RFC
// function useLink(props) {
//   const router = runtime_core_esm_bundler_inject(routerKey);
//   const currentRoute = runtime_core_esm_bundler_inject(routeLocationKey);
//   const route = runtime_core_esm_bundler_computed(() => router.resolve(unref(props.to)));
//   const activeRecordIndex = runtime_core_esm_bundler_computed(() => {
//     const {
//       matched
//     } = route.value;
//     const {
//       length
//     } = matched;
//     const routeMatched = matched[length - 1];
//     const currentMatched = currentRoute.matched;
//     if (!routeMatched || !currentMatched.length) return -1;
//     const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
//     if (index > -1) return index;
//     // possible parent record
//     const parentRecordPath = getOriginalPath(matched[length - 2]);
//     return (
//       // we are dealing with nested routes
//       length > 1 &&
//       // if the parent and matched route have the same path, this link is
//       // referring to the empty child. Or we currently are on a different
//       // child of the same parent
//       getOriginalPath(routeMatched) === parentRecordPath &&
//       // avoid comparing the child with its parent
//       currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
//     );
//   });
//   const isActive = runtime_core_esm_bundler_computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
//   const isExactActive = runtime_core_esm_bundler_computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
//   function navigate(e = {}) {
//     if (guardEvent(e)) {
//       return router[unref(props.replace) ? 'replace' : 'push'](unref(props.to)
//       // avoid uncaught errors are they are logged anyway
//       ).catch(noop);
//     }
//     return Promise.resolve();
//   }
//   // devtools only
//   if (false) {}
//   /**
//    * NOTE: update {@link _RouterLinkI}'s `$slots` type when updating this
//    */
//   return {
//     route,
//     href: runtime_core_esm_bundler_computed(() => route.value.href),
//     isActive,
//     isExactActive,
//     navigate
//   };
// }
// const RouterLinkImpl = /*#__PURE__*/runtime_core_esm_bundler_defineComponent({
//   name: 'RouterLink',
//   compatConfig: {
//     MODE: 3
//   },
//   props: {
//     to: {
//       type: [String, Object],
//       required: true
//     },
//     replace: Boolean,
//     activeClass: String,
//     // inactiveClass: String,
//     exactActiveClass: String,
//     custom: Boolean,
//     ariaCurrentValue: {
//       type: String,
//       default: 'page'
//     }
//   },
//   useLink,
//   setup(props, {
//     slots
//   }) {
//     const link = reactive(useLink(props));
//     const {
//       options
//     } = runtime_core_esm_bundler_inject(routerKey);
//     const elClass = runtime_core_esm_bundler_computed(() => ({
//       [getLinkClass(props.activeClass, options.linkActiveClass, 'router-link-active')]: link.isActive,
//       // [getLinkClass(
//       //   props.inactiveClass,
//       //   options.linkInactiveClass,
//       //   'router-link-inactive'
//       // )]: !link.isExactActive,
//       [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, 'router-link-exact-active')]: link.isExactActive
//     }));
//     return () => {
//       const children = slots.default && slots.default(link);
//       return props.custom ? children : h('a', {
//         'aria-current': link.isExactActive ? props.ariaCurrentValue : null,
//         href: link.href,
//         // this would override user added attrs but Vue will still add
//         // the listener, so we end up triggering both
//         onClick: link.navigate,
//         class: elClass.value
//       }, children);
//     };
//   }
// });
// // export the public type for h/tsx inference
// // also to avoid inline import() in generated d.ts files
// /**
//  * Component to render a link that triggers a navigation on click.
//  */
// const RouterLink = RouterLinkImpl;
// function guardEvent(e) {
//   // don't redirect with control keys
//   if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
//   // don't redirect when preventDefault called
//   if (e.defaultPrevented) return;
//   // don't redirect on right click
//   if (e.button !== undefined && e.button !== 0) return;
//   // don't redirect if `target="_blank"`
//   // @ts-expect-error getAttribute does exist
//   if (e.currentTarget && e.currentTarget.getAttribute) {
//     // @ts-expect-error getAttribute exists
//     const target = e.currentTarget.getAttribute('target');
//     if (/\b_blank\b/i.test(target)) return;
//   }
//   // this may be a Weex event which doesn't have this method
//   if (e.preventDefault) e.preventDefault();
//   return true;
// }
// function includesParams(outer, inner) {
//   for (const key in inner) {
//     const innerValue = inner[key];
//     const outerValue = outer[key];
//     if (typeof innerValue === 'string') {
//       if (innerValue !== outerValue) return false;
//     } else {
//       if (!vue_router_isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i])) return false;
//     }
//   }
//   return true;
// }
// /**
//  * Get the original path value of a record by following its aliasOf
//  * @param record
//  */
// function getOriginalPath(record) {
//   return record ? record.aliasOf ? record.aliasOf.path : record.path : '';
// }
// /**
//  * Utility class to get the active class based on defaults.
//  * @param propClass
//  * @param globalClass
//  * @param defaultClass
//  */
// const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
// const RouterViewImpl = /*#__PURE__*/runtime_core_esm_bundler_defineComponent({
//   name: 'RouterView',
//   // #674 we manually inherit them
//   inheritAttrs: false,
//   props: {
//     name: {
//       type: String,
//       default: 'default'
//     },
//     route: Object
//   },
//   // Better compat for @vue/compat users
//   // https://github.com/vuejs/router/issues/1315
//   compatConfig: {
//     MODE: 3
//   },
//   setup(props, {
//     attrs,
//     slots
//   }) {
//      false && 0;
//     const injectedRoute = runtime_core_esm_bundler_inject(routerViewLocationKey);
//     const routeToDisplay = runtime_core_esm_bundler_computed(() => props.route || injectedRoute.value);
//     const injectedDepth = runtime_core_esm_bundler_inject(viewDepthKey, 0);
//     // The depth changes based on empty components option, which allows passthrough routes e.g. routes with children
//     // that are used to reuse the `path` property
//     const depth = runtime_core_esm_bundler_computed(() => {
//       let initialDepth = unref(injectedDepth);
//       const {
//         matched
//       } = routeToDisplay.value;
//       let matchedRoute;
//       while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
//         initialDepth++;
//       }
//       return initialDepth;
//     });
//     const matchedRouteRef = runtime_core_esm_bundler_computed(() => routeToDisplay.value.matched[depth.value]);
//     provide(viewDepthKey, runtime_core_esm_bundler_computed(() => depth.value + 1));
//     provide(matchedRouteKey, matchedRouteRef);
//     provide(routerViewLocationKey, routeToDisplay);
//     const viewRef = reactivity_esm_bundler_ref();
//     // watch at the same time the component instance, the route record we are
//     // rendering, and the name
//     runtime_core_esm_bundler_watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
//       // copy reused instances
//       if (to) {
//         // this will update the instance for new instances as well as reused
//         // instances when navigating to a new route
//         to.instances[name] = instance;
//         // the component instance is reused for a different route or name, so
//         // we copy any saved update or leave guards. With async setup, the
//         // mounting component will mount before the matchedRoute changes,
//         // making instance === oldInstance, so we check if guards have been
//         // added before. This works because we remove guards when
//         // unmounting/deactivating components
//         if (from && from !== to && instance && instance === oldInstance) {
//           if (!to.leaveGuards.size) {
//             to.leaveGuards = from.leaveGuards;
//           }
//           if (!to.updateGuards.size) {
//             to.updateGuards = from.updateGuards;
//           }
//         }
//       }
//       // trigger beforeRouteEnter next callbacks
//       if (instance && to && (
//       // if there is no instance but to and from are the same this might be
//       // the first visit
//       !from || !isSameRouteRecord(to, from) || !oldInstance)) {
//         (to.enterCallbacks[name] || []).forEach(callback => callback(instance));
//       }
//     }, {
//       flush: 'post'
//     });
//     return () => {
//       const route = routeToDisplay.value;
//       // we need the value at the time we render because when we unmount, we
//       // navigated to a different location so the value is different
//       const currentName = props.name;
//       const matchedRoute = matchedRouteRef.value;
//       const ViewComponent = matchedRoute && matchedRoute.components[currentName];
//       if (!ViewComponent) {
//         return vue_router_normalizeSlot(slots.default, {
//           Component: ViewComponent,
//           route
//         });
//       }
//       // props from route configuration
//       const routePropsOption = matchedRoute.props[currentName];
//       const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === 'function' ? routePropsOption(route) : routePropsOption : null;
//       const onVnodeUnmounted = vnode => {
//         // remove the instance reference to prevent leak
//         if (vnode.component.isUnmounted) {
//           matchedRoute.instances[currentName] = null;
//         }
//       };
//       const component = h(ViewComponent, vue_router_assign({}, routeProps, attrs, {
//         onVnodeUnmounted,
//         ref: viewRef
//       }));
//       if (false) {}
//       return (
//         // pass the vnode to the slot as a prop.
//         // h and <component :is="..."> both accept vnodes
//         vue_router_normalizeSlot(slots.default, {
//           Component: component,
//           route
//         }) || component
//       );
//     };
//   }
// });
// function vue_router_normalizeSlot(slot, data) {
//   if (!slot) return null;
//   const slotContent = slot(data);
//   return slotContent.length === 1 ? slotContent[0] : slotContent;
// }
// // export the public type for h/tsx inference
// // also to avoid inline import() in generated d.ts files
// /**
//  * Component to display the current route the user is at.
//  */
// const RouterView = RouterViewImpl;
// // warn against deprecated usage with <transition> & <keep-alive>
// // due to functional component being no longer eager in Vue 3
// function warnDeprecatedUsage() {
//   const instance = getCurrentInstance();
//   const parentName = instance.parent && instance.parent.type.name;
//   const parentSubTreeType = instance.parent && instance.parent.subTree && instance.parent.subTree.type;
//   if (parentName && (parentName === 'KeepAlive' || parentName.includes('Transition')) && typeof parentSubTreeType === 'object' && parentSubTreeType.name === 'RouterView') {
//     const comp = parentName === 'KeepAlive' ? 'keep-alive' : 'transition';
//     vue_router_warn(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.\n` + `Use slot props instead:\n\n` + `<router-view v-slot="{ Component }">\n` + `  <${comp}>\n` + `    <component :is="Component" />\n` + `  </${comp}>\n` + `</router-view>`);
//   }
// }

// /**
//  * Copies a route location and removes any problematic properties that cannot be shown in devtools (e.g. Vue instances).
//  *
//  * @param routeLocation - routeLocation to format
//  * @param tooltip - optional tooltip
//  * @returns a copy of the routeLocation
//  */
// function formatRouteLocation(routeLocation, tooltip) {
//   const copy = vue_router_assign({}, routeLocation, {
//     // remove variables that can contain vue instances
//     matched: routeLocation.matched.map(matched => omit(matched, ['instances', 'children', 'aliasOf']))
//   });
//   return {
//     _custom: {
//       type: null,
//       readOnly: true,
//       display: routeLocation.fullPath,
//       tooltip,
//       value: copy
//     }
//   };
// }
// function formatDisplay(display) {
//   return {
//     _custom: {
//       display
//     }
//   };
// }
// // to support multiple router instances
// let routerId = 0;
// function addDevtools(app, router, matcher) {
//   // Take over router.beforeEach and afterEach
//   // make sure we are not registering the devtool twice
//   if (router.__hasDevtools) return;
//   router.__hasDevtools = true;
//   // increment to support multiple router instances
//   const id = routerId++;
//   setupDevtoolsPlugin({
//     id: 'org.vuejs.router' + (id ? '.' + id : ''),
//     label: 'Vue Router',
//     packageName: 'vue-router',
//     homepage: 'https://router.vuejs.org',
//     logo: 'https://router.vuejs.org/logo.png',
//     componentStateTypes: ['Routing'],
//     app
//   }, api => {
//     if (typeof api.now !== 'function') {
//       console.warn('[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.');
//     }
//     // display state added by the router
//     api.on.inspectComponent((payload, ctx) => {
//       if (payload.instanceData) {
//         payload.instanceData.state.push({
//           type: 'Routing',
//           key: '$route',
//           editable: false,
//           value: formatRouteLocation(router.currentRoute.value, 'Current Route')
//         });
//       }
//     });
//     // mark router-link as active and display tags on router views
//     api.on.visitComponentTree(({
//       treeNode: node,
//       componentInstance
//     }) => {
//       if (componentInstance.__vrv_devtools) {
//         const info = componentInstance.__vrv_devtools;
//         node.tags.push({
//           label: (info.name ? `${info.name.toString()}: ` : '') + info.path,
//           textColor: 0,
//           tooltip: 'This component is rendered by &lt;router-view&gt;',
//           backgroundColor: PINK_500
//         });
//       }
//       // if multiple useLink are used
//       if (vue_router_isArray(componentInstance.__vrl_devtools)) {
//         componentInstance.__devtoolsApi = api;
//         componentInstance.__vrl_devtools.forEach(devtoolsData => {
//           let backgroundColor = ORANGE_400;
//           let tooltip = '';
//           if (devtoolsData.isExactActive) {
//             backgroundColor = LIME_500;
//             tooltip = 'This is exactly active';
//           } else if (devtoolsData.isActive) {
//             backgroundColor = BLUE_600;
//             tooltip = 'This link is active';
//           }
//           node.tags.push({
//             label: devtoolsData.route.path,
//             textColor: 0,
//             tooltip,
//             backgroundColor
//           });
//         });
//       }
//     });
//     watch(router.currentRoute, () => {
//       // refresh active state
//       refreshRoutesView();
//       api.notifyComponentUpdate();
//       api.sendInspectorTree(routerInspectorId);
//       api.sendInspectorState(routerInspectorId);
//     });
//     const navigationsLayerId = 'router:navigations:' + id;
//     api.addTimelineLayer({
//       id: navigationsLayerId,
//       label: `Router${id ? ' ' + id : ''} Navigations`,
//       color: 0x40a8c4
//     });
//     // const errorsLayerId = 'router:errors'
//     // api.addTimelineLayer({
//     //   id: errorsLayerId,
//     //   label: 'Router Errors',
//     //   color: 0xea5455,
//     // })
//     router.onError((error, to) => {
//       api.addTimelineEvent({
//         layerId: navigationsLayerId,
//         event: {
//           title: 'Error during Navigation',
//           subtitle: to.fullPath,
//           logType: 'error',
//           time: api.now(),
//           data: {
//             error
//           },
//           groupId: to.meta.__navigationId
//         }
//       });
//     });
//     // attached to `meta` and used to group events
//     let navigationId = 0;
//     router.beforeEach((to, from) => {
//       const data = {
//         guard: formatDisplay('beforeEach'),
//         from: formatRouteLocation(from, 'Current Location during this navigation'),
//         to: formatRouteLocation(to, 'Target location')
//       };
//       // Used to group navigations together, hide from devtools
//       Object.defineProperty(to.meta, '__navigationId', {
//         value: navigationId++
//       });
//       api.addTimelineEvent({
//         layerId: navigationsLayerId,
//         event: {
//           time: api.now(),
//           title: 'Start of navigation',
//           subtitle: to.fullPath,
//           data,
//           groupId: to.meta.__navigationId
//         }
//       });
//     });
//     router.afterEach((to, from, failure) => {
//       const data = {
//         guard: formatDisplay('afterEach')
//       };
//       if (failure) {
//         data.failure = {
//           _custom: {
//             type: Error,
//             readOnly: true,
//             display: failure ? failure.message : '',
//             tooltip: 'Navigation Failure',
//             value: failure
//           }
//         };
//         data.status = formatDisplay('❌');
//       } else {
//         data.status = formatDisplay('✅');
//       }
//       // we set here to have the right order
//       data.from = formatRouteLocation(from, 'Current Location during this navigation');
//       data.to = formatRouteLocation(to, 'Target location');
//       api.addTimelineEvent({
//         layerId: navigationsLayerId,
//         event: {
//           title: 'End of navigation',
//           subtitle: to.fullPath,
//           time: api.now(),
//           data,
//           logType: failure ? 'warning' : 'default',
//           groupId: to.meta.__navigationId
//         }
//       });
//     });
//     /**
//      * Inspector of Existing routes
//      */
//     const routerInspectorId = 'router-inspector:' + id;
//     api.addInspector({
//       id: routerInspectorId,
//       label: 'Routes' + (id ? ' ' + id : ''),
//       icon: 'book',
//       treeFilterPlaceholder: 'Search routes'
//     });
//     function refreshRoutesView() {
//       // the routes view isn't active
//       if (!activeRoutesPayload) return;
//       const payload = activeRoutesPayload;
//       // children routes will appear as nested
//       let routes = matcher.getRoutes().filter(route => !route.parent);
//       // reset match state to false
//       routes.forEach(resetMatchStateOnRouteRecord);
//       // apply a match state if there is a payload
//       if (payload.filter) {
//         routes = routes.filter(route =>
//         // save matches state based on the payload
//         isRouteMatching(route, payload.filter.toLowerCase()));
//       }
//       // mark active routes
//       routes.forEach(route => markRouteRecordActive(route, router.currentRoute.value));
//       payload.rootNodes = routes.map(formatRouteRecordForInspector);
//     }
//     let activeRoutesPayload;
//     api.on.getInspectorTree(payload => {
//       activeRoutesPayload = payload;
//       if (payload.app === app && payload.inspectorId === routerInspectorId) {
//         refreshRoutesView();
//       }
//     });
//     /**
//      * Display information about the currently selected route record
//      */
//     api.on.getInspectorState(payload => {
//       if (payload.app === app && payload.inspectorId === routerInspectorId) {
//         const routes = matcher.getRoutes();
//         const route = routes.find(route => route.record.__vd_id === payload.nodeId);
//         if (route) {
//           payload.state = {
//             options: formatRouteRecordMatcherForStateInspector(route)
//           };
//         }
//       }
//     });
//     api.sendInspectorTree(routerInspectorId);
//     api.sendInspectorState(routerInspectorId);
//   });
// }
// function modifierForKey(key) {
//   if (key.optional) {
//     return key.repeatable ? '*' : '?';
//   } else {
//     return key.repeatable ? '+' : '';
//   }
// }
// function formatRouteRecordMatcherForStateInspector(route) {
//   const {
//     record
//   } = route;
//   const fields = [{
//     editable: false,
//     key: 'path',
//     value: record.path
//   }];
//   if (record.name != null) {
//     fields.push({
//       editable: false,
//       key: 'name',
//       value: record.name
//     });
//   }
//   fields.push({
//     editable: false,
//     key: 'regexp',
//     value: route.re
//   });
//   if (route.keys.length) {
//     fields.push({
//       editable: false,
//       key: 'keys',
//       value: {
//         _custom: {
//           type: null,
//           readOnly: true,
//           display: route.keys.map(key => `${key.name}${modifierForKey(key)}`).join(' '),
//           tooltip: 'Param keys',
//           value: route.keys
//         }
//       }
//     });
//   }
//   if (record.redirect != null) {
//     fields.push({
//       editable: false,
//       key: 'redirect',
//       value: record.redirect
//     });
//   }
//   if (route.alias.length) {
//     fields.push({
//       editable: false,
//       key: 'aliases',
//       value: route.alias.map(alias => alias.record.path)
//     });
//   }
//   if (Object.keys(route.record.meta).length) {
//     fields.push({
//       editable: false,
//       key: 'meta',
//       value: route.record.meta
//     });
//   }
//   fields.push({
//     key: 'score',
//     editable: false,
//     value: {
//       _custom: {
//         type: null,
//         readOnly: true,
//         display: route.score.map(score => score.join(', ')).join(' | '),
//         tooltip: 'Score used to sort routes',
//         value: route.score
//       }
//     }
//   });
//   return fields;
// }
// /**
//  * Extracted from tailwind palette
//  */
// const PINK_500 = 0xec4899;
// const BLUE_600 = 0x2563eb;
// const LIME_500 = 0x84cc16;
// const CYAN_400 = 0x22d3ee;
// const ORANGE_400 = 0xfb923c;
// // const GRAY_100 = 0xf4f4f5
// const DARK = 0x666666;
// function formatRouteRecordForInspector(route) {
//   const tags = [];
//   const {
//     record
//   } = route;
//   if (record.name != null) {
//     tags.push({
//       label: String(record.name),
//       textColor: 0,
//       backgroundColor: CYAN_400
//     });
//   }
//   if (record.aliasOf) {
//     tags.push({
//       label: 'alias',
//       textColor: 0,
//       backgroundColor: ORANGE_400
//     });
//   }
//   if (route.__vd_match) {
//     tags.push({
//       label: 'matches',
//       textColor: 0,
//       backgroundColor: PINK_500
//     });
//   }
//   if (route.__vd_exactActive) {
//     tags.push({
//       label: 'exact',
//       textColor: 0,
//       backgroundColor: LIME_500
//     });
//   }
//   if (route.__vd_active) {
//     tags.push({
//       label: 'active',
//       textColor: 0,
//       backgroundColor: BLUE_600
//     });
//   }
//   if (record.redirect) {
//     tags.push({
//       label: typeof record.redirect === 'string' ? `redirect: ${record.redirect}` : 'redirects',
//       textColor: 0xffffff,
//       backgroundColor: DARK
//     });
//   }
//   // add an id to be able to select it. Using the `path` is not possible because
//   // empty path children would collide with their parents
//   let id = record.__vd_id;
//   if (id == null) {
//     id = String(routeRecordId++);
//     record.__vd_id = id;
//   }
//   return {
//     id,
//     label: record.path,
//     tags,
//     children: route.children.map(formatRouteRecordForInspector)
//   };
// }
// //  incremental id for route records and inspector state
// let routeRecordId = 0;
// const EXTRACT_REGEXP_RE = /^\/(.*)\/([a-z]*)$/;
// function markRouteRecordActive(route, currentRoute) {
//   // no route will be active if matched is empty
//   // reset the matching state
//   const isExactActive = currentRoute.matched.length && isSameRouteRecord(currentRoute.matched[currentRoute.matched.length - 1], route.record);
//   route.__vd_exactActive = route.__vd_active = isExactActive;
//   if (!isExactActive) {
//     route.__vd_active = currentRoute.matched.some(match => isSameRouteRecord(match, route.record));
//   }
//   route.children.forEach(childRoute => markRouteRecordActive(childRoute, currentRoute));
// }
// function resetMatchStateOnRouteRecord(route) {
//   route.__vd_match = false;
//   route.children.forEach(resetMatchStateOnRouteRecord);
// }
// function isRouteMatching(route, filter) {
//   const found = String(route.re).match(EXTRACT_REGEXP_RE);
//   route.__vd_match = false;
//   if (!found || found.length < 3) {
//     return false;
//   }
//   // use a regexp without $ at the end to match nested routes better
//   const nonEndingRE = new RegExp(found[1].replace(/\$$/, ''), found[2]);
//   if (nonEndingRE.test(filter)) {
//     // mark children as matches
//     route.children.forEach(child => isRouteMatching(child, filter));
//     // exception case: `/`
//     if (route.record.path !== '/' || filter === '/') {
//       route.__vd_match = route.re.test(filter);
//       return true;
//     }
//     // hide the / route
//     return false;
//   }
//   const path = route.record.path.toLowerCase();
//   const decodedPath = decode(path);
//   // also allow partial matching on the path
//   if (!filter.startsWith('/') && (decodedPath.includes(filter) || path.includes(filter))) return true;
//   if (decodedPath.startsWith(filter) || path.startsWith(filter)) return true;
//   if (route.record.name && String(route.record.name).includes(filter)) return true;
//   return route.children.some(child => isRouteMatching(child, filter));
// }
// function omit(obj, keys) {
//   const ret = {};
//   for (const key in obj) {
//     if (!keys.includes(key)) {
//       // @ts-expect-error
//       ret[key] = obj[key];
//     }
//   }
//   return ret;
// }

// /**
//  * Creates a Router instance that can be used by a Vue app.
//  *
//  * @param options - {@link RouterOptions}
//  */
// function createRouter(options) {
//   const matcher = createRouterMatcher(options.routes, options);
//   const parseQuery$1 = options.parseQuery || parseQuery;
//   const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
//   const routerHistory = options.history;
//   if (false) {}
//   const beforeGuards = useCallbacks();
//   const beforeResolveGuards = useCallbacks();
//   const afterGuards = useCallbacks();
//   const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
//   let pendingLocation = START_LOCATION_NORMALIZED;
//   // leave the scrollRestoration if no scrollBehavior is provided
//   if (isBrowser && options.scrollBehavior && 'scrollRestoration' in history) {
//     history.scrollRestoration = 'manual';
//   }
//   const normalizeParams = applyToParams.bind(null, paramValue => '' + paramValue);
//   const encodeParams = applyToParams.bind(null, encodeParam);
//   const decodeParams =
//   // @ts-expect-error: intentionally avoid the type check
//   applyToParams.bind(null, decode);
//   function addRoute(parentOrRoute, route) {
//     let parent;
//     let record;
//     if (isRouteName(parentOrRoute)) {
//       parent = matcher.getRecordMatcher(parentOrRoute);
//       record = route;
//     } else {
//       record = parentOrRoute;
//     }
//     return matcher.addRoute(record, parent);
//   }
//   function removeRoute(name) {
//     const recordMatcher = matcher.getRecordMatcher(name);
//     if (recordMatcher) {
//       matcher.removeRoute(recordMatcher);
//     } else if (false) {}
//   }
//   function getRoutes() {
//     return matcher.getRoutes().map(routeMatcher => routeMatcher.record);
//   }
//   function hasRoute(name) {
//     return !!matcher.getRecordMatcher(name);
//   }
//   function resolve(rawLocation, currentLocation) {
//     // const objectLocation = routerLocationAsObject(rawLocation)
//     // we create a copy to modify it later
//     currentLocation = vue_router_assign({}, currentLocation || currentRoute.value);
//     if (typeof rawLocation === 'string') {
//       const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
//       const matchedRoute = matcher.resolve({
//         path: locationNormalized.path
//       }, currentLocation);
//       const href = routerHistory.createHref(locationNormalized.fullPath);
//       if (false) {}
//       // locationNormalized is always a new object
//       return vue_router_assign(locationNormalized, matchedRoute, {
//         params: decodeParams(matchedRoute.params),
//         hash: decode(locationNormalized.hash),
//         redirectedFrom: undefined,
//         href
//       });
//     }
//     let matcherLocation;
//     // path could be relative in object as well
//     if ('path' in rawLocation) {
//       if (false) {}
//       matcherLocation = vue_router_assign({}, rawLocation, {
//         path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
//       });
//     } else {
//       // remove any nullish param
//       const targetParams = vue_router_assign({}, rawLocation.params);
//       for (const key in targetParams) {
//         if (targetParams[key] == null) {
//           delete targetParams[key];
//         }
//       }
//       // pass encoded values to the matcher, so it can produce encoded path and fullPath
//       matcherLocation = vue_router_assign({}, rawLocation, {
//         params: encodeParams(targetParams)
//       });
//       // current location params are decoded, we need to encode them in case the
//       // matcher merges the params
//       currentLocation.params = encodeParams(currentLocation.params);
//     }
//     const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
//     const hash = rawLocation.hash || '';
//     if (false) {}
//     // the matcher might have merged current location params, so
//     // we need to run the decoding again
//     matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
//     const fullPath = stringifyURL(stringifyQuery$1, vue_router_assign({}, rawLocation, {
//       hash: encodeHash(hash),
//       path: matchedRoute.path
//     }));
//     const href = routerHistory.createHref(fullPath);
//     if (false) {}
//     return vue_router_assign({
//       fullPath,
//       // keep the hash encoded so fullPath is effectively path + encodedQuery +
//       // hash
//       hash,
//       query:
//       // if the user is using a custom query lib like qs, we might have
//       // nested objects, so we keep the query as is, meaning it can contain
//       // numbers at `$route.query`, but at the point, the user will have to
//       // use their own type anyway.
//       // https://github.com/vuejs/router/issues/328#issuecomment-649481567
//       stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
//     }, matchedRoute, {
//       redirectedFrom: undefined,
//       href
//     });
//   }
//   function locationAsObject(to) {
//     return typeof to === 'string' ? parseURL(parseQuery$1, to, currentRoute.value.path) : vue_router_assign({}, to);
//   }
//   function checkCanceledNavigation(to, from) {
//     if (pendingLocation !== to) {
//       return createRouterError(8 /* ErrorTypes.NAVIGATION_CANCELLED */, {
//         from,
//         to
//       });
//     }
//   }
//   function push(to) {
//     return pushWithRedirect(to);
//   }
//   function replace(to) {
//     return push(vue_router_assign(locationAsObject(to), {
//       replace: true
//     }));
//   }
//   function handleRedirectRecord(to) {
//     const lastMatched = to.matched[to.matched.length - 1];
//     if (lastMatched && lastMatched.redirect) {
//       const {
//         redirect
//       } = lastMatched;
//       let newTargetLocation = typeof redirect === 'function' ? redirect(to) : redirect;
//       if (typeof newTargetLocation === 'string') {
//         newTargetLocation = newTargetLocation.includes('?') || newTargetLocation.includes('#') ? newTargetLocation = locationAsObject(newTargetLocation) :
//         // force empty params
//         {
//           path: newTargetLocation
//         };
//         // @ts-expect-error: force empty params when a string is passed to let
//         // the router parse them again
//         newTargetLocation.params = {};
//       }
//       if (false) {}
//       return vue_router_assign({
//         query: to.query,
//         hash: to.hash,
//         // avoid transferring params if the redirect has a path
//         params: 'path' in newTargetLocation ? {} : to.params
//       }, newTargetLocation);
//     }
//   }
//   function pushWithRedirect(to, redirectedFrom) {
//     const targetLocation = pendingLocation = resolve(to);
//     const from = currentRoute.value;
//     const data = to.state;
//     const force = to.force;
//     // to could be a string where `replace` is a function
//     const replace = to.replace === true;
//     const shouldRedirect = handleRedirectRecord(targetLocation);
//     if (shouldRedirect) return pushWithRedirect(vue_router_assign(locationAsObject(shouldRedirect), {
//       state: typeof shouldRedirect === 'object' ? vue_router_assign({}, data, shouldRedirect.state) : data,
//       force,
//       replace
//     }),
//     // keep original redirectedFrom if it exists
//     redirectedFrom || targetLocation);
//     // if it was a redirect we already called `pushWithRedirect` above
//     const toLocation = targetLocation;
//     toLocation.redirectedFrom = redirectedFrom;
//     let failure;
//     if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
//       failure = createRouterError(16 /* ErrorTypes.NAVIGATION_DUPLICATED */, {
//         to: toLocation,
//         from
//       });
//       // trigger scroll to allow scrolling to the same anchor
//       handleScroll(from, from,
//       // this is a push, the only way for it to be triggered from a
//       // history.listen is with a redirect, which makes it become a push
//       true,
//       // This cannot be the first navigation because the initial location
//       // cannot be manually navigated to
//       false);
//     }
//     return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch(error => isNavigationFailure(error) ?
//     // navigation redirects still mark the router as ready
//     isNavigationFailure(error, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */) ? error : markAsReady(error) // also returns the error
//     :
//     // reject any unknown error
//     triggerError(error, toLocation, from)).then(failure => {
//       if (failure) {
//         if (isNavigationFailure(failure, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)) {
//           if (false) {}
//           return pushWithRedirect(
//           // keep options
//           vue_router_assign({
//             // preserve an existing replacement but allow the redirect to override it
//             replace
//           }, locationAsObject(failure.to), {
//             state: typeof failure.to === 'object' ? vue_router_assign({}, data, failure.to.state) : data,
//             force
//           }),
//           // preserve the original redirectedFrom if any
//           redirectedFrom || toLocation);
//         }
//       } else {
//         // if we fail we don't finalize the navigation
//         failure = finalizeNavigation(toLocation, from, true, replace, data);
//       }
//       triggerAfterEach(toLocation, from, failure);
//       return failure;
//     });
//   }
//   /**
//    * Helper to reject and skip all navigation guards if a new navigation happened
//    * @param to
//    * @param from
//    */
//   function checkCanceledNavigationAndReject(to, from) {
//     const error = checkCanceledNavigation(to, from);
//     return error ? Promise.reject(error) : Promise.resolve();
//   }
//   function runWithContext(fn) {
//     const app = installedApps.values().next().value;
//     // support Vue < 3.3
//     return app && typeof app.runWithContext === 'function' ? app.runWithContext(fn) : fn();
//   }
//   // TODO: refactor the whole before guards by internally using router.beforeEach
//   function navigate(to, from) {
//     let guards;
//     const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
//     // all components here have been resolved once because we are leaving
//     guards = extractComponentsGuards(leavingRecords.reverse(), 'beforeRouteLeave', to, from);
//     // leavingRecords is already reversed
//     for (const record of leavingRecords) {
//       record.leaveGuards.forEach(guard => {
//         guards.push(guardToPromiseFn(guard, to, from));
//       });
//     }
//     const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
//     guards.push(canceledNavigationCheck);
//     // run the queue of per route beforeRouteLeave guards
//     return runGuardQueue(guards).then(() => {
//       // check global guards beforeEach
//       guards = [];
//       for (const guard of beforeGuards.list()) {
//         guards.push(guardToPromiseFn(guard, to, from));
//       }
//       guards.push(canceledNavigationCheck);
//       return runGuardQueue(guards);
//     }).then(() => {
//       // check in components beforeRouteUpdate
//       guards = extractComponentsGuards(updatingRecords, 'beforeRouteUpdate', to, from);
//       for (const record of updatingRecords) {
//         record.updateGuards.forEach(guard => {
//           guards.push(guardToPromiseFn(guard, to, from));
//         });
//       }
//       guards.push(canceledNavigationCheck);
//       // run the queue of per route beforeEnter guards
//       return runGuardQueue(guards);
//     }).then(() => {
//       // check the route beforeEnter
//       guards = [];
//       for (const record of to.matched) {
//         // do not trigger beforeEnter on reused views
//         if (record.beforeEnter && !from.matched.includes(record)) {
//           if (vue_router_isArray(record.beforeEnter)) {
//             for (const beforeEnter of record.beforeEnter) guards.push(guardToPromiseFn(beforeEnter, to, from));
//           } else {
//             guards.push(guardToPromiseFn(record.beforeEnter, to, from));
//           }
//         }
//       }
//       guards.push(canceledNavigationCheck);
//       // run the queue of per route beforeEnter guards
//       return runGuardQueue(guards);
//     }).then(() => {
//       // NOTE: at this point to.matched is normalized and does not contain any () => Promise<Component>
//       // clear existing enterCallbacks, these are added by extractComponentsGuards
//       to.matched.forEach(record => record.enterCallbacks = {});
//       // check in-component beforeRouteEnter
//       guards = extractComponentsGuards(enteringRecords, 'beforeRouteEnter', to, from);
//       guards.push(canceledNavigationCheck);
//       // run the queue of per route beforeEnter guards
//       return runGuardQueue(guards);
//     }).then(() => {
//       // check global guards beforeResolve
//       guards = [];
//       for (const guard of beforeResolveGuards.list()) {
//         guards.push(guardToPromiseFn(guard, to, from));
//       }
//       guards.push(canceledNavigationCheck);
//       return runGuardQueue(guards);
//     })
//     // catch any navigation canceled
//     .catch(err => isNavigationFailure(err, 8 /* ErrorTypes.NAVIGATION_CANCELLED */) ? err : Promise.reject(err));
//   }
//   function triggerAfterEach(to, from, failure) {
//     // navigation is confirmed, call afterGuards
//     // TODO: wrap with error handlers
//     for (const guard of afterGuards.list()) {
//       runWithContext(() => guard(to, from, failure));
//     }
//   }
//   /**
//    * - Cleans up any navigation guards
//    * - Changes the url if necessary
//    * - Calls the scrollBehavior
//    */
//   function finalizeNavigation(toLocation, from, isPush, replace, data) {
//     // a more recent navigation took place
//     const error = checkCanceledNavigation(toLocation, from);
//     if (error) return error;
//     // only consider as push if it's not the first navigation
//     const isFirstNavigation = from === START_LOCATION_NORMALIZED;
//     const state = !isBrowser ? {} : history.state;
//     // change URL only if the user did a push/replace and if it's not the initial navigation because
//     // it's just reflecting the url
//     if (isPush) {
//       // on the initial navigation, we want to reuse the scroll position from
//       // history state if it exists
//       if (replace || isFirstNavigation) routerHistory.replace(toLocation.fullPath, vue_router_assign({
//         scroll: isFirstNavigation && state && state.scroll
//       }, data));else routerHistory.push(toLocation.fullPath, data);
//     }
//     // accept current navigation
//     currentRoute.value = toLocation;
//     handleScroll(toLocation, from, isPush, isFirstNavigation);
//     markAsReady();
//   }
//   let removeHistoryListener;
//   // attach listener to history to trigger navigations
//   function setupListeners() {
//     // avoid setting up listeners twice due to an invalid first navigation
//     if (removeHistoryListener) return;
//     removeHistoryListener = routerHistory.listen((to, _from, info) => {
//       if (!router.listening) return;
//       // cannot be a redirect route because it was in history
//       const toLocation = resolve(to);
//       // due to dynamic routing, and to hash history with manual navigation
//       // (manually changing the url or calling history.hash = '#/somewhere'),
//       // there could be a redirect record in history
//       const shouldRedirect = handleRedirectRecord(toLocation);
//       if (shouldRedirect) {
//         pushWithRedirect(vue_router_assign(shouldRedirect, {
//           replace: true
//         }), toLocation).catch(noop);
//         return;
//       }
//       pendingLocation = toLocation;
//       const from = currentRoute.value;
//       // TODO: should be moved to web history?
//       if (isBrowser) {
//         saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
//       }
//       navigate(toLocation, from).catch(error => {
//         if (isNavigationFailure(error, 4 /* ErrorTypes.NAVIGATION_ABORTED */ | 8 /* ErrorTypes.NAVIGATION_CANCELLED */)) {
//           return error;
//         }
//         if (isNavigationFailure(error, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)) {
//           // Here we could call if (info.delta) routerHistory.go(-info.delta,
//           // false) but this is bug prone as we have no way to wait the
//           // navigation to be finished before calling pushWithRedirect. Using
//           // a setTimeout of 16ms seems to work but there is no guarantee for
//           // it to work on every browser. So instead we do not restore the
//           // history entry and trigger a new navigation as requested by the
//           // navigation guard.
//           // the error is already handled by router.push we just want to avoid
//           // logging the error
//           pushWithRedirect(error.to, toLocation
//           // avoid an uncaught rejection, let push call triggerError
//           ).then(failure => {
//             // manual change in hash history #916 ending up in the URL not
//             // changing, but it was changed by the manual url change, so we
//             // need to manually change it ourselves
//             if (isNavigationFailure(failure, 4 /* ErrorTypes.NAVIGATION_ABORTED */ | 16 /* ErrorTypes.NAVIGATION_DUPLICATED */) && !info.delta && info.type === NavigationType.pop) {
//               routerHistory.go(-1, false);
//             }
//           }).catch(noop);
//           // avoid the then branch
//           return Promise.reject();
//         }
//         // do not restore history on unknown direction
//         if (info.delta) {
//           routerHistory.go(-info.delta, false);
//         }
//         // unrecognized error, transfer to the global handler
//         return triggerError(error, toLocation, from);
//       }).then(failure => {
//         failure = failure || finalizeNavigation(
//         // after navigation, all matched components are resolved
//         toLocation, from, false);
//         // revert the navigation
//         if (failure) {
//           if (info.delta &&
//           // a new navigation has been triggered, so we do not want to revert, that will change the current history
//           // entry while a different route is displayed
//           !isNavigationFailure(failure, 8 /* ErrorTypes.NAVIGATION_CANCELLED */)) {
//             routerHistory.go(-info.delta, false);
//           } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 /* ErrorTypes.NAVIGATION_ABORTED */ | 16 /* ErrorTypes.NAVIGATION_DUPLICATED */)) {
//             // manual change in hash history #916
//             // it's like a push but lacks the information of the direction
//             routerHistory.go(-1, false);
//           }
//         }
//         triggerAfterEach(toLocation, from, failure);
//       }).catch(noop);
//     });
//   }
//   // Initialization and Errors
//   let readyHandlers = useCallbacks();
//   let errorHandlers = useCallbacks();
//   let ready;
//   /**
//    * Trigger errorHandlers added via onError and throws the error as well
//    *
//    * @param error - error to throw
//    * @param to - location we were navigating to when the error happened
//    * @param from - location we were navigating from when the error happened
//    * @returns the error as a rejected promise
//    */
//   function triggerError(error, to, from) {
//     markAsReady(error);
//     const list = errorHandlers.list();
//     if (list.length) {
//       list.forEach(handler => handler(error, to, from));
//     } else {
//       if (false) {}
//       console.error(error);
//     }
//     return Promise.reject(error);
//   }
//   function isReady() {
//     if (ready && currentRoute.value !== START_LOCATION_NORMALIZED) return Promise.resolve();
//     return new Promise((resolve, reject) => {
//       readyHandlers.add([resolve, reject]);
//     });
//   }
//   function markAsReady(err) {
//     if (!ready) {
//       // still not ready if an error happened
//       ready = !err;
//       setupListeners();
//       readyHandlers.list().forEach(([resolve, reject]) => err ? reject(err) : resolve());
//       readyHandlers.reset();
//     }
//     return err;
//   }
//   // Scroll behavior
//   function handleScroll(to, from, isPush, isFirstNavigation) {
//     const {
//       scrollBehavior
//     } = options;
//     if (!isBrowser || !scrollBehavior) return Promise.resolve();
//     const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
//     return runtime_core_esm_bundler_nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then(position => position && scrollToPosition(position)).catch(err => triggerError(err, to, from));
//   }
//   const go = delta => routerHistory.go(delta);
//   let started;
//   const installedApps = new Set();
//   const router = {
//     currentRoute,
//     listening: true,
//     addRoute,
//     removeRoute,
//     hasRoute,
//     getRoutes,
//     resolve,
//     options,
//     push,
//     replace,
//     go,
//     back: () => go(-1),
//     forward: () => go(1),
//     beforeEach: beforeGuards.add,
//     beforeResolve: beforeResolveGuards.add,
//     afterEach: afterGuards.add,
//     onError: errorHandlers.add,
//     isReady,
//     install(app) {
//       const router = this;
//       app.component('RouterLink', RouterLink);
//       app.component('RouterView', RouterView);
//       app.config.globalProperties.$router = router;
//       Object.defineProperty(app.config.globalProperties, '$route', {
//         enumerable: true,
//         get: () => unref(currentRoute)
//       });
//       // this initial navigation is only necessary on client, on server it doesn't
//       // make sense because it will create an extra unnecessary navigation and could
//       // lead to problems
//       if (isBrowser &&
//       // used for the initial navigation client side to avoid pushing
//       // multiple times when the router is used in multiple apps
//       !started && currentRoute.value === START_LOCATION_NORMALIZED) {
//         // see above
//         started = true;
//         push(routerHistory.location).catch(err => {
//           if (false) {}
//         });
//       }
//       const reactiveRoute = {};
//       for (const key in START_LOCATION_NORMALIZED) {
//         // @ts-expect-error: the key matches
//         reactiveRoute[key] = runtime_core_esm_bundler_computed(() => currentRoute.value[key]);
//       }
//       app.provide(routerKey, router);
//       app.provide(routeLocationKey, reactive(reactiveRoute));
//       app.provide(routerViewLocationKey, currentRoute);
//       const unmountApp = app.unmount;
//       installedApps.add(app);
//       app.unmount = function () {
//         installedApps.delete(app);
//         // the router is not attached to an app anymore
//         if (installedApps.size < 1) {
//           // invalidate the current navigation
//           pendingLocation = START_LOCATION_NORMALIZED;
//           removeHistoryListener && removeHistoryListener();
//           removeHistoryListener = null;
//           currentRoute.value = START_LOCATION_NORMALIZED;
//           started = false;
//           ready = false;
//         }
//         unmountApp();
//       };
//       // TODO: this probably needs to be updated so it can be used by vue-termui
//       if (false) {}
//     }
//   };
//   // TODO: type this as NavigationGuardReturn or similar instead of any
//   function runGuardQueue(guards) {
//     return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
//   }
//   return router;
// }
// function extractChangingRecords(to, from) {
//   const leavingRecords = [];
//   const updatingRecords = [];
//   const enteringRecords = [];
//   const len = Math.max(from.matched.length, to.matched.length);
//   for (let i = 0; i < len; i++) {
//     const recordFrom = from.matched[i];
//     if (recordFrom) {
//       if (to.matched.find(record => isSameRouteRecord(record, recordFrom))) updatingRecords.push(recordFrom);else leavingRecords.push(recordFrom);
//     }
//     const recordTo = to.matched[i];
//     if (recordTo) {
//       // the type doesn't matter because we are comparing per reference
//       if (!from.matched.find(record => isSameRouteRecord(record, recordTo))) {
//         enteringRecords.push(recordTo);
//       }
//     }
//   }
//   return [leavingRecords, updatingRecords, enteringRecords];
// }

// /**
//  * Returns the router instance. Equivalent to using `$router` inside
//  * templates.
//  */
// function useRouter() {
//   return inject(routerKey);
// }
// /**
//  * Returns the current route location. Equivalent to using `$route` inside
//  * templates.
//  */
// function useRoute() {
//   return inject(routeLocationKey);
// }

// ;// CONCATENATED MODULE: ../../node_modules/thread-loader/dist/cjs.js!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=template&id=2d0b58bd

// const _hoisted_1 = /*#__PURE__*/createBaseVNode("h1", null, "Hello Vue Micro App!", -1);
// const _hoisted_2 = /*#__PURE__*/createBaseVNode("br", null, null, -1);
// function Appvue_type_template_id_2d0b58bd_render(_ctx, _cache, $props, $setup, $data, $options) {
//   const _component_router_link = resolveComponent("router-link");
//   const _component_router_view = resolveComponent("router-view");
//   return openBlock(), createElementBlock(runtime_core_esm_bundler_Fragment, null, [_hoisted_1, createBaseVNode("p", null, [runtime_core_esm_bundler_createVNode(_component_router_link, {
//     to: "/foo"
//   }, {
//     default: withCtx(() => [createTextVNode("Go to Foo")]),
//     _: 1
//   }), _hoisted_2, runtime_core_esm_bundler_createVNode(_component_router_link, {
//     to: "/bar"
//   }, {
//     default: withCtx(() => [createTextVNode("Go to Bar")]),
//     _: 1
//   })]), runtime_core_esm_bundler_createVNode(_component_router_view)], 64);
// }
// ;// CONCATENATED MODULE: ../../node_modules/thread-loader/dist/cjs.js!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=script&lang=js
// // import HelloWorld from './components/HelloWorld.vue'

// /* harmony default export */ var Appvue_type_script_lang_js = ({
//   name: 'App',
//   components: {
//     // HelloWorld
//   }
// });
// ;// CONCATENATED MODULE: ./src/App.vue?vue&type=script&lang=js
 
// // EXTERNAL MODULE: ../../node_modules/vue-style-loader/index.js??clonedRuleSet-54.use[0]!../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-54.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[2]!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[3]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=2d0b58bd&lang=css
// var Appvue_type_style_index_0_id_2d0b58bd_lang_css = __webpack_require__(3060);
// ;// CONCATENATED MODULE: ./src/App.vue?vue&type=style&index=0&id=2d0b58bd&lang=css

// // EXTERNAL MODULE: ../../node_modules/vue-loader/dist/exportHelper.js
// var exportHelper = __webpack_require__(7091);
// ;// CONCATENATED MODULE: ./src/App.vue




// ;


// const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(Appvue_type_script_lang_js, [['render',Appvue_type_template_id_2d0b58bd_render]])

// /* harmony default export */ var App = (__exports__);
// ;// CONCATENATED MODULE: ../../node_modules/thread-loader/dist/cjs.js!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/HelloFoo.vue?vue&type=template&id=4ee7c554

// function HelloFoovue_type_template_id_4ee7c554_render(_ctx, _cache, $props, $setup, $data, $options) {
//   return openBlock(), createElementBlock("h1", null, "Hello Foo!");
// }
// ;// CONCATENATED MODULE: ../../node_modules/thread-loader/dist/cjs.js!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/HelloFoo.vue?vue&type=script&lang=js
// // import HelloWorld from './components/HelloWorld.vue'

// /* harmony default export */ var HelloFoovue_type_script_lang_js = ({
//   name: "HelloFoo",
//   components: {
//     // HelloWorld
//   },
//   mounted() {
//     console.log('window.location.href: ', window.location.href);
//   }
// });
// ;// CONCATENATED MODULE: ./src/HelloFoo.vue?vue&type=script&lang=js
 
// ;// CONCATENATED MODULE: ./src/HelloFoo.vue




// ;
// const HelloFoo_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(HelloFoovue_type_script_lang_js, [['render',HelloFoovue_type_template_id_4ee7c554_render]])

// /* harmony default export */ var HelloFoo = (HelloFoo_exports_);
// ;// CONCATENATED MODULE: ../../node_modules/thread-loader/dist/cjs.js!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/HelloBar.vue?vue&type=template&id=3df03df9

// function HelloBarvue_type_template_id_3df03df9_render(_ctx, _cache, $props, $setup, $data, $options) {
//   return openBlock(), createElementBlock("h1", null, "Hello Bar!");
// }
// ;// CONCATENATED MODULE: ../../node_modules/thread-loader/dist/cjs.js!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/HelloBar.vue?vue&type=script&lang=js
// // import HelloWorld from './components/HelloWorld.vue'

// /* harmony default export */ var HelloBarvue_type_script_lang_js = ({
//   name: "HelloBar",
//   components: {
//     // HelloWorld
//   },
//   mounted() {
//     console.log('window.location.href: ', window.location.href);
//   }
// });
// ;// CONCATENATED MODULE: ./src/HelloBar.vue?vue&type=script&lang=js
 
// ;// CONCATENATED MODULE: ./src/HelloBar.vue




// ;
// const HelloBar_exports_ = /*#__PURE__*/(0,exportHelper/* default */.Z)(HelloBarvue_type_script_lang_js, [['render',HelloBarvue_type_template_id_3df03df9_render]])

// /* harmony default export */ var HelloBar = (HelloBar_exports_);
// ;// CONCATENATED MODULE: ./src/main.js





// let app;
// const routes = [{
//   path: "/foo",
//   component: HelloFoo
// }, {
//   path: "/bar",
//   component: HelloBar
// }];
// const router = createRouter({
//   // history 模式
//   history: createWebHistory(),
//   // hash 模式
//   // history: createWebHashHistory(),
//   routes
// });
// app = createApp(App);
// app.use(router);
// app.mount(document.body);

// // export function mount() {
// //   console.log("vue app mount");
// //   app = createApp(App);
// //   app.mount("#vue-app");
// // }

// // export function unmount() {
// //   console.log("vue app unmount: ", app);
// //   app && app.unmount();
// // }
// ;// CONCATENATED MODULE: ../../node_modules/@vue/cli-service/lib/commands/build/entry-lib-no-default.js



// }();
// /******/ 	return __webpack_exports__;
// /******/ })()
// ;
// });
// //# sourceMappingURL=vue-app.umd.js.map