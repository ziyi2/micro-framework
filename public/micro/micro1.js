
let root = document.createElement("h1");
root.textContent = "微应用1";
root.id = 'micro1-dom';
root.onclick = () => {
  console.log("微应用1: ", window.a);
};
document.body.appendChild(root);

window.a = 1;