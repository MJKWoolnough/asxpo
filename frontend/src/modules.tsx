import bind from "@bind";
import CSS from "@css";
import {amendNode, bindCustomElement} from "@dom";
import {goto} from "@router";
import {deleteModule, modules, setModule} from "./endpoints.js";
import {Add, Remove} from "./symbols.js";

const css = [new CSS().add({
	"ul": {
		"list-style": "none",
		"padding-left": 0
	},
	"button:has(>svg)": {
		"border": 0,
		"background": "none",
		"cursor": "pointer",

		">svg": {
			"width": "1em"
		}
	},
	"label": {
		"display": "inline-block",
		"width": "9em",
		"text-align": "right"
	}
})];

export default bindCustomElement("aspxo-modules", class Modules extends HTMLElement {
	#moduleList = bind([] as {Name: string; Description: string}[]);

	constructor() {
		super();

		amendNode(this.attachShadow({"mode": "open"}), <>
			<button onclick={function (this: HTMLButtonElement) {
				const name = <input id="module_add_name" type="text" />,
				      desc = <textarea id="module_add_desc" />,
				      overlay = <dialog id="module_add" onclose={() => overlay.remove()} closedby="any">
					<label for="module_add_name">Module Name:</label>{name}<br />
					<label for="module_add_desc">Module Description:</label>{desc}<br />
					<button onclick={() => {
						if (!name.value) {
							alert("Name cannot be empty")

							return;
						}

						setModule(name.value, desc.value)
						.then(() => {
							overlay.close();
							goto("/modules/"+name.value);
						})
						.catch(e => alert("Failed to create environment: " + e.message))
					}}>Create Module</button>
					<button commandfor="module_add" command="close">Cancel</button>
				      </dialog>;

				this.parentNode!.append(overlay);
				overlay.showModal();
			}}><Add title="Add Module" /></button>
			{this.#moduleList.toDOM(<ul />, m => {
				return <li>
					<a href={"/modules/"+m.Name}>{m.Name}</a>
					<button onclick={() => {
						const overlay = <dialog id="module_remove" onclose={() => overlay.remove()} closedby="any">
							<div>Are you sure you wish to remove module {m.Name}</div>
							<button onclick={() => {
								deleteModule(m.Name)
								.then(() => {
									overlay.close();
									modules().then(this.#moduleList);
								})
								.catch(e => alert("Failed to delete environment: " + e.message));
							}}>Remove</button>
							<button commandfor="module_remove" command="close">Cancel</button>
						      </dialog>

						this.parentNode!.append(overlay);
						overlay.showModal();
					}}><Remove title="Remove Module" /></button>
				</li>
			})}
		</>).adoptedStyleSheets = css;
	}

	connectedCallback() {
		modules().then(this.#moduleList);
	}
});
