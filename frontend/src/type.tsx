import type {Field} from "./endpoints.js";
import bind from "@bind";
import CSS from "@css";
import {bindCustomElement} from "@dom";
import {goto} from "@router";
import {getType, updateTypeDefinition, updateTypeDescription} from "./endpoints.js";
import Form from "./form.js";
import Shadow from "./shadow.js";
import {Add, Edit, Remove} from "./symbols.js";

const attrs = Object.freeze(["module", "type"]),
      css = [new CSS()];

export const Fields = ({types}: {"types": string[]}) => {
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

export default bindCustomElement("aspxo-type", class Type extends HTMLElement {
	#module = bind("");
	#name = bind("");
	#description = bind("");

	constructor() {
		super();
		
		<Shadow this={this} mode="open" css={css}>
			<div>
				<h2>{this.#name}</h2>
				<pre>{this.#description}</pre>
				<button onclick={() => <Form legend="Edit Description" submit="Update" onsubmit={(desc: string) => updateTypeDescription(this.#module(), this.#name(), desc)} onsuccess={this.#description}>
					<textarea label="Description" value={this.#description()} />,
				</Form>}><Edit title="Edit Description"/></button>
			</div>
			<button onclick={() => <Form legend="Update Type" submit="Update" onsubmit={(fields: Field[]) => updateTypeDefinition(this.#module(), this.#name(), fields)}>
				<Fields types={types} />
			</Form>}><Add title="Add Type" /></button>
		</Shadow>

		bind((module, typ) => {
			if (module && typ) {
				getType(module, typ)
				.then(type => {
					this.#module(module);
					this.#name(typ);
					this.#description(type.Description);
				})
				.catch(e => {
					alert(e.message);
					goto("/");
				});
			}
		}, this.#module, this.#name)
	}

	static get observedAttributes() {
		return attrs;
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		if (!newValue) {
			return;
		}

		switch (name) {
		case "module":
			this.#module(newValue)
		case "type":
			this.#name(newValue);
		}
	}
});
