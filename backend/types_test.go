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
	})
}
