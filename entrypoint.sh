#!/bin/sh

echo "
#!/bin/sh
curl http://localhost:3333/api/run/recurring
" >/etc/periodic/hourly/recurring-invoices

chmod +x /etc/periodic/hourly/recurring-invoices

cd /app/backend/apps/backend || exit

export PORT=3333
export NODE_ENV=production

node ace migration:run --force
node ace db:seed
node server.js &

cd /app/frontend || exit
PORT=3000 node ./server/index.mjs &

crond -f &

caddy run --config /app/Caddyfile
