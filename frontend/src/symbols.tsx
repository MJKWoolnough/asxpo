import type {PropsObject} from "@dom";
import {amendNode} from "@dom";

const addSymbol = (S: () => SVGElement) => ({title: t, ...rest}: PropsObject) => amendNode(<S />, rest, <>
	{t ? <svg:title>{t}</svg:title> : <></>}
</>);

export const Add = addSymbol(() => <svg viewBox="0 0 24 20">
		<path d="M1,4 h22 v15 h-22 Z m2,0 l3,-3 h5 l3,3 m3,2 v12 m-6,-6 h12" style="stroke: currentColor" fill="none" stroke-linejoin="round" />
   	</svg> as SVGElement),
	Remove = addSymbol(() => <svg viewBox="0 0 32 34"><path d="M10,5 v-3 q0,-1 1,-1 h10 q1,0 1,1 v3 m8,0 h-28 q-1,0 -1,1 v2 q0,1 1,1 h28 q1,0 1,-1 v-2 q0,-1 -1,-1 m-2,4 v22 q0,2 -2,2 h-20 q-2,0 -2,-2 v-22 m2,3 v18 q0,1 1,1 h3 q1,0 1,-1 v-18 q0,-1 -1,-1 h-3 q-1,0 -1,1 m7.5,0 v18 q0,1 1,1 h3 q1,0 1,-1 v-18 q0,-1 -1,-1 h-3 q-1,0 -1,1 m7.5,0 v18 q0,1 1,1 h3 q1,0 1,-1 v-18 q0,-1 -1,-1 h-3 q-1,0 -1,1" style="stroke: currentColor" fill="none" /></svg> as SVGElement),
	Edit = addSymbol(() => <svg viewBox="0 0 70 70" fill="none" style="stroke: currentColor">
		<polyline points="51,7 58,0 69,11 62,18 51,7 7,52 18,63 62,18" stroke-width="2" />
		<path d="M7,52 L1,68 L18,63 M53,12 L14,51 M57,16 L18,55" />
	</svg> as SVGElement);
