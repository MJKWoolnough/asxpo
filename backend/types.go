package backend

import (
	"encoding/json"
	"errors"
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
	moduleName := r.PathValue("module")

	if strings.ContainsAny(moduleName, "/\x00") {
		return ErrInvalidName
	}

	var t mType

	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		return err
	}

	t.Name = r.PathValue("type")

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

func (b *backend) getType(w http.ResponseWriter, r *http.Request) error {
	moduleName := r.PathValue("module")
	typeName := r.PathValue("type")

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

	if strings.ContainsAny(moduleName, "/\x00") || strings.ContainsAny(typeName, "/\x00") || strings.ContainsAny(newName, "/\x00") {
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
	return nil
}
