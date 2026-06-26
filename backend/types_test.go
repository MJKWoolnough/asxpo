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
		{ // 6
			Method:   http.MethodGet,
			URL:      "/modules/some-module/myType",
			Code:     http.StatusOK,
			Response: "{\"Name\":\"myType\",\"Description\":\"My Type\",\"Fields\":[{\"Name\":\"A\",\"Description\":\"A Field\",\"Type\":\"string\"},{\"Name\":\"B\",\"Description\":\"B Field\",\"Type\":\"int\"}]}\n",
		},
		{ // 7
			Method: http.MethodPost,
			URL:    "/modules/some-module/myType/newType",
			Code:   http.StatusNoContent,
		},
		{ // 8
			Method:   http.MethodGet,
			URL:      "/modules/some-module/myType",
			Code:     http.StatusNotFound,
			Response: "no type with that name: myType\n",
		},
		{ // 9
			Method:   http.MethodGet,
			URL:      "/modules/some-module/newType",
			Code:     http.StatusOK,
			Response: "{\"Name\":\"newType\",\"Description\":\"My Type\",\"Fields\":[{\"Name\":\"A\",\"Description\":\"A Field\",\"Type\":\"string\"},{\"Name\":\"B\",\"Description\":\"B Field\",\"Type\":\"int\"}]}\n",
		},
		{ // 10
			Method: http.MethodDelete,
			URL:    "/modules/some-module/newType",
			Code:   http.StatusNoContent,
		},
		{ // 11
			Method:   http.MethodGet,
			URL:      "/modules/some-module/newType",
			Code:     http.StatusNotFound,
			Response: "no type with that name: newType\n",
		},
	})
}
