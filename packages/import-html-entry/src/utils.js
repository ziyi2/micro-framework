/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2019-02-25
 * fork from https://github.com/systemjs/systemjs/blob/master/src/extras/global.js
 */

const isIE11 =
	typeof navigator !== "undefined" &&
	navigator.userAgent.indexOf("Trident") !== -1;

// shouldSkipProperty 用于判断是否跳过某个属性
// 外部调用 for...in 循环遍历属性时会包含原型链上的属性，因此需要判断是否是对象自身的属性

// 1. 如果不是对象自身的属性（例如是原型链上的属性），或者是数组的索引，则跳过
// 2. 如果 window[p] 是 window 对象的子窗口，则跳过
// 3. 如果访问 window[p] 会抛出异常，则跳过
function shouldSkipProperty(global, p) {
	// 判断是否是 window 对象的属性（不包含原型链）
	// 例如：window.hasOwnProperty('document') => true
	// 例如：window.hasOwnProperty('toString') => false
	if (!global.hasOwnProperty(p) || (!isNaN(p) && p < global.length))
		return true;

	// 判断是否是 IE11
	if (isIE11) {
		// https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
		try {
			// 1. 判断 window[p] 是否是 window 对象的子窗口
			return (
				global[p] &&
				typeof window !== "undefined" &&
				global[p].parent === window
			);
		} catch (err) {
			// 2. 访问 window[p] 会抛出异常，则跳过
			return true;
		}
	} else {
		return false;
	}
}

// safari unpredictably lists some new globals first or second in object order
let firstGlobalProp, secondGlobalProp, lastGlobalProp;

export function getGlobalProp(global) {
	let cnt = 0;
	let lastProp;
	let hasIframe = false;

	for (let p in global) {
		// 跳过原型链上的属性检测
		if (shouldSkipProperty(global, p)) continue;

		// 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
		for (let i = 0; i < window.frames.length && !hasIframe; i++) {
			const frame = window.frames[i];
			if (frame === global[p]) {
				hasIframe = true;
				break;
			}
		}

		// 1. 如果不存在 iframe
		// 2. 第一个属性不是 firstGlobalProp
		// 3. 第二个属性不是 secondGlobalProp
		// 那么新添加的全局属性在第一个或者第二个位置
		// 通过 safari 注释：safari unpredictably lists some new globals first or second in object order
		// 可以看出 safari 在遍历 window 对象时，新添加的全局属性可能会在第一个或者第二个位置
		if (
			!hasIframe &&
			((cnt === 0 && p !== firstGlobalProp) ||
				(cnt === 1 && p !== secondGlobalProp))
		)
			// 返回 window 对象新增的属性名
			return p;
		cnt++;

		// 除了 safari 之外，大部分浏览器都是按照 ECMA-262 规范实现
		// 新添加的全局属性会在最后一个位置

		// 计算 window 对象的最后一个属性名
		// 详见之前的课程框架解析
		// single-spa 的 Fetch 示例 / 如何获取生命周期函数
		// https://juejin.cn/book/7258893482318626868/section/7330188684471795747#heading-6
		lastProp = p;
	}

	// 例如以 vue 微应用为例，详见 packages/vue-app/vue.config.js 的 configureWebpack.output.library
	// 例如此时 window 对象最后新增的属性名为 vue-micro-app_a171ba64-a574-4715-aa0f-db63aef66f53
	// 因此可以通过 window["vue-micro-app_a171ba64-a574-4715-aa0f-db63aef66f53"] 获取 vue 微应用导出的生命周期函数
	if (lastProp !== lastGlobalProp) return lastProp;
}
// noteGlobalProps 会遍历 window 上的属性，返回最后一个属性名
export function noteGlobalProps(global) {
	// alternatively Object.keys(global).pop()
	// but this may be faster (pending benchmarks)
	firstGlobalProp = secondGlobalProp = undefined;

	// 1. 使用 for...in 遍历 window 上的属性时会包含原型链上的属性
	// 2. 通过 shouldSkipProperty 判断是否跳过原型链上的属性
	// 为什么不用 Object.keys 进行遍历呢？
	// for...in 和 Object.keys 的字符串键都是按照属性被添加到对象的顺序进行排序的
	for (let p in global) {
		if (shouldSkipProperty(global, p)) continue;
		// 例如 firstGlobalProp = 'window'
		if (!firstGlobalProp) firstGlobalProp = p;
		// 例如 secondGlobalProp = 'self'
		else if (!secondGlobalProp) secondGlobalProp = p;
		// 计算出 window 对象的最后一个属性名
		lastGlobalProp = p;
	}

	return lastGlobalProp;
}

// 例如：'<script>var a = 123;<\/script>'
// 去掉 <script> 和 </script>，只提取中间的 js 代码, 返回 'var a = 123;'
// 为什么要去掉 <script> 和 </script>，因为 new Function(code) 和 eval 不认识 <script> 和 </script>

// 例如：'<style>body{background-color: red}<\/style>'
// 去掉 <style> 和 </style>，只提取中间的 css 代码, 返回 'body{background-color: red}'
export function getInlineCode(match) {
	const start = match.indexOf(">") + 1;
	const end = match.lastIndexOf("<");
	return match.substring(start, end);
}

/**
 * 计算 publicPath
 *
 * @export
 * @param {*} entry
 * @return {*}
 */

// 例如：entry = 'http://localhost:8080/entry.js'
// 返回 'http://localhost:8080/'

// 例如：entry = 'http://localhost:8080/a/b/entry.js'
// 返回：'http://localhost:8080/a/b/'
export function defaultGetPublicPath(entry) {
	if (typeof entry === "object") {
		return "/";
	}
	try {
		const { origin, pathname } = new URL(entry, location.href);
		const paths = pathname.split("/");
		// 移除最后一个元素
		paths.pop();
		return `${origin}${paths.join("/")}/`;
	} catch (e) {
		console.warn(e);
		return "";
	}
}

// Detect whether browser supports `<script type=module>` or not
export function isModuleScriptSupported() {
	const s = document.createElement("script");
	return "noModule" in s;
}

// RIC and shim for browsers setTimeout() without it
export const requestIdleCallback =
	// 如果浏览器支持 requestIdleCallback，则使用浏览器原生的 requestIdleCallback
	window.requestIdleCallback ||
	// 否则使用 setTimeout 模拟 requestIdleCallback
	function requestIdleCallback(cb) {
		const start = Date.now();
		return setTimeout(() => {
			cb({
				didTimeout: false,
				timeRemaining() {
					return Math.max(0, 50 - (Date.now() - start));
				},
			});
		}, 1);
	};

export function readResAsString(response, autoDetectCharset) {
	// 未启用自动检测
	if (!autoDetectCharset) {
		return response.text();
	}

	// 如果没headers，发生在test环境下的mock数据，为兼容原有测试用例
	if (!response.headers) {
		return response.text();
	}

	// 如果没返回content-type，走默认逻辑
	const contentType = response.headers.get("Content-Type");
	if (!contentType) {
		return response.text();
	}

	// 解析content-type内的charset
	// Content-Type: text/html; charset=utf-8
	// Content-Type: multipart/form-data; boundary=something
	// GET请求下不会出现第二种content-type
	let charset = "utf-8";
	const parts = contentType.split(";");
	if (parts.length === 2) {
		const [, value] = parts[1].split("=");
		const encoding = value && value.trim();
		if (encoding) {
			charset = encoding;
		}
	}

	// 如果还是utf-8，那么走默认，兼容原有逻辑，这段代码删除也应该工作
	if (charset.toUpperCase() === "UTF-8") {
		return response.text();
	}

	// 走流读取，编码可能是gbk，gb2312等，比如sofa 3默认是gbk编码
	return response.blob().then(
		(file) =>
			new Promise((resolve, reject) => {
				const reader = new window.FileReader();
				reader.onload = () => {
					resolve(reader.result);
				};
				reader.onerror = reject;
				reader.readAsText(file, charset);
			})
	);
}

const evalCache = {};

// 在非严格模式的全局作用域中执行 JavaScript 代码，同时缓存已经解析过的代码
export function evalCode(scriptSrc, code) {
	// 例如：scriptSrc = 'http://localhost:8080/entry.js'
	// 例如：scriptSrc = '<script>var a = 123;<\/script>'
	// 例如：code: ;(function(window, self, globalThis){;
	//   var a = 123;
	// }).bind(window.proxy)(window.proxy, window.proxy, window.proxy);
	const key = scriptSrc;
	// 检测是否已经缓存了该代码
	if (!evalCache[key]) {
		// 例如： (function(){;(function(window, self, globalThis){;var a = 123;}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);})'
		// 例如： (function(){;(function(){with(this){var a = 123;}}).bind(window.proxy)();})'
		const functionWrappedCode = `(function(){${code}})`;
		// 通过 (0, eval) 执行的函数，其作用域是全局作用域
		// 因此这里得到了一个在全局作用域下执行的函数

		// 除此之外，间接调用的 eval（0,eval） 还会在非严格模式下执行代码，因此内部可以使用 with 语句（默认情况下严格模式才能使用 with）
		// 当然，如果显示指定 "use strict"，则会在严格模式下执行代码；例如：(0, eval("use strict; var a = 123;"))
		// 在严格模式下间接调用 eval （0,eval）也是非严格模式下执行
		evalCache[key] = (0, eval)(functionWrappedCode);
	}
	// evalFun 是一个函数，该函数因为使用了 (0, eval)，所在是在全局作用域下执行
	const evalFunc = evalCache[key];
	// 执行 evalFunc 函数
	evalFunc.call(window);
}

// 转换 url 中的转义字符，例如 &amp; => &
export function parseUrl(url) {
	const parser = new DOMParser();
	const html = `<script src="${url}"></script>`;
	const doc = parser.parseFromString(html, "text/html");
	return doc.scripts[0].src;
}
