const mean = (amount, values) =>
	values.length === 0
		? undefined
		: values.slice(-amount).reduce((p, c) => p + c) /
		  Math.min(values.length, amount);

function pad(values, minLen) {
	while (values.length < minLen) values.unshift(undefined);
	return values;
}

const msToFps = (val) => 1 / (val / 1000);

let stop = false;
let isSus = false;
const frameTimes = [];

const lastFrameTime = () => frameTimes[frameTimes.length - 1];

let lastTimestamp = performance.now();
function eventLoop(timestamp) {
	const diff = timestamp - lastTimestamp;

	frameTimes.push(diff);
	if (frameTimes.length > 1000) frameTimes.shift();

	lastTimestamp = timestamp;

	isSus = frameTimes.some((v) => v === 0);

	setTimeout(() => sendData(), 0);

	requestAnimationFrame(eventLoop);
}
requestAnimationFrame(eventLoop);

function sendData() {
	chrome.runtime.sendMessage({
		source: "webfps",
		data: {
			time: lastFrameTime,
			fps: msToFps(lastFrameTime()),
			mean: mean(100, frameTimes.map(msToFps)),
			raw: pad(frameTimes, 1000),
			sus: isSus,
		},
	});
}
