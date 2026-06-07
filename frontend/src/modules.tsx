import bind from "@bind";
import CSS from "@css";
import {amendNode, bindCustomElement} from "@dom";
import {goto} from "@router";
import {deleteModule, modules, setModule} from "./endpoints.js";

const css = [new CSS().add({
	"ul": {
		"list-style": "none",
		"padding-left": 0
	}
})];

export default bindCustomElement("aspxo-modules", class Modules extends HTMLElement {
	#moduleList = bind([] as {Name: string; Description: string}[]);

	constructor() {
		super();

		amendNode(this.attachShadow({"mode": "open"}), <>
			<button onclick={() => {
				const name = prompt("Enter module name:"),
				      description = prompt("Enter module description:");

				if (!name) {
					alert("Name required");

					return;
				}

				setModule(name, description ?? "")
				.then(() => goto("/modules/"+name))
				.catch(e => alert("Failed to create environment: " + e.message))
			}}>Create Module</button>
			{this.#moduleList.toDOM(<ul />, m => {
				return <li>
					<a href={"/modules/"+m.Name}>{m.Name}</a>
					<button onclick={() => {
						if (!confirm("Are you sure you wish to delete module: " + m.Name)) {
							return;
						}

						deleteModule(m.Name)
						.then(() => modules().then(this.#moduleList))
						.catch(e => alert("Failed to delete environment: " + e.message));
					}}>Delete</button>
				</li>
			})}
		</>).adoptedStyleSheets = css;
	}

	connectedCallback() {
		modules().then(this.#moduleList);
	}
});
