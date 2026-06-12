import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import Module from "./module.js";
import Modules from "./modules.js";

add({
	"dialog": {
		"border": "none",
		"background-color": "transparent",
		"pointer-events": "none",

		" fieldset": {
			"pointer-events": "auto",
			"display": "grid",
			"grid-template-columns": "max-content 1fr",
			"align-items": "center",
			"background-color": "#fff",

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
			},

			">legend": {
				"border": "2px groove threedface",
				"background-color": "#fff"
			},

			":disabled,:disabled>legend": {
				"border-style": "solid",
				"animation": "borderPulse 1s infinite"
			}
		}
	}
})
.at("@keyframes borderPulse", {
	"0%": {
		"border-color": "threedface",
    		"box-shadow": "0 0 5px rgba(0, 0, 0, 0.8)"
	},
	"50%": {
		"border-color": "#000",
    		"box-shadow": "0 0 0px rgba(0, 0, 0, 0.2)"
	},
	"100%": {
		"border-color": "threedface",
    		"box-shadow": "0 0 5px rgba(0, 0, 0, 0.8)"
	},
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
