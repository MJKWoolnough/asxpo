package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
)

type field struct {
	Name        string
	Description string
	Type        string
}

type mType struct {
	Name        string `json:",omitempty"`
	Description string
	Fields      []field
}

func (b *backend) setType(w http.ResponseWriter, r *http.Request) error {
	moduleName := r.PathValue("module")
	typeName := r.PathValue("type")

	if !validatePaths(moduleName, typeName) {
		return ErrInvalidName
	}

	var t mType

	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		return err
	}

	return b.writeType(moduleName, typeName, t)
}

func (b *backend) writeType(moduleName, typeName string, t mType) error {
	f, err := os.Create(filepath.Join(b.path, moduleName, typeName+".typ"))
	if err != nil {
		return err
	}

	if err := json.NewEncoder(f).Encode(t); err != nil {
		f.Close()

		return err
	}

	return f.Close()
}

type typePatch struct {
	Description *string
	Fields      *[]field
}

func (b *backend) updateType(w http.ResponseWriter, r *http.Request) error {
	moduleName := r.PathValue("module")
	typeName := r.PathValue("type")

	if !validatePaths(moduleName, typeName) {
		return ErrInvalidName
	}

	var t typePatch

	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		return err
	}

	if t.Description == nil && t.Fields == nil {
		return ErrNoPatch
	}

	mType, err := b.readTypeData(moduleName, typeName)
	if err != nil {
		return err
	}

	if t.Description != nil {
		mType.Description = *t.Description
	}

	if t.Fields != nil {
		mType.Fields = *t.Fields
	}

	return b.writeType(moduleName, typeName, mType)
}

func (b *backend) readTypes(moduleName string) ([]nameDescription, error) {
	paths, err := filepath.Glob(filepath.Join(b.path, moduleName, "*.typ"))
	if err != nil {
		return nil, err
	}

	types := []nameDescription{}

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

	nd.Name = filepath.Base(typ[:len(typ)-4])

	return nd, nil
}

func (b *backend) getType(w http.ResponseWriter, r *http.Request) error {
	moduleName := r.PathValue("module")
	typeName := r.PathValue("type")

	if !validatePaths(moduleName, typeName) {
		return ErrInvalidName
	}

	mType, err := b.readTypeData(moduleName, typeName)
	if err != nil {
		return err
	}

	return json.NewEncoder(w).Encode(mType)
}

func (b *backend) readTypeData(moduleName, typeName string) (mType, error) {
	f, err := os.Open(filepath.Join(b.path, moduleName, typeName+".typ"))
	if err != nil {
		if os.IsNotExist(err) {
			return mType{}, fmt.Errorf("%w: %s", ErrNoType, typeName)
		}

		return mType{}, err
	}

	defer f.Close()

	var mType mType

	if err := json.NewDecoder(f).Decode(&mType); err != nil {
		return mType, err
	}

	mType.Name = typeName

	return mType, nil
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

	path := filepath.Join(b.path, moduleName, typeName+".typ")

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return fmt.Errorf("%w: %s", ErrNoType, typeName)
	}

	return os.Remove(path)
}

var (
	ErrNoType  = errors.New("no type with that name")
	ErrNoPatch = errors.New("empty patch")
)
