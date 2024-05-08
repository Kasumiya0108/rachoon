#!/bin/sh
node ace -v
node ace migration:run --force
node ace db:seed
node build/server.js
