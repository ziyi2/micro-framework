import { mount, unmount } from "vue-micro-app";
import React, { useEffect } from "react";

function VueApp() {
  useEffect(() => {
    mount();
    return () => {
      unmount();
    };
  }, [mount]);
  return <div id="vue-app" style={{ textAlign: "center" }}></div>;
}

export default VueApp;
