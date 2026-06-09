#!/bin/bash

jspacker -o index.html -H src/index.html -b src/ -i /index.html -P -x "$(grep '`' index_dev.go | cut -d'`' -f2)" -n -M '["terser", "-m", "--module", "--compress", "pure_getters,passes=3", "--ecma", "2020"]';

declare size="$(stat -c %s index.html)";

zopfli -m index.html;
rm -rf index.html;

declare time="$(stat -c %Y index.html.gz)";

cat > index.go <<HEREDOC
//go:build !dev

package frontend

// File automatically generated with ./build.sh

import (
	_ "embed"
	"time"

	"vimagination.zapto.org/httpembed"
)

//go:embed index.html.gz
var indexHTML []byte

var Index = httpembed.HandleBuffer("index.html", indexHTML, $size, time.Unix($time, 0))
HEREDOC
