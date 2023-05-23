import { attrs, effect, html, sig, Sig } from "@uwu/iota";
import { Perf } from "./usePerf";

const WIDTH = 200,
  HEIGHT = 100;

const calcMax = (vals: number[]) =>
  vals.reduce((p, c) => Math.max(p ?? 0, c ?? 0));
const calcMin = (vals: number[]) =>
  vals.reduce((p, c) => Math.min(p ?? 0, c ?? 0));

export default (perf: Sig<Perf>) => {
  let canvas: HTMLCanvasElement;

  const minSig = sig(0);
  const maxSig = sig(0);

  effect(() => {
    const data = perf().raw;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 200, 100);
    ctx.beginPath();

    const dataMin = calcMin(data);
    const dataMax = calcMax(data);
    for (let i = 0; i < data.length; i++) {
      const ceil = dataMin;
      const floor = dataMax - dataMin;

      const multiplier = (data[i] - ceil) / floor;
      const pointHeight = (1 - multiplier) * HEIGHT;

      const pointWidth = (WIDTH / data.length) * i;
      ctx.lineTo(pointWidth, pointHeight);
    }
    ctx.strokeStyle = "white";
    ctx.stroke();

    minSig(dataMin);
    maxSig(dataMax);
  });

  return html<HTMLDivElement>`<div style="display:grid;justify-items:right">
    ${() => maxSig().toFixed(2)}ms
    <span style="align-self:end"> ${() => minSig().toFixed(2)}ms </span>

    ${(canvas = attrs(
      html`<canvas style="grid-area:1/2/3/3 " />`,
      "width",
      WIDTH,
      "height",
      HEIGHT
    ))}
  </div>`;
};
