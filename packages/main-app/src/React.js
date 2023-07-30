const { mount, unmount } = require("react-micro-app");
import React, { useEffect } from "react";

const containerId = 'react-app';

function ReactApp() {
  useEffect(() => {
    mount(containerId);
    return () => {
      unmount();
    };
  }, []);
  return <div id={containerId}></div>;
}

export default React.memo(ReactApp);
