// used by dom-expressions
// this is all stubs, no reactivity

export function root<T>(fn: (dispose: () => void) => T) {
	return fn(() => {});
}

export function effect<T>(fn: (prev?: T) => T, current?: T) {
	current = fn(current);
}

export const memo = null;
export const getOwner = null;
export const createComponent = null;
export const sharedConfig = {};
export const mergeProps = null;

export function untrack<T>(fn: () => T) {
	return fn();
}