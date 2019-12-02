#!/bin/bash
curl -X POST -H "Content-Type: application/json"  -d @login.json  http://localhost:5000/api/login | json_pp
