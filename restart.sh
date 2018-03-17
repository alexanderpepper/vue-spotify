#!/usr/bin/env bash
git pull origin develop; ./install.sh; ./kill.sh; ./deploy.sh development; ./monitor.sh;
