interface ToString {                                                                                                                                                                  
	toString(): string;                                                                                                                                                           
}

declare namespace JSX {
	type Element = HTMLElement | SVGElement | MathMLElement;

	type AllElementsMap = HTMLElementTagNameMap & SVGElementTagNameMap & MathMLElementTagNameMap;

	type IntrinsicElements = {
		[K in keyof AllElementsMap]: Omit<Partial<AllElementsMap[K]>, "style" | "href"> & {
			[ev: `on${string}`]: EventListenerObject | Function;
			[attribute: string]: unknown;
			"style"?: Record<string, ToString | undefined> | CSSStyleDeclaration | string;
			"href"?: unknown;
		}
	}
}

declare const __jsxFragment: unknown;
