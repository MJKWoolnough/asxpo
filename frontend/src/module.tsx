import type {Field} from "./endpoints.js";
import bind from "@bind";
import CSS from "@css";
import {bindCustomElement} from "@dom";
import {goto} from "@router";
import {getModule, setModule, setType} from "./endpoints.js";
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
      Fields = ({fields, types}: {"fields": Field[], "types": string[]}) => {
	const adder = <li><button type="button" onclick={() => {
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
	}}>+</button></li> as HTMLLIElement;

	return <>
		<ul>
			{adder}
		</ul>
		<datalist id="types">
			{types.map(t => <option>{t}</option>)}
		</datalist>
	</>;
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
				<button onclick={() => {
					const desc = <textarea id="module_description" value={this.#description()} />,
					      fs = <fieldset>
						<legend>Edit Description</legend>
						<label for="module_description">Description:</label>{desc}
						<div>
							<button type="submit">Update</button>
							<button type="button" commandfor="module_desc" command="close">Cancel</button>
						</div>
					      </fieldset> as HTMLFieldSetElement,
					      overlay = <dialog id="module_desc" onclose={() => overlay.remove()} closedby="any">
						<form onsubmit={(e: Event) => {
							e.preventDefault();
	
							fs.disabled = true;
	
							setModule(this.#name(), desc.value)
							.then(() => {
								this.#description(desc.value);
								overlay.close();
							})
							.catch(e => {
								alert("Failed to update description: " + e.message);

								fs.disabled = false;
							});
						}}>{fs}</form>
					      </dialog>;
	
					document.body.append(overlay);
					overlay.showModal();
				}}><Edit title="Edit Description"/></button>
			</div>
			<button onclick={() => {
				const name = <input id="type_name" required pattern="^[^\/]+$" title="Cannot contain slashes" placeholder=" " />,
				      desc = <textarea id="type_description" />,
				      fields: Field[] = [],
				      fs = <fieldset>
					<legend>Add Type</legend>
					<label for="type_name">Name:</label>{name}
					<label for="type_description">Description:</label>{desc}
					<label>Fields:</label>
					<Fields fields={fields} types={types} />
					<div>
						<button type="submit">Update</button>
						<button type="button" commandfor="type_add" command="close">Cancel</button>
					</div>
				      </fieldset> as HTMLFieldSetElement,
				      overlay = <dialog id="type_add" onclose={() => overlay.remove()} closedby="any">
					<form onsubmit={(e: Event) => {
						e.preventDefault();

						fs.disabled = true;

						setType(this.#name(), name.value, desc.value, fields)
						.then(() => overlay.close())
						.catch(e => {
							alert("Failed to create type: " + e.message);

							fs.disabled = false;
						});
					}}>{fs}</form>
				      </dialog>;

				document.body.append(overlay);
				overlay.showModal();
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
