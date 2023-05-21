export type Sig<T> = (newVal?: T) => T;

let effectStack: (() => void)[] = [];

export function sig<T>(val?: T): Sig<T> {
  const subs = new Set<() => void>();

  return (...nv: [T]) => {
    if (nv.length) {
      val = nv[0];
      subs.forEach((e) => e());
    } else if (effectStack.length) {
      subs.add(effectStack[effectStack.length - 1]);
    }
    return val;
  };
}

export function effect(cb: () => void) {
  let cancel = false;
  const run = () => {
    if (cancel) return;
    effectStack.push(run);
    cb();
    effectStack.pop();
  };
  run();

  return () => {
    cancel = true;
  };
}

export function computed<T>(cb: () => T) {
  const val = sig<T>(null);
  effect(() => val(cb()));
  return () => val();
}
