import {amendNode} from "@dom";
import ready from "@load";
import {router} from "@router";

ready.then(() => {
	amendNode(document.body, <>
		<h1 style={{"font-family": "arial"}}>ΑΣΞΠΩ</h1>
		{router().add("/project/:id", ({id}) => {
			return <div>Project: {id}</div>
		}).add("", () => {
			return <a href="/project/abc">ABC</a>
		})}
	</>)
});
