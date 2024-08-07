/**
 * @author Saviio
 * @since 2020-4-19
 */

// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
enum RuleType {
  // type: rule will be rewrote
  STYLE = 1,
  MEDIA = 4,
  SUPPORTS = 12,

  // type: value will be kept
  IMPORT = 3,
  FONT_FACE = 5,
  PAGE = 6,
  KEYFRAMES = 7,
  KEYFRAME = 8,
}

const arrayify = <T>(list: CSSRuleList | any[]) => {
  return [].slice.call(list, 0) as T[];
};

const rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;

export class ScopedCSS {
  private static ModifiedTag = 'Symbol(style-modified-qiankun)';

  private sheet: StyleSheet;

  private swapNode: HTMLStyleElement;

  constructor() {
    // 创建一个 style 标签
    const styleNode = document.createElement('style');
    // 将 style 标签插入到 body 的底部
    rawDocumentBodyAppend.call(document.body, styleNode);
    // 缓存 style 标签
    this.swapNode = styleNode;
    // 获取 style 标签的 CSS 样式表
    // https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet
    this.sheet = styleNode.sheet!;
    // 初始化时禁用 style 样式，防止样式直接生效
    // 详见：https://developer.mozilla.org/zh-CN/docs/Web/API/StyleSheet/disabled
    this.sheet.disabled = true;
  }

  process(styleNode: HTMLStyleElement, prefix: string = '') {
    // 如果内联样式标签已经处理过，则直接返回
    if (ScopedCSS.ModifiedTag in styleNode) {
      return;
    }

    // 如果 style 标签的内容不为空，则进行 ScopedCSS 处理
    if (styleNode.textContent !== '') {
      // 根据 style 标签的内容生成一个文本节点
      const textNode = document.createTextNode(styleNode.textContent || '');
      // 将文本节点添加到 swapNode (构造函数中创建的 style 标签)中
      this.swapNode.appendChild(textNode);
      // 获取 swapNode 的 CSS 样式表
      // https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet
      const sheet = this.swapNode.sheet as any; // type is missing
      // 获取 swapNode 的 CSS 样式规则列表
      // cssRules: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/cssRules
      // CSSRuleList: https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRuleList

      // cssRules 是一个只读属性，返回一个包含样式表中所有规则的 CSSRuleList 类数组对象
      // 将 swapNode 的 CSS 样式规则列表（类数组对象）转换为数组
      const rules = arrayify<CSSRule>(sheet?.cssRules ?? []);
      // 对所有的 CSS 规则进行 ScopedCSS 处理，生成新的 CSS 样式
      const css = this.rewrite(rules, prefix);
      // eslint-disable-next-line no-param-reassign
      styleNode.textContent = css;

      // cleanup
      // 移除 swapNode 中的文本节点
      this.swapNode.removeChild(textNode);
      // 标记 style 标签已经被 ScopedCSS 处理过
      (styleNode as any)[ScopedCSS.ModifiedTag] = true;
      return;
    }

    // 如果 style 标签的内容为空，则监听 style 标签的变化
    const mutator = new MutationObserver((mutations) => {
      for (let i = 0; i < mutations.length; i += 1) {
        const mutation = mutations[i];
        // 如果 style 标签已经被 ScopedCSS 处理过，则直接返回
        if (ScopedCSS.ModifiedTag in styleNode) {
          return;
        }

        if (mutation.type === 'childList') {
          // 将 CSSRuleList 转换成 Array
          const sheet = styleNode.sheet as any;
          // 对样式进行 scope 处理
          const rules = arrayify<CSSRule>(sheet?.cssRules ?? []);
          const css = this.rewrite(rules, prefix);
          // 重新设置 style 标签的内容
          // eslint-disable-next-line no-param-reassign
          styleNode.textContent = css;
          // 标记 style 标签已经被 ScopedCSS 处理过
          // eslint-disable-next-line no-param-reassign
          (styleNode as any)[ScopedCSS.ModifiedTag] = true;
        }
      }
    });

    // since observer will be deleted when node be removed
    // we dont need create a cleanup function manually
    // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect
    mutator.observe(styleNode, { childList: true });
  }

  private rewrite(rules: CSSRule[], prefix: string = '') {
    let css = '';

    // CSSRule: https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRule
    rules.forEach((rule) => {
      // rule.type 包含了 CSS 规则的类型，例如：样式规则、媒体查询规则、支持规则、导入规则、字体规则等
      // interface CSSRule {
      //   const unsigned short STYLE_RULE = 1;
      //   const unsigned short CHARSET_RULE = 2;
      //   const unsigned short IMPORT_RULE = 3;
      //   const unsigned short MEDIA_RULE = 4;
      //   const unsigned short FONT_FACE_RULE = 5;
      //   const unsigned short PAGE_RULE = 6;
      //   const unsigned short KEYFRAMES_RULE = 7;
      //   const unsigned short KEYFRAME_RULE = 8;
      //   const unsigned short NAMESPACE_RULE = 10;
      //   const unsigned short COUNTER_STYLE_RULE = 11;
      //   const unsigned short SUPPORTS_RULE = 12;
      //   const unsigned short DOCUMENT_RULE = 13;
      //   const unsigned short FONT_FEATURE_VALUES_RULE = 14;
      //   const unsigned short VIEWPORT_RULE = 15;
      //   const unsigned short REGION_STYLE_RULE = 16;
      //   readonly attribute unsigned short type;
      //   attribute DOMString cssText;
      //   readonly attribute CSSRule? parentRule;
      //   readonly attribute CSSStyleSheet? parentStyleSheet;
      // };

      switch (rule.type) {
        // 如果是样式规则，则调用 ruleStyle 方法处理
        // 例如 .app-main {}
        case RuleType.STYLE:
          css += this.ruleStyle(rule as CSSStyleRule, prefix);
          break;
        // 如果是媒体查询规则，则调用 ruleMedia 方法处理
        // 例如 @media screen and (max-width: 300px) {}
        case RuleType.MEDIA:
          css += this.ruleMedia(rule as CSSMediaRule, prefix);
          break;
        // 如果是支持规则，则调用 ruleSupport 方法处理
        // 例如 @supports (display: grid) {}
        case RuleType.SUPPORTS:
          css += this.ruleSupport(rule as CSSSupportsRule, prefix);
          break;
        // 其他情况直接拼接 cssText
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

  // prefix 示例: div[data-qiankun="vue"]（Vue 微应用）
  private ruleStyle(rule: CSSStyleRule, prefix: string) {
    const rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
    const rootCombinationRE = /(html[^\w{[]+)/gm;

    // 例如样式 h1 { background-color: #f0f0f0; }
    // 获取样式选择器的文本内容，例如 h1
    const selector = rule.selectorText.trim();

    let cssText = '';
    if (typeof rule.cssText === 'string') {
      // 获取样式规则的文本内容，例如 h1 { background-color: #f0f0f0; }
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
      // body { margin: 4px; } 被替换成 div[data-name="vue"] { margin: 4px; }
      // body 样式是根样式，而在微应用中 body 对应的是 qiankun 的容器元素 div[data-name="vue"]
      // 因此需要将 body 样式替换成 div[data-name="vue"]
      return cssText.replace(rootSelectorRE, prefix);
    }

    // handle html body { ... }
    // handle html > body { ... }

    // 2. 匹配联合选择器，例如 html + body、html > body、html body，去除联合选择器中的 html、html > 等

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
    if (rootCombinationRE.test(rule.selectorText)) {
      // /(html[^\w{]+)(\+|~)/

      // 正则表达式可以分为以下几个部分：
      // 1. html: 匹配 html
      // 2. [^\w{]+: 匹配 html 后面的除了字母、数字、下划线、左大括号之外的字符
      // 3. (\+|~): 匹配 + 或者 ~

      // 匹配兄弟选择器，例如 html + body、html ~ body
      const siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm;

      // since html + body is a non-standard rule for html
      // transformer will ignore it
      if (!siblingSelectorRE.test(rule.selectorText)) {
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
    cssText = cssText.replace(/^[\s\S]+{/, (selectors) =>
      // selectors: a,span,p,div {
      // selectors: body {

      // 正则表达式 /(^|,\n?)([^,]+)/g 用于匹配以逗号分隔的选择器列表中的每个选择器。以下是详细解析：

      // (^|,\n?)：要么匹配字符串的开头，要么匹配逗号（逗号后可以携带换行符，换行符可选）。

      // ^：匹配字符串的开头。
      // |：表示逻辑“或”。
      // ,\n?：匹配逗号，逗号后可以有一个换行符（\n 是换行符，? 表示换行符是可选的）。

      // ([^,]+)：
      // [^,]：匹配除逗号之外的任何字符。
      // +：表示前面的字符可以出现一次或多次。
      // g：全局匹配标志，表示会匹配字符串中的所有符合条件的部分，而不仅仅是第一个。

      // 示例
      // 假设有以下 CSS 选择器字符串：

      // body,html,h1 { ... }
      // 正则表达式的匹配过程如下：

      // (^|,\n?) 会匹配字符串的开头或逗号（可选换行符）。
      // ([^,]+) 会匹配除逗号之外的字符。

      // 匹配结果：
      // body：匹配到的第一个选择器。
      // ,html：匹配到的第二个选择器（包括前面的逗号）。
      // ,h1：匹配到的第三个选择器（包括前面的逗号）。

      // replace 的第二个参数是一个函数，用于处理匹配到的字符串
      // item: 匹配到的字符串
      // p: 第一个捕获组
      // s: 第二个捕获组

      // 例如 body,html { 会匹配到 body 和 ,html {
      // 例如 h3[data-v-469af010] { 会匹配到 h3[data-v-469af010] {

      // 3.1 处理分组选择器，用 , 分割选择器
      selectors.replace(/(^|,\n?)([^,]+)/g, (item, p, s) => {
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
        //       例如 a,b 会被替换成 div[data-qiankun="vue"] a, div[data-qiankun="vue"] b
        // 这里的本质是为了在每一个选择器前面插入 div[data-qiankun="vue"]

        // replace root selector with prefix
        return `${p}${prefix} ${s.replace(/^ */, '')}`;
      }),
    );

    return cssText;
  }

  // handle case:
  // @media screen and (max-width: 300px) {}
  private ruleMedia(rule: CSSMediaRule, prefix: string) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@media ${rule.conditionText || rule.media.mediaText} {${css}}`;
  }

  // handle case:
  // @supports (display: grid) {}
  private ruleSupport(rule: CSSSupportsRule, prefix: string) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@supports ${rule.conditionText || rule.cssText.split('{')[0]} {${css}}`;
  }
}

let processor: ScopedCSS;

export const QiankunCSSRewriteAttr = 'data-qiankun';
export const process = (
  appWrapper: HTMLElement,
  stylesheetElement: HTMLStyleElement | HTMLLinkElement,
  appName: string,
): void => {
  // lazy singleton pattern
  // 单例模式，只有在第一次调用时才会创建 ScopedCSS 实例
  // 之后的调用都会复用这个实例
  if (!processor) {
    processor = new ScopedCSS();
  }

  // 如果还有 link 外联样式标签，则警告提示
  // 理论上此时已经没有 link 外联样式标签了，因为 import-html-entry 会将外联样式标签转换为内联样式标签
  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }

  // 如果没有 qiankun 容器元素，则直接返回
  // qiankun 容器元素：<div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
  const mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }

  // 获取 qiankun 容器的 tag 名称, 例如：div
  const tag = (mountDOM.tagName || '').toLowerCase();

  // 只有 style 标签对应的内联样式才会被处理
  if (tag && stylesheetElement.tagName === 'STYLE') {
    // 生成样式前缀, 例如：div[data-qiankun="vue"]
    // 用于匹配 qiankun 的容器元素 <div id="__qiankun_microapp_wrapper_for_vue__" data-name="vue" data-version="2.10.16" data-sandbox-cfg=false>
    const prefix = `${tag}[${QiankunCSSRewriteAttr}="${appName}"]`;
    // 处理内联样式
    processor.process(stylesheetElement, prefix);
  }
};
