import {Perf} from "./usePerf";
import Chart from "./Chart";
import {ev, html} from "./iota";

export default (causeCancel: () => void, pos: [number, number], setPos: (v: [number, number]) => void) => {
  let dragAreaDiv: HTMLDivElement;
  let timeSpan: HTMLSpanElement;
  let fpsSpan: HTMLSpanElement;
  let meanSpan: HTMLSpanElement;
  let susDiv: HTMLDivElement;

  let dragOffset: [number, number];

  const mmHandler = (ev) => {
    if (dragOffset) {
      setPos([ev.clientX - dragOffset[0], ev.clientY - dragOffset[1]]);
    }
  };

  window.addEventListener("mousemove", mmHandler);

  const onCancel = () => {
    window.removeEventListener("mousemove", mmHandler)
  }

  const [updateChart, chart] = Chart();

  const onData = (data: Perf) => {
    updateChart(data.raw);
    timeSpan.textContent = data.time.toPrecision(4);
    fpsSpan.textContent = data.fps.toPrecision(4);
    meanSpan.textContent = data.mean.toPrecision(4);
    susDiv.style.display = data.sus ? "" : "none";
  }

  return [
    onCancel,
    onData,
    (
      html`
    <div style="background: #000c; color: #fff; font-family: monospace;
        margin: .5rem; padding: .5rem; width: max-content; gap: .25rem .5rem;
        display: grid; grid-template-columns: auto 1fr; position: relative
        ">
      <div style="position:absolute;top:5px;right:5px;display:flex;gap:.5rem;pointer-events:all">
        <div
          ref={dragAreaDiv}
          style={{
            width: "1.5rem",
            background:
              "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 2px 2px",
            cursor: "grab",
          }}
          onmousedown={(ev) => {
            dragOffset = [ev.clientX - pos[0], ev.clientY - pos[1]];
            dragAreaDiv.style.cursor = "grabbing";
          }}
          onmouseup={() => {
            dragOffset = undefined;
            dragAreaDiv.style.cursor = "grab";
          }}
        />

        ${ev(
          html`<button style="background:none;color:white;border:none">X</button>`, 
          "onclick",
          causeCancel)
        }
      </div>

      <div ref={susDiv} style="display:none;grid-column:1/3">
        Frame times are suspicious
        <br />
        If on Firefox, ensure privacy.resistFingerprinting is off
      </div>

      <span>FTime:</span>
      <span><span ref={timeSpan} />ms</span>
      <span>Current:</span>
      <span><span ref={fpsSpan} />fps</span>
      <span>Last 50 mean:</span>
      <span><span ref={meanSpan} />fps</span>

      <div style="grid-column:1/3">
        Frame time graph:
        {chart}
      </div>
    </div>`[0] as HTMLDivElement
  )] as const;
};