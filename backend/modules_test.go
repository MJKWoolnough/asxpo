package backend

import (
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"slices"
	"strings"
	"testing"
)

func TestModules(t *testing.T) {
	s := httptest.NewServer(New(t.TempDir()))

	t.Cleanup(func() { s.Close() })

	for n, test := range [...]struct {
		Method   string
		URL      string
		Body     string
		Code     int
		Headers  http.Header
		Response string
	}{
		{ // 1
			Method:   http.MethodGet,
			URL:      "/modules",
			Code:     http.StatusOK,
			Response: "[]\n",
		},
		{ // 2
			Method:   http.MethodGet,
			URL:      "/modules/some-module",
			Code:     http.StatusNotFound,
			Response: "no module with that name: some-module\n",
		},
		{ // 3
			Method: http.MethodPut,
			URL:    "/modules/some-module",
			Body:   "some data",
			Code:   http.StatusCreated,
		},
		{ // 4
			Method:   http.MethodGet,
			URL:      "/modules",
			Code:     http.StatusOK,
			Response: "[{\"Name\":\"some-module\",\"Description\":\"some data\"}]\n",
		},
		{ // 5
			Method: http.MethodPut,
			URL:    "/modules/another-module",
			Body:   "12345",
			Code:   http.StatusCreated,
		},
		{ // 6
			Method:   http.MethodGet,
			URL:      "/modules",
			Code:     http.StatusOK,
			Response: "[{\"Name\":\"another-module\",\"Description\":\"12345\"},{\"Name\":\"some-module\",\"Description\":\"some data\"}]\n",
		},
		{ // 7
			Method:   http.MethodGet,
			URL:      "/modules/some-module",
			Code:     http.StatusOK,
			Response: "{\"Name\":\"some-module\",\"Description\":\"some data\"}\n",
		},
		{ // 8
			Method: http.MethodPut,
			URL:    "/modules/some-module",
			Body:   "some other data",
			Code:   http.StatusNoContent,
		},
		{ // 9
			Method:   http.MethodGet,
			URL:      "/modules/some-module",
			Code:     http.StatusOK,
			Response: "{\"Name\":\"some-module\",\"Description\":\"some other data\"}\n",
		},
		{ // 10
			Method:   http.MethodPost,
			URL:      "/modules/not-a-module/some-module",
			Code:     http.StatusNotFound,
			Response: "no module with that name: not-a-module\n",
		},
		{ // 11
			Method: http.MethodPost,
			URL:    "/modules/some-module/some-module",
			Code:   http.StatusNotModified,
		},
		{ // 12
			Method: http.MethodPost,
			URL:    "/modules/some-module/new-name",
			Code:   http.StatusCreated,
			Headers: http.Header{
				"Location": []string{
					"../new-name",
				},
			},
		},
		{ // 13
			Method:   http.MethodPost,
			URL:      "/modules/another-module/new-name",
			Code:     http.StatusConflict,
			Response: "name already used: new-name\n",
		},
		{ // 14
			Method:   http.MethodGet,
			URL:      "/modules/some-module",
			Code:     http.StatusNotFound,
			Response: "no module with that name: some-module\n",
		},
		{ // 15
			Method:   http.MethodGet,
			URL:      "/modules/new-name",
			Code:     http.StatusOK,
			Response: "{\"Name\":\"new-name\",\"Description\":\"some other data\"}\n",
		},
		{ // 16
			Method:   http.MethodGet,
			URL:      "/modules",
			Code:     http.StatusOK,
			Response: "[{\"Name\":\"another-module\",\"Description\":\"12345\"},{\"Name\":\"new-name\",\"Description\":\"some other data\"}]\n",
		},
		{ // 17
			Method:   http.MethodDelete,
			URL:      "/modules/not-a-module",
			Code:     http.StatusNotFound,
			Response: "no module with that name: not-a-module\n",
		},
		{ // 18
			Method: http.MethodDelete,
			URL:    "/modules/new-name",
			Code:   http.StatusNoContent,
		},
		{ // 19
			Method:   http.MethodGet,
			URL:      "/modules",
			Code:     http.StatusOK,
			Response: "[{\"Name\":\"another-module\",\"Description\":\"12345\"}]\n",
		},
		{ // 20
			Method:   http.MethodGet,
			URL:      "/modules/new-name",
			Code:     http.StatusNotFound,
			Response: "no module with that name: new-name\n",
		},
	} {
		u, err := url.Parse(s.URL + test.URL)
		if err != nil {
			t.Fatalf("test %d: unexpected error: %s", n+1, err)
		}

		resp, err := s.Client().Do(&http.Request{
			Method: test.Method,
			URL:    u,
			Body:   io.NopCloser(strings.NewReader(test.Body)),
		})
		if err != nil {
			t.Fatalf("test %d: unexpected error: %s", n+1, err)
		}

		if resp.StatusCode != test.Code {
			t.Errorf("test %d: expecting status code %d, got %d", n+1, test.Code, resp.StatusCode)
		} else if body, err := io.ReadAll(resp.Body); err != nil {
			t.Fatalf("test %d: unexpected error reading body: %s", n+1, err)
		} else if string(body) != test.Response {
			t.Errorf("test %d: expecting body %q, got %q", n+1, test.Response, body)
		} else if test.Headers != nil {
			for key, values := range test.Headers {
				if hs := resp.Header.Values(key); !slices.Equal(values, hs) {
					t.Errorf("test %d: for header %s, expecting values %v, got %v", n+1, key, values, hs)
				}
			}
		}
	}
}
