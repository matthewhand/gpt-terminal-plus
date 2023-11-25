#!/bin/bash
docker-compose down && sleep 3 && docker system prune -f -a && docker-compose build --no-cache && docker-compose up
