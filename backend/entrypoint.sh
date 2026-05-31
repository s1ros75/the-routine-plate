#!/bin/bash
set -e

rm -f /app/tmp/pids/server.pid

bundle exec rails db:create db:migrate

exec bundle exec rails server -b 0.0.0.0 -p 3000
