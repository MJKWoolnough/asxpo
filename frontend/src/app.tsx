import {render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import Module from "./module.js";
import Modules from "./modules.js";
import Type from "./type.js";

ready.then(() => {
	amendNode(document.head, render());
	amendNode(document.body, <>
		<h1 style={{"font-family": "arial"}}>ΑΣΞΠΩ</h1>
		{
			router()
			.add("/modules/:module", Module)
			.add("/modules/:module/:type", Type)
			.add("/", Modules)
		}
	</>)
});
