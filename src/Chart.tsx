const height = 100;
const width = 200;

const calcMax = (vals: number[]) =>
  vals.reduce((p, c) => Math.max(p ?? 0, c ?? 0));
const calcMin = (vals: number[]) =>
  vals.reduce((p, c) => Math.min(p ?? 0, c ?? 0));

export default () => {
  let canvas: HTMLCanvasElement;

  let minSpan: HTMLSpanElement;
  let maxSpan: HTMLSpanElement;

  const update = ((data: number[]) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 100);
    ctx.beginPath();

    const dataMin = calcMin(data);
    const dataMax = calcMax(data);
    for (let i = 0; i < data.length; i++) {
      const ceil = dataMin;
      const floor = dataMax - dataMin;

      const multiplier = (data[i] - ceil) / floor;
      const pointHeight = (1 - multiplier) * height;

      const pointWidth = (width / data.length) * i;
      ctx.lineTo(pointWidth, pointHeight);
    }
    ctx.strokeStyle = "white";
    ctx.stroke();

    minSpan.innerText = dataMin.toFixed(2);
    maxSpan.innerText = dataMax.toFixed(2);
  });

  // noinspection JSUnusedAssignment - the ref={canvas}
  return [update, (
    <div style="display:grid;justify-items:right">
      <span><span ref={maxSpan} />ms</span>
      <span style="align-self:end"><span ref={minSpan} />ms</span>
      <canvas
        style="grid-area:1/2/3/3"
        ref={canvas}
        width={width}
        height={height}
      />
    </div> as HTMLDivElement
  )] as const;
};