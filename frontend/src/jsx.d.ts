interface ToString {                                                                                                                                                                  
	toString(): string;                                                                                                                                                           
}

type ElementType<T extends Element> = Omit<Partial<T>, string> & {
	[ev: `on${string}`]: EventListenerObject | Function;
	[attribute: string]: unknown;
	"style"?: Record<string, ToString | undefined> | CSSStyleDeclaration | string;
}

declare namespace JSX {
	type IntrinsicElements = {
		[K in keyof HTMLElementTagNameMap as `html:${K}` | `${K}`]: ElementType<HTMLElementTagNameMap[K]>;
	} & {
		[K in keyof SVGElementTagNameMap as `svg:${K}` | `${K}`]: ElementType<SVGElementTagNameMap[K]>;
	} & {
		[K in keyof MathMLElementTagNameMap as `math:${K}` | `${K}`]: ElementType<MathMLElementTagNameMap[K]>;
	}
}

declare const __jsxFragment: unknown;
