import bind from "@bind";
import CSS from "@css";
import {bindCustomElement} from "@dom";
import {goto} from "@router";
import {getModule, setModule} from "./endpoints.js";
import Shadow from "./shadow.js";
import {Edit} from "./symbols.js";

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
		"margin-top": 0,
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
		console.log(css);
		
		<Shadow this={this} mode="open" css={css}>
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
})
