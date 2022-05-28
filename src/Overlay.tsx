import type {Component} from "solid-js";
import {Show} from "solid-js";
import usePerf from "./usePerf";
import Chart from "./Chart";

const Overlay: Component<{ c: boolean; setC: (b: boolean) => void }> = (
	props
) => {
	const perf = usePerf(() => props.c);

	return (
		<Show when={!props.c}>
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
					gap: ".25rem"
				}}
			>
				<Show when={perf.sus()}>
					<div style="grid-column:1/3">
						Frame times are suspicious
						<br/>
						If on Firefox, ensure privacy.resistFingerprinting is off
					</div>
				</Show>
				<span>FTime:</span>
				<span>{perf.time()?.toPrecision(4)}ms</span>
				<span>Current:</span>
				<span>{perf.fps()?.toPrecision(4)}fps</span>
				<span>Last 50 mean:</span>
				<span>{perf.mean()?.toPrecision(4)}fps</span>
				<button
					style="background:none;border:1px solid white;color:white;grid-column:1/3"
					onclick={() => props.setC(true)}
				>
					Stop monitoring
				</button>
				<div style="grid-column:1/3">
					Frame time graph:
					<Chart data={perf.raw()}/>
				</div>
			</div>
		</Show>
	);
};
export default Overlay;
