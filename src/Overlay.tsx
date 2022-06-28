import type { Component, Setter } from "solid-js";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import usePerf from "./usePerf";
import Chart from "./Chart";

const Overlay: Component<{
  c: boolean;
  setC: Setter<boolean>;
  p: [number, number];
  setP: Setter<[number, number]>;
}> = (props) => {
  const perf = usePerf(() => props.c);

  const [dragOffset, setDragOffset] = createSignal<
    [number, number] | undefined
  >();

  const mmHandler = (ev) => {
    if (dragOffset())
      props.setP([ev.clientX - dragOffset()[0], ev.clientY - dragOffset()[1]]);
  };

  onMount(() => window.addEventListener("mousemove", mmHandler));
  onCleanup(() => window.removeEventListener("mousemove", mmHandler));

  return (
    <div
      style={{
        background: "#000c",
        margin: ".5rem",
        padding: ".5rem",
        width: "max-content",
        color: "#fff",
        "font-family": "monospace",
        display: "grid",
        "grid-template-columns": "auto 1fr",
        gap: ".25rem",
        position: "relative",
      }}
    >
      <div style="position:absolute;top:5px;right:5px;display:flex;gap:.5rem;pointer-events:all">
        <div
          style={{
            width: "2rem",
            background:
              "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 2px 2px",
            cursor: dragOffset() ? "grabbing" : "grab",
          }}
          onmousedown={(ev) =>
            setDragOffset([ev.clientX - props.p[0], ev.clientY - props.p[1]])
          }
          onmouseup={() => setDragOffset()}
        />

        <button
          style="background:none;color:white;grid-column:1/3"
          onclick={() => props.setC(true)}
        >
          X
        </button>
      </div>

      <Show when={perf.sus()}>
        <div style="grid-column:1/3">
          Frame times are suspicious
          <br />
          If on Firefox, ensure privacy.resistFingerprinting is off
        </div>
      </Show>

      <span>FTime:</span>
      <span>{perf.time()?.toPrecision(4)}ms</span>
      <span>Current:</span>
      <span>{perf.fps()?.toPrecision(4)}fps</span>
      <span>Last 50 mean:</span>
      <span>{perf.mean()?.toPrecision(4)}fps</span>

      <div style="grid-column:1/3">
        Frame time graph:
        <Chart data={perf.raw()} />
      </div>
    </div>
  );
};
export default Overlay;
