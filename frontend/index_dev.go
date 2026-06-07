//go:build dev

package frontend

import (
	"net/http"
	"os"
	"text/template"

	"vimagination.zapto.org/tsserver"
)

var Index = http.FileServer(http.FS(tsserver.WrapFS(os.DirFS("./frontend/src/"), tsserver.JSX(template.Must(template.New("").Parse(`{{if and .InHTML (eq .Namespace "html") }}import {TAG_NAME} from "@html";{{else if and .InSVG (eq .Namespace "svg")}}import {TAG_NAME} from "@svg";{{end}}TAG_NAME({{if .HasParams}}PARAMS{{end}}{{if .HasChildren}}{{if .HasParams}},{{end}}CHILDREN{{end}})`))))))
