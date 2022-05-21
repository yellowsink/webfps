/* @refresh reload */
import { render } from "solid-js/web";
import Overlay from "./Overlay";
import { createSignal } from "solid-js";
export default () => {
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:absolute;left:0;top:0;z-index:999";
    document.body.appendChild(overlay);
    const [cancelPerf, setCancelPerf] = createSignal(false);
    const unmount = render(() => <Overlay c={cancelPerf()} setC={setCancelPerf}/>, overlay);
    return () => {
        unmount();
        setCancelPerf(true);
    };
};
