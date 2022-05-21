import { createEffect } from "solid-js";
const height = 100;
const width = 200;
const max = (vals) => vals.reduce((p, c) => Math.max(p ?? 0, c ?? 0));
const min = (vals) => vals.reduce((p, c) => Math.min(p ?? 0, c ?? 0));
const Chart = (props) => {
    let canvas;
    createEffect(() => {
        const data = props.data;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 200, 100);
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const ceil = min(data);
            const floor = max(data) - ceil;
            const multiplier = (data[i] - ceil) / floor;
            const pointHeight = (1 - multiplier) * height;
            const pointWidth = (width / data.length) * i;
            ctx.lineTo(pointWidth, pointHeight);
        }
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.moveTo(0, 0);
        ctx.strokeText(max(data).toFixed(2) + "ms", 0, 10);
        ctx.strokeText(min(data).toFixed(2) + "ms", 0, height);
    });
    return <canvas ref={canvas} width={width} height={height}/>;
};
export default Chart;
