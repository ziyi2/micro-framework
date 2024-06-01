/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-09-03 15:04
 */
import { getInlineCode, isModuleScriptSupported, parseUrl } from "./utils";

// 注意一下这些正则表达式中使用了大量的捕获组，捕获组是用括号括起来的部分
// 例如获取 type 属性值的正则表达式: type=('|")?([^>'"\s]+), 其中 ('|")? 是第一个捕获组。([^>'"\s]+) 是第二个捕获组，用于提取 type 属性值
// 例如获取 href 属性值的正则表达式: href=('|")?([^>'"\s]+), 其中 ('|")? 是第一个捕获组。([^>'"\s]+) 是第二个捕获组，用于提取 href 属性值
// 例如获取 src 属性值的正则表达式: src=('|")?([^>'"\s]+), 其中 ('|")? 是第一个捕获组。([^>'"\s]+) 是第二个捕获组，用于提取 src 属性值
// 因为需要从匹配的字符串中提取出属性值，所以需要使用捕获组

const ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/gi;
const SCRIPT_TAG_REGEX =
	/<(script)\s+((?!type=('|")text\/ng-template\3).)*?>.*?<\/\1>/is;

const SCRIPT_SRC_REGEX = /.*\ssrc=('|")?([^>'"\s]+)/;
const SCRIPT_TYPE_REGEX = /.*\stype=('|")?([^>'"\s]+)/;
const SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
const SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
const SCRIPT_CROSSORIGIN_REGEX = /.*\scrossorigin=('|")?use-credentials\1/;
const SCRIPT_NO_MODULE_REGEX = /.*\snomodule\s*.*/;
const SCRIPT_MODULE_REGEX = /.*\stype=('|")?module('|")?\s*.*/;
const LINK_TAG_REGEX = /<(link)\s+.*?>/gis;
const LINK_PRELOAD_OR_PREFETCH_REGEX = /\srel=('|")?(preload|prefetch)\1/;
const LINK_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
const LINK_AS_FONT = /.*\sas=('|")?font\1.*/;
const STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
const STYLE_TYPE_REGEX = /\s+rel=('|")?stylesheet\1.*/;
const STYLE_HREF_REGEX = /.*\shref=('|")?([^>'"\s]+)/;
const HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
const LINK_IGNORE_REGEX = /<link(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
const STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;
const SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is;

function hasProtocol(url) {
	return url.startsWith("http://") || url.startsWith("https://");
}

function getEntirePath(path, baseURI) {
	// URL：https://developer.mozilla.org/zh-CN/docs/Web/API/URL
	// 例如： path = //localhost:8080/css/app.css，baseURI = http://localhost:8080
	// new URL(path, baseURI) 会将 path 拼接到 baseURI 后面，返回一个新的 URL 对象
	// 此时 new URL(path, baseURI).toString() 返回的结果为 http://localhost:8080/css/app.css
	return new URL(path, baseURI).toString();
}

function isValidJavaScriptType(type) {
	const handleTypes = [
		"text/javascript",
		"module",
		"application/javascript",
		"text/ecmascript",
		"application/ecmascript",
	];
	// 如果 type 为空，则返回 true，或者 handleTypes 中包含 type，则返回 true
	// 例如：type 为 text/javascript，则返回 true
	// 例如：<script defer src="/static/js/bundle.js">，type 为空，也返回 true
	return !type || handleTypes.indexOf(type) !== -1;
}

export const genLinkReplaceSymbol = (linkHref, preloadOrPrefetch = false) =>
	`<!-- ${
		preloadOrPrefetch ? "prefetch/preload" : ""
	} link ${linkHref} replaced by import-html-entry -->`;
export const genScriptReplaceSymbol = (
	scriptSrc,
	async = false,
	crossOrigin = false
) =>
	`<!-- ${crossOrigin ? "cors" : ""} ${
		async ? "async" : ""
	} script ${scriptSrc} replaced by import-html-entry -->`;
export const inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`;
export const genIgnoreAssetReplaceSymbol = (url) =>
	`<!-- ignore asset ${url || "file"} replaced by import-html-entry -->`;
export const genModuleScriptReplaceSymbol = (scriptSrc, moduleSupport) =>
	`<!-- ${
		moduleSupport ? "nomodule" : "module"
	} script ${scriptSrc} ignored by import-html-entry -->`;

/**
 * parse the script link from the template
 * 1. collect stylesheets
 * 2. use global eval to evaluate the inline scripts
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_constructor_and_function_declaration
 *    see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param baseURI
 * @param postProcessTemplate
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */
export default function processTpl(tpl, baseURI, postProcessTemplate) {
	let scripts = [];
	const styles = [];
	let entry = null;
	// 判断浏览器的兼容性，是否支持 <script type=module>
	const moduleSupport = isModuleScriptSupported();

	const template = tpl

		/*
		remove html comment first
		*/

		// HTML_COMMENT_REGEX：/<!--([\s\S]*?)-->/g
		// 该正则表达式可以拆分为：
		// 1 <!--: 匹配 <!-- 开头的字符串
		// 2 ([\s\S]*?): 匹配任意字符，包括换行符，非贪婪模式，即尽可能少的匹配
		//   2.1 [\s\S]: 匹配任意字符，包括换行符
		//     2.1.1 []: 用于定义一个字符集，可以匹配字符集中的任意一个字符，例如常见的 [0-9] 匹配 0 到 9 之间的任意一个数字
		//     2.1.2 \s: 匹配一个空白字符
		//     2.1.3 \S: 匹配一个非空白字符
		//   2.2 *?: 匹配 0 次或多次，非贪婪模式，即尽可能少的匹配
		//     2.2.1 * 表示匹配 0 次或多次
		//     2.2.2 ? 表示非贪婪模式
		// 3 -->: 匹配 --> 结尾的字符串

		// 移除所有的 HTML 注释
		.replace(HTML_COMMENT_REGEX, "")

		// LINK_TAG_REGEX: /<(link)\s+.*?>/gis
		// 例如：<link rel="icon" href="//localhost:8080/favicon.ico">
		// 例如：<link href="//localhost:8080/css/app.css" rel="stylesheet">
		// 该正则表达式可以拆分为：
		// 1 <(link): 匹配 <link 开头的字符串
		// 2 \s+: 匹配一个或多个空白字符
		// 3 .*?: 匹配任意字符，非贪婪模式，即尽可能少的匹配
		// 	 3.1 . 匹配除了换行符之外的任意字符
		//   3.2 * 表示匹配 0 次或多次
		//   3.3 ? 表示非贪婪模式
		// 4 >: 匹配 > 字符

		// 匹配所有的 link 标签
		.replace(LINK_TAG_REGEX, (match) => {
			/*
			change the css link
			*/

			// STYLE_TYPE_REGEX: /\s+rel=('|")?stylesheet\1.*/
			// 例如：<link href="//localhost:8080/css/app.css" rel="stylesheet">
			// 该正则表达式可以拆分为：
			// 1 \s+: 匹配一个或多个空白字符
			// 2 rel=('|")?stylesheet\1: 匹配 rel='stylesheet'、rel="stylesheet" 或 rel=stylesheet
			//   2.1 rel=('|")?: 匹配 rel=' 或 rel=" 或者 rel=，其中 ? 表示匹配 0 次或 1 次
			//     2.1.1 ('|"): 匹配 ' 或 "，其中 | 表示或，() 表示捕获组
			//     2.1.2 ?: 表示匹配 0 次或 1 次
			//   2.2 stylesheet: 匹配 stylesheet
			//   2.3 \1: 反向引用，引用前面的 ('|") 第 1 个捕获组，可以简单理解为就是 ('|") 的引用
			// 3 .*: 匹配任意字符，其中 * 表示匹配 0 次或多次

			// 判读 link 标签中的 rel 属性是否为 stylesheet
			const styleType = !!match.match(STYLE_TYPE_REGEX);
			// styleType 为 true，表示 link 标签中有 rel 属性为 stylesheet，即为 CSS 样式表
			if (styleType) {
				// LINK_HREF_REGEX: /.*\shref=('|")?([^>'"\s]+)/
				// 例如：<link href="//localhost:8080/css/app.css" rel="stylesheet">
				// 该正则表达式可以拆分为：
				// 1 .*: 匹配任意字符
				// 2 \s: 匹配一个空白字符
				// 3 href=('|")?([^>'"\s]+): 匹配 href='、href=" 或 href=，并且匹配 href 属性值
				//   3.1 href=('|")?: 匹配 href=' 或 href=" 或者 href=，其中 ? 表示匹配 0 次或 1 次
				//   3.2 ([^>'"\s]+): 匹配除了 >, ', ", 空白字符之外的任意字符, + 表示匹配一次或多次（如果遇到了 >, ', ", 空白字符就结束匹配）
				//     3.2.1 (): 用于提取匹配的内容，是一个捕获组，用于捕获 href 属性值
				//     3.2.2 []: 用于定义一个字符集，可以匹配字符集中的任意一个字符，例如常见的 [0-9] 匹配 0 到 9 之间的任意一个数字
				//     3.2.3 ^: 在字符集中插入符号 ^ 表示取反，即匹配除了字符集中的字符之外的任意字
				//     3.2.4 >'"\s: 匹配 >, ', ", 空白字符
				//   3.3 (): 捕获组，用于提取匹配的内容，在这里一共有两个捕获组，第一个捕获组用于匹配 href 属性值的引号，第二个捕获组用于匹配 href 属性值

				// 以 <link href="//localhost:8080/css/app.css" rel="stylesheet"> 为例
				// styleHref = [
				// 	"<link href=\"//localhost:8080/css/app.css", // 整个匹配的字符串
				// 	"\"", // 第一个捕获组，匹配 href 属性值的引号 "，注意这里的 \ 是转义字符
				// 	"//localhost:8080/css/app.css" // 第二个捕获组，匹配 href 属性值
				// ]

				// 匹配 link 标签中的 href 属性
				const styleHref = match.match(STYLE_HREF_REGEX);

				// LINK_IGNORE_REGEX: /<link(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is
				// 例如：<link ignore href="//localhost:8080/css/app.css">
				// 该正则表达式可以拆分为：
				// 1 <link: 匹配 <link 开头的字符串
				// 2 (\s+|\s+.+\s+): 匹配一个或多个空白字符，或者匹配一个或多个空白字符加上任意字符加上一个或多个空白字符
				//   2.1 \s+: 匹配一个或多个空白字符
				//   2.2 \s+.+\s+: 匹配一个或多个空白字符加上任意字符加上一个或多个空白字符
				//     2.2.1 \s+: 匹配一个或多个空白字符
				//     2.2.2 .+: 匹配任意字符，+ 表示匹配一次或多次
				//     2.2.3 \s+: 匹配一个或多个空白字符
				//   2.3 |: 或
				// 3 ignore: 匹配 ignore
				// 4 (\s*|\s+.*|=.*)>: 匹配 0 个或多个空白字符，或者匹配一个或多个空白字符加上任意字符，或者匹配 = 加上任意字符
				//   4.1 \s*: 匹配 0 个或多个空白字符
				//   4.2 \s+.*: 匹配一个或多个空白字符加上任意字符
				//   4.3 =.*: 匹配 = 加上任意字符

				// 这里为什么要加上 ignore 属性的判断呢？
				// 因为有些微应用的 JS 脚本或者 CSS 资源必须放在主应用中加载，不能通过微应用自己的方式加载
				// 此时需要将 link 标签替换为注释信息，不加载 link 标签中的资源
				// 例如：<link ignore href="//localhost:8080/css/app.css"> 会被替换为注释信息
				// 这样微应用的 css 资源就不会被加载，需要将其加入到主应用的模板中
				// 如果微应用需要单独使用（不是在微前端中运行），那么 ignore 的属性不会影响资源的加载，它不是 HTML 标准的属性

				// 匹配 link 标签中的 ignore 属性
				const styleIgnore = match.match(LINK_IGNORE_REGEX);

				// 如果 link 标签中有 href 属性
				if (styleHref) {
					// 获取 href 属性值
					// 例如：<link href="//localhost:8080/css/app.css" rel="stylesheet">
					// href = "//localhost:8080/css/app.css"

					// 这里的 styleHref[2] 就是匹配到的 href 属性值、
					// 因为在 STYLE_HREF_REGEX 中，href 属性值是第二个捕获组
					const href = styleHref && styleHref[2];
					let newHref = href;
					// 如果 href 属性值不是以 http:// 或 https:// 开头，则将其拼接到 baseURI 后面
					if (href && !hasProtocol(href)) {
						// 例如：href = //localhost:8080/css/app.css，baseURI = http://localhost:8080
						// newHref = http://localhost:8080/css/app.css
						newHref = getEntirePath(href, baseURI);
					}

					// 如果 link 标签中有 ignore 属性
					if (styleIgnore) {
						// 将 link 标签替换为注释信息
						// 例如：<link ignore href="//localhost:8080/css/app.css"> 会被替换为注释信息
						// <!-- ignore asset http://localhost:8080/css/app.css replaced by import-html-entry -->
						return genIgnoreAssetReplaceSymbol(newHref);
					}

					// 例如：newHref = "http://example.com/path?query=param&amp;anotherParam=value"
					// 此时 newHref 中的 &amp; 是转义字符，需要将其转换为 & 符号
					// 使用 parseUrl 方法将 newHref 进行解析
					// 返回结果为 http://example.com/path?query=param&anotherParam=value
					newHref = parseUrl(newHref);
					// 将 newHref 添加到 styles 数组中
					styles.push(newHref);
					// 生成 link 标签替换的注释信息
					// 原有的文本 <link href="//localhost:8080/css/app.css" rel="stylesheet"> 会被替换为注释信息
					// <!-- link http://localhost:8080/css/app.css replaced by import-html-entry -->
					return genLinkReplaceSymbol(newHref);
				}
			}

			// 如果 link 标签中没有 rel 属性为 stylesheet，即不是 CSS 样式表
			// 但可能是 preload 或 prefetch，例如：<link rel="preload" href="//localhost:8080/css/app.css">
			// 也可能是 font，例如：<link as="font" href="//localhost:8080/css/app.css">
			// 这里需要对这些 link 标签进行处理
			const preloadOrPrefetchType =
				// LINK_PRELOAD_OR_PREFETCH_REGEX: /\srel=('|")?(preload|prefetch)\1/
				// 例如：<link rel="preload" href="//localhost:8080/css/app.css">
				// 该正则表达式可以拆分为：
				// 1 \srel=('|")?(preload|prefetch)\1: 匹配 rel='preload' 或 rel="preload" 或 rel='prefetch' 或 rel="prefetch" 或 rel=preload 或 rel=prefetch
				// 	 1.1 \s: 匹配一个空白字符
				// 	 1.2 rel=('|")?: 匹配 rel='、rel=" 或 rel=, ? 表示匹配 0 次或 1 次
				// 	 1.3 (preload|prefetch): 匹配 preload 或 prefetch，其中（）是一个分组，可以匹配 preload 或 prefetch
				//   1.4 \1: 反向引用，引用前面的 ('|") 第 1 个捕获组，这样就可以匹配到 rel='preload' 或 rel="preload 尾部的引号

				// 匹配所有的 rel 属性为 preload 或 prefetch 的 link 标签
				match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) &&
				// 匹配所有的 rel 属性为 preload 或 prefetch 的 link 标签中的 href 属性
				// 已经在上面的代码中讲解了该正则表达式
				match.match(LINK_HREF_REGEX) &&
				// LINK_AS_FONT: /.*\sas=('|")?font\1.*/
				// 例如：<link as="font" href="//localhost:8080/css/app.css">
				// 该正则表达式可以拆分为：
				// 1 .*: 匹配任意字符
				// 2 \s: 匹配一个空白字符
				// 3 as=('|")?font\1: 匹配 as='font' 或 as="font" 或 as=font
				//   3.1 as=('|")?: 匹配 as='、as=" 或 as=，其中 ? 表示匹配 0 次或 1 次
				//   3.2 font: 匹配 font
				//   3.3 \1: 反向引用，引用前面的 ('|") 第 1 个捕获组，这样就可以匹配到 as='font' 或 as="font 尾部的引号
				// 4 .*: 匹配任意字符，* 表示匹配 0 次或多次

				// 不匹配 link 标签中的 as 属性为 font 的 link 标签
				!match.match(LINK_AS_FONT);

			// 如果 link 标签中的 rel 属性为 preload 或 prefetch
			// 此时 preloadOrPrefetchType 为 true
			if (preloadOrPrefetchType) {
				// 匹配 link 标签中的 href 属性
				// 因为 href 属性值是第二个捕获组，所以这里是 [2]
				const [, , linkHref] = match.match(LINK_HREF_REGEX);
				// 生成 link 标签替换的注释信息
				// 原有的文本 <link rel="preload" href="//localhost:8080/css/app.css"> 会被替换为注释信息
				// <!-- prefetch/preload link //localhost:8080/css/app.css replaced by import-html-entry -->

				// 这里可以思考一下为什么要将 preload 或 prefetch 的 link 标签替换为注释信息？
				// 为什么要去除 preload 或 prefetch 的能力？
				// 因为不是直接使用 HTML 的方式加载资源，而是通过 import-html-entry 的方式加载资源
				// 只有通过 HTML 的方式加载资源，才会触发浏览器的预加载或预取功能
				// 通过 import-html-entry 的方式加载资源，不会触发浏览器的预加载或预取功能
				return genLinkReplaceSymbol(linkHref, true);
			}
			// 其余情况，直接返回 link 标签
			return match;
		})

		// STYLE_TAG_REGEX: /<style[^>]*>[\s\S]*?<\/style>/gi
		// 例如：<style>body { color: red; }</style>
		// 该正则表达式可以拆分为：
		// 1 <style: 匹配 <style 开头的字符串
		// 2 [^>]*: 匹配除了 > 之外的任意字符，* 表示匹配 0 次或多次
		// 3 >: 匹配 > 字符
		// 4 [\s\S]*?: 匹配任意字符，非贪婪模式，即尽可能少的匹配
		// 5 <\/style>: 匹配 </style> 结尾的字符串

		// 匹配所有内联的 style 标签
		.replace(STYLE_TAG_REGEX, (match) => {
			// STYLE_IGNORE_REGEX: /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*|=.*)>/is
			// 例如：<style ignore>body { color: red; }</style>
			// 该正则表达式可以拆分为：
			// 1 <style: 匹配 <style 开头的字符串
			// 2 (\s+|\s+.+\s+): 匹配一个或多个空白字符，或者匹配一个或多个空白字符加上任意字符加上一个或多个空白字符
			//   2.1 \s+: 匹配一个或多个空白字符
			//   2.2 \s+.+\s+: 匹配一个或多个空白字符加上任意字符加上一个或多个空白字符
			//     2.2.1 \s+: 匹配一个或多个空白字符
			//     2.2.2 .+: 匹配任意字符，+ 表示匹配一次或多次
			//     2.2.3 \s+: 匹配一个或多个空白字符
			//   2.3 |: 或
			// 3 ignore: 匹配 ignore
			// 4 (\s*|\s+.*|=.*)>: 匹配 0 个或多个空白字符，或者匹配一个或多个空白字符加上任意字符，或者匹配 = 加上任意字符
			//   4.1 \s*: 匹配 0 个或多个空白字符
			//   4.2 \s+.*: 匹配一个或多个空白字符加上任意字符
			//   4.3 =.*: 匹配 = 加上任意字符
			//   4.4 >: 匹配 > 字符

			// qiankun 识别到 style 标签中有 ignore 属性，不会加载该 style 标签中的样式
			// 而是将该 style 标签替换为注释信息

			// 匹配 ignore 属性的 style 标签
			if (STYLE_IGNORE_REGEX.test(match)) {
				// 将 ignore 属性的 style 标签替换为注释信息
				// 例如：<style ignore>body { color: red; }</style> 会被替换为注释信息
				// <!-- ignore asset style file replaced by import-html-entry -->
				return genIgnoreAssetReplaceSymbol("style file");
			}
			// 如果是内联的 style 标签，直接返回内联的 style 标签
			return match;
		})
		// 例如: <script defer src="/static/js/bundle.js"></scrip>
		// 例如: <script>console.log('inline script')</script>

		// ALL_SCRIPT_REGEX: /<script(\s+|.+?)*>[\s\S]*?<\/script>/gi
		// 该正则表达式可以拆分为：
		// 1 <script: 匹配 <script 开头的字符串
		// 2 (\s+|.+?)*: 匹配一个或多个空白字符，或者匹配任意字符，非贪婪模式，即尽可能少的匹配，注意这是一个捕获组
		//   2.1 \s+: 匹配一个或多个空白字符
		//   2.2 .+?: 匹配任意字符，非贪婪模式，即尽可能少的匹配
		//   2.3 *: 匹配 0 次或多次
		// 3 >: 匹配 > 字符
		// 4 [\s\S]*?: 匹配任意字符，非贪婪模式，即尽可能少的匹配
		//   4.1 \s: 匹配一个空白字符
		//   4.2 \S: 匹配一个非空白字符
		//   4.3 *: 匹配 0 次或多次
		//   4.4 ?: 非贪婪模式，即尽可能少的匹配
		// 5 <\/script>: 匹配 </script> 结尾的字符串

		// 匹配所有的 script 标签
		.replace(ALL_SCRIPT_REGEX, (match, scriptTag) => {
			// 匹配 script 标签中的 ignore 属性
			// 类似于上述 style 标签中的 ignore 匹配
			const scriptIgnore = scriptTag.match(SCRIPT_IGNORE_REGEX);
			// 1. 浏览器支持 module 但是 script 标签中有 nomodule 属性
			// 2. 浏览器不支持 module 但是 script 标签中有 type="module" 属性
			// 这两种情况都会被忽略
			const moduleScriptIgnore =
				// SCRIPT_NO_MODULE_REGEX: /.*\snomodule\s*.*/
				// 例如：<script nomodule src="/static/js/bundle.js"></script>
				// 该正则表达式可以拆分为：
				// 1 .*: 匹配任意字符
				// 2 \s: 匹配一个空白字符
				// 3 nomodule: 匹配 nomodule
				// 4 \s*: 匹配 0 个或多个空白字符
				// 5 .*: 匹配任意字符，* 表示匹配 0 次或多次

				// 浏览器支持 module 但是 script 标签中有 nomodule 属性
				(moduleSupport && !!scriptTag.match(SCRIPT_NO_MODULE_REGEX)) ||
				// SCRIPT_MODULE_REGEX: /.*\stype=('|")?module('|")?\s*.*/
				// 例如：<script type="module" src="/static/js/bundle.js"></script>
				// 该正则表达式可以拆分为：
				// 1 .*: 匹配任意字符
				// 2 \s: 匹配一个空白字符
				// 3 type=('|")?module('|")?: 匹配 type='module'、type="module"、type=module
				//   3.1 type=('|")?: 匹配 type=' 或 type=" 或者 type=，其中 ? 表示匹配 0 次或 1 次
				//   3.2 module: 匹配 module
				//   3.3 ('|")?: 匹配 ' 或 "，其中 ? 表示匹配 0 次或 1 次
				// 4 \s*: 匹配 0 个或多个空白字符
				// 5 .*: 匹配任意字符，* 表示匹配 0 次或多次

				// 浏览器不支持 module 但是 script 标签中有 type="module" 属性
				(!moduleSupport && !!scriptTag.match(SCRIPT_MODULE_REGEX));
			// in order to keep the exec order of all javascripts

			// SCRIPT_TYPE_REGEX: /.*\stype=('|")?([^>'"\s]+)/
			// 例如：<script type="text/javascript" src="/static/js/bundle.js"></script>
			// 该正则表达式可以拆分为：
			// 1 .*: 匹配任意字符
			// 2 \s: 匹配一个空白字符
			// 3 type=('|")?: 匹配 type=' 或 type=" 或者 type=，其中 ? 表示匹配 0 次或 1 次
			// 4 ([^>'"\s]+): 匹配除了 >, ', ", 空白字符之外的任意字符，+ 表示匹配一次或多次（如果遇到了 >, ', ", 空白字符就结束匹配）
			//   4.1 (): 用于提取匹配的内容，是一个捕获组，用于捕获 type 属性值，注意这里是第二个捕获组
			//   4.2 []: 用于定义一个字符集，可以匹配字符集中的任意一个字符，例如常见的 [0-9] 匹配 0 到 9 之间的任意一个数字
			//   4.3 ^: 在字符集中插入符号 ^ 表示取反，即匹配除了字符集中的字符之外的任意字
			//   4.4 >'"\s: 匹配 >, ', ", 空白字符
			//   4.5 +: 匹配 1 次或多次（匹配非 >, ', ", 空白字符之外的字符）

			// 匹配 script 标签中的 type 属性
			const matchedScriptTypeMatch = scriptTag.match(SCRIPT_TYPE_REGEX);
			const matchedScriptType =
				// SCRIPT_TYPE_REGEX 正则中有两个捕获组，
				// 第一个捕获组匹配 type 属性的引号
				// 第二个捕获组匹配 type 属性值

				// 在 ('|")? 中 () 有两个主要作用：
				// 1. 分组
				// 括号可以将多个字符组合在一起，然后应用一个或多个正则操作符。
				// 例如，a(bc)? 会匹配一个 'a' 后面跟着零个或多个 'bc'
				// 'bc' 是一个分组，可以使用 ? 来匹配 0 次或 1 次
				// 2. 捕获
				// 括号还可以捕获匹配的文本，以便稍后在表达式中或在后续的代码中使用。
				// 例如，a(bc) 会匹配 'abc'，并且捕获 'bc'

				// 正因为如此，所以 ([^>'"\s]+) 不得已成为了第二个捕获组，而不是第一个捕获组
				matchedScriptTypeMatch && matchedScriptTypeMatch[2];

			// 如果 script 标签的 type 不能判断是否为 JavaScript 脚本，那么不对该 script 标签进行处理
			if (!isValidJavaScriptType(matchedScriptType)) {
				return match;
			}

			// if it is a external script

			// SCRIPT_TAG_REGEX: /<(script)\s+((?!type=('|")text\/ng-template\3).)*?>.*?<\/\1>/is
			// 例如：
			// <script type="text/ng-template" id="tpl1.html">
			// 	<div>Content of tpl1.html</div>
			// </script>

			// 该正则表达式可以拆分为：
			// 1 <(script): 匹配 <script 开头的字符串
			// 2 \s+: 匹配一个或多个空白字符
			// 3 ((?!type=('|")text\/ng-template\3).)*?: 匹配除了 type='text/ng-template'、type="text/ng-template" 之外的任意字符
			//   3.1 (?!type=('|")text\/ng-template\3): 负向预查，匹配后面不是 type='text/ng-template' 的字符
			//       3.1.1 type=('|")text\/ng-template\3: 匹配 type='text/ng-template' 或 type="text/ng-template"
			//       3.1.2 \3: 反向引用，引用前面的 ('|") 第 3 个捕获组，这样就可以匹配到 type='text/ng-template' 或 type="text/ng-template 尾部的引号
			//       3.1.3 ('|"): 匹配 ' 或 "，其中 | 表示或，() 表示捕获组
			//       3.1.4 text\/ng-template: 匹配 text/ng-template
			//       3.1.5 (?!) 负向预查，匹配后面不是 type='text/ng-template' 或 type="text/ng-template" 的字符
			//   3.2 .: 匹配任意字符
			//   3.3 *?: 匹配 0 次或多次，非贪婪模式，即尽可能少的匹配
			// 4 >: 匹配 > 字符
			// 5 .*?: 匹配任意字符，非贪婪模式，即尽可能少的匹配
			// 6 <\/\1>: 匹配 </script> 结尾的字符串，\1 表示引用前面的捕获组，这里是 script

			// SCRIPT_SRC_REGEX: /.*\ssrc=('|")?([^>'"\s]+)/
			// 例如：<script src="/static/js/bundle.js"></script>
			// 该正则表达式可以拆分为：
			// 1 .*: 匹配任意字符
			// 2 \s: 匹配一个空白字符
			// 3 src=('|")?: 匹配 src=' 或 src=" 或者 src=，其中 ? 表示匹配 0 次或 1 次
			// 4 ([^>'"\s]+): 匹配除了 >, ', ", 空白字符之外的任意字符，+ 表示匹配一次或多次（如果遇到了 >, ', ", 空白字符就结束匹配）
			//   4.1 (): 用于提取匹配的内容，是一个捕获组，用于捕获 src 属性值
			//   4.2 []: 用于定义一个字符集，可以匹配字符集中的任意一个字符，例如常见的 [0-9] 匹配 0 到 9 之间的任意一个数字
			//   4.3 ^: 在字符集中插入符号 ^ 表示取反，即匹配除了字符集中的字符之外的任意字
			//   4.4 >'"\s: 匹配 >, ', ", 空白字符
			//   4.5 +: 匹配 1 次或多次（匹配非 >, ', ", 空白字符之外的字符）

			// 1. 匹配 type 不为 text/ng-template 的 script 标签
			//    在 Angular 中，text/ng-template 用于定义模板，并不是 JavaScript 脚本
			// 2. 匹配 script 标签中有 src 属性, 例如：<script src="/static/js/bundle.js"></script>
			// 满足上述两个条件的 script 标签都会被认为是外部的 JavaScript 脚本
			if (SCRIPT_TAG_REGEX.test(match) && scriptTag.match(SCRIPT_SRC_REGEX)) {
				/*
				collect scripts and replace the ref
				*/

				// SCRIPT_ENTRY_REGEX: /.*\sentry\s*.*/
				// 例如：<script entry src="/static/js/bundle.js"></script>

				// 该正则表达式可以拆分为：
				// 1 .*: 匹配任意字符
				// 2 \s: 匹配一个空白字符
				// 3 entry: 匹配 entry
				// 4 \s*: 匹配 0 个或多个空白字符
				// 5 .*: 匹配任意字符，* 表示匹配 0 次或多次

				// 在 qiankun 中，entry 属性用于标识入口脚本
				// 如果 script 标签中有 entry 属性，那么该 script 标签中的 src 属性值就是入口脚本
				// 例如：<script entry src="/static/js/bundle.js"></script>，那么 /static/js/bundle.js 就是入口脚本
				const matchedScriptEntry = scriptTag.match(SCRIPT_ENTRY_REGEX);

				// 再次匹配 script 标签中的 src 属性值
				const matchedScriptSrcMatch = scriptTag.match(SCRIPT_SRC_REGEX);
				// 获取 script 标签中的 src 属性值
				let matchedScriptSrc =
					matchedScriptSrcMatch && matchedScriptSrcMatch[2];

				// 注意最外层的 .replace(ALL_SCRIPT_REGEX, (match, scriptTag) => {})  匹配的是整个 script 标签的内容
				// 如果当前 HTML 有多个 script 标签，那么会多次进入 .replace(ALL_SCRIPT_REGEX, (match, scriptTag) => {}) 中
				// 此时如果在之前的 script 标签中匹配到了 entry 属性，那么会将 entry 属性值赋值给 entry 变量
				// 如果在当前 script 标签中再次匹配到了 entry 属性，那么说明有多个入口脚本，此时会抛出异常
				if (entry && matchedScriptEntry) {
					throw new SyntaxError("You should not set multiply entry script!");
				}

				// 如果当前 script 标签有 src 属性, 例如：<script src="/static/js/bundle.js"></script>
				if (matchedScriptSrc) {
					// append the domain while the script not have a protocol prefix
					// 如果 script 标签中的 src 属性值不是以 http:// 或 https:// 开头，则将其拼接到 baseURI 后面
					if (!hasProtocol(matchedScriptSrc)) {
						// 例如：matchedScriptSrc = //localhost:8080/static/js/bundle.js，baseURI = http://localhost:8080
						// matchedScriptSrc = http://localhost:8080/static/js/bundle.js
						matchedScriptSrc = getEntirePath(matchedScriptSrc, baseURI);
					}
					// 例如：matchedScriptSrc = http://example.com/path?query=param&amp;anotherParam=value
					// 此时 matchedScriptSrc 中的 &amp; 是转义字符，需要将其转换为 & 符号
					// 使用 parseUrl 方法将 matchedScriptSrc 进行解析
					// 返回结果为 http://example.com/path?query=param&anotherParam=value
					matchedScriptSrc = parseUrl(matchedScriptSrc);
				}

				// 识别出入口脚本
				// 如果当前 script 标签中有 entry 属性，那么该 script 标签中的 src 属性值就是入口脚本
				// 例如：<script entry src="/static/js/bundle.js"></script>，那么 /static/js/bundle.js 就是入口脚本
				entry = entry || (matchedScriptEntry && matchedScriptSrc);

				// 如果 script 标签中有 ignore 属性，那么将该 script 标签替换为注释信息
				if (scriptIgnore) {
					// 例如：<script ignore src="/static/js/bundle.js"></script> 会被替换为注释信息
					// <!-- ignore asset /static/js/bundle.js replaced by import-html-entry -->
					return genIgnoreAssetReplaceSymbol(matchedScriptSrc || "js file");
				}

				// 如果浏览器支持 module 但是 script 标签中有 nomodule 属性
				// 或者浏览器不支持 module 但是 script 标签中有 type="module" 属性
				// 那么将该 script 标签替换为注释信息
				if (moduleScriptIgnore) {
					// 返回对应的注释信息
					return genModuleScriptReplaceSymbol(
						matchedScriptSrc || "js file",
						moduleSupport
					);
				}

				// 如果 script 标签中有 src 属性
				if (matchedScriptSrc) {
					// SCRIPT_ASYNC_REGEX: /.*\sasync\s*.*/
					// 例如：<script async src="/static/js/bundle.js"></script>
					// 该正则表达式可以拆分为：
					// 1 .*: 匹配任意字符
					// 2 \s: 匹配一个空白字符
					// 3 async: 匹配 async
					// 4 \s*: 匹配 0 个或多个空白字符
					// 5 .*: 匹配任意字符，* 表示匹配 0 次或多次

					// 匹配 script 标签中的 async 属性
					const asyncScript = !!scriptTag.match(SCRIPT_ASYNC_REGEX);

					// SCRIPT_CROSSORIGIN_REGEX: /.*\scrossorigin=('|")?use-credentials\1/
					// 例如：<script crossorigin="use-credentials" src="/static/js/bundle.js"></script>
					// 该正则表达式可以拆分为：
					// 1 .*: 匹配任意字符
					// 2 \s: 匹配一个空白字符
					// 3 crossorigin=('|")?: 匹配 crossorigin=' 或 crossorigin=" 或者 crossorigin=，其中 ? 表示匹配 0 次或 1 次
					// 4 use-credentials: 匹配 use-credentials
					// 5 \1: 反向引用，引用前面的 ('|") 第 1 个捕获组，这样就可以匹配到 crossorigin='use-credentials' 或 crossorigin="use-credentials" 尾部的引号

					// 匹配 script 标签中的 crossorigin 属性，use-credentials 表示使用凭证
					// use-credentials 会对 window.onerror 捕获的错误堆栈信息产生影响

					// 如果没有使用 crossorigin 属性或没有为跨源脚本配置适当的 CORS 头部，
					// 当跨源脚本发生运行时错误时，这些错误信息默认不会暴露给调用的域，
					// 即 window.onerror 事件处理器不能获取到错误的详细信息，比如行号、错误消息、堆栈信息等，只能得到 "Script error."。

					// 但是，如果你使用了 crossorigin="use-credentials" 并且服务端响应了适当的 CORS 头部，
					// 那么当跨源脚本发生错误时，浏览器会把详细的错误信息提供给 window.onerror 回调，允许开发者捕获并处理这些错误。

					// 例如 React CDN 中使用 crossorigin，详见 https://legacy.reactjs.org/docs/cdn-links.html#why-the-crossorigin-attribute
					const crossOriginScript = !!scriptTag.match(SCRIPT_CROSSORIGIN_REGEX);
					// 将 matchedScriptSrc 添加到 scripts 数组中
					scripts.push(
						asyncScript || crossOriginScript
							? {
									async: asyncScript,
									src: matchedScriptSrc,
									crossOrigin: crossOriginScript,
							  }
							: matchedScriptSrc
					);
					// 生成 script 标签替换的注释信息
					// 例如：<script src="/static/js/bundle.js"></script> 会被替换为注释信息
					// <!-- script /static/js/bundle.js replaced by import-html-entry -->

					// 例如: <script async src="/static/js/bundle.js"></script> 会被替换为注释信息
					// <!-- async script /static/js/bundle.js replaced by import-html-entry -->

					// 例如: <script crossorigin="use-credentials" src="/static/js/bundle.js"></script> 会被替换为注释信息
					// <!-- crossorigin script /static/js/bundle.js replaced by import-html-entry -->
					return genScriptReplaceSymbol(
						matchedScriptSrc,
						asyncScript,
						crossOriginScript
					);
				}

				// 其余情况，直接返回 script 标签
				return match;

				// 如果 script 标签中没有 src 属性，那么该 script 标签就是内联的脚本
			} else {
				// 如果 script 标签中有 ignore 属性，那么将该 script 标签替换为注释信息
				if (scriptIgnore) {
					// 例如：<script ignore>console.log('inline script')</script> 会被替换为注释信息
					// <!-- ignore asset js file replaced by import-html-entry -->
					return genIgnoreAssetReplaceSymbol("js file");
				}

				// 如果浏览器支持 module 但是 script 标签中有 nomodule 属性
				// 或者浏览器不支持 module 但是 script 标签中有 type="module" 属性
				// 那么将该 script 标签替换为注释信息
				// 例如：<script nomodule>console.log('inline script')</script> 会被替换为注释信息
				// <!-- module script js file replaced by import-html-entry -->
				if (moduleScriptIgnore) {
					return genModuleScriptReplaceSymbol("js file", moduleSupport);
				}

				// if it is an inline script
				// 去除 <script>console.log('inline script')</script> 中的 <script> 和 </script>
				// 只保留内联的脚本内容 console.log('inline script')
				const code = getInlineCode(match);

				// remove script blocks when all of these lines are comments.
				// 判断内联脚本是否全是注释
				const isPureCommentBlock = code
					// 通过 split 方法将 code 按照换行符分割为数组
					.split(/[\r\n]+/)
					// 通过 every 方法判断数组中的每一项是否都是注释
					.every((line) => !line.trim() || line.trim().startsWith("//"));

				// 如果内联脚本不全是注释
				if (!isPureCommentBlock) {
					// 将内联脚本添加到 scripts 数组中，注意这里加入的不是 code，而是 match
					// 例如：<script>console.log('inline script')</script> 会被添加到 scripts 数组中
					scripts.push(match);
				}

				// 生成内联脚本替换的注释信息
				// 例如：<script>console.log('inline script')</script> 会被替换为注释信息
				// <!-- inline script replaced by import-html-entry -->
				return inlineScriptReplaceSymbol;
			}
		});

	// 过滤掉空的 script
	scripts = scripts.filter(function (script) {
		// filter empty script
		return !!script;
	});

	// 例如以当前项目的 Vue 微应用为例，通过 window.fetch 获取后，HTML 文本如下所示：
	// <!DOCTYPE html>
	// <html lang="">
	//   <head>
	//     <meta charset="utf-8" />
	//     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
	//     <meta name="viewport" content="width=device-width,initial-scale=1.0" />
	//     <link rel="icon" href="//localhost:8080/favicon.ico" />
	//     <title>vue-micro-app</title>
	//     <style>
	//       body {
	//         margin: 0;
	//       }
	//     </style>
	//     <script>
	//       console.log("inline script");
	//     </script>
	//   <script defer src="//localhost:8080/js/chunk-vendors.js"></script><script defer src="//localhost:8080/js/app.js"></script><link href="//localhost:8080/css/app.css" rel="stylesheet"></head>
	//   <body>
	//     <noscript>
	//       <strong
	//         >We're sorry but vue-micro-app doesn't work
	//         properly without JavaScript enabled. Please enable it to
	//         continue.</strong
	//       >
	//     </noscript>
	//     <div id="app"></div>
	//     <!-- built files will be auto injected -->
	//   </body>
	// </html>

	// 经过正则匹配后，template 的内容如下所示：
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

	// 通过正则匹配后，styles 的内容如下所示：
	// [
	// 	"http://localhost:8080/css/app.css"
	// ]

	// 通过正则匹配后，scripts 的内容如下所示：
	// [
	// 	"<script>\n      console.log(\"inline script\");\n    </script>",
	// 	"http://localhost:8080/js/chunk-vendors.js",
	// 	"http://localhost:8080/js/app.js"
	// ]

	// entry 的内容为 http://localhost:8080/js/app.js
	let tplResult = {
		template,
		scripts,
		styles,
		// set the last script as entry if have not set
		// 如果没有明确在 script 标签中设置 entry 属性
		// 那么将 scripts 数组中的最后一个脚本作为入口脚本
		entry: entry || scripts[scripts.length - 1],
	};

	// postProcessTemplate 是 importHTML 以及 importEntry 方法中 opts 参数的 postProcessTemplate 属性
	// 可以通过外部传入 postProcessTemplate 函数对模板进行后处理
	if (typeof postProcessTemplate === "function") {
		tplResult = postProcessTemplate(tplResult);
	}

	return tplResult;
}
