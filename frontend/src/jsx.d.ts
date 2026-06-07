interface ToString {                                                                                                                                                                  
	toString(): string;                                                                                                                                                           
}

type ElementType<T extends Element> = Omit<Partial<T>, string> & {
	[ev: `on${string}`]: EventListenerObject | Function;
	[attribute: string]: unknown;
	"style"?: Record<string, ToString | undefined> | CSSStyleDeclaration | string;
}

declare namespace JSX {
	type Element = HTMLElement | SVGElement | MathMLElement;

	type AllElementsMap = HTMLElementTagNameMap & SVGElementTagNameMap & MathMLElementTagNameMap;

	type IntrinsicElements = {
		[K in keyof AllElementsMap]: ElementType<AllElementsMap[K]>;
	}
}

declare const __jsxFragment: unknown;
