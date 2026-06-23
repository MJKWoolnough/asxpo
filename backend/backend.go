package backend

import (
	"encoding/json"
	"errors"
	"net/http"

	"vimagination.zapto.org/httpbuffer"
)

type backend struct {
	path string
	http.ServeMux
}

func New(path string) http.Handler {
	b := &backend{
		path: path,
	}

	var mux http.ServeMux

	mux.Handle("GET /modules", http.HandlerFunc(b.ListModules))
	mux.Handle("GET /modules/{module}", http.HandlerFunc(b.GetModule))
	mux.Handle("PUT /modules/{module}", http.HandlerFunc(b.SetModule))
	mux.Handle("POST /modules/{module}/{name}", http.HandlerFunc(b.RenameModule))
	mux.Handle("DELETE /modules/{module}", http.HandlerFunc(b.DeleteModule))

	mux.Handle("GET /modules/{module}/{type}", http.HandlerFunc(b.GetType))
	mux.Handle("PUT /modules/{module}/{type}", http.HandlerFunc(b.SetType))
	mux.Handle("POST /modules/{module}/{type}", http.HandlerFunc(b.RenameType))
	mux.Handle("DELETE /modules/{module}/{type}", http.HandlerFunc(b.DeleteType))

	return &mux
}

func handle(fn func(http.ResponseWriter, *http.Request) error, w http.ResponseWriter, r *http.Request) {
	httpbuffer.Handler{
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if err := fn(w, r); err != nil {
				http.Error(w, err.Error(), responseCode(err))
			}
		}),
	}.ServeHTTP(w, r)
}

var httpErrors = map[error]int{
	ErrDuplicateName: http.StatusConflict,
	ErrInvalidName:   http.StatusUnprocessableEntity,
	ErrNoModule:      http.StatusNotFound,
}

func responseCode(err error) int {
	for e, resp := range httpErrors {
		if errors.Is(err, e) {
			return resp
		}
	}

	if _, ok := errors.AsType[*json.SyntaxError](err); ok {
		return http.StatusBadRequest
	}

	return http.StatusInternalServerError
}
