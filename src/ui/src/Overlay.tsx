import type { Component } from "solid-js";
import { Show } from "solid-js";
import usePerf from "./usePerf";
import Chart from "./Chart";

const Overlay: Component<{
	time: number;
	fps: number;
	mean: number;
	raw: readonly number[];
	sus: boolean;
}> = (props) => {
	return (
		<div
			style={{
				background: "#000c",
				padding: ".5rem",
				width: "100vw",
				height: "100vh",
				color: "#fff",
				"font-family": "monospace",
				display: "grid",
				"grid-template-columns": "auto 1fr",
				gap: ".25rem",
			}}
		>
			<Show when={props.sus}>
				<div style={{ "grid-column": "1/3" }}>
					Frame times are suspicious.
					<br />
					If on Firefox, ensure privacy.resistFingerprinting is off.
				</div>
			</Show>
			<span>Frame Time:</span>
			<span>{props.time?.toPrecision(4)}ms</span>
			<span>Current:</span>
			<span>{props.fps?.toPrecision(4)} FPS</span>
			<span>Last 100 mean:</span>
			<span>{props.mean?.toPrecision(4)} FPS</span>
			<div style={{ "grid-column": "1/3" }}>
				Frame time graph:
				<Chart data={props.raw} />
			</div>
		</div>
	);
};
export default Overlay;
