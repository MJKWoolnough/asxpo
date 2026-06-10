import bind from "@bind";
import {amendNode, bindCustomElement} from "@dom";
import {getModule} from "./endpoints.js";

const id = Object.freeze(["id"]);

export default bindCustomElement("aspxo-module", class Module extends HTMLElement {
	#name = bind("");
	#description = bind("");

	constructor() {
		super();
		
		amendNode(this.attachShadow({"mode": "open"}), <>
			  <h2>{this.#name}</h2>
			  <div>{this.#description}</div>
		</>)
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
