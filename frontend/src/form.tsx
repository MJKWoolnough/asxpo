import {id} from "@css";
import {amendNode} from "@dom";

export default ({legend: legendText, submit, onsubmit, onsuccess}: {legend: string; submit: string; onsubmit: (...args: string[]) => Promise<any>, onsuccess: (t: any) => void}, elements: (string | HTMLElement & {"value": string})[]) => {
	 const fs = <fieldset>
	 	<legend>{legendText}</legend>
		{elements.map(e => {
			if (!(e instanceof HTMLElement)) {
				return [];
			}

			const lid = id();

			return <>
				<label for={lid}>{e.getAttribute("label")}</label>{amendNode(e, {"id": lid})}
			</>
		})}
		<div>
			<button type="submit">{submit}</button>
			<button type="button" commandfor="module_desc" command="close">Cancel</button>
		</div>
	       </fieldset>,
	       overlay = <dialog id="module_desc" onclose={() => overlay.remove()} closedby="any">
	 	<form onsubmit={(e: Event) => {
			e.preventDefault()

			fs.disabled = true;

			onsubmit.apply(null, elements.map(e => typeof e === "string" ? e : e.value) as {[K in keyof T]: string} & string[])
			.then(v => {
				onsuccess(v);
				overlay.close();
			})
			.catch(e => {
				alert(`Failed to ${legendText}: ${e.message}`);
			});
		}}>
			{fs}
		</form>
	       </dialog>;

	document.body.append(overlay);
	overlay.showModal();
};
