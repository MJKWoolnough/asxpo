import {HTTPRequest} from "@conn";
import {Arr, Obj, Str} from "@typeguard";

export const modules = () => HTTPRequest("/api/modules", {"response": "json", "checker": Arr(Obj({"Name": Str(), "Description": Str()}))}),
createModule = (name: string, description: string) => HTTPRequest("/api/modules/"+name, {"method": "put", "data": description}),
deleteModule = (name: string) => HTTPRequest("/api/modules/"+name, {"method": "delete"});
