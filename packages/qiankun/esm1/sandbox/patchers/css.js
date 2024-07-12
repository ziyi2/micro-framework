/**
 * @author Saviio
 * @since 2020-4-19
 */
// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
var RuleType;
(function (RuleType) {
  // type: rule will be rewrote
  RuleType[(RuleType['STYLE'] = 1)] = 'STYLE';
  RuleType[(RuleType['MEDIA'] = 4)] = 'MEDIA';
  RuleType[(RuleType['SUPPORTS'] = 12)] = 'SUPPORTS';
  // type: value will be kept
  RuleType[(RuleType['IMPORT'] = 3)] = 'IMPORT';
  RuleType[(RuleType['FONT_FACE'] = 5)] = 'FONT_FACE';
  RuleType[(RuleType['PAGE'] = 6)] = 'PAGE';
  RuleType[(RuleType['KEYFRAMES'] = 7)] = 'KEYFRAMES';
  RuleType[(RuleType['KEYFRAME'] = 8)] = 'KEYFRAME';
})(RuleType || (RuleType = {}));
const arrayify = (list) => {
  // 将类数组转换成真正的数组
  // 例如：CSSRuleList -> Array
  // 例如：NodeList -> Array
  return [].slice.call(list, 0);
};
const rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;
export class ScopedCSS {
  static ModifiedTag = 'Symbol(style-modified-qiankun)';
  sheet;
  swapNode;
  constructor() {
    // 创建一个 style 标签
    const styleNode = document.createElement('style');
    // 将 style 标签插入到 body 的底部
    rawDocumentBodyAppend.call(document.body, styleNode);
    // 保存 style 标签
    this.swapNode = styleNode;
    // 获取 style 标签的 sheet 属性
    this.sheet = styleNode.sheet;
    // 禁用 style 样式
    // 详见：https://developer.mozilla.org/zh-CN/docs/Web/API/StyleSheet/disabled
    this.sheet.disabled = true;
  }
  process(styleNode, prefix = '') {
    // 如果 style 标签已经被处理过，则直接返回
    if (ScopedCSS.ModifiedTag in styleNode) {
      return;
    }
    // 如果 style 标签的内容不为空，则进行 ScopedCSS 处理
    if (styleNode.textContent !== '') {
      // 创建一个文本节点
      const textNode = document.createTextNode(styleNode.textContent || '');
      // 将文本节点插入到 swapNode 的底部
      this.swapNode.appendChild(textNode);
      const sheet = this.swapNode.sheet; // type is missing
      // cssRules 是一个只读属性，返回一个包含样式表中所有规则的 CSSRuleList 对象
      // 例如：
      // [{
      //   cssRules: CSSStyleRule;
      //   cssText: string;
      // }]
      // 将 CSSRuleList 转换成 Array
      const rules = arrayify(sheet?.cssRules ?? []);
      // 对样式进行 scope 处理
      const css = this.rewrite(rules, prefix);
      // eslint-disable-next-line no-param-reassign
      // 重新设置 style 标签的内容
      styleNode.textContent = css;
      // cleanup
      // 移除文本节点
      this.swapNode.removeChild(textNode);
      // 设置 style 标签已经被处理过
      styleNode[ScopedCSS.ModifiedTag] = true;
      return;
    }
    // 如果 style 标签的内容为空，则监听 style 标签的变化
    const mutator = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i += 1) {
        const mutation = mutations[i];
        // 如果 style 标签已经被处理过，则直接返回
        if (ScopedCSS.ModifiedTag in styleNode) {
          return;
        }
        if (mutation.type === 'childList') {
          const sheet = styleNode.sheet;
          // 将 CSSRuleList 转换成 Array
          const rules = arrayify(sheet?.cssRules ?? []);
          // 对样式进行 scope 处理
          const css = this.rewrite(rules, prefix);
          // eslint-disable-next-line no-param-reassign
          // 重新设置 style 标签的内容
          styleNode.textContent = css;
          // eslint-disable-next-line no-param-reassign
          // 设置 style 标签已经被处理过
          styleNode[ScopedCSS.ModifiedTag] = true;
        }
      }
    });
    // since observer will be deleted when node be removed
    // we dont need create a cleanup function manually
    // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect
    mutator.observe(styleNode, { childList: true });
  }
  rewrite(rules, prefix = '') {
    let css = '';
    rules.forEach((rule) => {
      // 根据 rule 的类型，进行不同的处理
      switch (rule.type) {
        // 处理样式
        case RuleType.STYLE:
          css += this.ruleStyle(rule, prefix);
          break;
        // @media 规则用于描述不同的媒体设备上的不同样式
        case RuleType.MEDIA:
          css += this.ruleMedia(rule, prefix);
          break;
        // @supports 规则用于检查浏览器是否支持指定的CSS属性
        case RuleType.SUPPORTS:
          css += this.ruleSupport(rule, prefix);
          break;
        default:
          if (typeof rule.cssText === 'string') {
            css += `${rule.cssText}`;
          }
          break;
      }
    });
    return css;
  }
  // handle case:
  // .app-main {}
  // html, body {}
  // eslint-disable-next-line class-methods-use-this
  // prefix: div[data-qiankun="vue"]（Vue 微应用）
  ruleStyle(rule, prefix) {
    const rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
    const rootCombinationRE = /(html[^\w{[]+)/gm;
    // rule.cssText: h3[data-v-469af010] { margin: 40px 0px 0px; }
    // rule.selectorText: h3[data-v-469af010]（Vue 微应用）
    const selector = rule.selectorText.trim();
    let cssText = '';
    if (typeof rule.cssText === 'string') {
      cssText = rule.cssText;
    }
    // handle html { ... }
    // handle body { ... }
    // handle :root { ... }

    // 1. 单独匹配 html、body、:root 根选择器
    if (selector === 'html' || selector === 'body' || selector === ':root') {
      // rootSelectorRE: 匹配 html、body、:root

      // /((?:[^\w\-.#]|^)(body|html|:root))/gm
      // 匹配 body、html、:root

      // 正则表达式可以分为以下几个部分：
      // 1. (?:[^\w\-.#]|^): 匹配除了字母、数字、下划线、连字符、点、井号之外的字符或者开头
      //  1.1 () 为捕获组，(?:) 为非捕获组
      //  1.2 [^\w\-.#]: 匹配除了字母、数字、下划线、连字符、点、井号之外的字符
      //    1.2.1 []: 匹配方括号内的任意字符
      //    1.2.2 ^: 在方括号表达式中使用，表示匹配不在该字符集合中的字符
      //    1.2.3 \w: 匹配任何字母数字字符，等价于 [A-Za-z0-9_]
      //    1.2.4 \-.#: 匹配连字符、点、井号
      //  1.3 |: 或者
      //  1.4 ^: 匹配开头

      // 匹配 body { margin: 0px; } 中的 body
      // 因此 body 会被替换成 div[data-qiankun="vue"]
      // body { margin: 0px } 会被替换成 div[data-qiankun="vue"] { margin: 0px; }
      return cssText.replace(rootSelectorRE, prefix);
    }
    // handle html body { ... }
    // handle html > body { ... }

    // /(html[^\w{[]+)/gm

    // 正则表达式可以分为以下几个部分：
    // 1. html: 匹配 html
    // 2. [^\w{]: 匹配除了字母、数字、下划线、左大括号之外的字符
    //  2.1 []: 匹配方括号内的任意字符
    //  2.2 ^: 在方括号表达式中使用，表示匹配不在该字符集合中的字符
    //  2.3 \w: 匹配任何字母数字字符，等价于 [A-Za-z0-9_]
    //  2.4 {: 匹配左大括号
    // 3. +: 表示匹配一个或多个

    // 匹配 html body 中 body 前面的部分（遇到 body 的首字母 b 结束匹配）
    // 匹配 html > body 中 body 前面的部分 html >（遇到 body 的首字母 b 结束匹配）

    // 2. 匹配联合选择器，例如 html + body、html > body、html body，去除联合选择器中的 html、html > 等
    if (rootCombinationRE.test(rule.selectorText)) {
      // /(html[^\w{]+)(\+|~)/

      // 正则表达式可以分为以下几个部分：
      // 1. html: 匹配 html
      // 2. [^\w{]+: 匹配 html 后面的除了字母、数字、下划线、左大括号之外的字符
      // 3. (\+|~): 匹配 + 或者 ~

      // 匹配 html + body 或者 html ~ body
      const siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm;
      // since html + body is a non-standard rule for html
      // transformer will ignore it
      // 注意 html + body 是一个非标准的规则，因此不需要处理
      // 如果不是 html + body 或者 html ~ body
      if (!siblingSelectorRE.test(rule.selectorText)) {
        // 匹配 html > body { margin: 0px; } 中的 html >
        // 因此 html > 会被替换成空字符串
        // html > body { margin: 0px; } 会被替换成 body { margin: 0px; }
        cssText = cssText.replace(rootCombinationRE, '');
      }
    }
    // handle grouping selector, a,span,p,div { ... }

    // /^[\s\S]+{/

    // 正则表达式可以分为以下几个部分：
    // 1. ^: 匹配开头
    // 2. [\s\S]: 匹配任意字符
    // 3. +: 匹配一个或多个
    // 4. {: 匹配左大括号

    // 匹配 a,span,p,div { ... } 中的 a,span,p,div {
    // 匹配 body { ... } 中的 body {
    // 匹配 h3[data-v-469af010] { ... } 中的 h3[data-v-469af010] {

    // 3. 处理分组选择器，例如 a,span,p,div { ... }，在选择器前面加上 div[data-qiankun="vue"]
    cssText = cssText.replace(/^[\s\S]+{/, (selectors) => {
      // selectors: a,span,p,div {
      // selectors: body {

      // /(^|,\n?)([^,]+)/
      // 匹配逗号或者换行符后面的字符
      // 例如：body,html { margin: 0px; } 中的 body,html

      // 正则表达式可以分为以下几个部分：
      // 1. (^|,\n?): 匹配开头或者逗号或者换行符
      // 2. ([^,]+): 匹配除了逗号之外的字符

      // replace 的第二个参数是一个函数，用于处理匹配到的字符串
      // item: 匹配到的字符串
      // p: 第一个捕获组
      // s: 第二个捕获组

      // 例如 body { 会匹配到 body
      // 例如 body,html { 会匹配到 body 和 ,html {
      // 例如 h3[data-v-469af010] { 会匹配到 h3[data-v-469af010] {

      // 3.1 处理分组选择器，用 , 分割选择器
      // 例如 a,b,c 会分别匹配到 a、b、c
      return selectors.replace(/(^|,\n?)([^,]+)/g, (item, p, s) => {
        // handle div,body,span { ... }

        // rootSelectorRE: 匹配 html、body、:root

        // /((?:[^\w\-.#]|^)(body|html|:root))/gm
        // 匹配 body、html、:root

        // 正则表达式可以分为以下几个部分：
        // 1. (?:[^\w\-.#]|^): 匹配除了字母、数字、下划线、连字符、点、井号之外的字符或者开头
        //  1.1 () 为捕获组，(?:) 为非捕获组
        //  1.2 [^\w\-.#]: 匹配除了字母、数字、下划线、连字符、点、井号之外的字符
        //    1.2.1 []: 匹配方括号内的任意字符
        //    1.2.2 ^: 在方括号表达式中使用，表示匹配不在该字符集合中的字符
        //    1.2.3 \w: 匹配任何字母数字字符，等价于 [A-Za-z0-9_]
        //    1.2.4 \-.#: 匹配连字符、点、井号
        //  1.3 |: 或者
        //  1.4 ^: 匹配开头

        // 例如：body  会被匹配
        // 例如 ,html { 会被匹配到

        // 3.1.1 如果匹配到的字符是 html、body、:root
        //       将其替换成 div[data-qiankun="vue"]
        if (rootSelectorRE.test(item)) {
          // 例如 body 会匹配到 body
          // 例如 , html { 会匹配到 html，注意 /((?:[^\w\-.#]|^)(body|html|:root))/gm 中的 (?:[^\w\-.#]|^) 不会捕获
          return item.replace(rootSelectorRE, (m) => {
            // do not discard valid previous character, such as body,html or *:not(:root)
            const whitePrevChars = [',', '('];
            if (m && whitePrevChars.includes(m[0])) {
              return `${m[0]}${prefix}`;
            }
            return prefix;
          });
        }

        // 3.1.2 如果匹配到的字符不是 html、body、:root，则插入 div[data-qiankun="vue"]
        //       例如 a,b 会被替换成 div[data-qiankun="vue"] a,div[data-qiankun="vue"] b

        // 其中 p 是逗号或者换行符，是第一个捕获组，捕获 /(^|,\n?)([^,]+)/ 中的 ^|,\n?
        // 其中 s 是除了逗号之外的字符，是第二个捕获组，捕获 /(^|,\n?)([^,]+)/ 中的 [^,]+

        // 例如 , span { 中 p = , s = span {
        // s.replace(/^ */, '') 是为了将 s 中的空格压缩掉，例如 span { 会被替换成span{

        // 这里的本质是为了在每一个分组选择器前面插入 div[data-qiankun="vue"]
        return `${p}${prefix} ${s.replace(/^ */, '')}`;
      });
    });
    return cssText;
  }
  // handle case:
  // @media screen and (max-width: 300px) {}
  ruleMedia(rule, prefix) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@media ${rule.conditionText || rule.media.mediaText} {${css}}`;
  }
  // handle case:
  // @supports (display: grid) {}
  ruleSupport(rule, prefix) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@supports ${rule.conditionText || rule.cssText.split('{')[0]} {${css}}`;
  }
}
let processor;
export const QiankunCSSRewriteAttr = 'data-qiankun';
// 1. appWrapper: 携带了应用的标识、框架版本号、沙箱配置等信息的 div 元素
// 2. stylesheetElement: style 元素
// 3. appName: 应用名称
export const process = (appWrapper, stylesheetElement, appName) => {
  // lazy singleton pattern
  // 单例模式，只有在需要的时候才会创建 ScopedCSS 实例
  if (!processor) {
    processor = new ScopedCSS();
  }
  // 如果还有 link 外联样式标签，则警告提示
  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }
  // 如果 appWrapper 不存在，则直接返回
  const mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }
  // 获取标签名，例如 div
  const tag = (mountDOM.tagName || '').toLowerCase();
  if (tag && stylesheetElement.tagName === 'STYLE') {
    // prefix: 例如 div[data-qiankun="vue"]，表示 vue 应用
    const prefix = `${tag}[${QiankunCSSRewriteAttr}="${appName}"]`;
    processor.process(stylesheetElement, prefix);
  }
};
