/* @refresh reload */
import { render } from "dom-expressions/src/client";

import Overlay from "./Overlay";
import usePerf from "./usePerf";

export default () => {
  const shadowHost = (<div />) as HTMLDivElement;
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  document.body.appendChild(shadowHost);

  const pos: [number, number] = [0, 0];

  const overlay = (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        "z-index": 9999,
        "pointer-events": "none"
      }}
    />
  ) as HTMLDivElement;
  shadowRoot.appendChild(overlay);

  let cancelOlay;
  let cancelPerf;
  const causeCancel = () => {
    unmount();
    shadowHost.remove();
    cancelOlay?.();
    cancelPerf?.();
  };

  const unmount = render(
    () => {
      const [onCancel, onData, elem] = Overlay(causeCancel, pos, ([x, y]) => {
        pos[0] = x;
        pos[1] = y;
        overlay.style.left = x + "px";
        overlay.style.top = y + "px";
      });
      cancelOlay = onCancel;

      cancelPerf = usePerf(onData);

      return elem;
    },
    overlay
  );

  return causeCancel;
};
