package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"

	"vimagination.zapto.org/asxpo/backend"
	"vimagination.zapto.org/asxpo/frontend"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run() error {
	var base string

	flag.StringVar(&base, "p", "", "project directory")

	flag.Parse()

	b := backend.New(base)

	http.Handle("GET /", frontend.Index)
	http.Handle("GET /api/modules", http.HandlerFunc(b.ListModules))
	http.Handle("GET /api/modules/{module}", http.HandlerFunc(b.GetModule))
	http.Handle("PUT /api/modules/{module}", http.HandlerFunc(b.SetModule))
	http.Handle("POST /api/modules/{module}/{name}", http.HandlerFunc(b.RenameModule))
	http.Handle("DELETE /api/modules/{module}", http.HandlerFunc(b.DeleteModule))

	return http.ListenAndServe(":8080", nil)
}
