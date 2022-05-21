import { Show } from "solid-js";
import usePerf from "./usePerf";
import Chart from "./Chart";
const Overlay = (props) => {
    const perf = usePerf(() => props.c);
    return (<Show when={!props.c}>
      <div style={{
            background: "#000c",
            margin: ".5rem",
            padding: ".5rem",
            width: "max-content",
            color: "#fff",
            "font-family": "monospace",
        }}>
        <Show when={perf.sus()}>
          Frame times are suspicious
          <br />
          If on Firefox, ensure privacy.resistFingerprinting is off
          <br />
          <br />
        </Show>
        FTime: {perf.time()?.toPrecision(4)}ms
        <br />
        Current: {perf.fps()?.toPrecision(4)}fps
        <br />
        Last 50 mean: {perf.mean()?.toPrecision(4)}fps
        <br />
        <button style="background:none;border:1px solid white;color:white" onclick={() => props.setC(true)}>
          Stop monitoring
        </button>
        <br />
        Frame time graph:
        <br />
        <Chart data={perf.raw()}/>
      </div>
    </Show>);
};
export default Overlay;
