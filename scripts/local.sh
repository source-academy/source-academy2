#!/bin/bash
PORT=4000
HOST=http://localhost:$PORT

# Build Frontend
cd frontend
PUBLIC_URL=$HOST npm run build

# Compile and test run app
cd ..
PORT=4000 MIX_ENV=prod mix do compile, phx.digest, phx.server
