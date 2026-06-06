import bind from "@bind";
import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {goto, router} from "@router";
import {setModule, deleteModule, modules} from "./endpoints.js";

add({
	"#modules": {
		"list-style": "none",
		"padding-left": 0,
	}
});

ready.then(() => {
	amendNode(document.head, render());
	amendNode(document.body, <>
		<h1 style={{"font-family": "arial"}}>ΑΣΞΠΩ</h1>
		{router().add("/modules/:id", ({id}) => {
			return <div>Module: {id}</div>
		}).add("", () => {
			const moduleList = bind([] as {Name: string; Description: string}[]);

			modules().then(moduleList);

			return <div>
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
				{moduleList.toDOM(<ul id="modules" />, m => {
					return <li>
						<a href={"/modules/"+m.Name}>{m.Name}</a>
						<button onclick={() => {
							if (!confirm("Are you sure you wish to delete module: " + m.Name)) {
								return;
							}

							deleteModule(m.Name)
							.then(() => modules().then(moduleList))
							.catch(e => alert("Failed to delete environment: " + e.message));
						}}>Delete</button>
					</li>
				})}
			</div>
		})}
	</>)
});
