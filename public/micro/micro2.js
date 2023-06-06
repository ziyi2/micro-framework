let root = document.createElement("h1");
root.textContent = "微应用2";
root.id = 'micro2-dom';
root.onclick = () => {
  console.log("微应用2 的 window.a: ", window.a);
};
document.body.appendChild(root);

window.a = 2;