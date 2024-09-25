import { useEffect } from "react";
import "./react-micro.css";

function App() {
  // 测试动态添加样式
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      h1 {
        outline: 10px solid yellow;
      }
    `;
    document.head.appendChild(style);

    // 测试移除样式
    // setTimeout(() => {
    //   document.head.removeChild(style);
    // }, 1000);
  }, []);

  // 测试动态添加 link 标签
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.bootcdn.net/ajax/libs/antd/4.16.13/antd.min.css";
    document.head.appendChild(link);

    // 测试移除样式
    // setTimeout(() => {
    //   document.head.removeChild(link);
    // }, 1000);
  }, []);

  return (
    <div className="container">
      <h1 className="h1">Hello, React Micro App</h1>
    </div>
  );
}

export default App;
