import {add, id} from "@css";
import {amendNode} from "@dom";

add({
	"dialog": {
		"border": "none",
		"background-color": "transparent",
		"pointer-events": "none",

		" fieldset": {
			"pointer-events": "auto",
			"display": "grid",
			"grid-template-columns": "max-content 1fr",
			"align-items": "center",
			"background-color": "#fff",

			">label": {
				"text-align": "right",
				"grid-column": 1,

				":after": {
					"content": `":"`,
					"margin-right": "0.5em"
				}
			},

			">input,>textarea,>select": {
				"grid-column": 2,
				"width": "100%"
			},

			">input:user-invalid": {
				"border-color": "#f00"
			},

			">div": {
				"margin-top": "1em",
				"grid-column": "1/3"
			},

			">legend": {
				"border": "2px groove threedface",
				"background-color": "#fff"
			},

			":disabled,:disabled>legend": {
				"border-style": "solid",
				"animation": "borderPulse 1s infinite"
			}
		}
	},
	"button:has(svg)": {
		"border": 0,
		"background": "none",
		"cursor": "pointer",

		">svg": {
			"width": "1em"
		}
	},
	"ul": {
		"padding": 0,
		"list-style": "none"
	}
})
.at("@keyframes borderPulse", {
	"0%": {
		"border-color": "threedface",
    		"box-shadow": "0 0 5px rgba(0, 0, 0, 0.8)"
	},
	"50%": {
		"border-color": "#000",
    		"box-shadow": "0 0 0px rgba(0, 0, 0, 0.2)"
	},
	"100%": {
		"border-color": "threedface",
    		"box-shadow": "0 0 5px rgba(0, 0, 0, 0.8)"
	},
});

export default ({legend: legendText, preamble, submit, onsubmit, onsuccess}: {legend: string; preamble?: string; submit: string; onsubmit: (...args: string[]) => Promise<any>, onsuccess: (t: any) => void}, elements: (HTMLElement & {"value": string})[] = []) => {
	 const fs = <fieldset>
	 	<legend>{legendText}</legend>
		{preamble ? <div>{preamble}</div> : []}
		{elements.map(e => {
			const lid = id();

			return <>
				<label for={lid}>{e.getAttribute("label")}</label>
				{amendNode(e, {"id": lid})}
			</>
		})}
		<div>
			<button type="submit">{submit}</button>
			<button type="button" commandfor="module_desc" command="close">Cancel</button>
		</div>
	       </fieldset>,
	       overlay = <dialog id="module_desc" onclose={() => overlay.remove()} closedby="any">
	 	<form onsubmit={function (this: HTMLFormElement, e: Event) {
			if (!this.reportValidity()) {
				return;
			}

			e.preventDefault()

			fs.disabled = true;

			onsubmit.apply(null, elements.map(e => e.value))
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
