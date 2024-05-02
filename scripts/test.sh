#!/bin/bash
NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" npx jest --detectOpenHandles --pass-with-no-tests "$1"
