import { Perf } from "./usePerf";
import Chart from "./Chart";
import { attrs, effect, ev, html, sig, Sig } from "./iota";

export default (
  cancelSig: Sig<boolean>,
  pos: Sig<[number, number]>,
  stats: () => Perf
) => {
  const dragOffset = sig<[number, number]>();

  const mmHandler = (ev) =>
    dragOffset() &&
    pos([ev.clientX - dragOffset()[0], ev.clientY - dragOffset()[1]]);

  window.addEventListener("mousemove", mmHandler);

  effect(() => {
    if (cancelSig()) window.removeEventListener("mousemove", mmHandler);
  });

  return html<HTMLDivElement>`<div
    style="background: #000c; color: #fff; font-family: monospace;
        margin: .5rem; padding: .5rem; width: max-content; gap: .25rem .5rem;
        display: grid; grid-template-columns: auto 1fr; position: relative
        "
  >
    <div
      style="position:absolute;top:5px;right:5px;display:flex;gap:.5rem;pointer-events:all"
    >
      ${attrs(
        ev(
          html`<div />`,
          "mousedown",
          (ev: MouseEvent) =>
            dragOffset([ev.clientX - pos()[0], ev.clientY - pos()[1]]),
          "mouseup",
          () => dragOffset(null)
        ),
        "style",
        () =>
          "width: 1.5rem; background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 2px 2px; cursor: grab" +
          (dragOffset() ? "bing" : "")
      )}
      ${ev(
        html`<button style="background:none;color:white;border:none">
          X
        </button>`,
        "click",
        () => cancelSig(true)
      )}
    </div>

    ${() =>
      stats().sus
        ? html`<div style="grid-column:1/3">
            Frame times are suspicious
            <br />
            If on Firefox, ensure privacy.resistFingerprinting is off
          </div>`
        : null}

    <span>FTime:</span>
    <span>${() => stats().time.toPrecision(4)}ms</span>
    <span>Current:</span>
    <span>${() => stats().fps.toPrecision(4)}fps</span>
    <span>Last 50 mean:</span>
    <span>${() => stats().mean.toPrecision(4)}fps</span>

    <div style="grid-column:1/3">Frame time graph: ${Chart(stats)}</div>
  </div>`;
};
