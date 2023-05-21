import Overlay from "./Overlay";
import usePerf from "./usePerf";
import { html } from "./iota";

export default () => {
  const shadowHost = (<div />) as HTMLDivElement;
  const shadowRoot = shadowHost.attachShadow({ mode: "open" });
  document.body.append(shadowHost);

  const pos: [number, number] = [0, 0];

  const overlay: HTMLDivElement =
    html`<div style="position: fixed; left: 0; top: 0; z-index: 9999; pointer-events: none" />`;

  shadowRoot.append(overlay);

  let cancelOlay;
  let cancelPerf;
  const causeCancel = () => {
    shadowHost.remove();
    cancelOlay?.();
    cancelPerf?.();
  };

  const [onCancel, onData, elem] = Overlay(causeCancel, pos, ([x, y]) => {
    pos[0] = x;
    pos[1] = y;
    overlay.style.left = x + "px";
    overlay.style.top = y + "px";
  });
  cancelOlay = onCancel;

  cancelPerf = usePerf(onData);

  overlay.append(elem);

  return causeCancel;
};
