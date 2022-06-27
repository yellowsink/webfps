import type { Accessor } from "solid-js";
import { createEffect, createSignal } from "solid-js";

export interface Perf {
	/** Last frame time */
	time: Accessor<number>;
	/** Last FPS */
	fps: Accessor<number>;
	/** Mean Last 50 FPS */
	mean: (amount: number) => number;
	/** Raw last 100 frame times */
	raw: Accessor<number[]>;
	/** Are frames suspicious */
	sus: Accessor<boolean>;
}

const mean = (amount: number, values: number[]) =>
	values.length === 0
		? undefined
		: values.slice(-amount).reduce((p, c) => p + c) /
		  Math.min(values.length, amount);

function pad<T>(values: (T | undefined)[], minLen: number) {
	while (values.length < minLen) values.unshift(undefined);
	return values;
}

const msToFps = (val: number) => 1 / (val / 1000);

export default (cancel: Accessor<boolean>): Perf => {
	const [frameTimes, setFrameTimes] = createSignal([] as number[]);

	const lastFrameTime = () => frameTimes()[frameTimes().length - 1];

	let lastTimestamp = performance.now();
	const tick = (stamp: DOMHighResTimeStamp) => {
		const diff = stamp - lastTimestamp;

		const times = frameTimes();
		times.push(diff);
		setFrameTimes(times.slice(-100));

		lastTimestamp = stamp;

		if (!cancel()) requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);

	// frames are suspicious if any times are 0
	const [isSus, setIsSus] = createSignal(false);
	createEffect(() => setIsSus(frameTimes().some((v) => v === 0)));

	return {
		time: lastFrameTime,
		fps: () => msToFps(lastFrameTime()),
		mean: (amount: number) => mean(amount, frameTimes().map(msToFps)),
		raw: () => pad(frameTimes(), 100),
		sus: isSus,
	};
};
