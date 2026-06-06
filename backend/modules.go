package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

const description = "description"

func (b *Backend) SetModule(w http.ResponseWriter, r *http.Request) {
	handle(b.setModule, w, r)
}

func (b *Backend) setModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")

	if strings.ContainsAny(name, "/\x00") {
		return ErrInvalidName
	}

	moduleDir := filepath.Join(b.path, name)

	ret := http.StatusCreated

	if err := os.Mkdir(moduleDir, 0755); err != nil {
		if !os.IsExist(err) {
			return err
		}

		ret = http.StatusNoContent
	}

	f, err := os.Create(filepath.Join(moduleDir, description))
	if err != nil {
		return err
	}

	if _, err := io.Copy(f, r.Body); err != nil {
		return err
	}

	if err := f.Close(); err != nil {
		return err
	}

	w.WriteHeader(ret)

	return nil
}

func (b *Backend) ListModules(w http.ResponseWriter, r *http.Request) {
	handle(b.listModules, w, r)
}

type module struct {
	Name        string
	Description string
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

func (b *Backend) GetModule(w http.ResponseWriter, r *http.Request) {
	handle(b.getModule, w, r)
}

func (b *Backend) getModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")
	base := filepath.Join(b.path, name)

	desc, err := os.ReadFile(filepath.Join(base, description))
	if err != nil {
		if os.IsNotExist(err) {
			return ErrNoModule
		}

		return err
	}

	_, err = w.Write(desc)

	return err
}

func (b *Backend) RenameModule(w http.ResponseWriter, r *http.Request) {
	handle(b.renameModule, w, r)
}

func (b *Backend) renameModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")
	newName := r.PathValue("name")

	if name == newName {
		w.WriteHeader(http.StatusNotModified)

		return nil
	}

	err := os.Rename(filepath.Join(b.path, name), filepath.Join(b.path, newName))
	if os.IsNotExist(err) {
		w.Header().Set("Allow", "GET, PUT")

		return fmt.Errorf("%w: %s", ErrNoModule, name)
	} else if err != nil {
		return err
	}

	w.Header().Set("Location", path.Join(path.Dir(path.Dir(r.URL.Path)), newName))

	w.WriteHeader(http.StatusCreated)

	return nil
}

func (b *Backend) DeleteModule(w http.ResponseWriter, r *http.Request) {
	handle(b.deleteModule, w, r)
}

func (b *Backend) deleteModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")

	if strings.ContainsAny(name, "/\x00") {
		return ErrInvalidName
	}

	err := os.RemoveAll(filepath.Join(b.path, name))
	if os.IsNotExist(err) {
		w.Header().Set("Allow", "GET, PUT")

		return fmt.Errorf("%w: %s", ErrNoModule, name)
	}

	return err
}

var (
	ErrInvalidName   = errors.New("module names cannot contain slashes or null bytes")
	ErrDuplicateName = errors.New("name already used")
	ErrNoModule      = errors.New("no module with that name")
)
