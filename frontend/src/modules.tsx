import bind from "@bind";
import CSS from "@css";
import {bindCustomElement} from "@dom";
import {goto} from "@router";
import {deleteModule, modules, setModule} from "./endpoints.js";
import Form from "./form.js";
import Shadow from "./shadow.js";
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
	}
})];

export default bindCustomElement("aspxo-modules", class Modules extends HTMLElement {
	#moduleList = bind([] as {Name: string; Description: string}[]);

	constructor() {
		super();

		<Shadow this={this} mode="open" css={css}>
			<button onclick={() => {
				const name = <input label="Module Name" type="text" required pattern="^[^\/]+$" title="Cannot contain slashes" placeholder=" " />;

				<Form legend="Add Module" submit="Create Module" onsubmit={setModule} onsuccess={() => goto("/modules/"+name.value)}>
					{name}
					<textarea label="Module Description" />
				</Form>
			}}><Add title="Add Module" /></button>
			{this.#moduleList.toDOM(<ul />, m => <li>
				<a href={"/modules/"+m.Name}>{m.Name}</a>
				<button onclick={() => {
					const fs = <fieldset>
						<legend>Remove Module</legend>
						<div>Are you sure you wish to remove module: {m.Name}</div>
						<div>
							<button type="submit">Remove</button>
							<button type="button" commandfor="module_remove" command="close">Cancel</button>
						</div>
					      </fieldset>,
					      overlay = <dialog id="module_remove" onclose={() => overlay.remove()} closedby="any">
					      	<form method="dialog" onsubmit={(e: Event) => {
							e.preventDefault();

							fs.disabled = true;

							deleteModule(m.Name)
							.then(() => {
								overlay.close();
								modules().then(this.#moduleList);
							})
							.catch(e => {
								alert("Failed to delete module: " + e.message);

								fs.disabled = false;
							});
						}}>{fs}</form>
					      </dialog>

					document.body.append(overlay);
					overlay.showModal();
				}}><Remove title="Remove Module" /></button>
			</li>)}
		</Shadow>
	}

	connectedCallback() {
		modules().then(this.#moduleList);
	}
});
