#!/bin/bash
source ~/.bashrc
export PATH="/home/deploy/.bun/bin:/home/deploy/.nvm/versions/node/v24.11.1/bin:$PATH"

bun i
pm2 reload ecosystem.config.js --update-env