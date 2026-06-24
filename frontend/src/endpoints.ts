import type {TypeGuardOf} from "@typeguard";
import {HTTPRequest} from "@conn";
import {Arr, Obj, Str} from "@typeguard";

const Field = Obj({
	"Name": Str(),
	"Type": Str(),
	"Description": Str(),
});

export type Field = TypeGuardOf<typeof Field>;

export const modules = () => HTTPRequest("/api/modules", {"response": "json", "checker": Arr(Obj({"Name": Str(), "Description": Str()}))}),
setModule = (name: string, description: string) => HTTPRequest("/api/modules/"+name, {"method": "put", "data": description}),
getModule = (name: string) => HTTPRequest("/api/modules/"+name, {"response": "json", "checker": Obj({"Name": Str(), "Description": Str(), "Types": Arr(Obj({"Name": Str(), "Description": Str()}))})}),
renameModule = (name: string, newName: string) => HTTPRequest(`/api/modules/${name}/${newName}`, {"method": "post"}),
deleteModule = (name: string) => HTTPRequest("/api/modules/"+name, {"method": "delete"}),
setType = (module: string, name: string, description: string, typ: Field[]) => HTTPRequest(`/api/modules/${module}/${name}`, {"method": "put", "data": JSON.stringify({description, "type": typ})}),
getType = (module: string, name: string) => HTTPRequest(`/api/modules/${module}/${name}`, {"response": "json", "checker": Obj({"Name": Str(), "Description": Str(), "Fields": Arr(Field)})}),
renameType = (module: string, name: string, newName: string) => HTTPRequest(`/api/modules/${module}/${name}/${newName}`, {"method": "post"}),
deleteType = (module: string, name: string) => HTTPRequest(`/api/modules/${module}/${name}`, {"method": "delete"});
