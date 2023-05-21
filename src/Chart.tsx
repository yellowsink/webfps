import { html } from "./iota";

const calcMax = (vals: number[]) =>
  vals.reduce((p, c) => Math.max(p ?? 0, c ?? 0));
const calcMin = (vals: number[]) =>
  vals.reduce((p, c) => Math.min(p ?? 0, c ?? 0));

export default () => {
  let canvas: HTMLCanvasElement;

  let minSpan: HTMLSpanElement;
  let maxSpan: HTMLSpanElement;

  const update = (data: number[]) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 100);
    ctx.beginPath();

    const dataMin = calcMin(data);
    const dataMax = calcMax(data);
    for (let i = 0; i < data.length; i++) {
      const ceil = dataMin;
      const floor = dataMax - dataMin;

      const multiplier = (data[i] - ceil) / floor;
      const pointHeight = (1 - multiplier) * 100;

      const pointWidth = (200 / data.length) * i;
      ctx.lineTo(pointWidth, pointHeight);
    }
    ctx.strokeStyle = "white";
    ctx.stroke();

    minSpan.innerText = dataMin.toFixed(2);
    maxSpan.innerText = dataMax.toFixed(2);
  };

  return [
    update,
    html<HTMLDivElement>`<div style="display:grid;justify-items:right">
      <span>${(maxSpan = html`<span />`)}ms</span>
      <span style="align-self:end">
        ${(minSpan = html`<span />`)}ms
      </span>

      ${(canvas = html` <canvas
        style="grid-area:1/2/3/3"
        width="200"
        height="100"
      />`)}
    </div>`,
  ] as const;
};
