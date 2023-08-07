let root;
// 以下其实可以是 React 框架或者 Vue 框架生成的 Document 元素，这里只是做一个简单的示例
root = document.createElement("h1");
root.textContent = "微应用1";
// 约定往空的 iframe 的 body 下挂载微应用
document.body.appendChild(root);

// iframe src: about:blank
// src 属性：嵌入一个遵从同源策略的空白页：https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe
// 源的继承：在页面中通过 about:blank 或 javascript: URL 执行的脚本会继承打开该 URL 的文档的源，因为这些类型的 URL 没有包含源服务器的相关信息：https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy#%E6%BA%90%E7%9A%84%E7%BB%A7%E6%89%BF
console.log(window.document.domain === window.parent.document.domain); // true

// 可以请求主应用服务所在的接口
// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("POST", "/microapps");
// oReq.send();
// function reqListener() {
//   console.log(this.responseText);
// }

console.log(window.location);

window.history.pushState({ key: "hello" }, "", "/test");
