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

	http.Handle("/", frontend.Index)
	http.Handle("/modules/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.URL.Path = "/"
		frontend.Index.ServeHTTP(w, r)
	}))
	http.Handle("/api/", http.StripPrefix("/api", b))

	return http.ListenAndServe(":8080", nil)
}
