#!/bin/bash
# command to save file format correctly in vim
# :set fileformat=unix 
# command to set file exectuate permissions
# sudo chmod u+x run.sh

# go to file location
PRJ_FILE="/home/patrick/Documents/Projects/PatrickWilsonSite/"
cd $PRJ_FILE

# recompile if needed
go build -o ./bin/patrickwilsonsite ./

# run data crawler with given flag
./bin/patrickwilsonsite -prd