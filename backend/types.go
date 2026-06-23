package backend

import (
	"encoding/json"
	"net/http"
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

func (b *backend) SetType(w http.ResponseWriter, r *http.Request) {
	handle(b.setType, w, r)
}

func (b *backend) setType(w http.ResponseWriter, r *http.Request) error {
	var t mType

	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		return err
	}

	return nil
}

func (b *backend) GetType(w http.ResponseWriter, r *http.Request) {
	handle(b.getType, w, r)
}

func (b *backend) getType(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (b *backend) RenameType(w http.ResponseWriter, r *http.Request) {
	handle(b.renameType, w, r)
}

func (b *backend) renameType(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (b *backend) DeleteType(w http.ResponseWriter, r *http.Request) {
	handle(b.renameType, w, r)
}

func (b *backend) deleteType(w http.ResponseWriter, r *http.Request) error {
	return nil
}
