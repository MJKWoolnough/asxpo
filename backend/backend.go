package backend

import (
	"compress/gzip"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	"github.com/klauspost/compress/zstd"
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

	mux.Handle("GET /modules", handler(b.listModules))
	mux.Handle("GET /modules/{module}", handler(b.getModule))
	mux.Handle("PUT /modules/{module}", handler(b.setModule))
	mux.Handle("POST /modules/{module}/{name}", handler(b.renameModule))
	mux.Handle("DELETE /modules/{module}", handler(b.deleteModule))

	mux.Handle("GET /modules/{module}/{type}", handler(b.getType))
	mux.Handle("PUT /modules/{module}/{type}", handler(b.setType))
	mux.Handle("PATCH /modules/{module}/{type}", handler(b.updateType))
	mux.Handle("POST /modules/{module}/{type}/{name}", handler(b.renameType))
	mux.Handle("DELETE /modules/{module}/{type}", handler(b.deleteType))

	return httpbuffer.New(&mux, httpbuffer.Zstd(zstd.SpeedBestCompression), httpbuffer.Gzip(gzip.BestCompression))
}

type handler func(w http.ResponseWriter, r *http.Request) error

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := h(w, r); err != nil {
		http.Error(w, err.Error(), responseCode(err))
	}
}

var httpErrors = map[error]int{
	ErrDuplicateName: http.StatusConflict,
	ErrInvalidName:   http.StatusUnprocessableEntity,
	ErrNoModule:      http.StatusNotFound,
	ErrNoType:        http.StatusNotFound,
	ErrNoPatch:       http.StatusUnprocessableEntity,
	io.EOF:           http.StatusBadRequest,
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

func validatePaths(paths ...string) bool {
	for _, path := range paths {
		if strings.ContainsAny(path, "/\x00") {
			return false
		}
	}

	return true
}
