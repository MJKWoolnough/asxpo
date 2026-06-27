import type {Field} from "./endpoints.js";
import bind from "@bind";
import CSS from "@css";
import {bindCustomElement} from "@dom";
import {goto} from "@router";
import {getModule, setModule, setType} from "./endpoints.js";
import Form from "./form.js";
import Shadow from "./shadow.js";
import {Add, Edit} from "./symbols.js";
import {Fields, types} from "./type.js";

const attrs = Object.freeze(["module"]),
      css = [new CSS().add({
	"button:has(>svg)": {
		"border": 0,
		"background": "none",
		"cursor": "pointer",

		">svg": {
			"width": "1em"
		}
	},
	"pre": {
		"margin": 0,
		"float": "left",

		":empty::before": {
			"display": "block",
			"content": `"No Description"`,
			"font-style": "italic"
		}
	}
})];

export default bindCustomElement("aspxo-module", class Module extends HTMLElement {
	#name = bind("");
	#description = bind("");

	constructor() {
		super();
		
		<Shadow this={this} mode="open" css={css}>
			<div>
				<h2>{this.#name}</h2>
				<pre>{this.#description}</pre>
				<button onclick={() => <Form legend="Edit Description" submit="Update" onsubmit={(desc: string) => setModule(this.#name(), desc)} onsuccess={this.#description}>
					<textarea label="Description" value={this.#description()} />,
				</Form>}><Edit title="Edit Description"/></button>
			</div>
			<button onclick={() => {
				const name = <input label="Name" required pattern="^[^\/]+$" title="Cannot contain slashes" placeholder=" " />;

				<Form legend="Add Type" submit="Add" onsubmit={(name: string, desc: string, fields: Field[]) => setType(this.#name(), name, desc, fields)}>
					{name}
					<textarea label="Description" />
					<Fields types={types} />
				</Form>
			}}><Add title="Add Type" /></button>
		</Shadow>
	}

	static get observedAttributes() {
		return attrs;
	}

	attributeChangedCallback(_id: string, _oldValue: string, newValue: string) {
		if (!newValue) {
			return;
		}

		getModule(newValue)
		.then(module => {
			this.#name(newValue);
			this.#description(module.Description);
		})
		.catch(e => {
			alert(e.message);
			goto("/");
		});
	}
});
