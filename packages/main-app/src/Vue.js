import React, { useEffect } from "react";
const { mount, unmount } = require('vue-micro-app')

const containerId = 'react-app';

function VueApp() {
  useEffect(() => {
    mount(containerId);
    return () => {
      unmount();
    };
  }, []);
  return <div id={containerId} style={{ textAlign: "center" }}></div>;
}

export default VueApp;
