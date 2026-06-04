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

var ErrInvalidName = errors.New("module names cannot contain slashes or null bytes")
