#!/usr/bin/env bash

if [ ! -f env ]; then
    echo "Generate SENTRY_SECRET_KEY in ./env file"
    echo "SENTRY_SECRET_KEY=$(docker run --rm sentry:9.0.0 sentry config generate-secret-key)" | env
fi
