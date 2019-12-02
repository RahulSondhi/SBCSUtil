#!/bin/bash
curl -X POST -H "Content-Type: application/json"  -d @register.json  http://localhost:5000/api/register | json_pp
