package backend

import (
	"net/http"

	"vimagination.zapto.org/httpbuffer"
)

type Backend struct {
	path string
}

func New(path string) *Backend {
	return &Backend{
		path: path,
	}
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

var httpErrors = map[error]int{}

func responseCode(err error) int {
	if c, ok := httpErrors[err]; ok {
		return c
	}

	return http.StatusInternalServerError
}
