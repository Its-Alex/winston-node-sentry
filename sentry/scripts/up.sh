#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/../"

./generate-sentry-secret-key.sh
docker-compose up -d redis postgres
docker-compose -f docker-compose-tools.yml run --rm wait_postgres
docker-compose -f docker-compose-tools.yml run --rm wait_redis

cp init.sql postgresql-data/init.sql
docker-compose exec postgres psql -U sentry sentry -f /var/lib/postgresql/data/init.sql > /dev/null

# There is "pip uninstall sentry-plugins" here to fix this bug https://github.com/getsentry/sentry/issues/11302
docker-compose run --rm sentry bash -c "pip uninstall sentry-plugins -y; sentry upgrade --noinput"
docker-compose run --rm sentry sentry createuser \
    --email admin@example.com \
    --password password \
    --superuser --no-input > /dev/null || true
docker-compose up -d