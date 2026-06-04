import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import {modules} from "./endpoints.js";

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
			return <ul id="modules">
				{modules.map(m => <li><a href={"/modules/"+m.Name}>{m.Name}</a></li>)}
			</ul>
		})}
	</>)
});
