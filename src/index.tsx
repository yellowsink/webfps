/* @refresh reload */
import { render } from "dom-expressions/src/client";

import Overlay from "./Overlay";
import { createEffect, createSignal } from "solid-js";

export default () => {
  const shadowHost = (<div />) as HTMLDivElement;
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  document.body.appendChild(shadowHost);

  const [pos, setPos] = createSignal<[number, number]>([0, 0]);

  const overlay = (
    <div
      style={{
        position: "fixed",
        left: pos()[0] + "px",
        top: pos()[1] + "px",
        "z-index": 9999,
        "pointer-events": "none"
      }}
    />
  ) as HTMLDivElement;
  shadowRoot.appendChild(overlay);

  const [cancelPerf, setCancelPerf] = createSignal(false);

  const unmount = render(
    () => (
      <Overlay c={cancelPerf()} setC={setCancelPerf} p={pos()} setP={setPos} />
    ),
    overlay
  );

  createEffect(() => {
    if (cancelPerf()) {
      unmount();
      shadowHost.remove();
    }
  });

  return () => setCancelPerf(true);
};
