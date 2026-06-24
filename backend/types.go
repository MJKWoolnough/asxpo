package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type field struct {
	Name        string
	Description string
	Type        string
}

type mType struct {
	Name        string
	Description string
	Fields      []field
}

func (b *backend) setType(w http.ResponseWriter, r *http.Request) error {
	var t mType

	moduleName := r.PathValue("module")
	t.Name = r.PathValue("type")

	if !validatePaths(moduleName, t.Name) {
		return ErrInvalidName
	}

	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		return err
	}

	if strings.ContainsAny(t.Name, "/\x00") {
		return ErrInvalidName
	}

	f, err := os.Create(filepath.Join(b.path, moduleName, t.Name+".typ"))
	if err != nil {
		return err
	}

	if err := json.NewEncoder(w).Encode(t); err != nil {
		f.Close()

		return err
	}

	if err := f.Close(); err != nil {
		return err
	}

	return nil
}

func (b *backend) readTypes(moduleName string) ([]nameDescription, error) {
	paths, err := filepath.Glob(filepath.Join(b.path, moduleName, "*.typ"))
	if err != nil {
		return nil, err
	}

	var types []nameDescription

	for _, typ := range paths {
		t, err := readType(typ)
		if err != nil {
			return nil, err
		}

		types = append(types, t)
	}

	return types, nil
}

func readType(typ string) (nameDescription, error) {
	f, err := os.Open(typ)
	if err != nil {
		return nameDescription{}, err
	}

	defer f.Close()

	var nd nameDescription

	if err := json.NewDecoder(f).Decode(&nd); err != nil {
		return nameDescription{}, err
	}

	return nd, nil
}

func (b *backend) getType(w http.ResponseWriter, r *http.Request) error {
	moduleName := r.PathValue("module")
	typeName := r.PathValue("type")

	if !validatePaths(moduleName, typeName) {
		return ErrInvalidName
	}

	f, err := os.Open(filepath.Join(b.path, moduleName, typeName+".typ"))
	if err != nil {
		return err
	}

	defer f.Close()

	_, err = io.Copy(w, f)

	return err
}

func (b *backend) renameType(w http.ResponseWriter, r *http.Request) error {
	moduleName := r.PathValue("module")
	typeName := r.PathValue("type")
	newName := r.PathValue("name")

	if !validatePaths(moduleName, typeName, newName) {
		return ErrInvalidName
	}

	base := filepath.Join(b.path, moduleName)
	newFile := filepath.Join(base, newName+".typ")

	_, err := os.Stat(newFile)
	if !errors.Is(err, fs.ErrNotExist) {
		return err
	}

	return os.Rename(filepath.Join(base, typeName+".typ"), newFile)
}

func (b *backend) deleteType(w http.ResponseWriter, r *http.Request) error {
	moduleName := r.PathValue("module")
	typeName := r.PathValue("type")

	if !validatePaths(moduleName, typeName) {
		return ErrInvalidName
	}

	path := filepath.Join(b.path, moduleName, typeName)

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return fmt.Errorf("%w: %s", ErrNoType, typeName)
	}

	return os.RemoveAll(path)
}

var ErrNoType = fmt.Errorf("no type with that name")
