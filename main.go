package main

import (
	"net/http"
	"os"
	"text/template"

	"vimagination.zapto.org/tsserver"
)

func main() {
	jsx := template.Must(template.New("").Parse("{{if .InHTML}}import {TAG_NAME} from '@html';{{else if .InSVG}}import {TAG_NAME} from '@svg';{{end}}TAG_NAME({{if .HasParams}}PARAMS{{end}}{{if .HasChildren}}{{if .HasParams}},{{end}}CHILDREN{{end}})"))

	http.ListenAndServe(":8080", http.FileServer(http.FS(tsserver.WrapFS(os.DirFS("./frontend/"), tsserver.JSX(jsx)))))
}
