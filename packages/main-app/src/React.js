const { mount, unmount } = require("react-micro-app");
import React, { useEffect } from "react";

function ReactApp() {
  useEffect(() => {
    mount();
    return () => {
      unmount();
    };
  }, []);
  return <div id="react-app"></div>;
}

export default React.memo(ReactApp);
