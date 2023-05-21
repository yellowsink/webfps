import { Sig, sig } from "./iota";

export interface Perf {
  /** Last frame time */
  time: number;
  /** Last FPS */
  fps: number;
  /** Mean Last 50 FPS */
  mean: number;
  /** Raw last 100 frame times */
  raw: number[];
  /** Are frames suspicious */
  sus: boolean;
}

const mean50 = (values: number[]) =>
  values.length === 0
    ? undefined
    : values.slice(-50).reduce((p, c) => p + c) / Math.min(values.length, 50);

function pad<T>(values: (T | undefined)[], minLen: number) {
  while (values.length < minLen) values.unshift(undefined);
  return values;
}

const msToFps = (val: undefined | number) => (!val ? 0 : 1 / (val / 1000));

export default (cancelSig: Sig<boolean>) => {
  const frameTimes: number[] = [];

  const stats = sig<Perf>({
    time: 0,
    fps: 0,
    mean: 0,
    raw: pad([], 100),
    sus: false,
  });

  let lastTimestamp = performance.now();
  const tick = () => {
    const stamp = performance.now();
    if (frameTimes.length === 100) frameTimes.shift();
    frameTimes.push(stamp - lastTimestamp);

    lastTimestamp = stamp;

    stats({
      time: frameTimes[frameTimes.length - 1],
      fps: msToFps(frameTimes[frameTimes.length - 1]),
      mean: msToFps(mean50(frameTimes)),
      raw: pad(frameTimes, 100),
      sus: frameTimes.some((v) => v === 0),
    });

    if (!cancelSig()) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  return () => stats();
};
