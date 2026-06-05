package backend

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

const description = "description"

func (b *Backend) CreateModule(w http.ResponseWriter, r *http.Request) {
	handle(b.createModule, w, r)
}

type module struct {
	Name        string
	Description string
}

func (b *Backend) createModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")

	if strings.ContainsAny(name, "/\x00") {
		return ErrInvalidName
	}

	moduleDir := filepath.Join(b.path, name)

	if err := os.Mkdir(moduleDir, 0755); err != nil {
		if os.IsExist(err) {
			w.Header().Set("Allow", "GET, PATCH")

			return ErrDuplicateName
		}

		return err
	}

	f, err := os.Create(filepath.Join(moduleDir, description))
	if err != nil {
		return err
	}

	if _, err := io.Copy(f, r.Body); err != nil {
		return err
	}

	return f.Close()
}

func (b *Backend) ListModules(w http.ResponseWriter, r *http.Request) {
	handle(b.listModules, w, r)
}

func (b *Backend) listModules(w http.ResponseWriter, r *http.Request) error {
	paths, err := filepath.Glob(filepath.Join(b.path, "*", description))
	if err != nil {
		return err
	}

	modules := make([]module, 0, len(paths))

	for _, path := range paths {
		name := filepath.Base(filepath.Dir(path))
		description, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		modules = append(modules, module{Name: name, Description: string(description)})
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(modules)
}

var (
	ErrInvalidName   = errors.New("module names cannot contain slashes or null bytes")
	ErrDuplicateName = errors.New("name already used")
)
