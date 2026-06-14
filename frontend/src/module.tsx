import type {Field} from "./endpoints.js";
import bind from "@bind";
import CSS from "@css";
import {bindCustomElement} from "@dom";
import {goto} from "@router";
import {getModule, setModule, setType} from "./endpoints.js";
import Form from "./form.js";
import Shadow from "./shadow.js";
import {Add, Edit, Remove} from "./symbols.js";

const id = Object.freeze(["id"]),
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
})],
      Fields = ({types}: {"types": string[]}) => {
	const adder = <li>
		<button type="button" onclick={() => {
			const field = {"Name": "", "Type": "", "Description": ""};

			fields.push(field);

			adder.before(<li>
				<input type="text" onchange={function(this: HTMLInputElement) {field.Name = this.value}} placeholder="Name" required />
				<input type="text" onchange={function(this: HTMLInputElement) {field.Type = this.value}} placeholder="Type" required list="types" />
				<input type="text" onchange={function(this: HTMLInputElement) {field.Type = this.value}} placeholder="Description" />
				<button type="button" onclick={function(this: HTMLButtonElement) {
					const index = fields.indexOf(field);

					if (index >= 0) {
						fields.splice(index, 1);
					}

					this.parentElement?.remove();
				}}><Remove title="Remove Field" /></button>
			</li>);
		}}>+</button>
		<datalist id="types">
			{types.map(t => <option>{t}</option>)}
		</datalist>
	</li> as HTMLLIElement,
	      fields: Field[] = [];

	return Object.assign(<ul label="Fields">{adder}</ul>, {"value": fields});
      },
      types: string[] = [
	      "string",
	      "int"
      ];

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
		return id;
	}

	attributeChangedCallback(_id: string, _oldValue: string, newValue: string) {
		if (!newValue) {
			return;
		}

		getModule(newValue)
		.then(desc => {
			this.#name(newValue);
			this.#description(desc);
		})
		.catch(e => {
			alert(e.message);
			goto("/");
		});
	}
});
