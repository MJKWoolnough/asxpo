import {amendNode} from "@dom";

export const toggleForm = (parent: Element, enable: boolean) => {
	let curr: Node | null;

	const i = document.createNodeIterator(parent, NodeFilter.SHOW_ELEMENT, node => node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement || node instanceof HTMLButtonElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
	      attrs = {"disabled": !enable};

	while (curr = i.nextNode()) {
		amendNode(curr, attrs);
	}
};
