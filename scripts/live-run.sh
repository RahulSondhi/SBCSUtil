#!/bin/bash
pushd ../
x-terminal-emulator -e "npm run dev" ;
popd
pushd ../client/
x-terminal-emulator -e "npm start"


