import type {Children} from "@dom";
import {amendNode} from "@dom";

export default ({this: self, css = [], ...rest}: {this: HTMLElement, css?: CSSStyleSheet[]} & ShadowRootInit, children: Children) => {
	const s = amendNode(self.attachShadow(rest), children)

	s.adoptedStyleSheets = css;

	return s;
};
