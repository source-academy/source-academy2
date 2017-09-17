#!/bin/bash
if [ -z "$HOST" ]; then
    echo "Set environment variable HOST to http://some.deployment first"
    exit 1
fi

HOST_IP=${HOST#*//}

# Build Frontend
cd frontend
npm run build

# Build App
cd ..
MIX_ENV=prod mix do compile, phx.digest, release --env=prod

# Provision App to
rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress _build/prod/rel/source_academy/releases/2.0.0/source_academy.tar.gz root@$HOST_IP:/root/
