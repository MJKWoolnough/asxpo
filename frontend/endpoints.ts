import {HTTPRequest} from "@conn";
import {Arr, Str} from "@typeguard";

export const projects = () => HTTPRequest("/api/projects", {"response": "json", "checker": Arr(Str())});
