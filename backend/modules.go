package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

const description = "description"

func (b *backend) setModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")

	if !validatePaths(name) {
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

type nameDescription struct {
	Name        string
	Description string
}

func (b *backend) listModules(w http.ResponseWriter, r *http.Request) error {
	paths, err := filepath.Glob(filepath.Join(b.path, "*", description))
	if err != nil {
		return err
	}

	modules := make([]nameDescription, 0, len(paths))

	for _, path := range paths {
		name := filepath.Base(filepath.Dir(path))
		description, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		modules = append(modules, nameDescription{Name: name, Description: string(description)})
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(modules)
}

type moduleWithTypes struct {
	nameDescription
	types []nameDescription
}

func (b *backend) getModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")
	base := filepath.Join(b.path, name)

	if !validatePaths(name) {
		return ErrInvalidName
	}

	description, err := os.ReadFile(filepath.Join(base, description))
	if err != nil {
		if os.IsNotExist(err) {
			return fmt.Errorf("%w: %s", ErrNoModule, name)
		}

		return err
	}

	var module moduleWithTypes
	module.Name = name
	module.Description = string(description)

	module.types, err = b.readTypes(name)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(module)
}

func (b *backend) renameModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")
	newName := r.PathValue("name")

	if !validatePaths(name, newName) {
		return ErrInvalidName
	}

	if name == newName {
		w.WriteHeader(http.StatusNotModified)

		return nil
	}

	err := os.Rename(filepath.Join(b.path, name), filepath.Join(b.path, newName))
	if os.IsNotExist(err) {
		return fmt.Errorf("%w: %s", ErrNoModule, name)
	} else if os.IsExist(err) {
		return fmt.Errorf("%w: %s", ErrDuplicateName, newName)
	} else if err != nil {
		return err
	}

	w.Header().Set("Location", "../"+newName)

	w.WriteHeader(http.StatusCreated)

	return nil
}

func (b *backend) deleteModule(w http.ResponseWriter, r *http.Request) error {
	name := r.PathValue("module")

	if !validatePaths(name) {
		return ErrInvalidName
	}

	path := filepath.Join(b.path, name)

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return fmt.Errorf("%w: %s", ErrNoModule, name)
	}

	return os.RemoveAll(path)
}

var (
	ErrInvalidName   = errors.New("names cannot contain slashes or null bytes")
	ErrDuplicateName = errors.New("name already used")
	ErrNoModule      = errors.New("no module with that name")
)
