package backend

import (
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func (b *Backend) CreateModule(w http.ResponseWriter, r *http.Request) {
	handle(b.createModule, w, r)
}

type newModule struct {
	Name        string
	Description string
}

func (b *Backend) createModule(w http.ResponseWriter, r *http.Request) error {
	var m newModule

	if err := json.NewDecoder(r.Body).Decode(&m); err != nil {
		return err
	}

	if strings.ContainsAny(m.Name, "/\x00") {
		return ErrInvalidName
	}

	moduleDir := filepath.Join(b.path, m.Name)

	if err := os.Mkdir(moduleDir, 0755); err != nil {
		return err
	}

	if err := os.WriteFile(filepath.Join(moduleDir, "description"), []byte(m.Description), 0644); err != nil {
		return err
	}

	return nil
}

func (b *Backend) ListModules(w http.ResponseWriter, r *http.Request) {
	handle(b.listModules, w, r)
}

func (b *Backend) listModules(w http.ResponseWriter, r *http.Request) error {
	paths, err := filepath.Glob(filepath.Join(b.path, "*", "description"))
	if err != nil {
		return err
	}

	modules := make([]newModule, 0, len(paths))

	for _, path := range paths {
		name := filepath.Base(filepath.Dir(path))
		description, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		modules = append(modules, newModule{Name: name, Description: string(description)})
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(modules)
}

var ErrInvalidName = errors.New("module names cannot contain slashes or null bytes")
