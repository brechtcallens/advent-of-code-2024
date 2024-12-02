#!/bin/bash

if [[ $# -ne 1 ]]; then
   echo "Usage: $0 <day_nr>" 
   exit 1;
fi

DAY_DIR="day$1"
if [ -d "$DAY_DIR" ]; then
   echo "Directory '$DAY_DIR' already exists, skipping..."
else
   echo "Creating project '$DAY_DIR'"
   mkdir $DAY_DIR
   cp template/* $DAY_DIR
fi

echo "Update package.json to run solver for day $1"
sed -i "s/\"solve\".*/\"solve\": \"tsx $DAY_DIR\/solve.ts\"/" package.json

COOKIE_FILE=".session_cookie"
if [ -f "$COOKIE_FILE" ]; then
   echo "Fetching input for day $1 from server"
   SESSION_COOKIE=$(cat $COOKIE_FILE)
   INPUT_FILE="$DAY_DIR/input"
   curl -s -H "cookie: $SESSION_COOKIE" https://adventofcode.com/2024/day/$1/input | head -c -1 > $INPUT_FILE
   LINES=$(($(cat $INPUT_FILE | wc -l) + 1))
   echo "Written $LINES lines to '$INPUT_FILE'"
else
   echo "Cookie file '$COOKIE_FILE' does not exist, can't fetch input!"
fi
