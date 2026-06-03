import {add, render} from "@css";
import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";
import {projects} from "./endpoints.js";

add({
	"#projects": {
		"list-style": "none",
		"padding-left": 0,
	}
});

ready.then(projects).then(projects => {
	amendNode(document.head, render());
	amendNode(document.body, <>
		<h1 style={{"font-family": "arial"}}>ΑΣΞΠΩ</h1>
		{router().add("/project/:id", ({id}) => {
			return <div>Project: {id}</div>
		}).add("", () => {
			return <ul id="projects">
				{projects.map(project => <li><a href={"/project/"+project}>{project}</a></li>)}
			</ul>
		})}
	</>)
});
