//go:build dev

package frontend

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"text/template"

	"vimagination.zapto.org/tsserver"
)

var Index = http.FileServer(http.FS(tsserver.WrapFS(os.DirFS("./frontend/src/"), tsserver.JSX(template.Must(template.New("").Parse(`{{if or .InHTML .InSVG }}import {TAG_NAME} from "@{{.Namespace}}";{{end}}TAG_NAME({{if .HasParams}}PARAMS{{end}}{{if .HasChildren}}{{if .HasParams}},{{end}}CHILDREN{{end}})`))), tsserver.ErrFn(func(w io.Writer, err error) {
	fmt.Fprintln(w, err)
}))))
