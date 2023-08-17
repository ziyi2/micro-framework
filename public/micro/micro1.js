this.a = 'a';
console.log('微应用1 a: ', a);

var b = 'b';
console.log('微应用1 b: ', window.b);

window.c = 'c';
console.log('微应用1 c: ', window.c);

let root = document.createElement("button");
root.textContent = "微应用 1 更改 history 为 micro1";
document.body.appendChild(root);

root.onclick = () => {
  history.pushState({}, '', '/micro1');
}