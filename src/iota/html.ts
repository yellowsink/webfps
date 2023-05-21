import { effect } from "./sig";

type IndividualTemplateValue = Node | string | number | undefined;
type StaticTemplateValue = IndividualTemplateValue | IndividualTemplateValue[];
type ReactiveTemplateValue = StaticTemplateValue | (() => StaticTemplateValue);

export function html<T extends Node = ChildNode>(strings: TemplateStringsArray, ...values: ReactiveTemplateValue[]) {
	//debugger;
	const root = document.createElement("_");

	const idVals = values.map(v => ["a" + Math.random(), v] as const);

	let str = "";
	let si = 0, vi = 0;
	while (si < strings.length || vi < idVals.length) {
		if (si < strings.length) str += strings[si++];
		if (vi < idVals.length) str += `<${idVals[vi++][0]} />`;
	}

	// parse tree
	root.innerHTML = str;
	const tree = root.firstElementChild;
	///const trees = [...root.children];
	//for (const tree of trees) {
  for (const [id, val] of idVals) {
    const [el] = tree.getElementsByTagName(id);
    if (el) {
      let prev: Node[] = [tree];
      const react = () => {
        let last: Node;
        while (prev.length) {
          last?.parentNode.removeChild(last);
          last = prev.shift();
        }

        const unwrapped = typeof val === "function" ? val() : val;
        const nodes = Array.isArray(unwrapped) ? unwrapped : [unwrapped];

        prev = nodes.map((v) =>
          v instanceof Node ? v : document.createTextNode(v as any)
        );

				prev[0] ??= document.createTextNode('');

        prev.forEach((n) => last.parentNode.insertBefore(n, last));
        last.parentNode.removeChild(last);
      };
      effect(react);
    }
  }
  //}

	// i think multiple elems is unnecessary generally
	//return [...root.childNodes] as any as T[];
	return root.firstChild as any as T;
}

export function ev<T extends Node>(node: T, ...evs: (string | ((ev: Event) => void))[]) {
	for (let i = 0; i + 1 < evs.length; i += 2) node.addEventListener(evs[i] as string, evs[i + 1] as any);
  return node;
}