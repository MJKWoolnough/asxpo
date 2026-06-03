package main

import (
	"encoding/json"
	"net/http"
	"os"
	"text/template"

	"vimagination.zapto.org/tsserver"
)

func main() {
	http.Handle("GET /", http.FileServer(http.FS(tsserver.WrapFS(os.DirFS("./frontend/"), tsserver.JSX(template.Must(template.New("").Parse("{{if .InHTML}}import {TAG_NAME} from '@html';{{else if .InSVG}}import {TAG_NAME} from '@svg';{{end}}TAG_NAME({{if .HasParams}}PARAMS{{end}}{{if .HasChildren}}{{if .HasParams}},{{end}}CHILDREN{{end}})")))))))
	http.Handle("GET /api/projects", http.HandlerFunc(projects))

	http.ListenAndServe(":8080", nil)
}

func projects(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]string{
		"ProjectA",
		"ProjectB",
	})
}
