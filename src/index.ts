import Overlay from "./Overlay";
import usePerf from "./usePerf";
import { effect, html, sig } from "@uwu/iota";

export default () => {
  const shadowHost = html<HTMLDivElement>`<div />`;
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  document.body.append(shadowHost);

  const pos = sig<[number, number]>([0, 0]);
  const cancelSig = sig(false);
  const perfSig = usePerf(cancelSig);

  const overlay: HTMLDivElement = html`<div
    style="position: fixed; left: 0; top: 0; z-index: 9999; pointer-events: none"
  >
    ${Overlay(cancelSig, pos, perfSig)}
  </div>`;

  shadowRoot.append(overlay);

  effect(() => {
    overlay.style.left = pos()[0] + "px";
    overlay.style.top = pos()[1] + "px";
  });

  effect(() => cancelSig() && shadowHost.remove());

  return () => {
    cancelSig(true);
  };
};
