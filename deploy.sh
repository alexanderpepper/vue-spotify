#!/usr/bin/env bash
sudo pm2 kill;
sudo pm2 start pm2.json --env $1;
sudo pm2 monit;
