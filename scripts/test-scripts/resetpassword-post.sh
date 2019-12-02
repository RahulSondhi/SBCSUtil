#!/bin/bash
curl -X POST -H "Content-Type: application/json"  -d @resetpassword.json  http://localhost:8080/resetPassword | json_pp
