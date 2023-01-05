import React, { useEffect } from "react";
const { mount, unmount } = require('vue-micro-app')

function VueApp() {
  useEffect(() => {
    mount();
    return () => {
      unmount();
    };
  }, []);
  return <div id="vue-app" style={{ textAlign: "center" }}></div>;
}

export default VueApp;
