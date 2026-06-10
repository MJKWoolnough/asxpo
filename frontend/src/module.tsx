import bind from "@bind";
import {bindCustomElement} from "@dom";
import {getModule} from "./endpoints.js";
import Shadow from "./shadow.js";

const id = Object.freeze(["id"]);

export default bindCustomElement("aspxo-module", class Module extends HTMLElement {
	#name = bind("");
	#description = bind("");

	constructor() {
		super();
		
		<Shadow this={this} mode="open">
			  <h2>{this.#name}</h2>
			  <div>{this.#description}</div>
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
		.catch(e => alert(e.message));
	}
}, )
