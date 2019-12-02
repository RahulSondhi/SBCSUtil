#!/bin/bash
pushd ../
x-terminal-emulator -e "npm install && npm start" ;
popd
pushd ../client/
x-terminal-emulator -e "npm install && npm start"
