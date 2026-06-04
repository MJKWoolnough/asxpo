package backend

type Backend struct {
	path string
}

func New(path string) *Backend {
	return &Backend{
		path: path,
	}
}
