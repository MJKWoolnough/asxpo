import {HTTPRequest} from "@conn";
import {Arr, Obj, Str} from "@typeguard";

export const modules = () => HTTPRequest("/api/modules", {"response": "json", "checker": Arr(Obj({"Name": Str(), "Description": Str()}))}),
setModule = (name: string, description: string) => HTTPRequest("/api/modules/"+name, {"method": "put", "data": description}),
getModule = (name: string) => HTTPRequest("/api/modules/"+name),
renameModule = (name: string, newName: string) => HTTPRequest(`/api/modules/${name}/${newName}`, {"method": "post"}),
deleteModule = (name: string) => HTTPRequest("/api/modules/"+name, {"method": "delete"});
