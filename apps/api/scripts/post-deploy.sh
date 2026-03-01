#!/bin/bash
source ~/.bashrc
bun i
pm2 reload ecosystem.config.js --update-env