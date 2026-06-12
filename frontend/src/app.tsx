import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import Module from "./module.js";
import Modules from "./modules.js";

add({
	"dialog fieldset": {
		"display": "grid",
		"grid-template-columns": "max-content 1fr",
		"align-items": "center",

		">label": {
			"text-align": "right",
			"grid-column": 1
		},

		">input,>textarea,>select": {
			"grid-column": 2,
			"width": "100%"
		},

		">input:user-invalid": {
			"border-color": "#f00"
		},

		">div": {
			"margin-top": "1em",
			"grid-column": "1/3"
		}
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
