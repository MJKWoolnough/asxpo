import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import Modules from "./modules.js";

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
		}).add("", Modules)}
	</>)
});
