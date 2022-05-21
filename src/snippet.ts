// @ts-nocheck
import WebFps from ".";

window.webfps = () => {
  window.stopwebfps?.();
  window.stopwebfps = WebFps();
};
webfps();
