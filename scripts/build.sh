#!/bin/bash
HOST=https://sourceacademy.comp.nus.edu.sg

# Build Frontend
cd frontend
PUBLIC_URL=$HOST npm run build

# Build App
cd ..
MIX_ENV=prod mix do compile, phx.digest, release --env=prod
