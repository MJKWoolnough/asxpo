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
	http.Handle("POST /api/modules", http.HandlerFunc(b.CreateModule))
	http.Handle("GET /api/modules", http.HandlerFunc(b.ListModules))

	return http.ListenAndServe(":8080", nil)
}
