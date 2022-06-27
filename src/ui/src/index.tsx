/* @refresh reload */

/// <reference types="chrome" />

import { render } from "solid-js/web";
import { createMutable, createStore } from "solid-js/store";

import Overlay from "./Overlay";

import "./index.module.css";

const [data, setData] = createStore<{
	time: number;
	fps: number;
	mean: number;
	raw: number[];
	sus: boolean;
}>({
	time: 0,
	fps: 0,
	mean: 0,
	raw: [],
	sus: false,
});

chrome.devtools.panels.create(
	"WebFPS",
	null,
	"/dist/index.html",
	function (panel) {
		const tabID = chrome.devtools.inspectedWindow.tabId;

		chrome.runtime.onMessage.addListener(function (
			request,
			sender,
			sendResponse
		) {
			if (sender.tab.id === tabID && request.source === "webfps") {
				setData(request.data);
			}
		});
	}
);

const unmount = render(
	() => <Overlay {...data} />,

	document.getElementById("root") as HTMLElement
);

// createEffect(() => {
// 	if (cancelPerf()) {
// 		unmount();
// 		overlay.remove();
// 	}
// });
