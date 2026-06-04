package main

import (
	"encoding/json"
	"net/http"

	"vimagination.zapto.org/asxpo/frontend"
)

func main() {
	http.Handle("GET /", frontend.Index)
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
