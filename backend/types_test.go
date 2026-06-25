package backend

import (
	"net/http"
	"testing"
)

func TestTypes(t *testing.T) {
	tests(t, []test{
		{ // 1
			Method: http.MethodPut,
			URL:    "/modules/some-module",
			Body:   "some data",
			Code:   http.StatusCreated,
		},
		{ // 2
			Method:   http.MethodGet,
			URL:      "/modules/some-module",
			Code:     http.StatusOK,
			Response: "{\"Name\":\"some-module\",\"Description\":\"some data\",\"Types\":[]}\n",
		},
		{ // 3
			Method:   http.MethodPut,
			URL:      "/modules/some-module/myType",
			Code:     http.StatusBadRequest,
			Response: "EOF\n",
		},
		{ // 4
			Method: http.MethodPut,
			URL:    "/modules/some-module/myType",
			Body:   `{"Description": "My Type", "Fields": [{"Name": "A", "Description": "A Field", "Type": "string"}, {"Name": "B", "Description": "B Field", "Type": "int"}]}`,
			Code:   http.StatusNoContent,
		},
		{ // 5
			Method:   http.MethodGet,
			URL:      "/modules/some-module",
			Code:     http.StatusOK,
			Response: "{\"Name\":\"some-module\",\"Description\":\"some data\",\"Types\":[{\"Name\":\"myType\",\"Description\":\"My Type\"}]}\n",
		},
	})
}
