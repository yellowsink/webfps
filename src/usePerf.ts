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

const msToFps = (val: undefined | number) => !val ? 0 : 1 / (val / 1000);

export default (receiver: (p: Perf) => void) => {
  const frameTimes: number[] = [];

  const lastFTime = () => frameTimes[frameTimes.length - 1];

  let lastTimestamp = performance.now();
  let isCancelled = false;
  const tick = (stamp: DOMHighResTimeStamp) => {
    const diff = stamp - lastTimestamp;

    if (frameTimes.length === 100) frameTimes.shift();
    frameTimes.push(diff);

    lastTimestamp = stamp;

    receiver({
      time: lastFTime(),
      fps: msToFps(lastFTime()),
      mean: msToFps(mean50(frameTimes)),
      raw: pad(frameTimes, 100),
      sus: frameTimes.some(v => v === 0),
    });

    if (!isCancelled) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);


  return () => {
    isCancelled = true;
  };
};
