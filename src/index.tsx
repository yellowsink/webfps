/* @refresh reload */
import {render} from "solid-js/web";

import Overlay from "./Overlay";
import {createEffect, createSignal} from "solid-js";

export default () => {
	const overlay = document.createElement("div");
	overlay.style.cssText = "position:fixed;left:0;top:0;z-index:9999;pointer-events:none";
	document.body.appendChild(overlay);

	const [cancelPerf, setCancelPerf] = createSignal(false);

	const unmount = render(
		() => <Overlay c={cancelPerf()} setC={setCancelPerf}/>,
		overlay
	);

	createEffect(() => {
		if (cancelPerf()) {
			unmount();
			overlay.remove();
		}
	});

	return () => {
		unmount();
		overlay.remove();
		setCancelPerf(true);
	};
};
