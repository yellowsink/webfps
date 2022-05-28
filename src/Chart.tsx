import { Component, createEffect, createSignal } from "solid-js";

const height = 100;
const width = 200;

const calcMax = (vals: number[]) =>
  vals.reduce((p, c) => Math.max(p ?? 0, c ?? 0));
const calcMin = (vals: number[]) =>
  vals.reduce((p, c) => Math.min(p ?? 0, c ?? 0));

const Chart: Component<{ data: number[] }> = (props) => {
  let canvas: HTMLCanvasElement;

  const [min, setMin] = createSignal(0);
  const [max, setMax] = createSignal(0);

  createEffect(() => {
    const data = props.data;

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
    ctx.strokeStyle = "red";
    ctx.stroke();

    setMin(dataMin);
    setMax(dataMax);
  });

  return (
    <div style="display:grid;justify-items:right">
      {max().toFixed(2)}
      <span style="align-self:end">{min().toFixed(2)}</span>
      <canvas
        style="grid-area:1/2/3/3"
        ref={canvas}
        width={width}
        height={height}
      />
    </div>
  );
};

export default Chart;
