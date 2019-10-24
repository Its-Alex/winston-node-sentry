#!/bin/bash

docker cp ./extract_dsn.py $(docker-compose ps sentry | tail -n1 | cut -d' ' -f1):/extract_dsn.py
docker-compose exec -T sentry sentry exec /extract_dsn.py | tail -n1
