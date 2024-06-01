/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-15 11:37
 */

import processTpl, {
	genLinkReplaceSymbol,
	genScriptReplaceSymbol,
} from "./process-tpl";
import {
	defaultGetPublicPath,
	evalCode,
	getGlobalProp,
	getInlineCode,
	noteGlobalProps,
	readResAsString,
	requestIdleCallback,
} from "./utils";

const styleCache = {};
const scriptCache = {};
const embedHTMLCache = {};

if (!window.fetch) {
	throw new Error(
		'[import-html-entry] Here is no "fetch" on the window env, you need to polyfill it'
	);
}
const defaultFetch = window.fetch.bind(window);

// 原样返回
function defaultGetTemplate(tpl) {
	return tpl;
}

/**
 * convert external css link to inline style for performance optimization
 * @param template
 * @param styles
 * @param opts
 * @return embedHTML
 */
// 将外链样式表转换为内联样式表
function getEmbedHTML(template, styles, opts = {}) {
	const { fetch = defaultFetch } = opts;
	let embedHTML = template;
	// 请求获取 HTML 中的外链样式表内容
	return getExternalStyleSheets(styles, fetch).then((styleSheets) => {
		// 将外链样式表替换为内联样式表
		embedHTML = styles.reduce((html, styleSrc, i) => {
			html = html.replace(
				// 之前通过 genLinkReplaceSymbol 生成的占位符，用于替换外链样式表
				genLinkReplaceSymbol(styleSrc),
				// 如果 styleSrc 是内联代码，则直接返回内联代码
				// 如果 styleSrc 是外链样式表地址，则将外链样式表内容转换为内联样式表
				isInlineCode(styleSrc)
					? `${styleSrc}`
					: `<style>/* ${styleSrc} */${styleSheets[i]}</style>`
			);
			return html;
			// 根据之前生成的 HTML Template 和外链样式表内容，生成最终带有内联样式表的 HTML
		}, embedHTML);
		return embedHTML;
	});
}

// 如果 style 或 script 是内联代码，则以 < 开头
const isInlineCode = (code) => code.startsWith("<");

function getExecutableScript(scriptSrc, scriptText, opts = {}) {
	const { proxy, strictGlobal, scopedGlobalVariables = [] } = opts;

	// 如果 scriptSrc 是内联代码，则不需要设置 sourceURL
	const sourceUrl = isInlineCode(scriptSrc)
		? ""
		: // 否则设置 sourceURL 为 scriptSrc
		  `//# sourceURL=${scriptSrc}\n`;

	// 将 scopedGlobalVariables 拼接成变量声明，用于缓存全局变量，避免每次使用时都走一遍代理

	// 这里用于节省性能，防止每次使用全局变量时都需要通过代理获取
	// 在 qiankun 中为了使内部的微应用执行可以快速访问 history、location 等，
	// 专门进行了作用域内的局部声明，从而防止作用域链查找带来的性能损耗
	const scopedGlobalVariableDefinition = scopedGlobalVariables.length
		? `const {${scopedGlobalVariables.join(",")}}=this;`
		: "";

	// 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
	// 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy

	// "嵌套场景" 指的是在一个 iframe 或 Web Worker 中运行代码。
	// 例如，有一个主页面，它包含一个 iframe，这个 iframe 又包含另一个 iframe，这就是一个嵌套的场景。

	// 在这种情况下，每个 iframe 都有自己的 window 对象，这些 window 对象是嵌套的。
	// 主页面的 window 对象是最外层的 window 对象，第一个 iframe 的 window 对象是第二层，第二个 iframe 的 window 对象是第三层，依此类推。

	// 这段代码的目的是确保 window.proxy 绑定到全局的 window 对象，而不是内层 iframe 应用的 window 对象。
	// 这样，即使代码在全局作用域运行，闭包里的 window.proxy 也能取到最外层的代理对象。
	const globalWindow = (0, eval)("window");
	globalWindow.proxy = proxy;
	// TODO 通过 strictGlobal 方式切换 with 闭包，待 with 方式坑趟平后再合并
	return strictGlobal
		? scopedGlobalVariableDefinition
			? // 关于 Proxy + with 详见课程 iframe + Proxy 隔离：https://juejin.cn/book/7258893482318626868/section/7259192856407965711#heading-2
			  // 当然在这里使用 with 是因为 scopedGlobalVariableDefinition 里面的变量是需要在 with 作用域下的，使用 with 可以缩短作用域链查找的时间
			  `;(function(){with(this){${scopedGlobalVariableDefinition}${scriptText}\n${sourceUrl}}}).bind(window.proxy)();`
			: `;(function(window, self, globalThis){with(window){;${scriptText}\n${sourceUrl}}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`
		: // globalThis: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis
		  // globalThis 指代 window 对象，本质上是为了解决不同环境的代码移植性问题
		  `;(function(window, self, globalThis){;${scriptText}\n${sourceUrl}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`;
}

// for prefetch
export function getExternalStyleSheets(styles, fetch = defaultFetch) {
	return Promise.all(
		styles.map((styleLink) => {
			// 如果 styleLink 是内联代码，则以 < 开头
			// 否则 styleLink 是外链样式表地址
			if (isInlineCode(styleLink)) {
				// if it is inline style
				// 如果是内联样式表，则直接返回内联样式表内容
				// 例如：去除 <script>console.log('inline script')</script> 中的 <script> 和 </script>
				// 只保留内联的脚本内容 console.log('inline script')
				return getInlineCode(styleLink);
			} else {
				// external styles
				// 如果是外部样式表，则通过 fetch 获取样式表内容
				// 并将样式表内容缓存到 styleCache 中
				// 注意这里的 styleCache 存储的是 Promise，而不是样式表内容
				// 如果再次请求相同的样式表，会直接返回缓存的 Promise
				// 此时 Promise 的状态如果是 pending，则会等待 Promise resolve 后再返回
				// 如果 Promise 的状态是 resolved，则直接返回样式表内容
				// 这样可以避免多次请求相同的样式表
				return (
					styleCache[styleLink] ||
					(styleCache[styleLink] = fetch(styleLink).then((response) =>
						// 返回样式表内容
						response.text()
					))
				);
			}
		})
	);
}

// for prefetch
export function getExternalScripts(scripts, fetch = defaultFetch) {
	const fetchScript = (scriptUrl, opts) =>
		// 如果 scriptUrl 已经请求过，则直接返回缓存的 Promise
		// 否则通过 fetch 获取脚本内容
		scriptCache[scriptUrl] ||
		(scriptCache[scriptUrl] = fetch(scriptUrl, opts).then((response) => {
			// usually browser treats 4xx and 5xx response of script loading as an error and will fire a script error event
			// https://stackoverflow.com/questions/5625420/what-http-headers-responses-trigger-the-onerror-handler-on-a-script-tag/5625603
			if (response.status >= 400) {
				throw new Error(
					`${scriptUrl} load failed with status ${response.status}`
				);
			}
			// 返回脚本内容
			return response.text();
		}));

	// 通过 Promise.all 获取所有脚本内容
	// 如果脚本是内联代码，则直接返回内联代码
	// 如果脚本是外链脚本地址，则通过 fetch 获取脚本内容
	// 获取的脚本内容会缓存到 scriptCache 中
	return Promise.all(
		scripts.map((script) => {
			// 1. 内联代码
			// 2. 外链脚本地址
			if (typeof script === "string") {
				// 如果是内联代码，则直接返回内联代码
				if (isInlineCode(script)) {
					// if it is inline script
					// 例如：'<script>alert(1)</script>'
					// 返回内联代码内容, 例如：'alert(1)'
					return getInlineCode(script);
				} else {
					// external script
					// 如果是外链脚本地址，则通过 fetch 获取脚本内容
					return fetchScript(script);
				}

				// 1. async script
				// 2. crossOrigin script
			} else {
				// use idle time to load async script
				const { src, async, crossOrigin } = script;
				// 如果是 crossOrigin 脚本，则需要设置 fetch 的 credentials 为 include
				const fetchOpts = crossOrigin ? { credentials: "include" } : {};

				// 如果是 async 脚本，则通过 requestIdleCallback 在空闲时间内加载脚本
				if (async) {
					return {
						src,
						async: true,
						content: new Promise((resolve, reject) =>
							requestIdleCallback(() =>
								fetchScript(src, fetchOpts).then(resolve, reject)
							)
						),
					};
				}
				// 否则直接加载脚本
				return fetchScript(src, fetchOpts);
			}
		})
	);
}

function throwNonBlockingError(error, msg) {
	setTimeout(() => {
		console.error(msg);
		throw error;
	});
}

const supportsUserTiming =
	typeof performance !== "undefined" &&
	typeof performance.mark === "function" &&
	typeof performance.clearMarks === "function" &&
	typeof performance.measure === "function" &&
	typeof performance.clearMeasures === "function";

/**
 * FIXME to consistent with browser behavior, we should only provide callback way to invoke success and error event
 * @param entry
 * @param scripts
 * @param proxy
 * @param opts
 * @returns {Promise<unknown>}
 */
export function execScripts(entry, scripts, proxy = window, opts = {}) {
	const {
		fetch = defaultFetch,
		strictGlobal = false,
		success,
		error = () => {},
		beforeExec = () => {},
		afterExec = () => {},
		scopedGlobalVariables = [],
	} = opts;

	// 如果外部使用 import-html-entry 时没有调用 getExternalScripts 方法获取脚本内容
	// 调用 execScripts 时会再次获取脚本内容
	// 如果外部使用 import-html-entry 时已经调用 getExternalScripts 方法获取脚本内容
	// 此时再次调用时会直接获取 scriptCache 中缓存的脚本内容
	return (
		getExternalScripts(scripts, fetch)
			// scriptsText 是所有脚本内容的数组
			// 例如：['alert(1)', 'alert(2)', 'alert(3)']
			.then((scriptsText) => {
				// 例如：geval('<script>alert(1)</script>', 'alert(1)')
				// scriptSrc 为 '<script>alert(1)</script>'
				// inlineScript 为 'alert(1)'
				const geval = (scriptSrc, inlineScript) => {
					// beforeExec 用于处理脚本执行前的逻辑，外部可以通过 beforeExec 方法对脚本进行处理
					// 例如：rawCode 为 'alert(1)'
					const rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
					// 获取可执行的脚本内容
					const code = getExecutableScript(scriptSrc, rawCode, {
						// proxy 为 window，用于代理全局变量
						proxy,
						// 是否是严格模式
						strictGlobal,
						// scopedGlobalVariables 为全局变量数组
						// 例如：['window', 'document', 'location', 'localStorage', 'sessionStorage', 'alert', 'confirm', 'prompt']
						scopedGlobalVariables,
					});
					// 在非严格模式的全局作用域下执行脚本
					evalCode(scriptSrc, code);
					// afterExec 用于处理脚本执行后的逻辑，外部可以通过 afterExec 方法对脚本进行处理
					afterExec(inlineScript, scriptSrc);
				};

				function exec(scriptSrc, inlineScript, resolve) {
					const markName = `Evaluating script ${scriptSrc}`;
					// 用于记录脚本执行的时间
					const measureName = `Evaluating Time Consuming: ${scriptSrc}`;

					// 如果支持 performance API，则记录脚本执行的时间
					if (process.env.NODE_ENV === "development" && supportsUserTiming) {
						// mark 用于记录时间点
						performance.mark(markName);
					}

					// 如果 scriptSrc 是 entry，则执行 entry 脚本
					if (scriptSrc === entry) {
						// 记录入口脚本执行前的 window 对象的第一个属性、第二个属性以及最后一个属性
						noteGlobalProps(strictGlobal ? proxy : window);

						try {
							// 执行 entry 脚本
							geval(scriptSrc, inlineScript);
							// 获取 entry 脚本执行后导出的生命周期函数
							const exports =
								// 通过对比微应用脚本执行之前的 window 对象（noteGlobalProps）和执行之后的 window 对象
								// 可以计算出微应用脚本执行后新增的全局属性，从而计算出导出的生命周期函数
								proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};

							// Promise.resolve(exports) 用于返回微应用导出的生命周期函数
							resolve(exports);
						} catch (e) {
							// entry error must be thrown to make the promise settled
							console.error(
								`[import-html-entry]: error occurs while executing entry script ${scriptSrc}`
							);
							throw e;
						}
						// 如果 scriptSrc 不是 entry，则执行普通脚本
					} else {
						if (typeof inlineScript === "string") {
							try {
								// 例如：scriptSrc.src = 'http://localhost:8080/js/app.js'
								// 这里主要处理 async 脚本和 crossOrigin 脚本
								if (scriptSrc?.src) {
									geval(scriptSrc.src, inlineScript);
								} else {
									// 例如： scriptSrc = '<script>alert(1)</script>'
									// 例如： inlineScript = 'alert(1)'
									geval(scriptSrc, inlineScript);
								}
							} catch (e) {
								// consistent with browser behavior, any independent script evaluation error should not block the others
								throwNonBlockingError(
									e,
									`[import-html-entry]: error occurs while executing normal script ${scriptSrc}`
								);
							}
						} else {
							// external script marked with async
							// 执行 async 脚本
							inlineScript.async &&
								// 通过 requestIdleCallback 在空闲时间内加载脚本
								inlineScript?.content
									.then((downloadedScriptText) =>
										geval(inlineScript.src, downloadedScriptText)
									)
									.catch((e) => {
										throwNonBlockingError(
											e,
											`[import-html-entry]: error occurs while executing async script ${inlineScript.src}`
										);
									});
						}
					}

					// 如果支持 performance API，则记录脚本执行的时间
					if (process.env.NODE_ENV === "development" && supportsUserTiming) {
						performance.measure(measureName, markName);
						performance.clearMarks(markName);
						performance.clearMeasures(measureName);
					}
				}

				function schedule(i, resolvePromise) {
					// 如果 i < scripts.length，则表明还有脚本需要执行
					if (i < scripts.length) {
						// 获取 scriptSrc
						// 如果是内联代码，则 scriptSrc 是内联代码内容
						// 如果是外链脚本地址，则 scriptSrc 是外链脚本地址
						// 例如：
						// [
						// 	"<script>\n      console.log(\"inline script\");\n    </script>",
						// 	"http://localhost:8080/js/chunk-vendors.js",
						// 	"http://localhost:8080/js/app.js"
						// ]
						const scriptSrc = scripts[i];

						// 获取 inlineScript
						// inlineScript 是脚本的文本内容
						const inlineScript = scriptsText[i];

						// 执行脚本
						exec(scriptSrc, inlineScript, resolvePromise);
						// resolve the promise while the last script executed and entry not provided
						if (!entry && i === scripts.length - 1) {
							resolvePromise();
						} else {
							schedule(i + 1, resolvePromise);
						}
					}
				}

				// 开始执行所有的脚本
				return new Promise((resolve) => schedule(0, success || resolve));
			})
			.catch((e) => {
				error();
				throw e;
			})
	);
}

export default function importHTML(url, opts = {}) {
	// 默认的 fetch 方法是 window.fetch
	let fetch = defaultFetch;
	let autoDecodeResponse = false;
	// 默认的 getPublicPath 方法是 defaultGetPublicPath
	let getPublicPath = defaultGetPublicPath;
	let getTemplate = defaultGetTemplate;
	// HTML 解析的后置处理，让用户可以对解析后的 HTML 内容进行二次处理
	const { postProcessTemplate } = opts;

	// compatible with the legacy importHTML api
	if (typeof opts === "function") {
		fetch = opts;
	} else {
		// fetch option is availble
		if (opts.fetch) {
			// fetch is a funciton
			if (typeof opts.fetch === "function") {
				fetch = opts.fetch;
			} else {
				// configuration
				fetch = opts.fetch.fn || defaultFetch;
				autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
			}
		}
		getPublicPath =
			opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
		getTemplate = opts.getTemplate || defaultGetTemplate;
	}

	return (
		// 如果已经解析并缓存了 HTML 的处理结果，直接返回缓存结果
		embedHTMLCache[url] ||
		// 通过 window.fetch 获取 HTML 内容（HTML 地址的请求需要支持跨域）
		(embedHTMLCache[url] = fetch(url)
			// 将请求结果转换为字符串
			.then((response) => readResAsString(response, autoDecodeResponse))
			// 请求成功后，处理 HTML 文本内容
			.then((html) => {
				// 获取 HTML 内容的 publicPath
				// 例如：http://localhost:8080/abc/def/index.html -> http://localhost:8080/abc/def/
				const assetPublicPath = getPublicPath(url);
				// 对 HTML 内容进行解析，提取其中的 script、style、template 等内容
				const { template, scripts, entry, styles } = processTpl(
					getTemplate(html),
					assetPublicPath,
					postProcessTemplate
				);

				// 处理 CSS 样式表，将外联样式表转换为内联样式表

				// 例如 template：

				// <!DOCTYPE html>
				// <html lang="">
				// <head>
				// 	<meta charset="utf-8" />
				// 	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				// 	<meta name="viewport" content="width=device-width,initial-scale=1.0" />
				// 	<link rel="icon" href="//localhost:8080/favicon.ico" />
				// 	<title>vue-micro-app</title>
				// 	<style>
				// 	body {
				// 		margin: 0;
				// 	}
				// 	</style>
				// 	<!-- inline scripts replaced by import-html-entry -->
				// <!--   script http://localhost:8080/js/chunk-vendors.js replaced by import-html-entry --><!--   script http://localhost:8080/js/app.js replaced by import-html-entry --><!--  link http://localhost:8080/css/app.css replaced by import-html-entry --></head>
				// <body>
				// 	<noscript>
				// 	<strong
				// 		>We're sorry but vue-micro-app doesn't work
				// 		properly without JavaScript enabled. Please enable it to
				// 		continue.</strong
				// 	>
				// 	</noscript>
				// 	<div id="app"></div>

				// </body>
				// </html>

				// 转换成 embedHTML：

				// <!DOCTYPE html>
				// <html lang="">
				//   <head>
				// 	<meta charset="utf-8" />
				// 	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
				// 	<meta name="viewport" content="width=device-width,initial-scale=1.0" />
				// 	<link rel="icon" href="//localhost:8080/favicon.ico" />
				// 	<title>vue-micro-app</title>
				// 	<style>
				// 	  body {
				// 		margin: 0;
				// 	  }
				// 	</style>
				// 	<!-- inline scripts replaced by import-html-entry -->
				//   <!--   script http://localhost:8080/js/chunk-vendors.js replaced by import-html-entry --><!--   script http://localhost:8080/js/app.js replaced by import-html-entry --><style>/* http://localhost:8080/css/app.css *//*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
				//   !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css ***!
				//   \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/

				// h3[data-v-469af010] {
				//   margin: 40px 0 0;
				// }
				// ul[data-v-469af010] {
				//   list-style-type: none;
				//   padding: 0;
				// }
				// li[data-v-469af010] {
				//   display: inline-block;
				//   margin: 0 10px;
				// }
				// a[data-v-469af010] {
				//   color: #42b983;
				// }

				// /*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
				//   !*** css ../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!../../node_modules/vue-loader/dist/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&lang=css ***!
				//   \************************************************************************************************************************************************************************************************************************************************************************************************************************************/

				// #app {
				//   font-family: Avenir, Helvetica, Arial, sans-serif;
				//   -webkit-font-smoothing: antialiased;
				//   -moz-osx-font-smoothing: grayscale;
				//   text-align: center;
				//   color: #2c3e50;
				//   margin-top: 60px;
				// }

				// </style></head>
				//   <body>
				// 	<noscript>
				// 	  <strong
				// 		>We're sorry but vue-micro-app doesn't work
				// 		properly without JavaScript enabled. Please enable it to
				// 		continue.</strong
				// 	  >
				// 	</noscript>
				// 	<div id="app"></div>

				//   </body>
				// </html>
				return getEmbedHTML(template, styles, { fetch }).then((embedHTML) => ({
					// 对外暴露转换成内联样式表的 HTML 内容
					template: embedHTML,
					// 对外暴露 HTML 内容的 publicPath
					assetPublicPath,
					// 对外暴露获取外链脚本的方法（利用闭包缓存了参数 scripts 和 fetch）
					getExternalScripts: () => getExternalScripts(scripts, fetch),
					// 对外暴露获取外链样式表的方法
					getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
					// 对外暴露执行脚本的方法（利用闭包缓存了参数 entry、scripts 和 fetch）
					execScripts: (proxy, strictGlobal, opts = {}) => {
						// 如果没有脚本，则直接返回
						if (!scripts.length) {
							return Promise.resolve();
						}
						// 执行脚本
						return execScripts(entry, scripts, proxy, {
							fetch,
							strictGlobal,
							...opts,
						});
					},
				}));
			}))
	);
}

export function importEntry(entry, opts = {}) {
	const {
		fetch = defaultFetch,
		getTemplate = defaultGetTemplate,
		postProcessTemplate,
	} = opts;
	const getPublicPath =
		opts.getPublicPath || opts.getDomain || defaultGetPublicPath;

	if (!entry) {
		throw new SyntaxError("entry should not be empty!");
	}

	// html entry
	if (typeof entry === "string") {
		return importHTML(entry, {
			fetch,
			getPublicPath,
			getTemplate,
			postProcessTemplate,
		});
	}

	// config entry
	// 如果 entry 是对象，且 entry 中包含 scripts 和 styles
	if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
		const { scripts = [], styles = [], html = "" } = entry;
		// 通过 getHTMLWithStylePlaceholder 方法将 HTML 中的外链样式表替换为占位符
		const getHTMLWithStylePlaceholder = (tpl) =>
			styles.reduceRight(
				(html, styleSrc) => `${genLinkReplaceSymbol(styleSrc)}${html}`,
				tpl
			);
		// 通过 getHTMLWithScriptPlaceholder 方法将 HTML 中的外链脚本替换为占位符
		const getHTMLWithScriptPlaceholder = (tpl) =>
			scripts.reduce(
				(html, scriptSrc) => `${html}${genScriptReplaceSymbol(scriptSrc)}`,
				tpl
			);

		// 基本上和 importHTML 逻辑一致
		return getEmbedHTML(
			getTemplate(
				getHTMLWithScriptPlaceholder(getHTMLWithStylePlaceholder(html))
			),
			styles,
			{ fetch }
		).then((embedHTML) => ({
			template: embedHTML,
			assetPublicPath: getPublicPath(entry),
			getExternalScripts: () => getExternalScripts(scripts, fetch),
			getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
			execScripts: (proxy, strictGlobal, opts = {}) => {
				if (!scripts.length) {
					return Promise.resolve();
				}
				return execScripts(scripts[scripts.length - 1], scripts, proxy, {
					fetch,
					strictGlobal,
					...opts,
				});
			},
		}));
	} else {
		throw new SyntaxError("entry scripts or styles should be array!");
	}
}
