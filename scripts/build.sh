#!/usr/bin/env bash
cd "$(dirname "$0")/../" || exit 1
set -euo pipefail
# Build script that replicates the Docker CMD functionality
# This script builds the Next.js project and optionally copies output to a host directory

echo "Starting build process..."

# Run the build command
bun run build

echo "Build completed successfully"

# Check if out directory exists and handle output copying
if [ -d "out" ]; then
    echo "Found out directory"

    # Add .nojekyll file for GitHub Pages deployment
    echo "Adding .nojekyll file for GitHub Pages"
    touch out/.nojekyll

    # for each html,js,woff2 file in the out directory, gz compress it
    echo "Compressing HTML, JS, and WOFF2 files in out directory"
    find out/ -type f \
      -name \*.js -o -name \*.woff2 -o -name \*.html \
      | parallel gzip --best --keep --force --verbose {}
    echo "Compression completed"


    # If HOST_OUT environment variable is set, copy to that directory
    if [ -n "$HOST_OUT" ]; then
        echo "Copying build artifacts to $HOST_OUT"
        mkdir -p "$HOST_OUT"
        cp -r out/* "$HOST_OUT/"
        echo "Build artifacts copied to host"
    else
        echo "No HOST_OUT directory specified, build artifacts remain in ./out"
        echo "Contents of out directory:"
        ls -la out/
    fi
else
    echo "No out directory found"
    exit 1
fi

echo "Build script completed successfully"
