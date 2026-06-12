import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import Module from "./module.js";
import Modules from "./modules.js";

add({
	"input:not(:empty):invalid": {
		"border-color": "#f00"
	}
});

ready.then(() => {
	amendNode(document.head, render());
	amendNode(document.body, <>
		<h1 style={{"font-family": "arial"}}>ΑΣΞΠΩ</h1>
		{
			router()
			.add("/modules/:id", Module)
			.add("/", Modules)
		}
	</>)
});
