import type {TypeGuardOf} from "@typeguard";
import {HTTPRequest} from "@conn";
import {And, Arr, Obj, Str} from "@typeguard";

const str = Str(),
      field = Obj({
	"Name": str,
	"Type": str,
	"Description": str,
      }),
      nameDescription = Obj({"Name": str, "Description": str});

export type Field = TypeGuardOf<typeof field>;

export const modules = () => HTTPRequest("/api/modules", {"response": "json", "checker": Arr(nameDescription)}),
setModule = (name: string, description: string) => HTTPRequest("/api/modules/"+name, {"method": "put", "data": description}),
getModule = (name: string) => HTTPRequest("/api/modules/"+name, {"response": "json", "checker": And(nameDescription, Obj({"Types": Arr(nameDescription)}))}),
renameModule = (name: string, newName: string) => HTTPRequest(`/api/modules/${name}/${newName}`, {"method": "post"}),
deleteModule = (name: string) => HTTPRequest("/api/modules/"+name, {"method": "delete"}),
setType = (module: string, name: string, description: string, typ: Field[]) => HTTPRequest(`/api/modules/${module}/${name}`, {"method": "put", "data": JSON.stringify({description, "type": typ})}),
updateTypeDescription = (module: string, name: string, description: string) => HTTPRequest(`/api/modules/${module}/${name}`, {"method": "patch", "data": JSON.stringify({description})}),
updateTypeDefinition = (module: string, name: string, typ: Field[]) => HTTPRequest(`/api/modules/${module}/${name}`, {"method": "patch", "data": JSON.stringify({"type": typ})}),
getType = (module: string, name: string) => HTTPRequest(`/api/modules/${module}/${name}`, {"response": "json", "checker": And(nameDescription, Obj({"Fields": Arr(field)}))}),
renameType = (module: string, name: string, newName: string) => HTTPRequest(`/api/modules/${module}/${name}/${newName}`, {"method": "post"}),
deleteType = (module: string, name: string) => HTTPRequest(`/api/modules/${module}/${name}`, {"method": "delete"});
