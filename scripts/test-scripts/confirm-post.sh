#!/bin/bash
COMMAND=$(echo $1|tr -d '\n')
curl -X POST http://localhost:8080/confirm?token=$COMMAND | json_pp