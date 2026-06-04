#!/bin/bash

libs() {
	declare o="";
	declare c="";
	declare ext=".$1";

	if [ "$1" = "ts" ]; then
		o="[";
		c="]";
	else
		echo -n '{"imports":';
	fi;

	declare brackets="$1";

	echo -n "{";

	declare first=true;

	for i in libs/*.ts; do
		if $first; then
			first=false;
		else
			echo -n ",";
		fi;

		echo -n "\"@$(basename "$i" ".ts")\": $o\"./${i:0:-3}$ext\"$c";
	done;

	if [ "$1" == "js" ]; then
		echo -n "}";
	fi;

	echo -n "}";
}

sed -i 's|<script type="importmap">.*<\/script>|<script type="importmap">'"$(libs js)"'<\/script>|g' index.html
sed -i 's|"paths": .*|"paths": '"$(libs ts)"'|' tsconfig.json;
