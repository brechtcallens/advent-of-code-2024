#!/bin/bash

if [[ $# -ne 1 ]]; then
   echo "Usage: $0 <day_nr>" 
   exit 1;
fi

DAY_DIR="day$1"
mkdir $DAY_DIR
cp template/* $DAY_DIR
sed -i "s/\"solve\".*/\"solve\": \"tsx $DAY_DIR\/solve.ts\"/" package.json
