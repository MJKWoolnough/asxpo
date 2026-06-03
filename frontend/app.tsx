import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import {projects} from "./endpoints.js";

ready.then(projects).then(projects => {
	amendNode(document.body, <>
		<h1 style={{"font-family": "arial"}}>ΑΣΞΠΩ</h1>
		{router().add("/project/:id", ({id}) => {
			return <div>Project: {id}</div>
		}).add("", () => {
			return <ul>
				{projects.map(project => <li><a href={"/project/"+project}>{project}</a></li>)}
			</ul>
		})}
	</>)
});
