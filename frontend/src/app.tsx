import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {goto, router} from "@router";
import {createModule, modules} from "./endpoints.js";

add({
	"#modules": {
		"list-style": "none",
		"padding-left": 0,
	}
});

ready.then(modules).then(modules => {
	amendNode(document.head, render());
	amendNode(document.body, <>
		<h1 style={{"font-family": "arial"}}>ΑΣΞΠΩ</h1>
		{router().add("/modules/:id", ({id}) => {
			return <div>Module: {id}</div>
		}).add("", () => {
			return <div>
				<button onclick={() => {
					const name = prompt("Enter module name:"),
					      description = prompt("Enter module description:");

					if (!name) {
						alert("Name required");

						return;
					}

					createModule(name, description ?? "")
					.then(() => goto("/modules/"+name))
					.catch(e => alert("Failed to create environment: " + e.message))
				}}>Create Module</button>
				<ul id="modules">
					{modules.map(m => <li><a href={"/modules/"+m.Name}>{m.Name}</a></li>)}
				</ul>
			</div>
		})}
	</>)
});
