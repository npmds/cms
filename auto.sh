#!/bin/bash

commit_name="`date +%Y%m%d`_commit"
echo "====git auto push start...$commit_name"
git add .
git commit -m $commit_name
git push
echo "====git auto push end..."

