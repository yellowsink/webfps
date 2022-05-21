import { createEffect, createSignal } from "solid-js";
const mean50 = (values) => values.length === 0
    ? undefined
    : values.slice(-50).reduce((p, c) => p + c) / Math.min(values.length, 50);
function pad(values, minLen) {
    while (values.length < minLen)
        values.unshift(undefined);
    return values;
}
const msToFps = (val) => 1 / (val / 1000);
export default (cancel) => {
    const [frameTimes, setFrameTimes] = createSignal([]);
    const lastFTime = () => frameTimes()[frameTimes().length - 1];
    let lastTimestamp = performance.now();
    const tick = (stamp) => {
        const diff = stamp - lastTimestamp;
        const times = frameTimes();
        times.push(diff);
        setFrameTimes(times.slice(-100));
        lastTimestamp = stamp;
        if (!cancel())
            requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // frames are suspicious if any times are 0
    const [isSus, setIsSus] = createSignal(false);
    createEffect(() => setIsSus(frameTimes().some((v) => v === 0)));
    return {
        time: lastFTime,
        fps: () => msToFps(lastFTime()),
        mean: () => mean50(frameTimes().map(msToFps)),
        raw: () => pad(frameTimes(), 100),
        sus: isSus,
    };
};
